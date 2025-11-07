# Mailtrap Email Setup Guide

## Quick Start

### 1. Install Mailtrap Package

```bash
cd backend
pip install mailtrap
```

Or install all dependencies:
```bash
pip install -r requirements.txt
```

### 2. Get Mailtrap API Token

1. **Sign Up**: Go to [https://mailtrap.io/](https://mailtrap.io/) and create an account

2. **Choose Plan**:
   - **Free Tier**: 1,000 emails/month (perfect for testing)
   - **Paid Plans**: More emails + custom domains

3. **Get API Token**:
   - Click on your profile (top-right)
   - Go to **Settings** → **API Tokens**
   - Click **Create Token**
   - Give it a name (e.g., "Eudia App")
   - Copy the token

4. **Set Up Domain** (for production):
   - Go to **Email Sending** → **Domains**
   - Click **Add Domain**
   - Follow DNS verification steps
   - Use your verified domain in `MAIL_FROM`

   **For Testing**: You can use Mailtrap's sandbox domain

### 3. Configure Environment Variables

Edit `backend/.env`:

```env
# Mailtrap Configuration
MAILTRAP_TOKEN=your_api_token_here_from_step_3
MAIL_FROM=hello@sliverse.tech
SENDER_NAME=Eudia Legal Assistant
```

**Example:**
```env
MAILTRAP_TOKEN=abc123def456ghi789jkl012mno345pqr678
MAIL_FROM=hello@sliverse.tech
SENDER_NAME=Eudia Legal Assistant
```

### 4. Test Configuration

Start your backend server:
```bash
cd backend
uvicorn main:app --reload
```

Test the configuration:
```bash
curl http://localhost:8000/api/email/test
```

Expected response:
```json
{
  "mailtrap_token": "abc123def4...",
  "mail_from": "hello@sliverse.tech",
  "sender_name": "Eudia Legal Assistant",
  "configured": true
}
```

### 5. Send Test Email

1. Start frontend: `cd frontend && npm run dev`
2. Go to `http://localhost:5173`
3. Navigate to any case
4. Click **Share** button on a meeting
5. Add your email as recipient
6. Click **Send**

Check your email inbox! 📧

## Mailtrap Dashboard

After sending emails, you can monitor:
- **Delivery Status**: See if emails were delivered
- **Analytics**: Open rates, click rates (if tracking enabled)
- **Logs**: Detailed delivery logs
- **Inbox Testing**: Preview how emails look

Access dashboard: [https://mailtrap.io/inboxes](https://mailtrap.io/inboxes)

## Email Limits

### Free Tier
- 1,000 emails/month
- 1 sending domain
- Basic analytics

### Paid Plans
Check [Mailtrap Pricing](https://mailtrap.io/pricing) for:
- Higher email volumes
- Multiple domains
- Advanced analytics
- Priority support

## Troubleshooting

### "Mailtrap client not initialized"
- Check if `MAILTRAP_TOKEN` is set in `.env`
- Verify token is valid (not expired)
- Restart backend server after changing `.env`

### "Failed to send email"
- Check Mailtrap dashboard for error details
- Verify sending domain is verified (for production)
- Check monthly quota not exceeded
- Ensure `MAIL_FROM` matches verified domain

### "Import mailtrap could not be resolved"
- Run `pip install mailtrap`
- Check virtual environment is activated
- Verify `mailtrap` in `requirements.txt`

## Domain Verification (Production)

For production use, verify your domain:

1. **Add Domain** in Mailtrap
2. **Add DNS Records**:
   - SPF record
   - DKIM record
   - DMARC record (optional)
3. **Wait for Verification** (can take up to 48 hours)
4. **Update** `MAIL_FROM` with your verified domain email

Example verified domain setup:
```env
MAIL_FROM=notifications@yourdomain.com
```

## Using Mailtrap Sandbox (Development)

For testing without domain verification:

1. Use Mailtrap's inbox feature
2. Emails sent go to your Mailtrap inbox (not real recipients)
3. Perfect for development and testing
4. No domain verification needed

## Best Practices

✅ **Do:**
- Use app-specific API tokens
- Monitor your email quota
- Test emails before sending to real users
- Keep token in `.env` (never commit)
- Use verified domains in production

❌ **Don't:**
- Share API tokens publicly
- Hardcode tokens in code
- Send spam or unsolicited emails
- Exceed rate limits

## Support

- **Mailtrap Docs**: [https://help.mailtrap.io/](https://help.mailtrap.io/)
- **API Reference**: [https://api-docs.mailtrap.io/](https://api-docs.mailtrap.io/)
- **Support**: support@mailtrap.io

---

**You're all set!** 🎉 Your email feature is now powered by Mailtrap.
