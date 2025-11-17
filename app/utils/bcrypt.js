// 只可加密，比对密码，不可解密
'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
    async hash(password) {
        return bcrypt.hash(password, 10); // 加密
    },
    async compare(userInputPassword, hasstring) {
        return await bcrypt.compare(userInputPassword, hasstring); // 比对密码
    },
}