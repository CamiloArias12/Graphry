# Iniciar con uvicorn app:app --reload
import json
from calc import stagecoach
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post('/data')
async def send(request: Request):
    try:
        data = await request.json()
        nodes = json.loads(data.get("nodes"))
        phases = json.loads(data.get("phases"))
        solution, way = stagecoach(nodes, phases)
        response_data = {"solution": solution, "way": way}
        return response_data
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error al procesar los datos: {str(e)}")
