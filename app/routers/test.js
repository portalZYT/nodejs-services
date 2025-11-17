module.exports = ({ router, controller }) => {
    router.get('/test/health', controller.test.health);
    router.get('/test/database', controller.test.database);
}; 