from fastapi import FastAPI
from app.routers import auth, notes

app = FastAPI()

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the API"}
