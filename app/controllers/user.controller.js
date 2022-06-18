const user = require("../models/user.model.js");

// someText 是盐值
var salt = "123456212123243556！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！%！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！";

// Find a single user with a userId
exports.login = (req, res) => {
    // Create a user
    // MD5 Hash
    req.body.password = require("crypto")
        .createHash("md5")
        .update(req.body.password + salt)
        .digest("hex");
    user.login(req.body, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(400).send({
                    code: 400,
                    message: "用户名或者密码错误",
                    data: [],
                });
            } else {
                res.status(500).send({
                    code: 500,
                    message: "用户名或者密码错误或者服务器错误",
                    data: [],
                });
            }
        } else {
            // 后端设置cookie
            res.cookie("resc", JSON.stringify(data), {
                expires: new Date(Date.now() + 900000000),
            });
            res.status(200).send({
                code: 200,
                message: "登录成功",
                data: data,
            });
        }
    });
};

// 用户注册
exports.register = (req, res) => {
    let params = req.body;
    user.register(params, (err, data) => {
        if (err) {
            if (err.kind === "already_register") {
                res.status(400).send({
                    code: 400,
                    message: "已注册",
                    data: [],
                });
            } else {
                res.status(500).send({
                    code: 500,
                    message: "服务器错误1",
                    data: [],
                });
            }
        } else {
            //注册
            this.create(req, res);
        }
    });
};

// Create and Save a new user
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a user

    // MD5 Hash
    let password = require("crypto")
        .createHash("md5")
        .update(req.body.password + salt)
        .digest("hex");
    const User = new user({
        password: password,
        name: req.body.name,
    });

    // Save user in the database
    user.create(User, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the user.",
            });
        else res.send({
            code: 200,
            message: '注册成功',
            data: data,
        });
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



