// Test script to check environment variables
require('dotenv').config({ path: '.env.local' });

console.log('Environment variables:');
console.log('GOOGLE_AI_API_KEY:', process.env.GOOGLE_AI_API_KEY ? '✅ Found' : '❌ Not found');
console.log('NODE_ENV:', process.env.NODE_ENV); 