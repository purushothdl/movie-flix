from .database import metrics_collection

async def get_trending_movies():
    movies = await metrics_collection.find().sort("count", -1).limit(5).to_list(length=5)
    for movie in movies:
        movie["id"] = str(movie["_id"])
        del movie["_id"]  
    return movies

async def update_trending_movies(movie, search_term):
    document = {
        "search_term": search_term,
        "count": 1,
        "poster_url": f"https://image.tmdb.org/t/p/w500/{movie['poster_path']}",
        "movie_id": movie["id"]
    }

    existing_doc = await metrics_collection.find_one({"movie_id": movie["id"], "search_term": search_term})

    if existing_doc:
        await metrics_collection.update_one(
            {"_id": existing_doc["_id"]},
            {"$inc": {"count": 1}}
        )
    else:
        await metrics_collection.insert_one(document)
