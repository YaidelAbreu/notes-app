from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str


class UserResponse(BaseModel):
    email: str
    full_name: str


class UserCredentials(BaseModel):
    email: str
    password: str
