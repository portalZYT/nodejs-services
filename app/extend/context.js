'use strict';

const USER = Symbol('Context#user');

module.exports = {
    success(data) {
        this.body = {
            code: this.helper.SUCCESS,
            data,
            msg: null,
        };
    },

    fail(msg, code) {
        this.body = this.body = {
            code: code || this.helper.ERROR_CODE,
            data: {},
            msg,
        };;
    },
    get user() {
        return this[USER];
    },
    set user(user) {
        this[USER] = user;
    },
};
