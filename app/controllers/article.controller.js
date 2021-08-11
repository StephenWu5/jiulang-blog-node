const article = require("../models/article.model.js");

// Create and Save a new article
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a article
  const Article = new article({
    title: req.body.title,
    content: req.body.content,
  });

  // Save article in the database
  article.create(Article, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the article.",
      });
    else res.send({
      code: 200,
      message: '发布成功',
      data:data,
    });
  });
};

// Retrieve all articles from the database.
exports.findAll = (req, res) => {
  article.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving articles."
      });
    else res.send(data);
  });
};

// Find a single article with a articleId
exports.findOne = (req, res) => {
  article.findById(req.params.articleId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found article with id ${req.params.articleId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving article with id " + req.params.articleId
        });
      }
    } else res.send(data);
  });
};

// Update a article identified by the articleId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  article.updateById(
    req.params.articleId,
    new article(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found article with id ${req.params.articleId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating article with id " + req.params.articleId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a article with the specified articleId in the request
exports.delete = (req, res) => {
  article.remove(req.params.articleId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found article with id ${req.params.articleId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete article with id " + req.params.articleId
        });
      }
    } else res.send({ message: `article was deleted successfully!` });
  });
};

// Delete all articles from the database.
exports.deleteAll = (req, res) => {
  article.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all articles."
      });
    else res.send({ message: `All articles were deleted successfully!` });
  });
};



