# 🚀 Mailtrap Email - Quick Reference

## ⚡ Quick Setup (3 Steps)

### 1️⃣ Install Package
```bash
pip install mailtrap
```

### 2️⃣ Configure `.env`
```env
MAILTRAP_TOKEN=your_token_here
MAIL_FROM=hello@sliverse.tech
SENDER_NAME=Eudia Legal Assistant
```

### 3️⃣ Test
```bash
curl http://localhost:8000/api/email/test
```

---

## 📋 Environment Variables

| Variable | Example | Required |
|----------|---------|----------|
| `MAILTRAP_TOKEN` | `abc123...` | ✅ Yes |
| `MAIL_FROM` | `hello@sliverse.tech` | ✅ Yes |
| `SENDER_NAME` | `Eudia Legal Assistant` | ⚠️ Optional |

---

## 🔑 Get Mailtrap Token

1. Go to [mailtrap.io](https://mailtrap.io/)
2. Settings → API Tokens
3. Create Token
4. Copy & paste to `.env`

---

## ✅ Test Configuration

**Endpoint:** `GET /api/email/test`

**Success Response:**
```json
{
  "configured": true,
  "mailtrap_token": "abc123...",
  "mail_from": "hello@sliverse.tech"
}
```

---

## 📧 Send Email

**Endpoint:** `POST /api/email/send-meeting-summary`

**Request:**
```json
{
  "meeting_id": 1,
  "recipients": [
    {"email": "user@example.com", "name": "John"}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Meeting summary sent to 1 recipient(s)"
}
```

---

## 🐛 Common Errors

| Error | Solution |
|-------|----------|
| `Mailtrap client not initialized` | Set `MAILTRAP_TOKEN` in `.env` |
| `Import mailtrap could not be resolved` | Run `pip install mailtrap` |
| `Failed to send email` | Check Mailtrap dashboard logs |
| `configured: false` | Verify token is valid |

---

## 📊 Free Tier Limits

- ✅ 1,000 emails/month
- ✅ 1 sending domain
- ✅ Basic analytics
- ✅ Perfect for testing!

---

## 🎯 Using in Frontend

```typescript
// Navigate to share page
navigate(`/share-meeting/${meetingId}`);

// Or use API directly
await sendMeetingSummary({
  meeting_id: 1,
  recipients: [{ email: 'user@example.com' }]
});
```

---

## 📱 Access Share Page

**URL Pattern:**
```
http://localhost:5173/share-meeting/{meetingId}
```

**Example:**
```
http://localhost:5173/share-meeting/1
```

---

## 🔒 Security Checklist

- ✅ Token in `.env` (not in code)
- ✅ `.env` in `.gitignore`
- ✅ Use environment variables
- ✅ Never commit tokens
- ✅ Rotate tokens regularly

---

## 📚 Resources

- **Mailtrap Signup**: https://mailtrap.io/
- **API Docs**: https://api-docs.mailtrap.io/
- **Dashboard**: https://mailtrap.io/inboxes
- **Support**: support@mailtrap.io

---

## 🎨 Email Template Includes

✅ Meeting title & date  
✅ Case context  
✅ Summary  
✅ Minutes  
✅ AI Insights table  
✅ Color-coded severity  
✅ Dark theme design  
✅ Responsive layout  

---

**That's it!** You're ready to send emails! 🎉
