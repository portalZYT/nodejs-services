const { Controller } = require('egg');

/**
 * @controller Test 测试接口
 */
class TestController extends Controller {
    /**
     * @summary 健康检查
     * @description 检查API服务状态
     * @router get /test/health
     * @response 200 testResponse 检查成功
     */
    async health() {
        const { ctx } = this;
        ctx.success({
            status: 'OK',
            message: 'API服务正常运行',
            timestamp: new Date().toISOString()
        });
    }

    /**
     * @summary 数据库连接测试
     * @description 测试数据库连接和查询
     * @router get /test/database
     * @response 200 testResponse 测试成功
     */
    async database() {
        const { ctx } = this;
        try {
            // 测试数据库连接
            const [results] = await ctx.app.model.query('SELECT 1+1 AS result');
            
            // 测试用户表查询
            const userCount = await ctx.model.User.count();
            const latestUser = await ctx.model.User.findOne({
                order: [['id', 'DESC']],
                attributes: ['id', 'username', 'mobile', 'role', 'createdAt']
            });

            ctx.success({
                status: 'OK',
                message: '数据库连接正常',
                data: {
                    connectionTest: results[0],
                    userCount: userCount,
                    latestUser: latestUser,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            ctx.fail('数据库连接失败: ' + error.message);
        }
    }
}

module.exports = TestController; 