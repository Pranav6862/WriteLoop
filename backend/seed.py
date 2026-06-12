
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.db import models
from app.core.security import get_password_hash

def seed_db():
    models.Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    
    # Create admin user
    user = db.query(models.User).filter(models.User.email == "admin@example.com").first()
    if not user:
        user = models.User(
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            is_admin=True,
            is_active=True
        )
        db.add(user)
        db.commit()

    # Create templates
    templates_data = [
        {
            "name": "Blog Post Outline",
            "description": "Generate a structured outline for your next blog post.",
            "category": "Blogs",
            "prompt_template": "Create a detailed blog post outline about {topic}. Target audience is {audience}.",
            "inputs": [
                {"name": "topic", "label": "Topic", "type": "text"},
                {"name": "audience", "label": "Target Audience", "type": "text"}
            ]
        },
        {
            "name": "Professional Email",
            "description": "Write a clear, professional email.",
            "category": "Emails",
            "prompt_template": "Write a professional email about {subject} to {recipient}. Tone should be {tone}.",
            "inputs": [
                {"name": "subject", "label": "Subject", "type": "text"},
                {"name": "recipient", "label": "Recipient", "type": "text"},
                {"name": "tone", "label": "Tone", "type": "text"}
            ]
        },
        {
            "name": "Twitter Thread",
            "description": "Generate an engaging Twitter thread.",
            "category": "Social Media",
            "prompt_template": "Create a 5-tweet thread about {topic} that is engaging and informative.",
            "inputs": [
                {"name": "topic", "label": "Topic", "type": "text"}
            ]
        },
        {
            "name": "Product Description",
            "description": "Write a compelling product description.",
            "category": "Product Descriptions",
            "prompt_template": "Write a compelling product description for {product_name}. Key features are {features}.",
            "inputs": [
                {"name": "product_name", "label": "Product Name", "type": "text"},
                {"name": "features", "label": "Key Features", "type": "textarea"}
            ]
        },
        {
            "name": "Marketing Copy",
            "description": "Create high-converting marketing copy.",
            "category": "Marketing Copy",
            "prompt_template": "Write a highly converting marketing copy for {campaign_name}. Target audience: {audience}. Key benefits: {benefits}.",
            "inputs": [
                {"name": "campaign_name", "label": "Campaign Name", "type": "text"},
                {"name": "audience", "label": "Target Audience", "type": "text"},
                {"name": "benefits", "label": "Key Benefits", "type": "textarea"}
            ]
        },
        {
            "name": "Instagram Caption",
            "description": "Write a catchy Instagram caption.",
            "category": "Social Media",
            "prompt_template": "Write a catchy, highly engaging Instagram caption about {topic}. The mood should be {mood}. Include relevant emojis and 5 popular hashtags.",
            "inputs": [
                {"name": "topic", "label": "Topic or Photo Subject", "type": "text"},
                {"name": "mood", "label": "Mood / Tone", "type": "text"}
            ]
        },
        {
            "name": "YouTube Video Idea",
            "description": "Brainstorm a viral YouTube video concept.",
            "category": "Content Strategy",
            "prompt_template": "Brainstorm a highly clickable, viral YouTube video idea for the {niche} niche. The video format should be {format}. Include a catchy title and a brief outline of the intro, body, and outro.",
            "inputs": [
                {"name": "niche", "label": "Channel Niche", "type": "text"},
                {"name": "format", "label": "Video Format (e.g., Vlog, Tutorial)", "type": "text"}
            ]
        },
        {
            "name": "LinkedIn Outreach",
            "description": "Write a cold outreach message for LinkedIn.",
            "category": "Emails",
            "prompt_template": "Write a professional, non-spammy LinkedIn cold outreach message to someone whose role is {prospect_role}. Introduce my product which provides this value: {product_value}. Keep it under 100 words and end with a soft call to action.",
            "inputs": [
                {"name": "prospect_role", "label": "Prospect's Job Role", "type": "text"},
                {"name": "product_value", "label": "Value of your Product", "type": "textarea"}
            ]
        },
        {
            "name": "Recipe Generator",
            "description": "Create a recipe based on ingredients.",
            "category": "Fun",
            "prompt_template": "Create a delicious recipe using only these ingredients (plus basic pantry staples like oil/salt): {ingredients}. Provide step-by-step instructions and a creative name for the dish.",
            "inputs": [
                {"name": "ingredients", "label": "List of Ingredients", "type": "textarea"}
            ]
        }
    ]

    for t_data in templates_data:
        template = db.query(models.Template).filter(models.Template.name == t_data["name"]).first()
        if not template:
            db.add(models.Template(**t_data))
    
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_db()
