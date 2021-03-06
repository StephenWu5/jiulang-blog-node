module.exports = app => {
  const users = require("../controllers/user.controller.js");
  const articles = require("../controllers/article.controller.js");
  const tags = require("../controllers/tag.controller.js");

  // Create a new user
  app.post("/users", users.create);
  // Retrieve all users
  app.get("/users", users.findAll);
  // Retrieve a single user with userId
  app.get("/users/:userId", users.findOne);
  // Update a user with userId
  app.put("/users/:userId", users.update);
  // Delete a user with userId
  app.delete("/users/:userId", users.delete);

  // =====================登录功能模块的开始=============================================
  // 登录
  app.post("/api/login", users.login);
  // 注册
  app.post("/api/register", users.register);
  // =====================登录功能模块的结束=============================================

  // =====================文章功能模块的开始=============================================
  // 发文--新增博文
  app.post("/api/articles/dispatch", articles.create);
  // 更新博文
  app.post("/api/articles/update", articles.update);
  // 删除博文
  app.post("/api/articles/delete", articles.delete);
  // 查询
  app.post("/api/articles/query", articles.findAll);
  // =====================文章功能模块的结束=============================================

  // =====================标签功能模块的开始=============================================
  // 新增标签
  app.post("/api/tags/create", tags.create);
  // 删除标签
  app.post("/api/tags/delete", tags.delete);
  // 查询标签
  app.post("/api/tags/query", tags.findAll);
  // =====================标签功能模块的结束=============================================
};
