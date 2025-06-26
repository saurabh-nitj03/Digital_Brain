"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = chunkText;
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
const text_splitter_1 = require("langchain/text_splitter");
function chunkText(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: 400,
            chunkOverlap: 10
        });
        return yield splitter.splitText(text);
    });
}
// const res= chunkText("csnajniaj,msnicnsxcnkxzcmmzxncksnv kjaxn,m vjkjnvn kjndvj mknviens,mncjkjwejkfnknxkjqawdnjksanknwk")
// console.log(res);
// (async () => {
// const langchain = await import('langchain');
// })();
