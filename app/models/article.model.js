const sql = require("./db.js");

// constructor
const article = function (article) {
    this.title = article.title;
    this.content = article.content;
    this.author = article.author;
    this.author_id = article.author_id;
    this.create_time = article.create_time;
    this.status = article.status;
    this.tags = article.tags;
};

article.create = (newarticle, result) => {
    sql.query("INSERT INTO articles SET ?", newarticle, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created article: ", { id: res.insertId, ...newarticle });
        result(null, { id: res.insertId, ...newarticle });
    });
};

article.findById = (articleId, result) => {
    sql.query(`SELECT * FROM articles WHERE id = ${articleId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found article: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found article with the id
        result({ kind: "not_found" }, null);
    });
};



article.getAll = (pagination, result) => {
    const current = pagination.current  //当前的num
    const pageSize = pagination.pageSize  //当前页的数量
    const params = [(parseInt(current) - 1) * parseInt(pageSize), parseInt(pageSize)]
    sql.query("SELECT * FROM articles ORDER BY create_time DESC limit ?,?", params, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        let sqlTotal = 'select count(*) as total from articles' //as更换名称
        sql.query(sqlTotal, function (error, among) {
            if (error) {
                result(null, error);
                return;
            }
            let total = among[0]['total'] //查询表中的数量
            result(null, {
                data: res,
                current,
                pageSize,
                total,
            });
        })
    });
};

article.updateById = (id, article, result) => {
    sql.query(
        `UPDATE articles SET status = ?, content = ?, title = ?, tags = ? WHERE id = ?`,
        [article.status, article.content, article.title, article.tags, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found article with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated article: ", { id: id, ...article });
            result(null, { id: id, ...article });
        }
    );
};

article.remove = (id, result) => {
    sql.query("DELETE FROM articles WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found article with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted article with id: ", id);
        result(null, res);
    });
};

article.removeAll = (result) => {
    sql.query("DELETE FROM articles", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} articles`);
        result(null, res);
    });
};

module.exports = article;
