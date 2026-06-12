import smtplib
from email.message import EmailMessage
from app.core.config import settings

def send_verification_email(to_email: str, token: str):
    # Fallback if SMTP is not configured
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print("\n" + "="*50)
        print("SMTP Credentials not configured.")
        print(f"VERIFICATION LINK FOR {to_email}:")
        print(f"http://localhost:3000/verify-email?token={token}")
        print("="*50 + "\n")
        return

    msg = EmailMessage()
    msg['Subject'] = 'Verify your WriteLoop Account'
    msg['From'] = settings.SMTP_USER
    msg['To'] = to_email

    verification_link = f"https://write-loop.vercel.app/verify-email?token={token}"

    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Welcome to WriteLoop!</h2>
            <p>Thank you for signing up. Please verify your email address to activate your account.</p>
            <div style="margin: 30px 0;">
                <a href="{verification_link}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Verify Email Address</a>
            </div>
            <p style="font-size: 14px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="font-size: 14px; color: #2563eb; word-break: break-all;">{verification_link}</p>
        </div>
      </body>
    </html>
    """
    msg.set_content(html_content, subtype='html')

    try:
        # Use Gmail's SMTP server
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            smtp.send_message(msg)
            print(f"Successfully sent verification email to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        # Print link to console as a fallback
        print("\n" + "="*50)
        print(f"VERIFICATION LINK FOR {to_email}:")
        print(f"https://write-loop.vercel.app/verify-email?token={token}")
        print("="*50 + "\n")
