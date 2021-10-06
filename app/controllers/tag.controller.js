const tag = require("../models/tag.model.js");
const { getDesc, getNow } = require("../common/util.mjs");

// Create and Save a new tag
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  tag.getAll((err, data) => {
    let index = data.findIndex((item) => {
      return item.name === req.body.name;
    });
    if( index !== -1) {
      res.send({
        code: 204,
        message: "标签已存在",
        data: [req.body.name],
      });
    } else {
      // Create a tag
      const Tag = new tag({
        name: req.body.name,
      });

      // Save tag in the database
      tag.create(Tag, (err, data) => {
        if (err)
          res.status(500).send({
            message: err.message || "Some error occurred while creating the tag.",
          });
        else
          res.send({
            code: 200,
            message: "新增成功",
            data: data,
          });
      });
    }
  });
};

// Retrieve all tags from the database.
exports.findAll = (req, res) => {


  tag.getAll((err, data) => {
    data = data.sort(function (a, b) {
      //sort 按发表时间正序排序
      return Date.parse(b.create_time) - Date.parse(a.create_time);
    });

    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tags."
      });
    else res.send({
      code: 200,
      message: "查询成功",
      data: data,
    });
  });
};

// Find a single tag with a tagId
exports.findOne = (req, res) => {
  tag.findById(req.params.tagId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found tag with id ${req.params.tagId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving tag with id " + req.params.tagId
        });
      }
    } else res.send(data);
  });
};

// Update a tag identified by the tagId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // update a tag
  let userData = getDesc(req.headers.cookie);
  const tag = new tag({
    title: req.body.title,
    content: req.body.content,
    author: userData.name,
    author_id: userData.id,
    status: req.body.status,
  });
  let message = req.body.status == 0 ? "保存成功" : "更新成功";

  tag.updateById(req.body.id, tag, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Error updating tag with id " + req.body.id,
      });
    } else res.send({
      code: 200,
      message: message,
      data: data,
    });
  });
};

// Delete a tag with the specified tagId in the request
exports.delete = (req, res) => {
  tag.remove(req.body.id, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Could not delete tag with id " + req.params.tagId
      });
    } else res.send({ code: 200, message: `删除成功!` });
  });
};

// Delete all tags from the database.
exports.deleteAll = (req, res) => {
  tag.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tags."
      });
    else res.send({ message: `All tags were deleted successfully!` });
  });
};



