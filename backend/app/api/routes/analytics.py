from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api import deps
from app.db import models
from app.schemas import AnalyticsData

router = APIRouter()

@router.get("/", response_model=AnalyticsData)
def read_analytics(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    # Total generations
    total_gens = db.query(models.Content).filter(models.Content.user_id == current_user.id).count()
    
    # Total tokens
    total_tokens = db.query(func.sum(models.UsageLog.tokens)).filter(models.UsageLog.user_id == current_user.id).scalar() or 0
    
    # Category breakdown
    categories = db.query(models.Content.category, func.count(models.Content.id)).filter(models.Content.user_id == current_user.id).group_by(models.Content.category).all()
    category_breakdown = {cat: count for cat, count in categories}
    
    # Recent activity
    recent = db.query(models.Content).filter(models.Content.user_id == current_user.id).order_by(models.Content.created_at.desc()).limit(5).all()
    
    return AnalyticsData(
        total_generations=total_gens,
        total_tokens=total_tokens,
        category_breakdown=category_breakdown,
        recent_activity=recent
    )
