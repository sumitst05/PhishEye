from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router
from fastapi.responses import JSONResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def handle_root():
    return JSONResponse(status_code=200, content={"message": "Server is running!"})
