# Digital Brain AI Agent Backend

A personal AI agent that processes user content (PDFs, images, web links, YouTube, Twitter) and provides intelligent responses based on the uploaded content using vector search and Gemini LLM.

## Features

- **Multi-format Content Processing**: PDF, images, web links, YouTube videos, Twitter posts, and plain text
- **Vector Search**: Uses HuggingFace embeddings and MongoDB vector search for semantic similarity
- **AI Responses**: Powered by Google Gemini LLM for intelligent, context-aware responses
- **User Management**: Secure authentication and user-specific content storage
- **Content Management**: Upload, query, and manage personal content
- **Integrated AI**: AI agent functionality is seamlessly integrated into existing content endpoints

## Tech Stack

- **Backend**: Node.js with Express and TypeScript
- **Database**: MongoDB with vector search capabilities
- **Embeddings**: HuggingFace Transformers (Xenova/all-MiniLM-L6-v2)
- **LLM**: Google Gemini Pro
- **File Processing**: PDF parsing, OCR for images, web scraping
- **Authentication**: JWT-based authentication

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (with vector search enabled)
- Google Gemini API key
<!-- 
## Installation

1. **Clone the repository and navigate to the backend directory:**
   ```bash
   cd Digital_Brain/Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Google Gemini
   GEMINI_API_KEY=your_gemini_api_key
   
   # JWT Secret
   JWT_SECRET=your_jwt_secret_key
   
   # Server
   PORT=5000
   
   # Optional: Cloudinary (for file storage)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Set up MongoDB Vector Search:**
   Ensure your MongoDB instance has vector search enabled. Create a vector search index on the `embedding` field:
   ```javascript
   db.chunks.createIndex(
     { embedding: "vector" },
     {
       name: "default",
       numDimensions: 384,
       similarity: "cosine"
     }
   )
   ```

5. **Build and start the server:**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication Required Endpoints

All endpoints require authentication via JWT token in the Authorization header.

#### 1. Upload Content (with AI Processing)
**POST** `/api/v1/content`

Upload content and automatically process it for AI agent functionality.

**File Upload:**
```bash
curl -X POST http://localhost:5000/api/v1/content \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@document.pdf" \
  -F "title=My Document" \
  -F "type=document" \
  -F "tags=pdf,document,important"
```

**URL/Text Upload:**
```bash
curl -X POST http://localhost:5000/api/v1/content \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Article Link",
    "type": "link",
    "link": "https://example.com/article",
    "tags": ["article", "research"]
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Content added successfully",
  "data": {
    "_id": "...",
    "title": "My Document",
    "type": "document",
    "link": "cloudinary_url",
    "tags": ["pdf", "document", "important"],
    "userId": "...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Note**: When content is uploaded, it's automatically processed for AI agent functionality:
- Text is extracted and chunked
- Embeddings are generated and stored in vector database
- Content becomes available for AI queries

#### 2. Query AI Agent
**POST** `/api/v1/content/query`

Ask questions about your uploaded content.

```bash
curl -X POST http://localhost:5000/api/v1/content/query \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are the main points discussed in my documents?"
  }'
```

**Response:**
```json
{
  "success": true,
  "answer": "Based on your content, the main points discussed are...",
  "sources": ["document.pdf", "article.pdf"],
  "confidence": 0.85
}
```

#### 3. Get Content Summary
**GET** `/api/v1/content/summary`

Get a summary of your uploaded content and AI processing statistics.

```bash
curl -X GET http://localhost:5000/api/v1/content/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "totalChunks": 150,
    "contentTypes": ["pdf", "web", "youtube"],
    "recentUploads": [
      {
        "source": "document.pdf",
        "contentType": "pdf",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### 4. Get All Content
**GET** `/api/v1/content`

Get all content for the current user.

```bash
curl -X GET http://localhost:5000/api/v1/content \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 5. Search Content
**POST** `/api/v1/content/search`

Search through content using traditional text search.

```bash
curl -X POST http://localhost:5000/api/v1/content/search \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id",
    "query": "search term"
  }'
```

#### 6. Delete Content
**DELETE** `/api/v1/content`

Delete specific content.

```bash
curl -X DELETE http://localhost:5000/api/v1/content \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contentId": "content_id_to_delete"
  }'
```

## Supported Content Types

### 1. PDF Documents
- Extracts text content from PDF files
- Supports multi-page documents
- Maintains document structure

### 2. Images
- OCR processing using Tesseract.js
- Supports common image formats (JPEG, PNG, etc.)
- Extracts text from images, screenshots, and scanned documents

### 3. Web Links
- Web scraping using Cheerio
- Extracts main content from web pages
- Removes scripts and styling for clean text

### 4. YouTube Videos
- Extracts video transcripts
- Supports both YouTube.com and youtu.be URLs
- Processes video content for text-based queries

### 5. Twitter Posts
- Web scraping using Puppeteer
- Extracts tweet content
- Supports both twitter.com and x.com URLs

### 6. Plain Text
- Direct text input
- Manual content entry
- Quick notes and documents

## How It Works

### Content Upload Flow
```
User Uploads Content → Store in Content DB → Extract Text → Chunk Text → 
Generate Embeddings → Store in Vector DB → Content Ready for AI Queries
```

### AI Query Flow
```
User Question → Generate Query Embedding → Vector Search → Retrieve Similar Chunks → 
Generate Context → Send to Gemini LLM → Return AI Response
```

## Architecture

```
User Upload → Content Controller → Store in MongoDB → AI Processing → Vector Storage
                                                                    ↓
User Query → Query Endpoint → Vector Search → Context Retrieval → Gemini LLM → Response
```

## Error Handling

The API includes comprehensive error handling for:
- Invalid file types
- Processing failures
- Database errors
- API rate limits
- Authentication errors

## Performance Considerations

- **Chunk Size**: Text is chunked into 50-character pieces with 10-character overlap
- **Vector Search**: Uses MongoDB's vector search with cosine similarity
- **Caching**: Consider implementing Redis for frequently accessed embeddings
- **Rate Limiting**: Implement rate limiting for production use

## Security

- JWT-based authentication
- File type validation
- File size limits (10MB)
- Input sanitization
- CORS configuration

## Development

### Running in Development Mode
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

### Testing
```bash
# Add test scripts to package.json
npm test
```

## Troubleshooting

### Common Issues

1. **MongoDB Vector Search Not Working**
   - Ensure MongoDB version supports vector search
   - Check vector search index configuration
   - Verify embedding dimensions match (384 for all-MiniLM-L6-v2)

2. **Gemini API Errors**
   - Verify GEMINI_API_KEY is set correctly
   - Check API quota and rate limits
   - Ensure internet connectivity

3. **File Upload Issues**
   - Check file size limits
   - Verify supported file types
   - Ensure proper multipart form data

4. **Embedding Generation Failures**
   - Check HuggingFace model availability
   - Verify internet connectivity for model downloads
   - Monitor memory usage for large files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the ISC License.  -->