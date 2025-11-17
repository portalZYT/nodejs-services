# Swagger API 文档集成

## 🚀 快速开始

### 启动服务
```bash
npm run dev
```

### 访问文档
服务启动后，访问以下地址查看API文档：

- **Swagger UI**: http://localhost:7001/swagger-ui.html
- **Swagger JSON**: http://localhost:7001/swagger-doc

## 📝 API 接口列表

### 用户认证

| 接口 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 用户注册 | POST | `/login/register` | 注册新用户 |
| 用户登录 | POST | `/login/signin` | 用户登录获取token |
| 用户登出 | POST | `/login/signout` | 用户登出 |

## 📋 接口详情

### 1. 用户注册
- **URL**: `/login/register`
- **Method**: `POST`
- **请求参数**:
  ```json
  {
    "username": "john_doe",
    "mobile": "13800138000", 
    "password": "password123"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "username": "john_doe",
      "mobile": "13800138000",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### 2. 用户登录
- **URL**: `/login/signin`
- **Method**: `POST`
- **请求参数**:
  ```json
  {
    "username": "john_doe",
    "password": "password123"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "username": "john_doe",
        "mobile": "13800138000",
        "email": null,
        "role": "user",
        "avatar": null
      }
    }
  }
  ```

### 3. 用户登出
- **URL**: `/login/signout`
- **Method**: `POST`
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "message": "登出成功"
    }
  }
  ```

## 🛠️ 扩展API文档

### 添加新的API接口

1. **在控制器中添加Swagger注释**:
   ```javascript
   /**
    * @summary 接口摘要
    * @description 接口详细描述
    * @router post /api/path
    * @request body requestModel *body
    * @response 200 responseModel 成功响应
    * @response 400 errorResponse 错误响应
    */
   async methodName() {
     // 实现逻辑
   }
   ```

2. **定义请求/响应模型**:
   - 在 `app/contract/request/` 目录下创建请求模型
   - 在 `app/contract/response/` 目录下创建响应模型
   - 在 `app/contract/index.js` 中导出

3. **模型定义示例**:
   ```javascript
   module.exports = {
     requestModel: {
       field1: { type: 'string', required: true, description: '字段描述', example: '示例值' },
       field2: { type: 'integer', required: false, description: '数字字段' },
     },
     responseModel: {
       success: { type: 'boolean', description: '是否成功' },
       data: { type: 'object', description: '返回数据' }
     }
   };
   ```

## ⚙️ Swagger 配置

配置文件位于 `config/config.default.js`:

```javascript
config.swaggerdoc = {
  dirScanner: './app/controller',
  apiInfo: {
    title: 'Hotel API',
    description: '酒店管理系统API文档',
    version: '1.0.0',
  },
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  enableSecurity: false,
  routerMap: true,
  enable: true,
};
```

## 🔍 调试技巧

1. **检查Swagger JSON**: 访问 `/swagger-doc` 查看生成的OpenAPI规范
2. **验证注释格式**: 确保JSDoc注释格式正确
3. **检查模型导出**: 确保contract文件正确导出模型定义
4. **查看日志**: 开发模式下会显示详细的错误信息

## 📚 更多资源

- [egg-swagger-doc 官方文档](https://github.com/Yanshijie-EL/egg-swagger-doc)
- [OpenAPI 3.0 规范](https://swagger.io/specification/)
- [Swagger UI 文档](https://swagger.io/tools/swagger-ui/) 