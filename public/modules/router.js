import {signin ,signup }from  '../views/main'
import UserService from '../servises/user-service';
export default  class Router {

    constructor() {
        if (Router.__instance) {
            return Router.__instance;
        }
        this.routes = new Map();

        Router.__instance = this;
    }

    register(path, view) {
        this.routes.set(path, view);

        return this;
    }


    navigate() {
        window.onpopstate = event => {
            this.go(window.location.pathname);
        };

        document.body.addEventListener('click', event => {

            if (event.target.tagName.toLowerCase() === 'li' ) {
                event.preventDefault();
                const element = event.target;
                const pathname = element.getAttribute('value');

                if (pathname !== null) {
                   this.go(pathname);
                }
            }

            else if (event.target.tagName.toLowerCase() === 'a' &&  window.location.pathname !== '/info' ) {
                event.preventDefault();
                const element = event.target;
                const pathname = element.getAttribute('value');

                if (pathname !== null) {
                    this.go(pathname);
                }
            }
        });
        this.go(window.location.pathname);
    }

    go(path) {
        setTimeout(function() {
            if (!document.getElementById('user-menu')) {
                fetch('https://landsanddungeons.ru.com/restapi/session', {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include'
                }).then(response => {
                    if (response.status === 200) {
                        return response.text();
                    }
                }).then(data => {
                    if (data) {
                        let username = data.substring(data.indexOf('login is') + 9, data.length);

                        document.body.innerHTML += `<div id="user-menu" style="position:absolute;top: 0;  background: white;right: 0;background-color: #83c0f6;border-radius: 5px;"><p style="margin: 4px;">${username}</p><a id="logout">Logout</a></div>`;
                        document.getElementById('logout').addEventListener('click', function () {
                            document.getElementById('user-menu').remove();
                            new UserService().logout();
                            new Router().go('/');
                        });
                    }
                });
            }
        }, 300);
        const view = this.routes.get(path);
        if (!view) {
            document.body.innerHTML = '<h class="notfound"> We didnot do such page )';
            return;
        }

        if (window.location.pathname !== path) {
            window.history.pushState({}, '', path);
        }


        view.creation();
        if (path === '/login') {
            signin(view);
        }
        else if (path === '/signup') {
            signup(view)
        }
    }
}