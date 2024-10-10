from fastapi import FastAPI
from app.api import router
from fastapi.responses import JSONResponse

app = FastAPI()

app.include_router(router)

@app.get("/")
def handle_root():
    return JSONResponse(
        status_code=200,
        content={"message": "Server is running!"}
    )
