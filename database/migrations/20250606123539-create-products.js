'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '产品名称'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '产品描述'
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: '产品价格'
      },
      original_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: '原价'
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: '产品分类'
      },
      brand: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: '品牌'
      },
      sku: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true,
        comment: '商品编码'
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '库存数量'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'draft'),
        allowNull: false,
        defaultValue: 'draft',
        comment: '产品状态: active-上架, inactive-下架, draft-草稿'
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: '产品图片JSON数组'
      },
      weight: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
        comment: '重量(kg)'
      },
      dimensions: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: '尺寸信息(长宽高)'
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: '产品标签'
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true,
        defaultValue: 0.00,
        comment: '平均评分'
      },
      review_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '评价数量'
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '是否推荐产品'
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '排序权重'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      }
    });

    // 添加索引
    await queryInterface.addIndex('products', ['category']);
    await queryInterface.addIndex('products', ['brand']);
    await queryInterface.addIndex('products', ['status']);
    await queryInterface.addIndex('products', ['is_featured']);
    await queryInterface.addIndex('products', ['sort_order']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
