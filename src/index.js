var jsonop = require("./jsonop");

exports.merge = function (left, right) { return jsonop(left, right, false); };
exports.apply = function (left, right) { return jsonop(left, right, true); };
