from typing import List, Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Person(BaseModel):
    id: int
    name: str
    age: int
    
DB: List[Person] = [
    Person(id=1, name="Jamila", age=22),
    Person(id=1, name="Alex", age=18),
    Person(id=1, name="Alex", age=18)
]

@app.get("/api")
def read_root():
    return DB


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}