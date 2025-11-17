module.exports = ({ router, controller }) => {
    router.post('/login/signin', controller.login.signin);
    router.post('/login/signout', controller.login.signout);
    router.post('/login/register', controller.login.register);
};
