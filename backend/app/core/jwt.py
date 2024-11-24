from app.core.config import (SECRET_KEY, ALGORITHM,
                             ACCESS_TOKEN_EXPIRE_MINUTES,
                             REFRESH_TOKEN_EXPIRE_MINUTES)
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from app.db.models.user import User
from fastapi.security import OAuth2PasswordBearer
from app.core.dependencies import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.auth import JwtTokenSchema
from datetime import timedelta, datetime, timezone
from app.schemas.auth import TokenPair
import uuid
from fastapi import Response


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SUB = "sub"
EXP = "exp"
IAT = "iat"
JTI = "jti"


async def decode_access_token(token: str, db: AsyncSession):
    try:
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Check if the token has expired or if it does not have a subject
        if "sub" not in payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing subject (sub)."
            )
        return payload  # Returns the decoded payload of the token
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token or expired token."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token validation error: {str(e)}"
        )


def _create_access_token(payload: dict,
                         minutes: int | None = None) -> JwtTokenSchema:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=minutes or ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload[EXP] = expire

    token = JwtTokenSchema(
        token=jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM),
        payload=payload,
        expire=expire,
    )

    return token


def _create_refresh_token(payload: dict) -> JwtTokenSchema:
    expire = datetime.now(timezone.utc) + \
         timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)

    payload[EXP] = expire

    token = JwtTokenSchema(
        token=jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM),
        expire=expire,
        payload=payload,
    )

    return token


def create_token_pair(user: User) -> TokenPair:
    payload = {SUB: str(user.id),
               JTI: str(uuid.uuid4()),
               IAT: datetime.now(timezone.utc)}

    return TokenPair(
        access=_create_access_token(payload={**payload}),
        refresh=_create_refresh_token(payload={**payload}),
    )


def add_refresh_token_cookie(response: Response, token: str):
    exp = datetime.now(timezone.utc) + \
          timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    exp.replace(tzinfo=timezone.utc)

    response.set_cookie(
        key="refresh",
        value=token,
        expires=int(exp.timestamp()),
        httponly=True,
    )


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    try:
        payload = await decode_access_token(token, db=db)
        id = payload.get(SUB)

        if id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )

        user = await User.find_by_id(db=db, id=payload[SUB])

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found."
            )

        return user
    except Exception as e:
        print(f"Error in get_current_user: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
