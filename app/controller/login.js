const { Controller } = require('egg');

/**
 * @controller Login 用户认证
 */
class LoginController extends Controller {
    /**
     * @summary 用户注册
     * @description 创建新用户账户
     * @router post /login/register
     * @request body registerRequest *body
     * @response 201 registerResponse 注册成功
     * @response 400 errorResponse 注册失败
     */
    async register() {
        const { ctx } = this;
        try {
            // Get user input
            const { username, mobile, password } = ctx.request.body;
            // Validate user input
            if (!(username && password && mobile)) {
                return ctx.fail('All input is required');
            }
            const oldUser = await ctx.model.User.findOne({ where: { mobile } });
            if (oldUser) {
                return ctx.fail('User Already Exist. Please Login');
            }
            //Encrypt user password
            const encryptedPassword = await ctx.helper.hash(password);
            const token = ctx.helper.generateToken({ username, mobile });
            const user = await ctx.model.User.create({
                username,
                mobile,
                password: encryptedPassword,
                role: 'user'
            });
            
            ctx.status = 201;
            ctx.success({
                id: user.id,
                username: user.username,
                mobile: user.mobile,
                token: token,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            });
        } catch (err) {
            this.logger.error(err);
            ctx.fail('注册失败');
        }
    }

    /**
     * @summary 用户登录
     * @description 用户登录获取访问令牌
     * @router post /login/signin
     * @request body signinRequest *body
     * @response 200 signinResponse 登录成功
     * @response 401 errorResponse 登录失败
     */
    async signin() {
        const { ctx } = this;
        try {
            const { username, password } = ctx.request.body;
            
            // 验证输入参数
            if (!(username && password)) {
                return ctx.fail('用户名和密码不能为空');
            }
            
            // 查找用户
            const user = await ctx.model.User.findOne({ 
                where: { username }
            });
            
            if (!user) {
                return ctx.fail('用户不存在');
            }
            
            // 验证密码
            const isPasswordValid = await ctx.helper.compare(password, user.password);
            if (!isPasswordValid) {
                return ctx.fail('密码错误');
            }
            
            // 生成JWT token
            const token = ctx.helper.generateToken({ 
                id: user.id, 
                username: user.username, 
                mobile: user.mobile 
            });
            
            // 更新最后登录时间
            await user.update({ lastLogied: new Date() });
            
            ctx.success({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    mobile: user.mobile,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar
                }
            });
        } catch (err) {
            this.logger.error(err);
            ctx.fail('登录失败');
        }
    }

    /**
     * @summary 用户登出
     * @description 用户退出登录
     * @router post /login/signout
     * @request body signoutRequest *body
     * @response 200 signoutResponse 登出成功
     */
    async signout() {
        const { ctx } = this;
        try {
            // 这里可以实现token黑名单逻辑
            // 或者清除服务端session等
            
            ctx.success({
                message: '登出成功'
            });
        } catch (err) {
            this.logger.error(err);
            ctx.fail('登出失败');
        }
    }
}

module.exports = LoginController;
