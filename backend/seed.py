
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
