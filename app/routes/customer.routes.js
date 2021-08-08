module.exports = app => {
  const users = require("../controllers/user.controller.js");

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

  // =====================登录功能模块=============================================
  // 登录
  app.post("/api/login", users.login);
  // 注册
  app.post("/api/register", users.register);

  // =====================文章功能模块=============================================
  // 登录
  app.post("/api/articles/dispatch", users.login);
  // 注册
};
