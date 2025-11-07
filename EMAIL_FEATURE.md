# Email Sharing Feature

## Overview
The email sharing feature allows users to send meeting summaries and AI-generated insights to participants via email using Mailtrap.

## Setup Instructions

### 1. Install Required Python Package
```bash
cd backend
pip install mailtrap
```

Or install all dependencies:
```bash
pip install -r requirements.txt
```

### 2. Configure Mailtrap Settings

Add the following environment variables to your `backend/.env` file:

```env
# Email Configuration (Mailtrap)
MAILTRAP_TOKEN=your_mailtrap_api_token_here
MAIL_FROM=hello@sliverse.tech
SENDER_NAME=Eudia Legal Assistant
```

### 3. Get Mailtrap API Token

1. Sign up at [Mailtrap.io](https://mailtrap.io/)
2. Go to **Email Sending** → **Domains** (or use Mailtrap's sandbox)
3. Navigate to **API Tokens** in your account settings
4. Create a new API token
5. Copy the token and add it to your `.env` file as `MAILTRAP_TOKEN`
6. Verify your sending domain (or use Mailtrap's provided domain)
7. Update `MAIL_FROM` with your verified email address

### 4. Mailtrap Plans

**Free Tier:**
- 1,000 emails/month
- Perfect for testing and small deployments

**Paid Plans:**
- Higher email limits
- Custom domain support
- Advanced analytics

## Usage

### From the UI:

1. Navigate to a case detail page
2. Find the meeting you want to share
3. Click the **"Share"** button next to the meeting
4. Add recipient email addresses (and optional names)
5. Review the preview of what will be sent
6. Click **"Send to X Recipients"**

### What Gets Sent:

The email includes:
- Meeting title and date
- Complete meeting summary
- Full meeting minutes
- All AI-generated insights in a beautiful table
- Professional dark-themed HTML template

### API Endpoints:

**Send Meeting Summary:**
```
POST /api/email/send-meeting-summary
```

Request body:
```json
{
  "meeting_id": 1,
  "recipients": [
    {
      "email": "user@example.com",
      "name": "John Doe"
    }
  ]
}
```

**Test Email Configuration:**
```
GET /api/email/test
```

Returns:
```json
{
  "mailtrap_token": "abc1234567...",
  "mail_from": "hello@sliverse.tech",
  "sender_name": "Eudia Legal Assistant",
  "configured": true
}
```

## Features

### Beautiful Email Template
- Modern dark theme matching the app's aesthetics
- Responsive design for mobile and desktop
- Professional gradient header
- Tabular insights display with color-coded severity
- Clear sections for summary, minutes, and insights

### Email Delivery via Mailtrap
- Reliable email delivery infrastructure
- Built-in analytics and tracking
- Easy integration with API token
- No complex SMTP configuration needed

### Validation
- Email format validation
- Duplicate recipient detection
- Required fields enforcement

## Troubleshooting

### Email Not Sending?

1. **Check Configuration:**
   ```bash
   curl http://localhost:8000/api/email/test
   ```

2. **Common Issues:**
   - Mailtrap: Make sure API token is valid and not expired
   - Domain: Verify your sending domain is verified in Mailtrap
   - Limits: Check if you've exceeded your monthly email quota
   - Token: Ensure MAILTRAP_TOKEN is correctly set in .env

3. **Error Messages:**
   - `Mailtrap client not initialized`: Missing or invalid MAILTRAP_TOKEN
   - `Failed to send email`: Check Mailtrap dashboard for delivery errors
   - `Authentication failed`: Invalid API token

### Backend Logs
Check the terminal running uvicorn for detailed error messages.

## Security Notes

- Never commit your `.env` file to version control
- Keep your Mailtrap API token secure
- Use environment variables for sensitive data
- Regularly rotate your API tokens
- Monitor your Mailtrap dashboard for unusual activity

## Future Enhancements

Potential improvements:
- [ ] Email templates customization
- [ ] Attachment support (PDF reports)
- [ ] Scheduled email sending
- [ ] Email delivery status tracking
- [ ] Bulk email sending with rate limiting
- [ ] Email preview before sending
