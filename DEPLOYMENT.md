# Production Deployment Guide

## Environment Variables Setup

### For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following environment variable:
   - **Name**: `GOOGLE_AI_API_KEY`
   - **Value**: `AIzaSyCW7pzTGYu3dQQueyvHgCMoVtSgbC9Vjd4`
   - **Environment**: Production, Preview, Development

### For Netlify Deployment:
1. Go to your Netlify site dashboard
2. Navigate to Site settings → Environment variables
3. Add the environment variable:
   - **Key**: `GOOGLE_AI_API_KEY`
   - **Value**: `AIzaSyCW7pzTGYu3dQQueyvHgCMoVtSgbC9Vjd4`

### For Other Platforms:
Add the environment variable `GOOGLE_AI_API_KEY` with your API key value.

## Google Sheets Setup

Make sure your Google Apps Script is deployed and the URL is correct in `src/app/page.tsx`:
```javascript
const scriptURL = 'https://script.google.com/macros/s/AKfycbx2ly7xcLlloR9fW9KfERYBzAokrv3GgzAMw5aUGEFUKBYcH62OvsTGs4hhNtjsMbCJ/exec';
```

## Production Features

✅ **AI Validation**: Will work if API key is set, otherwise gracefully bypassed
✅ **Google Sheets Integration**: Will submit all form data
✅ **Anomaly Detection**: Will track user behavior
✅ **Timer & Security**: All security features will work
✅ **Responsive Design**: Works on all devices

## Testing Production

1. Deploy to your chosen platform
2. Test the form with:
   - Valid names: "John Smith", "Maria Garcia"
   - Invalid names: "aaa", "riy98h3", "qwert"
   - Valid emails: "john.smith@gmail.com"
   - Invalid emails: "test@test.com", "aaa@aaa.com"

## Troubleshooting

If AI validation fails in production:
1. Check if `GOOGLE_AI_API_KEY` is set in environment variables
2. Verify the API key is valid
3. Check browser console for errors
4. The form will still work without AI validation (graceful fallback) 