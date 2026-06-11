from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import Template, TemplateCreate

router = APIRouter()

@router.get("/", response_model=List[Template])
def read_templates(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    templates = db.query(models.Template).filter(models.Template.is_active == True).offset(skip).limit(limit).all()
    return templates

@router.post("/", response_model=Template)
def create_template(
    *,
    db: Session = Depends(deps.get_db),
    template_in: TemplateCreate,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    template = models.Template(**template_in.dict())
    db.add(template)
    db.commit()
    db.refresh(template)
    return template
