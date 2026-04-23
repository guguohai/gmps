from fastapi import FastAPI

app = FastAPI(title="Core API", description="PS System Core Application API")

@app.get("/")
async def root():
    return {"message": "Welcome to Core API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
