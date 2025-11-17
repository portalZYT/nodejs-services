'use strict';

const Controller = require('egg').Controller;

/**
 * @controller Product 产品管理
 */
class ProductController extends Controller {
  
  /**
   * @summary 获取产品列表
   * @description 获取产品列表，支持分页、搜索、筛选
   * @router GET /api/products
   * @request query integer page 页码，默认1
   * @request query integer pageSize 每页数量，默认10
   * @request query string keyword 搜索关键词
   * @request query string category 产品分类
   * @request query string brand 品牌
   * @request query string status 状态
   * @request query boolean isFeatured 是否推荐产品
   * @request query string sortBy 排序字段
   * @request query string sortOrder 排序方式
   * @response 200 object 获取成功
   */
  async getProductList() {
    const { ctx } = this;
    const {
      page = 1,
      pageSize = 10,
      keyword,
      category,
      brand,
      status,
      isFeatured,
      sortBy = 'sortOrder',
      sortOrder = 'DESC'
    } = ctx.query;

    try {
      // 构建查询条件
      const where = {};
      
      // 关键词搜索（产品名称和描述）
      if (keyword) {
        where[ctx.app.Sequelize.Op.or] = [
          { name: { [ctx.app.Sequelize.Op.like]: `%${keyword}%` } },
          { description: { [ctx.app.Sequelize.Op.like]: `%${keyword}%` } }
        ];
      }
      
      // 分类筛选
      if (category) {
        where.category = category;
      }
      
      // 品牌筛选
      if (brand) {
        where.brand = brand;
      }
      
      // 状态筛选
      if (status) {
        where.status = status;
      }
      
      // 推荐产品筛选
      if (isFeatured !== undefined) {
        where.isFeatured = isFeatured === 'true';
      }

      // 构建排序条件
      const orderMap = {
        price: 'price',
        rating: 'rating',
        createdAt: 'createdAt',
        sortOrder: 'sortOrder'
      };
      const orderField = orderMap[sortBy] || 'sortOrder';
      const order = [[orderField, sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']];

      // 分页参数
      const offset = (parseInt(page) - 1) * parseInt(pageSize);
      const limit = parseInt(pageSize);

      // 查询数据
      const result = await ctx.model.Product.findAndCountAll({
        where,
        order,
        offset,
        limit,
        attributes: [
          'id', 'name', 'description', 'price', 'originalPrice', 
          'category', 'brand', 'sku', 'stock', 'status', 'images',
          'weight', 'dimensions', 'tags', 'rating', 'reviewCount',
          'isFeatured', 'sortOrder', 'createdAt', 'updatedAt'
        ]
      });

      ctx.body = {
        code: 200,
        message: '获取产品列表成功',
        data: {
          list: result.rows,
          pagination: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            total: result.count,
            totalPages: Math.ceil(result.count / parseInt(pageSize))
          }
        }
      };

    } catch (error) {
      ctx.logger.error('获取产品列表失败:', error);
      ctx.body = {
        code: 500,
        message: '获取产品列表失败',
        error: error.message
      };
      ctx.status = 500;
    }
  }

  /**
   * @summary 获取产品详情
   * @description 根据ID获取产品详情
   * @router GET /api/products/{id}
   * @request path integer id 产品ID
   * @response 200 object 获取成功
   */
  async getProductById() {
    const { ctx } = this;
    const { id } = ctx.params;

    try {
      const product = await ctx.model.Product.findByPk(id);
      
      if (!product) {
        ctx.body = {
          code: 404,
          message: '产品不存在'
        };
        ctx.status = 404;
        return;
      }

      ctx.body = {
        code: 200,
        message: '获取产品详情成功',
        data: product
      };

    } catch (error) {
      ctx.logger.error('获取产品详情失败:', error);
      ctx.body = {
        code: 500,
        message: '获取产品详情失败',
        error: error.message
      };
      ctx.status = 500;
    }
  }

  /**
   * @summary 创建产品
   * @description 创建新产品
   * @router POST /api/products
   * @request body object 产品信息
   * @response 201 object 创建成功
   */
  async createProduct() {
    const { ctx } = this;
    const body = ctx.request.body;

    try {
      // 基本参数验证
      if (!body.name || !body.price) {
        ctx.body = {
          code: 400,
          message: '产品名称和价格不能为空'
        };
        ctx.status = 400;
        return;
      }

      // 检查SKU唯一性
      if (body.sku) {
        const existingSku = await ctx.model.Product.findOne({
          where: { sku: body.sku }
        });
        if (existingSku) {
          ctx.body = {
            code: 400,
            message: '商品编码已存在'
          };
          ctx.status = 400;
          return;
        }
      }

      const product = await ctx.model.Product.create(body);

      ctx.body = {
        code: 201,
        message: '创建产品成功',
        data: product
      };
      ctx.status = 201;

    } catch (error) {
      ctx.logger.error('创建产品失败:', error);
      ctx.body = {
        code: 500,
        message: '创建产品失败',
        error: error.message
      };
      ctx.status = 500;
    }
  }

  /**
   * @summary 更新产品
   * @description 更新产品信息
   * @router PUT /api/products/{id}
   * @request path integer id 产品ID
   * @request body object 产品信息
   * @response 200 object 更新成功
   */
  async updateProduct() {
    const { ctx } = this;
    const { id } = ctx.params;
    const body = ctx.request.body;

    try {
      const product = await ctx.model.Product.findByPk(id);
      
      if (!product) {
        ctx.body = {
          code: 404,
          message: '产品不存在'
        };
        ctx.status = 404;
        return;
      }

      // 检查SKU唯一性（如果更新了SKU）
      if (body.sku && body.sku !== product.sku) {
        const existingSku = await ctx.model.Product.findOne({
          where: { 
            sku: body.sku,
            id: { [ctx.app.Sequelize.Op.ne]: id }
          }
        });
        if (existingSku) {
          ctx.body = {
            code: 400,
            message: '商品编码已存在'
          };
          ctx.status = 400;
          return;
        }
      }

      await product.update(body);

      ctx.body = {
        code: 200,
        message: '更新产品成功',
        data: product
      };

    } catch (error) {
      ctx.logger.error('更新产品失败:', error);
      ctx.body = {
        code: 500,
        message: '更新产品失败',
        error: error.message
      };
      ctx.status = 500;
    }
  }

  /**
   * @summary 删除产品
   * @description 删除产品
   * @router DELETE /api/products/{id}
   * @request path integer id 产品ID
   * @response 200 object 删除成功
   */
  async deleteProduct() {
    const { ctx } = this;
    const { id } = ctx.params;

    try {
      const product = await ctx.model.Product.findByPk(id);
      
      if (!product) {
        ctx.body = {
          code: 404,
          message: '产品不存在'
        };
        ctx.status = 404;
        return;
      }

      await product.destroy();

      ctx.body = {
        code: 200,
        message: '删除产品成功'
      };

    } catch (error) {
      ctx.logger.error('删除产品失败:', error);
      ctx.body = {
        code: 500,
        message: '删除产品失败',
        error: error.message
      };
      ctx.status = 500;
    }
  }

  /**
   * @summary 获取产品分类列表
   * @description 获取所有产品分类
   * @router GET /api/products/categories
   * @response 200 object 获取成功
   */
  async getCategories() {
    const { ctx } = this;

    try {
      const categories = await ctx.model.Product.findAll({
        attributes: [
          [ctx.app.Sequelize.fn('DISTINCT', ctx.app.Sequelize.col('category')), 'category']
        ],
        where: {
          category: { [ctx.app.Sequelize.Op.ne]: null }
        },
        raw: true
      });

      ctx.body = {
        code: 200,
        message: '获取分类列表成功',
        data: categories.map(item => item.category).filter(Boolean)
      };

    } catch (error) {
      ctx.logger.error('获取分类列表失败:', error);
      ctx.body = {
        code: 500,
        message: '获取分类列表失败',
        error: error.message
      };
      ctx.status = 500;
    }
  }

  /**
   * @summary 获取品牌列表
   * @description 获取所有品牌
   * @router GET /api/products/brands
   * @response 200 object 获取成功
   */
  async getBrands() {
    const { ctx } = this;

    try {
      const brands = await ctx.model.Product.findAll({
        attributes: [
          [ctx.app.Sequelize.fn('DISTINCT', ctx.app.Sequelize.col('brand')), 'brand']
        ],
        where: {
          brand: { [ctx.app.Sequelize.Op.ne]: null }
        },
        raw: true
      });

      ctx.body = {
        code: 200,
        message: '获取品牌列表成功',
        data: brands.map(item => item.brand).filter(Boolean)
      };

    } catch (error) {
      ctx.logger.error('获取品牌列表失败:', error);
      ctx.body = {
        code: 500,
        message: '获取品牌列表失败',
        error: error.message
      };
      ctx.status = 500;
    }
  }

  /**
   * @summary 获取热门产品
   * @description 获取评分最高的热门产品列表
   * @router GET /api/products/hot
   * @request query integer limit 限制数量，默认5
   * @response 200 object 获取成功
   */
  async getHotProducts() {
    const { ctx } = this;
    const { limit = 5 } = ctx.query;

    try {
      const products = await ctx.model.Product.findAll({
        where: {
          status: 'active',
          isFeatured: true
        },
        order: [['rating', 'DESC'], ['reviewCount', 'DESC']],
        limit: parseInt(limit),
        attributes: ['id', 'name', 'price', 'rating', 'reviewCount', 'images']
      });

      ctx.body = {
        code: 200,
        message: '获取热门产品成功',
        data: products
      };

    } catch (error) {
      ctx.logger.error('获取热门产品失败:', error);
      ctx.body = {
        code: 500,
        message: '获取热门产品失败',
        error: error.message
      };
      ctx.status = 500;
    }
  }
}

module.exports = ProductController; 