const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Configuration
const BASE_URL = 'http://localhost:5000/api/v1';
const JWT_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token

// Test functions
async function testTextUpload() {
    console.log('🧪 Testing Text Upload...');
    try {
        const response = await axios.post(`${BASE_URL}/content`, {
            title: 'Test Document',
            type: 'text',
            content: 'This is a test document about artificial intelligence and machine learning. AI is transforming the way we work and live. Machine learning algorithms can process vast amounts of data to find patterns and make predictions.',
            tags: ['ai', 'ml', 'test']
        }, {
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Text upload successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Text upload failed:', error.response?.data || error.message);
    }
}

async function testLinkUpload() {
    console.log('🧪 Testing Link Upload...');
    try {
        const response = await axios.post(`${BASE_URL}/content`, {
            title: 'Wikipedia AI Article',
            type: 'link',
            link: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
            tags: ['ai', 'wikipedia', 'research']
        }, {
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Link upload successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Link upload failed:', error.response?.data || error.message);
    }
}

async function testAIQuery() {
    console.log('🧪 Testing AI Query...');
    try {
        const response = await axios.post(`${BASE_URL}/content/query`, {
            question: 'What is artificial intelligence and how does it work?'
        }, {
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ AI query successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ AI query failed:', error.response?.data || error.message);
    }
}

async function testContentSummary() {
    console.log('🧪 Testing Content Summary...');
    try {
        const response = await axios.get(`${BASE_URL}/content/summary`, {
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`
            }
        });
        
        console.log('✅ Content summary successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Content summary failed:', error.response?.data || error.message);
    }
}

async function testFileUpload() {
    console.log('🧪 Testing File Upload...');
    try {
        // Create a simple test PDF or text file
        const testContent = 'This is a test file content about artificial intelligence. AI systems can learn from data and make decisions. Machine learning is a subset of AI that focuses on algorithms.';
        
        // Create a temporary text file
        const tempFile = './test-file.txt';
        fs.writeFileSync(tempFile, testContent);
        
        const formData = new FormData();
        formData.append('file', fs.createReadStream(tempFile));
        formData.append('title', 'Test File');
        formData.append('type', 'document');
        formData.append('tags', 'test,file,ai');
        
        const response = await axios.post(`${BASE_URL}/content`, formData, {
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`,
                ...formData.getHeaders()
            }
        });
        
        // Clean up temp file
        fs.unlinkSync(tempFile);
        
        console.log('✅ File upload successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ File upload failed:', error.response?.data || error.message);
    }
}

// Main test function
async function runTests() {
    console.log('🚀 Starting AI Agent Tests...\n');
    
    // Test 1: Upload text content
    await testTextUpload();
    console.log('\n---\n');
    
    // Test 2: Upload link content
    await testLinkUpload();
    console.log('\n---\n');
    
    // Test 3: Upload file content
    await testFileUpload();
    console.log('\n---\n');
    
    // Wait a bit for processing
    console.log('⏳ Waiting for content processing...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Test 4: Query AI agent
    await testAIQuery();
    console.log('\n---\n');
    
    // Test 5: Get content summary
    await testContentSummary();
    console.log('\n---\n');
    
    console.log('✅ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
    if (JWT_TOKEN === 'YOUR_JWT_TOKEN_HERE') {
        console.log('❌ Please update the JWT_TOKEN variable with your actual token');
        console.log('💡 You can get a token by logging in through your frontend or auth endpoint');
    } else {
        runTests().catch(console.error);
    }
}

module.exports = {
    testTextUpload,
    testLinkUpload,
    testFileUpload,
    testAIQuery,
    testContentSummary,
    runTests
}; 