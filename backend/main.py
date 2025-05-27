import time
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from .movie_repository import get_trending_movies, update_trending_movies

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            
    allow_credentials=True,
    allow_methods=["*"],              
    allow_headers=["*"],             
)

@app.get("/trending-movies")
async def trending_movies():
    movies = await get_trending_movies()
    return {"movies": movies}

@app.post("/update-trending-movies")
async def update_movies(
    movie: dict = Body(...),  
    search_term: str = Body(...) 
):
    await update_trending_movies(movie, search_term)
    return {"status": "success"}
