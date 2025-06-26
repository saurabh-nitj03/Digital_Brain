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
exports.embedSentences = embedSentences;
exports.embedQuery = embedQuery;
const inference_1 = require("@huggingface/inference");
const hf = new inference_1.HfInference(process.env.HUGGINGFACE_API_KEY);
function embedSentences(sentences) {
    return __awaiter(this, void 0, void 0, function* () {
        const output = yield hf.featureExtraction({
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            inputs: sentences,
        });
        if (!Array.isArray(output) || !Array.isArray(output[0])) {
            throw new Error('Unexpected output from Hugging Face Inference API');
        }
        return sentences.map((chunk, i) => ({
            chunk,
            embedding: output[i],
        }));
    });
}
function embedQuery(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const output = yield hf.featureExtraction({
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            inputs: query,
        });
        if (!Array.isArray(output) || Array.isArray(output[0])) {
            throw new Error('Unexpected output from Hugging Face Inference API');
        }
        return output;
    });
}
// Commented out the old local model code below for reference
// ... existing code ...
