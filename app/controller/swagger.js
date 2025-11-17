const { Controller } = require('egg');
const path = require('path');
const fs = require('fs');

class SwaggerController extends Controller {
    async ui() {
        const { ctx } = this;
        const htmlPath = path.join(this.app.baseDir, 'app/public/index.html');
        const html = fs.readFileSync(htmlPath, 'utf8');
        
        ctx.set('Content-Type', 'text/html');
        ctx.body = html;
    }



    async doc() {
        const { ctx } = this;
        
        try {
            // 使用SwaggerService生成文档
            const swaggerDoc = await ctx.service.swaggerService.generateSwaggerDoc(ctx.host);
            
            ctx.set('Content-Type', 'application/json');
            ctx.set('Cache-Control', 'no-cache, no-store, must-revalidate');
            ctx.body = swaggerDoc;
        } catch (error) {
            console.error('生成Swagger文档失败:', error);
            ctx.body = {
                error: '生成Swagger文档失败',
                message: error.message
            };
            ctx.status = 500;
        }
    }
}

module.exports = SwaggerController; 