from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import Content, ContentCreate
from app.services.ai_generator import generate_content

router = APIRouter()

@router.post("/", response_model=Content)
def create_content(
    *,
    db: Session = Depends(deps.get_db),
    content_in: ContentCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    prompt = ""
    if content_in.template_id:
        template = db.query(models.Template).filter(models.Template.id == content_in.template_id).first()
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        prompt = template.prompt_template
        for key, value in content_in.inputs.items():
            prompt = prompt.replace(f"{{{key}}}", str(value))
    elif content_in.prompt:
        prompt = content_in.prompt
    else:
        raise HTTPException(status_code=400, detail="Either template_id or prompt must be provided")

    generated_text, tokens = generate_content(prompt)

    content = models.Content(
        user_id=current_user.id,
        template_id=content_in.template_id,
        category=content_in.category,
        title=content_in.title or "Generated Content",
        inputs=content_in.inputs,
        generated_text=generated_text,
        tokens_used=tokens
    )
    db.add(content)
    
    usage_log = models.UsageLog(
        user_id=current_user.id,
        endpoint="/api/v1/content",
        tokens=tokens
    )
    db.add(usage_log)
    
    db.commit()
    db.refresh(content)
    return content

@router.get("/", response_model=List[Content])
def read_contents(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    contents = db.query(models.Content).filter(models.Content.user_id == current_user.id).order_by(models.Content.created_at.desc()).offset(skip).limit(limit).all()
    return contents
