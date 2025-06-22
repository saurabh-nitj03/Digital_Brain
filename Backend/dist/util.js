"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random = (len) => {
    let options = "ndkjnmcnisjdkvisjakpaajwoew";
    let ans = "";
    for (let i = 0; i < len; i++) {
        ans += options[Math.floor(Math.random() * options.length)];
    }
    return ans;
};
exports.default = random;
