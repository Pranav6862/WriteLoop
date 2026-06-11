import uuid
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.core.security import get_password_hash
from app.db import models
from app.schemas import User, UserCreate, UserUpdate

router = APIRouter()

@router.post("/", response_model=User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    token = str(uuid.uuid4())
    user = models.User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        verification_token=token,
        is_verified=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    print("\n" + "="*50)
    print(f"VERIFICATION LINK FOR {user.email}:")
    print(f"http://localhost:3000/verify-email?token={token}")
    print("="*50 + "\n")
    
    return user

@router.get("/verify")
def verify_user(token: str, db: Session = Depends(deps.get_db)) -> Any:
    user = db.query(models.User).filter(models.User.verification_token == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid verification token")
    
    user.is_verified = True
    user.verification_token = None
    db.add(user)
    db.commit()
    return {"msg": "Email verified successfully"}

@router.get("/me", response_model=User)
def read_user_me(
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    return current_user

@router.put("/me", response_model=User)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    if user_in.password is not None:
        current_user.hashed_password = get_password_hash(user_in.password)
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
