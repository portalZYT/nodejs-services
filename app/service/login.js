const Service = require('egg').Service;
class LoginService extends Service {
    async find(uid) {
        return {
            user: {
                id: uid
            }
        };
    }
}

module.exports = LoginService;