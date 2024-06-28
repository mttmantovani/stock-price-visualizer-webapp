from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf

from typing import List
import asyncio

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

interval_sleep_mapping = {
    "1m": 60,  # Update every 1 minute
    "15m": 15 * 60,  # Update every 15 minutes
    "1d": 24 * 60 * 60,  # Update every day
    "1wk": 7 * 24 * 60 * 60,  # Update every week
}


@app.websocket("/ws/{symbol}/{interval}/{period}")
async def websocket_endpoint(
    symbol: str, interval: str, period: str, web_socket: WebSocket
):
    await web_socket.accept()
    while True:
        data = fetch_stock_data(symbol, interval, period)
        await web_socket.send_json(data)

        sleep_duration = interval_sleep_mapping.get(interval, 60)
        await asyncio.sleep(sleep_duration)


def fetch_stock_data(symbol: str, interval: str, period: str) -> List[dict]:
    stock = yf.Ticker(symbol)

    try:
        data = stock.history(interval=interval, period=period)
    except ValueError:
        return []

    if data.empty:
        return []

    data.index.names = [
        "Date"
    ]  # For interval="1d" or "15m" the index name is Datetime, for larger intervals it is Date

    data.reset_index(inplace=True)

    data["Date"] = data["Date"].dt.strftime("%Y-%m-%d %H:%M:%S")

    return data.to_dict(orient="records")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
