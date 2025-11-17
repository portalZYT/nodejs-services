'use strict';

module.exports = app => {
  const { STRING, INTEGER, DECIMAL, TEXT, JSON, BOOLEAN, DATE, ENUM } = app.Sequelize;

  const Product = app.model.define('Product', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING(100),
      allowNull: false,
      comment: '产品名称',
    },
    description: {
      type: TEXT,
      allowNull: true,
      comment: '产品描述',
    },
    price: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: '产品价格',
    },
    originalPrice: {
      type: DECIMAL(10, 2),
      allowNull: true,
      comment: '原价',
      field: 'original_price',
    },
    category: {
      type: STRING(50),
      allowNull: true,
      comment: '产品分类',
    },
    brand: {
      type: STRING(50),
      allowNull: true,
      comment: '品牌',
    },
    sku: {
      type: STRING(50),
      allowNull: true,
      unique: true,
      comment: '商品编码',
    },
    stock: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '库存数量',
    },
    status: {
      type: ENUM('active', 'inactive', 'draft'),
      allowNull: false,
      defaultValue: 'draft',
      comment: '产品状态',
    },
    images: {
      type: JSON,
      allowNull: true,
      comment: '产品图片JSON数组',
    },
    weight: {
      type: DECIMAL(8, 2),
      allowNull: true,
      comment: '重量(kg)',
    },
    dimensions: {
      type: JSON,
      allowNull: true,
      comment: '尺寸信息(长宽高)',
    },
    tags: {
      type: JSON,
      allowNull: true,
      comment: '产品标签',
    },
    rating: {
      type: DECIMAL(3, 2),
      allowNull: true,
      defaultValue: 0.00,
      comment: '平均评分',
    },
    reviewCount: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '评价数量',
      field: 'review_count',
    },
    isFeatured: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '是否推荐产品',
      field: 'is_featured',
    },
    sortOrder: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '排序权重',
      field: 'sort_order',
    },
    createdAt: {
      type: DATE,
      allowNull: false,
      field: 'created_at',
    },
    updatedAt: {
      type: DATE,
      allowNull: false,
      field: 'updated_at',
    },
  }, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    underscored: false,
  });

  return Product;
}; 