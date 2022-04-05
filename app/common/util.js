var Cookies = require("js-cookie");
const querystring = require("querystring");
var moment = require("moment");

// 获取登录信息
let getDesc = (resc) => {
  console.log(resc, 'resc1');
  let resc1 = querystring.unescape(resc).slice(5);
  return JSON.parse(resc1);
};
// 获取当前时间
let getNow = (resc) => {
  var now = moment().format("YYYY-MM-DD, HH:mm:ss");
  return now;
};

exports.getDesc = getDesc;
exports.getNow = getNow;
