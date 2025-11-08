from mailtrap import Mail, Address, MailtrapClient
from typing import List
from datetime import datetime
from config import get_settings


class EmailService:
    def __init__(self):
        settings = get_settings()
        self.mailtrap_token = settings.MAILTRAP_TOKEN
        self.mail_from = settings.MAIL_FROM
        self.sender_name = settings.SENDER_NAME
        self.client = MailtrapClient(token=self.mailtrap_token) if self.mailtrap_token else None

    def send_meeting_summary(
        self,
        recipients: List[str],
        case_title: str,
        meeting_title: str,
        meeting_date: datetime,
        summary: str,
        minutes: str,
        insights: List[dict],
        file_path: str = None,
    ) -> bool:
        """Send meeting summary and insights via email"""
        
        if not self.client:
            print("Error: Mailtrap client not initialized. Check MAILTRAP_TOKEN.")
            return False
        
        try:
            # Create HTML content
            html_content = self._create_email_html(
                case_title=case_title,
                meeting_title=meeting_title,
                meeting_date=meeting_date,
                summary=summary,
                minutes=minutes,
                insights=insights,
                file_path=file_path,
            )

            # Prepare recipient list for Mailtrap
            to_emails = [Address(email=email) for email in recipients]

            # Create Mail object
            mail = Mail(
                sender=Address(email=self.mail_from, name=self.sender_name),
                to=to_emails,
                subject=f"Meeting Summary: {meeting_title} - {case_title}",
                html=html_content,
                category="Meeting Summary"
            )

            # Send email using Mailtrap
            self.client.send(mail)

            return True

        except Exception as e:
            print(f"Error sending email: {str(e)}")
            return False

    def _create_email_html(
        self,
        case_title: str,
        meeting_title: str,
        meeting_date: datetime,
        summary: str,
        minutes: str,
        insights: List[dict],
        file_path: str = None,
    ) -> str:
        """Create HTML email template"""
        
        # Format meeting date
        formatted_date = meeting_date.strftime("%B %d, %Y at %I:%M %p")
        
        # Extract filename from file_path if provided
        transcript_filename = None
        transcript_url = None
        if file_path:
            transcript_filename = file_path.split('/')[-1] if '/' in file_path else file_path.split('\\')[-1]
            transcript_url = f"http://localhost:8000/uploads/{transcript_filename}"
        
        # Build insights HTML
        insights_html = ""
        if insights:
            insights_rows = ""
            for insight in insights:
                severity_color = {
                    "low": "#10b981",
                    "medium": "#f59e0b",
                    "high": "#f97316",
                    "critical": "#ef4444"
                }.get(insight.get("severity", "medium"), "#f59e0b")
                
                insights_rows += f"""
                <tr style="border-bottom: 1px solid #27272a;">
                    <td style="padding: 16px 12px;">
                        <div style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; margin-right: 8px;"></div>
                        <span style="color: #a1a1aa; font-size: 13px; text-transform: capitalize;">{insight.get('type', 'N/A').replace('_', ' ')}</span>
                    </td>
                    <td style="padding: 16px 12px; color: #e4e4e7; font-weight: 500;">{insight.get('title', 'N/A')}</td>
                    <td style="padding: 16px 12px;">
                        <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; background: {severity_color}20; color: {severity_color}; text-transform: capitalize;">
                            {insight.get('severity', 'medium')}
                        </span>
                    </td>
                    <td style="padding: 16px 12px; color: #a1a1aa; font-size: 14px;">{insight.get('description', 'N/A')}</td>
                </tr>
                """
            
            insights_html = f"""
            <div style="margin-top: 32px;">
                <h2 style="color: #ffffff; font-size: 20px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center;">
                    <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #3b82f6; margin-right: 12px;"></span>
                    AI-Generated Insights
                </h2>
                <table style="width: 100%; border-collapse: collapse; background: #18181b; border: 1px solid #27272a; border-radius: 12px; overflow: hidden;">
                    <thead style="background: linear-gradient(to bottom, #27272a, #18181b); border-bottom: 1px solid #3f3f46;">
                        <tr>
                            <th style="padding: 16px 12px; text-align: left; color: #a1a1aa; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Type</th>
                            <th style="padding: 16px 12px; text-align: left; color: #a1a1aa; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Title</th>
                            <th style="padding: 16px 12px; text-align: left; color: #a1a1aa; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Severity</th>
                            <th style="padding: 16px 12px; text-align: left; color: #a1a1aa; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {insights_rows}
                    </tbody>
                </table>
            </div>
            """
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #000000;">
            <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); padding: 32px; border-radius: 16px; margin-bottom: 32px;">
                    <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">Meeting Summary</h1>
                    <p style="color: #93c5fd; font-size: 16px; margin: 0;">{case_title}</p>
                </div>
                
                <!-- Main Content -->
                <div style="background: #09090b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
                    <!-- Meeting Info -->
                    <div style="margin-bottom: 32px;">
                        <h2 style="color: #ffffff; font-size: 22px; font-weight: 600; margin: 0 0 16px 0;">{meeting_title}</h2>
                        <div style="display: flex; align-items: center; color: #a1a1aa; font-size: 14px;">
                            <svg style="width: 16px; height: 16px; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            {formatted_date}
                        </div>
                    </div>
                    
                    <!-- Summary Section -->
                    <div style="margin-bottom: 32px;">
                        <h3 style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0 0 12px 0; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #3b82f6; margin-right: 12px;"></span>
                            Summary
                        </h3>
                        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; color: #d4d4d8; font-size: 15px; line-height: 1.7;">
                            {summary.replace(chr(10), '<br>')}
                        </div>
                    </div>
                    
                    <!-- Raw Transcript Section -->
                    {f'''
                    <div style="margin-bottom: 32px;">
                        <h3 style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0 0 12px 0; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10b981; margin-right: 12px;"></span>
                            Raw Transcript
                        </h3>
                        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px;">
                            <a href="{transcript_url}" 
                               style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                                      color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; 
                                      font-weight: 600; font-size: 14px; transition: all 0.2s;">
                                View Raw Transcript File
                            </a>
                            <p style="color: #71717a; font-size: 13px; margin: 12px 0 0 0;">
                                Click the button above to view the complete raw transcript of this meeting.
                            </p>
                        </div>
                    </div>
                    ''' if transcript_url else ''}
                    
                    {insights_html}
                </div>
                
                <!-- Footer -->
                <div style="text-align: center; color: #71717a; font-size: 13px; padding: 20px;">
                    <p style="margin: 0;">This summary was generated by Eudia Legal Assistant</p>
                    <p style="margin: 8px 0 0 0;">© {datetime.now().year} Eudia. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return html
