from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any, Dict
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[int] = None

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    class Config:
        from_attributes = True

class TemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    prompt_template: str
    inputs: List[Dict[str, Any]]

class TemplateCreate(TemplateBase):
    pass

class Template(TemplateBase):
    id: int
    is_active: bool
    class Config:
        from_attributes = True

class ContentCreate(BaseModel):
    template_id: Optional[int] = None
    category: str
    title: Optional[str] = None
    inputs: Dict[str, Any]
    prompt: Optional[str] = None

class Content(BaseModel):
    id: int
    user_id: int
    template_id: Optional[int] = None
    category: str
    title: Optional[str] = None
    inputs: Dict[str, Any]
    generated_text: str
    tokens_used: int
    created_at: datetime
    class Config:
        from_attributes = True

class AnalyticsData(BaseModel):
    total_generations: int
    total_tokens: int
    category_breakdown: Dict[str, int]
    recent_activity: List[Content]
