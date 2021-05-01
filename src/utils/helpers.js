const path = require("path");


module.exports.createUrl = (base, url, params) => {
    const result = new URL(`${path.join(base, url)}`);


    if (params) {
        result.search = new URLSearchParams(params).toString();
    }
    return result;
}