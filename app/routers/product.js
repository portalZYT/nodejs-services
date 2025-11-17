module.exports = app => {
  const { router, controller } = app;

  // 产品列表接口
  router.get('/api/products', controller.product.getProductList);
  
  // 获取产品分类列表 - 必须在 :id 路由之前
  router.get('/api/products/categories', controller.product.getCategories);
  
  // 获取品牌列表 - 必须在 :id 路由之前
  router.get('/api/products/brands', controller.product.getBrands);
  
  // 获取热门产品 - 必须在 :id 路由之前
  router.get('/api/products/hot', controller.product.getHotProducts);
  
  // 产品详情接口
  router.get('/api/products/:id', controller.product.getProductById);
  
  // 创建产品接口
  router.post('/api/products', controller.product.createProduct);
  
  // 更新产品接口
  router.put('/api/products/:id', controller.product.updateProduct);
  
  // 删除产品接口
  router.delete('/api/products/:id', controller.product.deleteProduct);
}; 