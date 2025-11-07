# Lexicase Troubleshooting Guide

## Common Issues and Solutions

### Backend Issues

#### 1. "Import Error: No module named 'X'"

**Problem:** Missing Python dependencies

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

Make sure your virtual environment is activated:
- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

---

#### 2. "API Key Error" or "Invalid API Key"

**Problem:** Gemini API key not configured or invalid

**Solution:**
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Open `backend/.env`
4. Replace `GEMINI_API_KEY=your_key_here` with your actual key
5. Restart the backend server

---

#### 3. "Database Error" or "Table doesn't exist"

**Problem:** Database not initialized properly

**Solution:**
```bash
cd backend
# Delete the database file
del lexicase.db  # Windows
rm lexicase.db   # Mac/Linux

# Restart the server - it will recreate the database
python main.py
```

---

#### 4. "Port 8000 already in use"

**Problem:** Another application is using port 8000

**Solution:**

Option 1 - Kill the process:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

Option 2 - Use different port:
Edit `backend/main.py`, change the last line:
```python
uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
```

---

#### 5. "Pinecone Error"

**Problem:** Pinecone not configured (optional feature)

**Solution:**

The app works without Pinecone! If you don't want to use it:
1. The chatbot will still work but without semantic search
2. You can ignore Pinecone errors

To fix:
1. Sign up at https://www.pinecone.io/
2. Get your API key
3. Update `backend/.env`

---

### Frontend Issues

#### 1. "npm install" fails

**Problem:** Node version or network issues

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
cd frontend
npm install

# If still fails, delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
npm install
```

---

#### 2. "Module not found" errors

**Problem:** Dependencies not installed

**Solution:**
```bash
cd frontend
npm install
```

---

#### 3. "Port 5173 already in use"

**Problem:** Another Vite app is running

**Solution:**

Kill the process or edit `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174  // Change to different port
  },
  // ... rest of config
})
```

---

#### 4. "Network Error" or "API not responding"

**Problem:** Backend not running or wrong URL

**Solution:**
1. Make sure backend is running on `http://localhost:8000`
2. Check `frontend/.env` has correct API URL
3. Open `http://localhost:8000/docs` to verify backend is running

---

#### 5. Tailwind CSS not working

**Problem:** Tailwind v4 configuration issues

**Solution:**
```bash
cd frontend
npm install @tailwindcss/vite
```

Check `vite.config.ts` has:
```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // ...
})
```

---

### Application Issues

#### 1. File upload fails

**Problem:** File too large or wrong format

**Solution:**
- Maximum file size: 100MB
- Supported formats: `.mp3`, `.txt`
- Check file encoding (UTF-8 for txt files)

---

#### 2. AI analysis takes too long

**Problem:** Large files or Gemini API slow response

**Solution:**
- For txt files, keep under 50KB for faster processing
- Large transcripts can take 10-30 seconds
- Check your internet connection
- Verify Gemini API quota

---

#### 3. Chatbot gives generic responses

**Problem:** No case context selected

**Solution:**
1. Select a case from the dropdown in the chat page
2. Make sure the case has meetings uploaded
3. Ask specific questions about the case

---

#### 4. No insights generated

**Problem:** Transcript too short or Gemini API issue

**Solution:**
- Ensure transcript has substantial content (at least 100 words)
- Check backend logs for Gemini API errors
- Verify API key is valid
- Check Gemini API quota

---

## Development Issues

#### TypeScript errors in frontend

**Solution:**
```bash
cd frontend
npm run build  # Check for actual errors vs IDE issues
```

Most TypeScript errors are warnings and won't prevent the app from running.

---

#### CORS errors

**Problem:** Frontend can't connect to backend

**Solution:**

Backend already has CORS configured for localhost:5173

If using different port, edit `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:YOUR_PORT"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Getting Help

### Check Logs

**Backend logs:**
- Watch the terminal where you ran `python main.py`
- Look for error messages and stack traces

**Frontend logs:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

### API Documentation

Visit `http://localhost:8000/docs` to test API endpoints directly

### Debug Mode

Enable verbose logging in backend:
Edit `backend/config.py` and run with debug:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

## Still Having Issues?

1. ✅ Check all environment variables are set
2. ✅ Verify Python 3.10+ and Node.js 18+ installed
3. ✅ Make sure virtual environment is activated
4. ✅ Try restarting both servers
5. ✅ Check firewall/antivirus isn't blocking ports
6. ✅ Review error messages carefully

---

## Quick Reset

If nothing works, complete reset:

```bash
# Backend
cd backend
deactivate  # If venv is active
rm -rf venv lexicase.db uploads/*
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Frontend
cd ../frontend
rm -rf node_modules package-lock.json
npm install

# Reconfigure .env files
# Restart both servers
```

---

**Good luck! The app should work smoothly once properly configured. 🚀**

*Team Nirvana*
