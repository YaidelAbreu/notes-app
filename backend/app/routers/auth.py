from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db
from app.schemas.user import UserCreate, UserResponse, UserCredentials
from app.services.user_service import create_user, authenticate_user
from app.core.jwt import create_token_pair, add_refresh_token_cookie

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    existing_user = await authenticate_user(db, user.email, user.password)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User email already taken."
        )
    return await create_user(db, user)


@router.post("/login")
async def login(user: UserCredentials,
                response: Response,
                db: AsyncSession = Depends(get_db)):
    authenticated_user = await authenticate_user(db, user.email, user.password)
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials."
        )
    token_pair = create_token_pair(user=authenticated_user)
    add_refresh_token_cookie(response=response, token=token_pair.refresh.token)
    return {"access_token": token_pair, "token_type": "bearer"}
