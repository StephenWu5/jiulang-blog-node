const user = require("../models/user.model.js");

// Create and Save a new user
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a user
  const User = new user({
    email: req.body.email,
    name: req.body.name,
    active: req.body.active
  });

  // Save user in the database
  user.create(User, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the user.",
      });
    else res.send(data);
  });
};

// Retrieve all users from the database.
exports.findAll = (req, res) => {
  user.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    else res.send(data);
  });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
  user.findById(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving user with id " + req.params.userId
        });
      }
    } else res.send(data);
  });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  user.updateById(
    req.params.userId,
    new user(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found user with id ${req.params.userId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating user with id " + req.params.userId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  user.remove(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete user with id " + req.params.userId
        });
      }
    } else res.send({ message: `user was deleted successfully!` });
  });
};

// Delete all users from the database.
exports.deleteAll = (req, res) => {
  user.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    else res.send({ message: `All users were deleted successfully!` });
  });
};

// Find a single user with a userId
exports.login = (req, res) => {
  user.login(req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(400).send({
          code: 400,
          message: "用户名或者密码错误",
          data: []
        });
      } else {
        res.status(500).send({
          code: 500,
          message: "用户名或者密码错误或者服务器错误",
          data: [],
        });
      }
    } else {
      res.cookie("resc", "设置到cookie里的值", {
        expires: new Date(Date.now() + 900000000),
      });
      res.status(200).send({
        code: 200,
        message: "登录成功",
        data: []
      });
    }
  });
};
