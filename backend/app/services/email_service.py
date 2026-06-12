import requests
from app.core.config import settings

def send_verification_email(to_email: str, token: str):
    # Fallback if EmailJS is not configured
    if not settings.EMAILJS_SERVICE_ID or not settings.EMAILJS_TEMPLATE_ID or not settings.EMAILJS_PUBLIC_KEY:
        print("\n" + "="*50)
        print("EmailJS Credentials not configured.")
        print(f"VERIFICATION LINK FOR {to_email}:")
        print(f"https://write-loop.vercel.app/verify-email?token={token}")
        print("="*50 + "\n")
        return

    verification_link = f"https://write-loop.vercel.app/verify-email?token={token}"

    url = "https://api.emailjs.com/api/v1.0/email/send"
    payload = {
        "service_id": settings.EMAILJS_SERVICE_ID,
        "template_id": settings.EMAILJS_TEMPLATE_ID,
        "user_id": settings.EMAILJS_PUBLIC_KEY,
        "accessToken": settings.EMAILJS_PRIVATE_KEY,
        "template_params": {
            "to_email": to_email,
            "verification_link": verification_link
        }
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        print(f"Successfully sent verification email to {to_email} via EmailJS")
    except Exception as e:
        print(f"Failed to send email via EmailJS to {to_email}: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"EmailJS Error Response: {e.response.text}")
        
        # Print link to console as a fallback
        print("\n" + "="*50)
        print(f"VERIFICATION LINK FOR {to_email}:")
        print(f"https://write-loop.vercel.app/verify-email?token={token}")
        print("="*50 + "\n")
