const apiResponseCode = {
    SUCCESS: 200,
    SERVER_ERROR: 300,
    NO_TOKEN: 400,
    TOKEN_ERROR: 400,
    NOT_FOUND: 404,
    ERROR_CODE: 500,

    // 参数校验不通过
    PARAMS_ERROR: 4001,

    // 资源已存在
    RESOURCE_EXISTED: 4003,
    // 超出限制
    RESOURCE_LIMTI: 4007,

    // 用户相关
    USER_NOT_FOUND: 4004,
    USER_ERROR: 4005,
    USER_UNAVAILABLE: 4006,
}

const apiResponseMsg = {
    SUCCESS_MSG: 'success',
    SERVER_ERROR_MSG: '服务器错误',
    NO_TOKEN_MSG: '鉴权失败、请登录',
    TOKEN_ERROR_MSG: '登录过期，请重新登录',
    WX_CODE_ERROR_MSG: '登录失败、微信信息错误',
    NOT_FOUND_MSG: '资源不存在',

    // 用户相关
    USER_NOT_FOUND_MSG: '登录失败、用户不存在',
    USER_PWD_ERROR_MSG: '登录失败、用户密码错误',
    USER_EXISTED_MSG: '用户已存在，请检查后重试',
    USER_UNAVAILABLE_MSG: '用户已禁用，请联系管理员',

    // 校验相关
    MOBILE_ERROR_MSG: '手机号码错误，请输入合法手机号码',
    CODE_ERROR_MSG: '验证码错误，请输入合法验证码',

    // 验证码
    SMS_OVER_MSG: '发送失败，每个手机号每天最多发送&条',
    SMS_SND_ERROR_MSG: '发送失败，请联系管理员',
}

module.exports = {
    apiResponseCode,
    apiResponseMsg,
};