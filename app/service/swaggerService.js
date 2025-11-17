'use strict';

const Service = require('egg').Service;
const path = require('path');
const fs = require('fs');

class SwaggerService extends Service {
  constructor(ctx) {
    super(ctx);
    this.swaggerCache = null;
    this.lastModified = {};
    this.initFileWatcher();
  }

  // 初始化文件监听器
  initFileWatcher() {
    if (this.app.config.env === 'local') {
      const controllerDir = path.join(this.app.baseDir, 'app/controller');
      
      try {
        // 监听控制器目录
        fs.watch(controllerDir, { recursive: true }, (eventType, filename) => {
          if (filename && filename.endsWith('.js') && filename !== 'swagger.js') {
            console.log(`[Swagger] 检测到控制器文件变化: ${filename}`);
            this.clearCache();
          }
        });
        console.log('[Swagger] 文件监听器已启动，支持热更新');
      } catch (error) {
        console.error('[Swagger] 文件监听器启动失败:', error);
      }
    }
  }

  // 清除缓存
  clearCache() {
    this.swaggerCache = null;
    this.lastModified = {};
  }

  // 检查文件是否有变化
  hasFileChanged(filePath) {
    try {
      const stats = fs.statSync(filePath);
      const currentModified = stats.mtime.getTime();
      const lastModified = this.lastModified[filePath];
      
      if (!lastModified || currentModified > lastModified) {
        this.lastModified[filePath] = currentModified;
        return true;
      }
      return false;
    } catch (error) {
      return true; // 文件不存在或出错时，认为需要重新解析
    }
  }

  // 解析控制器注释生成Swagger文档
  parseControllerComments(controllerPath) {
    try {
      const content = fs.readFileSync(controllerPath, 'utf8');
      const paths = {};
      const tags = [];
      
      // 解析控制器级别的注释
      const controllerMatch = content.match(/@controller\s+(\w+)\s+(.+)/);
      if (controllerMatch) {
        tags.push({
          name: controllerMatch[2] || controllerMatch[1],
          description: controllerMatch[2] || controllerMatch[1]
        });
      }

      // 解析方法注释
      const methodRegex = /\/\*\*[\s\S]*?\*\/\s*async\s+(\w+)\s*\(/g;
      let match;
      
      while ((match = methodRegex.exec(content)) !== null) {
        const methodName = match[1];
        const commentBlock = match[0];
        const methodInfo = this.parseMethodComment(commentBlock, methodName);
        
        if (methodInfo && methodInfo.router) {
          const [method, path] = methodInfo.router.split(' ');
          if (!paths[path]) paths[path] = {};
          
          paths[path][method.toLowerCase()] = {
            tags: [controllerMatch ? controllerMatch[2] || controllerMatch[1] : 'Default'],
            summary: methodInfo.summary || methodName,
            description: methodInfo.description || '',
            parameters: methodInfo.parameters || [],
            responses: methodInfo.responses || {
              '200': {
                description: '成功',
                schema: { 
                  type: 'object',
                  properties: {
                    code: { type: 'integer', example: 200 },
                    message: { type: 'string', example: '操作成功' },
                    data: { type: 'object' }
                  }
                }
              }
            }
          };
        }
      }
      
      return { paths, tags };
    } catch (error) {
      console.error('Error parsing controller:', controllerPath, error);
      return { paths: {}, tags: [] };
    }
  }

  // 解析方法注释
  parseMethodComment(commentBlock, methodName) {
    const info = { parameters: [], responses: {} };
    
    // 解析 @summary
    const summaryMatch = commentBlock.match(/@summary\s+(.+)/);
    if (summaryMatch) info.summary = summaryMatch[1].trim();
    
    // 解析 @description
    const descMatch = commentBlock.match(/@description\s+(.+)/);
    if (descMatch) info.description = descMatch[1].trim();
    
    // 解析 @router
    const routerMatch = commentBlock.match(/@router\s+(\w+)\s+(.+)/);
    if (routerMatch) info.router = `${routerMatch[1]} ${routerMatch[2].trim()}`;
    
    // 解析 @request 参数
    const requestMatches = commentBlock.matchAll(/@request\s+(\w+)\s+(\w+)\s+(\w+)\s+(.+)/g);
    for (const requestMatch of requestMatches) {
      const [, paramIn, paramType, paramName, paramDesc] = requestMatch;
      const parameter = {
        in: paramIn,
        name: paramName,
        type: paramType,
        description: paramDesc.trim(),
        required: paramIn === 'path' || paramIn === 'body'
      };
      
      if (paramIn === 'body') {
        parameter.schema = {
          type: 'object',
          properties: {
            name: { type: 'string', description: '产品名称' },
            description: { type: 'string', description: '产品描述' },
            price: { type: 'number', description: '产品价格' },
            category: { type: 'string', description: '产品分类' },
            brand: { type: 'string', description: '品牌' }
          }
        };
      }
      
      info.parameters.push(parameter);
    }
    
    // 解析 @response
    const responseMatches = commentBlock.matchAll(/@response\s+(\d+)\s+(\w+)\s+(.+)/g);
    for (const responseMatch of responseMatches) {
      const [, code, responseType, responseDesc] = responseMatch;
      info.responses[code] = {
        description: responseDesc.trim(),
        schema: { 
          type: 'object',
          properties: {
            code: { type: 'integer', example: parseInt(code) },
            message: { type: 'string', example: responseDesc.trim() },
            data: { type: 'object' }
          }
        }
      };
    }
    
    return info;
  }

  // 生成Swagger文档
  async generateSwaggerDoc(host) {
    // 检查是否需要重新生成文档
    if (this.swaggerCache) {
      const controllerDir = path.join(this.app.baseDir, 'app/controller');
      const controllerFiles = fs.readdirSync(controllerDir)
        .filter(file => file.endsWith('.js') && file !== 'swagger.js')
        .map(file => path.join(controllerDir, file));

      // 如果所有文件都没有变化，返回缓存
      const hasChanges = controllerFiles.some(file => this.hasFileChanged(file));
      if (!hasChanges) {
        return this.swaggerCache;
      }
    }

    // 基础Swagger文档结构
    const swaggerDoc = {
      swagger: "2.0",
      info: {
        title: "Hotel API",
        description: "酒店管理系统API文档 (支持实时更新)",
        version: "1.0.0"
      },
      host: host,
      basePath: "/",
      schemes: ["http", "https"],
      consumes: ["application/json"],
      produces: ["application/json"],
      paths: {},
      tags: [],
      definitions: {
        BaseResponse: {
          type: 'object',
          properties: {
            code: { type: 'integer', description: '状态码' },
            message: { type: 'string', description: '响应消息' },
            data: { type: 'object', description: '响应数据' }
          }
        }
      }
    };

    // 扫描控制器目录
    const controllerDir = path.join(this.app.baseDir, 'app/controller');
    const controllerFiles = fs.readdirSync(controllerDir)
      .filter(file => file.endsWith('.js') && file !== 'swagger.js');

    // 解析每个控制器
    for (const file of controllerFiles) {
      const controllerPath = path.join(controllerDir, file);
      const { paths, tags } = this.parseControllerComments(controllerPath);
      
      // 合并路径和标签
      Object.assign(swaggerDoc.paths, paths);
      swaggerDoc.tags.push(...tags);
    }

    // 缓存生成的文档
    this.swaggerCache = swaggerDoc;
    console.log(`[Swagger] 文档已更新，包含 ${Object.keys(swaggerDoc.paths).length} 个API路径`);
    
    return swaggerDoc;
  }
}

module.exports = SwaggerService; 