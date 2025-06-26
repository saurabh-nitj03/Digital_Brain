const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

// Test user ID (you can replace this with a real user ID)
const TEST_USER_ID = 'test-user-123';

async function testChatFunctionality() {
  try {
    console.log('🧪 Testing Chat Functionality...\n');

    // Test 1: Start a new chat conversation
    console.log('1. Starting a new chat conversation...');
    const startChatResponse = await axios.post(`${BASE_URL}/chat/start`, {
      userId: TEST_USER_ID,
      message: 'What is machine learning?'
    });
    
    console.log('✅ Start Chat Response:', {
      success: startChatResponse.data.success,
      conversationId: startChatResponse.data.conversationId,
      answer: startChatResponse.data.response.answer.substring(0, 100) + '...',
      sources: startChatResponse.data.response.sources,
      confidence: startChatResponse.data.response.confidence
    });

    const conversationId = startChatResponse.data.conversationId;

    // Test 2: Continue the conversation
    console.log('\n2. Continuing the conversation...');
    const continueChatResponse = await axios.post(`${BASE_URL}/chat/continue`, {
      userId: TEST_USER_ID,
      conversationId: conversationId,
      message: 'Can you explain more about supervised learning?'
    });

    console.log('✅ Continue Chat Response:', {
      success: continueChatResponse.data.success,
      answer: continueChatResponse.data.response.answer.substring(0, 100) + '...',
      sources: continueChatResponse.data.response.sources,
      confidence: continueChatResponse.data.response.confidence
    });

    // Test 3: Get user conversations
    console.log('\n3. Getting user conversations...');
    const conversationsResponse = await axios.get(`${BASE_URL}/chat/conversations/${TEST_USER_ID}`);
    
    console.log('✅ Conversations Response:', {
      success: conversationsResponse.data.success,
      conversationCount: conversationsResponse.data.conversations.length,
      conversations: conversationsResponse.data.conversations.map(conv => ({
        id: conv._id,
        title: conv.title,
        messageCount: conv.messages.length,
        createdAt: conv.createdAt
      }))
    });

    // Test 4: Get specific conversation
    console.log('\n4. Getting specific conversation...');
    const conversationResponse = await axios.get(`${BASE_URL}/chat/conversation/${conversationId}?userId=${TEST_USER_ID}`);
    
    console.log('✅ Conversation Response:', {
      success: conversationResponse.data.success,
      conversationId: conversationResponse.data.conversation._id,
      title: conversationResponse.data.conversation.title,
      messageCount: conversationResponse.data.conversation.messages.length,
      messages: conversationResponse.data.conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content.substring(0, 50) + '...',
        timestamp: msg.timestamp
      }))
    });

    // Test 5: Update conversation title
    console.log('\n5. Updating conversation title...');
    const updateTitleResponse = await axios.put(`${BASE_URL}/chat/conversation/${conversationId}/title`, {
      userId: TEST_USER_ID,
      title: 'Machine Learning Discussion'
    });

    console.log('✅ Update Title Response:', {
      success: updateTitleResponse.data.success,
      message: updateTitleResponse.data.message
    });

    console.log('\n🎉 All chat tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the tests
testChatFunctionality(); 