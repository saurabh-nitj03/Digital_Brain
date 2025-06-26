"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentProcessor = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const youtube_transcript_1 = require("youtube-transcript");
const puppeteer_1 = __importDefault(require("puppeteer"));
class ContentProcessor {
    // Process PDF files
    static processPDF(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0, pdf_parse_1.default)(buffer);
                return {
                    text: data.text,
                    source: 'PDF Document',
                    type: 'pdf'
                };
            }
            catch (error) {
                throw new Error(`Failed to process PDF: ${error}`);
            }
        });
    }
    // Process images using OCR
    static processImage(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield tesseract_js_1.default.recognize(buffer, 'eng', {
                    logger: m => console.log(m)
                });
                return {
                    text: result.data.text,
                    source: 'Image OCR',
                    type: 'image'
                };
            }
            catch (error) {
                throw new Error(`Failed to process image: ${error}`);
            }
        });
    }
    // Process web links
    static processWebLink(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(url);
                const $ = cheerio.load(response.data);
                // Remove script and style elements
                $('script').remove();
                $('style').remove();
                // Extract text from body
                const text = $('body').text().replace(/\s+/g, ' ').trim();
                return {
                    text: text,
                    source: url,
                    type: 'web'
                };
            }
            catch (error) {
                throw new Error(`Failed to process web link: ${error}`);
            }
        });
    }
    // Process YouTube links
    static processYouTubeLink(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract video ID from URL
                const videoId = this.extractYouTubeVideoId(url);
                if (!videoId) {
                    throw new Error('Invalid YouTube URL');
                }
                const transcripts = yield youtube_transcript_1.YoutubeTranscript.fetchTranscript(videoId);
                const text = transcripts.map(item => item.text).join(' ');
                return {
                    text: text,
                    source: url,
                    type: 'youtube'
                };
            }
            catch (error) {
                throw new Error(`Failed to process YouTube link: ${error}`);
            }
        });
    }
    // Process Twitter links
    static processTwitterLink(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const browser = yield puppeteer_1.default.launch({ headless: true });
                const page = yield browser.newPage();
                yield page.goto(url, { waitUntil: 'networkidle0' });
                // Wait for tweet content to load
                yield page.waitForSelector('[data-testid="tweetText"]', { timeout: 10000 });
                const tweetText = yield page.$eval('[data-testid="tweetText"]', el => el.textContent);
                yield browser.close();
                return {
                    text: tweetText || 'No text found',
                    source: url,
                    type: 'twitter'
                };
            }
            catch (error) {
                throw new Error(`Failed to process Twitter link: ${error}`);
            }
        });
    }
    // Process plain text
    static processText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                text: text,
                source: 'User Input',
                type: 'text'
            };
        });
    }
    // Main processing function that determines content type and processes accordingly
    static processContent(content, contentType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // If content is a buffer, it's likely a file
                if (Buffer.isBuffer(content)) {
                    if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('pdf')) {
                        return yield this.processPDF(content);
                    }
                    else if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('image')) {
                        return yield this.processImage(content);
                    }
                    else {
                        throw new Error('Unsupported file type');
                    }
                }
                // If content is a string, check if it's a URL
                if (typeof content === 'string') {
                    const url = content.trim();
                    if (this.isYouTubeUrl(url)) {
                        return yield this.processYouTubeLink(url);
                    }
                    else if (this.isTwitterUrl(url)) {
                        return yield this.processTwitterLink(url);
                    }
                    else if (this.isWebUrl(url)) {
                        return yield this.processWebLink(url);
                    }
                    else {
                        return yield this.processText(content);
                    }
                }
                throw new Error('Unsupported content type');
            }
            catch (error) {
                throw new Error(`Content processing failed: ${error}`);
            }
        });
    }
    // Helper methods to detect URL types
    static isYouTubeUrl(url) {
        return url.includes('youtube.com') || url.includes('youtu.be');
    }
    static isTwitterUrl(url) {
        return url.includes('twitter.com') || url.includes('x.com');
    }
    static isWebUrl(url) {
        return url.startsWith('http://') || url.startsWith('https://');
    }
    static extractYouTubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
}
exports.ContentProcessor = ContentProcessor;
