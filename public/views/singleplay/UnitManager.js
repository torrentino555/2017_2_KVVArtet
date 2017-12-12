import Entity from './Entity';
import Utils from './Utils';
import Action from './Action';
import Pathfinding from "./Pathfinding";

export default class UnitManager {
    constructor(Animation, animationManager, spriteManager, activeTile, actionPoint, state, entities, textures, conditions) {
        this.Animation = Animation;
        this.units = [];
        this.spriteManager = spriteManager;
        this.animationManager = animationManager;
        this.entities = entities;
        this.textures = textures;
        this.conditions = conditions;
        this.firstActiveUnit = true;
        this.massiveSkill = false;
        this.activeTile = activeTile;
        this.circle = spriteManager.addSprite(0, Utils.transActiveCircle(0), this.textures[5], Utils.madeRectangle(0, 0, 0.015, -0.015*global.ratio), true);
        this.actionPoint = actionPoint;
        this.activeIndex = 0;
        this.possibleMoves = [];
        this.dropMenu = 0;
        this.state = state;
        this.indexUnit = {
            warrior: 0,
            mage: 1,
            thief: 2,
            priest: 3,
            skeleton1: 4,
            skeleton2: 5
        };
        this.skillbar = [];

    }

    stateCheck(callback) {
        if (this.state.AnimationOnLowbar) {
            setTimeout(function() {
                requestAnimationFrame(callback);
            }, 50);
            return true;
        }
        this.state.AnimationOnLowbar = true;
    }

    timeAndRunSkill(nameSkill, sender, target, runAnimation, wounded) {
        let timeA = Math.sqrt(Math.pow(sender.xpos - target.xpos, 2) + Math.pow(sender.ypos - target.ypos, 2))/6;
        switch (nameSkill) {
        case 'Fire ball':
            if (runAnimation) {
                setTimeout(function() {
                    this.animationManager.fireball(sender, target);
                }.bind(this), 500);
            }
            return timeA*1000;
        case 'Thunderbolt':
            if (runAnimation) {
                setTimeout(function() {
                    this.animationManager.thunderbolt(sender, target);
                }.bind(this), 500);
            }
            return 500;

        case 'Massive Heal':
            if (runAnimation) {
                setTimeout(function() {
                    this.animationManager.healing(wounded);
                }.bind(this), 500);
            }
            return 1000;
        case 'Blade flurry':
            if (runAnimation) {
                setTimeout(function() {
                    this.animationManager.blade_flurry(target);
                }.bind(this), 500);
            }
            return 1000;
        case 'Attack': case 'Sawtooth knife':
            if (runAnimation) {
                setTimeout(function() {
                    this.animationManager.attack(target);
                }.bind(this), 500);
            }
            return 500;
        case 'Holly wrath':
            if (runAnimation) {
                setTimeout(function() {
                    this.animationManager.holly_wrath(sender, target);
                }.bind(this), 500);
            }
            return timeA*1000;
        }
        return 500;
    }

    updateHealth(wounded) {
        wounded.forEach(function(item) {
            if (item.healthpoint[0] > 0) {
                this.spriteManager.getSprite(item.entity.lowbarHealthId).setVertexs(Utils.madeRectangle(0, 0, (1.2 / 16) * (item.healthpoint[0] / item.healthpoint[1]) - 0.006, -0.015));
                this.spriteManager.getSprite(item.entity.healthbarId).setVertexs(Utils.madeRectangle(0, 0, (1.2 / 16) * (item.healthpoint[0] / item.healthpoint[1]) - 0.006, -0.015));
            } else {
                this.spriteManager.getSprite(item.entity.lowbarHealthId).setVertexs(Utils.madeRectangle(0, 0, 0, 0));
                this.spriteManager.getSprite(item.entity.healthbarId).setVertexs(Utils.madeRectangle(0, 0, 0, 0));
            }
        }.bind(this));
    }

    addUnit(unit) {
        unit.entity = new Entity();
        unit.entity.lowbarId = this.spriteManager.addSprite(0, Utils.transOnLowbar(this.units.length), this.entities[this.indexUnit[unit.class]], Utils.madeRectangle(0, 0, 0.075, -0.075 * global.ratio), true);
        unit.entity.mapId = this.spriteManager.addSprite(unit.ypos, Utils.translationForUnits(unit), this.entities[6 + this.indexUnit[unit.class]], Utils.madeRectangle(0, 0, (1.2 / 9) * 1.7, -(1.2 / 9) * 1.7 * global.ratio), true);
        unit.entity.lowbarHealthId = this.spriteManager.addColorSprite(0, Utils.transOnLowbarHealth(this.units.length), Utils.madeRectangle(0, 0, 0.075, -0.015), [250 / 255, 44 / 255, 31 / 255, 1.0]);
        unit.entity.healthbarId = this.spriteManager.addColorSprite(unit.ypos, Utils.transForHealthbar(unit), Utils.madeRectangle(0, 0, 1.2 / 16 - 0.006, -0.015), [250 / 255, 44 / 255, 31 / 255, 1.0]);
        this.units.push(unit);
    }

    updateSkillbar(name, sender, target) {
        if (this.skillbar.length + 1 > 7) {
            this.skillbar.pop();
            document.getElementById(6).remove();
            document.getElementById(6 + 'box').remove();
        }
        this.skillbar.forEach(function(skill, i) {
            let elem = document.getElementById(i + 'box');
            elem.id = (i + 1) + 'box';
            let trans = [parseFloat(elem.style.right.substring(0, elem.style.right.length - 2)), parseFloat(elem.style.top.substring(0, elem.style.top.length - 2))];
            this.Animation.MoveHtmlAnimation(elem, trans , [trans[0], trans[1] + 10] ,0.5);
            elem = document.getElementById(i);
            elem.id = i + 1;
            trans = [parseFloat(elem.style.right.substring(0, elem.style.right.length - 2)), parseFloat(elem.style.top.substring(0, elem.style.top.length - 2))];
            this.Animation.MoveHtmlAnimation(elem, trans , [trans[0], trans[1] + 10] ,0.5);
        }.bind(this));
        this.skillbar.unshift(name);
        setTimeout(function() {
            let skillBox = document.createElement('img');
            skillBox.id = 0 + 'box';
            skillBox.style.position = 'absolute';
            skillBox.style.right = 3.4 + 'vw';
            skillBox.style.top = 24.72 + 'vh';
            skillBox.style.width = '3.6vw';
            skillBox.style.height = '6.3vh';
            skillBox.src = '/views/singleplay/textures/skillBox.png';
            document.getElementsByClassName('container')[0].appendChild(skillBox);
            let skillImg = document.createElement('img');
            skillImg.id = 0;
            if(target.isOccupied()) {
                skillImg.title = sender.unitOnTile.class + ' attack ' + target.unitOnTile.class;
            } else {
                skillImg.title = sender.unitOnTile.class + ' attack ' + target.xpos + ':' + target.ypos + ' cell';
            }
            skillImg.style.position = 'absolute';
            skillImg.style.right = 3.8 + 'vw';
            skillImg.style.top = 25.5 + 'vh';
            skillImg.style.width = '2.7vw';
            skillImg.style.height = '4.6vh';
            skillImg.src = '/views/singleplay/icons/' + name + '.png';
            document.getElementsByClassName('container')[0].appendChild(skillImg);
        }, 500);
    }

    neighbors(sender, target) {
        console.log("sender"+sender+" target"+target+" neighvoors?");
        if (target.xpos + 1 === sender.xpos && target.ypos === sender.ypos) {
            return true;
        }

        if (target.xpos - 1 === sender.xpos && target.ypos === sender.ypos) {
            return true;
        }

        if (target.ypos + 1 === sender.ypos && target.xpos === sender.xpos) {
            return true;
        }

        if (target.ypos - 1 === sender.ypos && target.xpos === sender.xpos) {
            return true;
        }

        return false;
    }


    activeUnit(unit) {
        if (this.firstActiveUnit) {
            this.firstActiveUnit = false;
        } else {
            // this.changeActiveUnit(unit);
        }
        this.currentUnit = unit;
        this.massiveSkill = false;
        let skills = document.getElementsByClassName('skill');
        for (let i = skills.length - 1; i >= 0; i--) {
            skills[i].remove();
        }
        let activeSkillImg = document.getElementById('activeSkill');
        if (!activeSkillImg) {
            activeSkillImg = document.createElement('img');
            activeSkillImg.id = 'activeSkill';
            activeSkillImg.style.position = 'absolute';
            activeSkillImg.style.top = '0';
            activeSkillImg.style.left = 32.5 + 'vw';
            activeSkillImg.style.width = '3.7vw';
            activeSkillImg.style.height = 3.7*global.ratio + 'vh';
            activeSkillImg.src = '/views/singleplay/textures/activeTile.png';
            this.activeSkill = unit.skills[0];
            document.getElementsByClassName('container')[0].appendChild(activeSkillImg);
        } else {
            this.activeSkill = unit.skills[0];
            activeSkillImg.style.left = 32.5 + 'vw';
        }
        unit.skills.forEach(function(skill, i) {
            console.log(skill.name);
            let skillImg = document.createElement('img');
            skillImg.title = skill.getDesciption();
            skillImg.className = 'skill';
            skillImg.style.position = 'absolute';
            skillImg.style.top = '1.1vh';
            skillImg.style.left = (i*3.5 + 0.45 + 32.5) + 'vw';
            skillImg.style.width = '2.6vw';
            skillImg.style.height = 2.6*global.ratio + 'vh';
            skillImg.src = '/views/singleplay/icons/' + skill.name + '.png';
            document.getElementsByClassName('container')[0].appendChild(skillImg);
        }.bind(this));
        // this.animationManager.animationActiveTile(unit);
        while(this.units[this.activeIndex % this.units.length].isDead()) {
            this.activeIndex++;
        }
        this.spriteManager.getSprite(this.circle).setTrans(Utils.transActiveCircle(this.activeIndex % this.units.length));
        this.spriteManager.getSprite(this.actionPoint).setTrans(Utils.transActionPoint(this.activeIndex++ % this.units.length));
        this.spriteManager.getSprite(this.actionPoint).setTexture(this.textures[6]);
        this.spriteManager.getSprite(this.activeTile).setTrans(Utils.translationOnMap(unit.ypos, unit.xpos));
        document.onmousedown = function(event) {
            let x = event.clientX / window.innerWidth;
            let y = event.clientY / window.innerHeight;
            let xMin = (1 + global.mapShiftX)/2;
            let xMax = xMin + 0.6;
            let yMin = (1 - global.mapShiftY)/2;
            let yMax = yMin + 0.8;
            if (event.which === 1 && x >= xMin && x < xMax && y >= yMin && y < yMax && document.getElementById('win').hidden && document.getElementById('lose').hidden && this.dropMenu === 0 && !this.state.AnimationOnMap) {
                let i = Math.floor(((x - xMin) / 0.6) / (1 / 16));
                let j = Math.floor(((y - yMin) / 0.8) / (1 / 12));
                let div = document.createElement('div');
                this.dropMenu = div;
                let ul = document.createElement('ul');
                div.className = 'drop-menu';
                div.style.left = event.clientX - 40 + 'px';
                div.style.top = event.clientY - 15 + 'px';
                div.appendChild(ul);
                let elem = global.tiledMap[i][j];
                let func = function(item) {
                    let li = document.createElement('li');
                    li.innerHTML = item.name;
                    li.onclick = function() {
                        let action = new Action();
                        action.sender = global.tiledMap[unit.xpos][unit.ypos];
                        action.target = global.tiledMap[i][j];
                        action.ability = item;
                        global.actionDeque.push(action);
                        this.dropMenu.remove();
                        this.dropMenu = 0;
                    }.bind(this);
                    ul.appendChild(li);
                }.bind(this);



                if (elem.isOccupied() && elem.unitOnTile.type === unit.type ) {
                    console.log('Союзник');
                    unit.skills.forEach(function(item) {
                        if (item.damage[0] < 0) {
                            func(item);
                        }
                    });
                } else if (elem.isOccupied() && elem.unitOnTile.type !== unit.type && (unit.shooter || this.neighbors(global.tiledMap[unit.xpos][unit.ypos], elem))) {
                    console.log('Противник');
                    unit.skills.forEach(function(item) {
                        if (item.damage[0] > 0) {
                            func(item);
                        }
                    });
                } else {
                    console.log('Карта');
                    unit.skills.forEach(function(item) {
                        if (item.typeOfArea === 'circle') {
                            func(item);
                        }
                    });
                    if (elem.active) {
                        let li = document.createElement('li');
                        li.innerHTML = 'Move';
                        li.onclick = function () {
                            let action = new Action();
                            action.sender = global.tiledMap[unit.xpos][unit.ypos];
                            action.target = global.tiledMap[i][j];
                            action.ability = null;
                            global.actionDeque.push(action);
                            this.dropMenu.remove();
                            this.dropMenu = 0;
                        }.bind(this);
                        ul.appendChild(li);
                    }
                }
                document.getElementsByClassName('container')[0].appendChild(div);
            } else if (event.which === 1 && this.dropMenu !== 0 && event.target.tagName !== 'LI') {
                this.dropMenu.remove();
                this.dropMenu = 0;
            } else if (event.which === 1 && x >= 0.33 && x <= 0.675 && y >= 0 && y <= 0.07) {
                let i = Math.floor((x - 0.33)/(0.35/10));
                if (i === 0) {
                    this.drawActiveTiles(this.path, true);
                    this.massiveSkill = false;
                } else if (this.currentUnit.skills[i].typeOfArea === 'circle') {
                    this.possibleMoves.forEach(function(move) {
                        global.tiledMap[move.xpos][move.ypos].active = false;
                        this.spriteManager.deleteSprite(move.id);
                    }.bind(this));
                    this.massiveSkill = true;
                } else {
                    this.massiveSkill = false;
                    let tiles = getActiveTiles(global.tiledMap[this.currentUnit.xpos][this.currentUnit.ypos], this.currentUnit.skills[i]);
                    this.drawActiveTiles(tiles, true);
                }
                this.activeSkill = this.currentUnit.skills[i];
                let activeSkill = document.getElementById('activeSkill');
                activeSkill.style.left = 32.5 + (35/10)*i + 'vw';
            }
            return false;
        }.bind(this);
    }

    drawActiveTiles(tiles, rewritePathOrNot) {
        if (!rewritePathOrNot) {
            this.path = tiles;
        }
        this.possibleMoves.forEach(function(move) {
            global.tiledMap[move.xpos][move.ypos].active = false;
            this.spriteManager.deleteSprite(move.id);
        }.bind(this));
        this.possibleMoves = [];
        tiles.forEach(function(tile) {
            this.possibleMoves.push({
                id: this.spriteManager.addSprite(-2, Utils.translationOnMap(tile.ypos, tile.xpos), tile.unitOnTile ? (tile.unitOnTile.type === this.currentUnit.type ? this.textures[9] : this.textures[10]) : this.textures[0], Utils.madeRectangle(0, 0, 1.2 / 16, -(1.2 / 16) * global.ratio), true),
                xpos: tile.xpos,
                ypos: tile.ypos
            });
            global.tiledMap[tile.xpos][tile.ypos].active = true;
        }.bind(this));
        this.units.forEach((unit) => {
            this.spriteManager.getSprite(unit.entity.mapId).order = unit.ypos;
            this.spriteManager.getSprite(unit.entity.healthbarId).order = unit.ypos;
        });
        this.spriteManager.sortSprites();
    }

    unitAttack(nameSkill, sender, target, wounded) {
        this.spriteManager.getSprite(this.actionPoint).setTexture(this.textures[7]);
        this.updateSkillbar(nameSkill, sender, target);
        let index = this.indexUnit[sender.unitOnTile.class];
        this.spriteManager.getSprite(sender.unitOnTile.entity.mapId).setTexture(this.conditions[3 * index]);
        let timer = this.timeAndRunSkill(nameSkill, sender, target, true, wounded);
        setTimeout(function(nameSkill, sender, target) {
            this.spriteManager.getSprite(sender.unitOnTile.entity.mapId).setTexture(this.conditions[1 + 3 * index]);
            setTimeout(function(sender, target) {
                // gameManager.spriteManager.getSprite(target.unitOnTile.entity.mapId).setTexture(images[92]);
                if (sender.unitOnTile.healthpoint[0] > 0) {
                    this.spriteManager.getSprite(sender.unitOnTile.entity.mapId).setTexture(this.entities[6 + index]);
                }
                this.updateHealth(wounded);
            }.bind(this, sender, target), timer + 100);
        }.bind(this, nameSkill, sender, target), 500);
    }

    unitAttackAndKill(nameSkill, sender, target, DeadUnits, wounded) {
        this.unitAttack(nameSkill, sender, target, wounded);
        let timer = this.timeAndRunSkill(nameSkill, sender, target);
        setTimeout(() => {
            // this.removeUnitsInInitiativeLine(DeadUnits);
            DeadUnits.forEach((unit) => {
                this.spriteManager.getSprite(unit.entity.lowbarId).setTexture(this.textures[8]);
                this.spriteManager.getSprite(unit.entity.mapId).setTexture(this.conditions[2 + 3 * this.indexUnit[unit.class]]);
                this.spriteManager.getSprite(unit.entity.healthbarId).setVertexs(Utils.madeRectangle(0, 0, 0, 0));
            });
        }, timer + 800);
    }
}
