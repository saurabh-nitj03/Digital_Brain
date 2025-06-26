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
exports.storeChunks = storeChunks;
exports.searchChunks = searchChunks;
exports.getUserChunks = getUserChunks;
exports.deleteUserChunks = deleteUserChunks;
const pinecone_1 = require("@pinecone-database/pinecone");
const uuid_1 = require("uuid");
// Pinecone client setup
const pinecone = new pinecone_1.Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});
const index = pinecone.Index(process.env.PINECONE_INDEX);
// Store (upsert) chunks as vectors in Pinecone
function storeChunks(userId, embedChunks) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const vectors = embedChunks.map((item) => ({
                id: (0, uuid_1.v4)(),
                values: item.embedding,
                metadata: Object.assign({ userId, chunktext: item.chunk, source: item.source || 'Unknown', contentType: item.contentType || 'text' }, item.metadata),
            }));
            yield index.upsert(vectors);
            console.log(`Upserted ${vectors.length} vectors for user ${userId}`);
            return vectors;
        }
        catch (error) {
            console.error('Error storing chunks in Pinecone:', error);
            throw error;
        }
    });
}
// Search for similar vectors in Pinecone
function searchChunks(userId_1, questionEmbedding_1) {
    return __awaiter(this, arguments, void 0, function* (userId, questionEmbedding, topk = 10) {
        var _a;
        try {
            const result = yield index.query({
                vector: questionEmbedding,
                topK: topk,
                filter: { userId },
                includeMetadata: true,
            });
            // Map Pinecone results to expected format
            const matches = ((_a = result.matches) === null || _a === void 0 ? void 0 : _a.map((match) => ({
                chunktext: match.metadata.chunktext,
                source: match.metadata.source,
                contentType: match.metadata.contentType,
                metadata: match.metadata,
                score: match.score,
            }))) || [];
            console.log(`Found ${matches.length} similar chunks for user ${userId}`);
            return matches;
        }
        catch (error) {
            console.error('Error searching chunks in Pinecone:', error);
            throw error;
        }
    });
}
// Pinecone does not support listing all vectors for a user directly
function getUserChunks(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Not directly supported; would require maintaining a separate metadata DB or using Pinecone's metadata filtering with a scan (not recommended for large datasets)
        console.warn('getUserChunks is not implemented for Pinecone.');
        return [];
    });
}
// Delete all vectors for a user in Pinecone
function deleteUserChunks(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Pinecone does not support batch delete by metadata; you must track IDs or use a metadata scan (not recommended for large datasets)
        console.warn('deleteUserChunks is not implemented for Pinecone.');
        return { deletedCount: 0 };
    });
}
