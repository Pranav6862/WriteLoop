
import g4f
from app.core.config import settings

def generate_content(prompt: str) -> tuple[str, int]:
    try:
        response = g4f.ChatCompletion.create(
            model=g4f.models.default,
            messages=[
                {"role": "system", "content": "You are a professional content writer."},
                {"role": "user", "content": prompt}
            ],
        )
        content = str(response).strip() if response else "No response generated."
        tokens = len(content.split()) * 2
        return content, tokens
    except Exception as e:
        print(f"Error generating content: {e}")
        return f"Simulated generated content due to API error.\n\nError details: {e}", 50
