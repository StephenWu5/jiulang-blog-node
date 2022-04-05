const sql = require("./db.js");

// constructor
const tag = function (tag) {
    this.name = tag.name;
};

tag.create = (newtag, result) => {
    sql.query("INSERT INTO tags SET ?", newtag, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created tag: ", { id: res.insertId, ...newtag });
        result(null, { id: res.insertId, ...newtag });
    });
};

tag.findById = (tagId, result) => {
    sql.query(`SELECT * FROM tags WHERE id = ${tagId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found tag: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found tag with the id
        result({ kind: "not_found" }, null);
    });
};



tag.getAllByPage = (pagination, result) => {
    const current = pagination.current  //当前的num
    const pageSize = pagination.pageSize  //当前页的数量
    const params = [(parseInt(current) - 1) * parseInt(pageSize), parseInt(pageSize)]
    sql.query("SELECT * FROM tags ORDER BY name DESC limit ?,?", params, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        let sqlTotal = 'select count(*) as total from tags' //as更换名称
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

tag.getAll = (result) => {
    sql.query("SELECT * FROM tags", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("tags: ", res);
        result(null, res);
    });
}

tag.updateById = (id, tag, result) => {
    sql.query(
        `UPDATE tags SET status = ?, content = ?, title = ? WHERE id = ?`,
        [tag.status, tag.content, tag.title, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found tag with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated tag: ", { id: id, ...tag });
            result(null, { id: id, ...tag });
        }
    );
};

tag.remove = (id, result) => {
    sql.query("DELETE FROM tags WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found tag with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted tag with id: ", id);
        result(null, res);
    });
};

tag.removeAll = (result) => {
    sql.query("DELETE FROM tags", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} tags`);
        result(null, res);
    });
};

module.exports = tag;
