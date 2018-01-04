import Block from '../baseview';
import './info.scss';
import '../../servises/user-service';

const buttonBack = "buttonBack";
const authors = [
    {
        name: "Kirill",
        link:"https://github.com/KCherkasov"
    },
    {
        name: "Veniamin",
        link:"https://github.com/WorldVirus"
    },
    {
        name: "Vlad",
        link:"https://github.com/torrentino555"
    },
    {
        name: "Artur",
        link: "https://github.com/zonder129"
    }
];
class Info extends Block {
    constructor() {
        super('ul', ['info'], {});
    }

    creation() {

        if (document.querySelector('div.menu').childNodes[0] !== undefined) {
            document.querySelector('div.menu').removeChild(document.querySelector('div.menu').childNodes[0]);
        }
        const wrape = document.querySelector('div.menu');
        wrape.appendChild(document.createElement('ul'))
        wrape.querySelector('ul').setAttribute('class','name')
        wrape.querySelector('ul').setAttribute('class','info')

        for (let i = 0;i<4;++i) {
            document.querySelector('ul.info').appendChild(document.createElement('li'));

        }
        let allButtons = document.getElementsByTagName('li');
        for (let i = 0; i<4; ++i) {
            allButtons[i].innerHTML = `<a>${authors[i].name}</a>`
            allButtons[i].querySelector('a').setAttribute('href',authors[i].link)
        }

        // if (document.cookie) {
        //     let username = getCookie('username');
        //     let email = getCookie('email');
        //     document.body.innerHTML += `<div id="user-menu" style="position:absolute;top: 0;  background: white;right: 0;"><p style="margin: 4px;">${username}
        //     </p><a id="logout" style="margin: 4px;">Logut</a></div>`;
        //     document.getElementById('logout').addEventListener('click', function() {
        //         deleteCookie('username');
        //         deleteCookie('password');
        //         document.getElementById('user-menu').remove();
        //         new UserService().logout(username, email);
        //     });
        // }

        // wrape.appendChild(this._element);
        //
        // authors.forEach((i) => {
        //     this.appendChildBlock('li',new Block('li', [i.name]));
        //     let but  =  document.querySelector('li.' + i.name);
        //     but.innerHTML = `<a>${i.name}</a>`;
        //     but.querySelector('a').setAttribute('href',i.link);
        // });
    }

}

export default Info;

