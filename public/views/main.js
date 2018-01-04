import Block from './baseview';

import RegistrationValidate from '../blocks/autheficate/registrationAuth';
import LoginValidate from '../blocks/autheficate/loginAuth';

import Router from "../modules/router";
import Custom from "../views/custom-module/custom-module";

import UserService from '../servises/user-service';
import Mediator from '../modules/mediator';
import Validate from '../blocks/forms/validation';

const userService = new UserService();

const application = new Block(document.getElementById('application'));

const wrapper = new Block('div', ['wrapper']);

 const images = "logo";
application.appendChildBlock("logo",
    new Block('img', [images]));

const logo = document.querySelector('img.logo');
logo.setAttribute('src','../images/logo2.png');

application.appendChildBlock('application', wrapper);
wrapper.appendChildBlock('menu',new Block('div',['menu']))

 function signin(login) {
    login.onSubmit((formdata) => {
        const authValidation = LoginValidate(formdata[0], formdata[1]);
        if (authValidation === false) {
            return;
        }
        userService.login(formdata[0], formdata[1])
            .then(() => new Router().go('/game'))
            .then(() => {
                if (!document.querySelector('.user-menu')) {
                    let username = formdata[0];
                    document.body.innerHTML += `<div id="user-menu" style="position:absolute;top: 0;  background: white;right: 0;background-color: #83c0f6;border-radius: 5px;"><p style="margin: 4px;">${username}</p><a id="logout">Logout</a></div>`;
                    document.getElementById('logout').addEventListener('click', function () {
                        document.getElementById('user-menu').remove();
                        new UserService().logout();
                        new Router().go('/');
                    });
                }
            })
            .then (() => new Mediator().publish('VIEW_LOAD'))
            .catch(error => {
                error.text().then(error => {
                    Validate.userError(error);
                    console.log("Signup error: " + error);
                });
            });
    });
}

 function signup(registration) {
     registration.onSubmit((formdata) => {
         const authValidation = RegistrationValidate(formdata[0], formdata[1], formdata[2], formdata[3]);
         if (authValidation === false) {
             return;
         }
         userService.signup(formdata[0], formdata[1], formdata[2])
             .then(() => userService.login(formdata[0], formdata[2]))
             .then(() => new Router().go('/game'))
              .then(() => {
                  if (!document.querySelector('.user-menu')) {
                      let username = formdata[0];
                      document.body.innerHTML += `<div id="user-menu" style="position:absolute;top: 0;  background: white;right: 0;background-color: #83c0f6;border-radius: 5px;"><p style="margin: 4px;">${username}</p><a id="logout">Logout</a></div>`;
                      document.getElementById('logout').addEventListener('click', function () {
                          document.getElementById('user-menu').remove();
                          new UserService().logout();
                          new Router().go('/');
                      });
                  }
             }).catch(error => {
                 error.text().then(error => {
                     Validate.userError(error);
                     console.log("Signup error: " + error);
                 });
            });
     });
 }

if (window.innerHeight > window.innerWidth)
// && ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)))
{
    if (document.querySelector('div#application'))
        document.querySelector('div#application').style.display = 'none';
    new Custom().creation('It is game only for laptop view, rotate your device');

}

window.addEventListener('resize', () => {
    const div = document.querySelector('div.win');
    if (div) {
        if (document.querySelector('div#application'))
            document.querySelector('div#application').style.display = 'block';
        div.remove();
    }
    if (window.innerHeight > window.innerWidth) {
        if (document.querySelector('div#application'))
            document.querySelector('div#application').style.display = 'none';
        new Custom().creation('It is game only for laptop view, rotate your device');
    }
});



function setter(input) {
    console.log(input);
    return String(input);
}

export {signup,signin,setter };


