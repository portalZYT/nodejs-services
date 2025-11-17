module.exports = ({ router, controller }) => {
    router.get('/swagger-ui.html', controller.swagger.ui);
    router.get('/swagger-doc', controller.swagger.doc);
}; 