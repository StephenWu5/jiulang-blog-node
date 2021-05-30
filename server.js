const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var proxy = require("http-proxy-middleware");


const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// origin 可配置多个域名白名单（数组），也可配置一项域名（字符串）
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:8081", "http://www.tufu.com:8081"],
    headers: "X-Requested-With,Content-Type,username",
    methods: "PUT,POST,GET,DELETE,OPTIONS",
  })
);

// app.use(
//   "/",
//   proxy.createProxyMiddleware({
//     target: "http://localhost:8081",
//     changeOrigin: true,
//   })
// );

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/customer.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
