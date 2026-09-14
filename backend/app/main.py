from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import users as users_routes
from app.core.config import settings
from app.core.logging import setup_logging
from app.database.connection import close_mongo_connection, connect_to_mongo


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(title="BIS Sahayak AI Backend", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_routes.router)


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}


# As chat.py, standards.py, compliance.py, documents.py, labs.py get real
# implementations, include their routers here the same way as users_routes above:
# app.include_router(chat_routes.router)
