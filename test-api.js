// Test script to verify Google AI API key
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Your actual API key
const API_KEY = 'AIzaSyCW7pzTGYu3dQQueyvHgCMoVtSgbC9Vjd4';

async function testAPI() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent("Hello, this is a test message.");
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ API Key is working!');
    console.log('Response:', text);
  } catch (error) {
    console.log('❌ API Key error:', error.message);
    console.log('Full error:', error);
  }
}

testAPI(); 