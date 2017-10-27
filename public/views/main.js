import MainPage from './mainpage/mainpage';
import Block from './baseview';
import Info from './info/info';
import Registration from './signup/registration';
import Login from './login/login';
import RegistrationValidate from '../blocks/autheficate/registrationAuth';
import LoginValidate from '../blocks/autheficate/loginAuth';


import UserService from '../servises/user-service';

const userService = new UserService();
const application = new Block(document.getElementById('application'));

const mainMenu = new MainPage();

const information = new Info();
const login = new Login();
const registration = new Registration();

const gameName = new Block('div', ['game-name']);
const wrapper = new Block('div', ['wrapper']);
const game = new Block('div', ['game']);


application.appendChildBlock('game-name', gameName);
gameName.appendChildBlock('game-name', new Block('div', ['main']).setText('Lands & Dungeons'));
application.appendChildBlock('wrapper', wrapper);
wrapper.appendChildBlock('main-menu', mainMenu);

wrapper.worker = (toName, to) => {
    wrapper.removeAllChildren();
    wrapper.appendChildBlock(toName, to);
};

let back = () => {
    let buttonBack = document.querySelector('a.buttonBack');
    buttonBack.addEventListener('click', () => {
        wrapper.worker('main-menu',mainMenu);
        history.pushState(4, "/", "/");
    });
};

let loginButton = document.querySelector('div > a');

loginButton.addEventListener('click', function() {

    wrapper.worker("login-form",login);
    history.pushState(1, "login", "/login");
    back();
});


login.onSubmit((formdata) => {
    const authValidation = LoginValidate(formdata[0], formdata[1]);
    if (authValidation === false) {
        return;
    }
    userService.login(formdata[0], formdata[1])
        .then(() => wrapper.worker("game", game))
        .then(() => game.appendChildBlock('game', new Block('a', ['logout']).setText('logout')))
        .then(() => {
            let logout = document.querySelector('a.logout');
            logout.addEventListener('click', function () {
                userService.logout()
                wrapper.worker('main-menu', mainMenu)
            })
        })
});

let registrationButton = document.querySelector('a.buttonSecond');

registrationButton.addEventListener('click', function() {
    wrapper.worker("registration-form",registration);
    history.pushState(2, "signup", "/signup");
    back();
});

let infoButton = document.querySelector('a.buttonThird');

infoButton.addEventListener('click', function() {
    wrapper.worker("info-menu",information);
    history.pushState(3, "info", "/info");
    back();
});

registration.onSubmit((formdata) => {
    const authValidation = RegistrationValidate(formdata[0], formdata[1], formdata[2], formdata[3]);
    if (authValidation === false) {
        return;
    }
    userService.signup(formdata[0], formdata[1], formdata[2])
        .then(() => wrapper.worker("game", game))
        .then(() => game.appendChildBlock('game', new Block('a', ['logout']).setText('logout')))
        .then(() => {
            let logout = document.querySelector('a.logout');
            logout.addEventListener('click', function () {
                userService.logout()
                wrapper.worker('main-menu', mainMenu)
            })
        })

});



