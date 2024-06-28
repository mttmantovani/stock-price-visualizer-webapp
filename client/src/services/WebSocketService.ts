import { StockData } from "../models/StockData";

class WebSocketService {
  private socket: WebSocket;

  constructor(url: string) {
    this.socket = new WebSocket(url);
  }

  public onMessage(callback: (data: StockData[]) => void) {
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (!this.isStockDataArray(data)) {
        console.error("Received invalid stock data", data);
        callback([]); // Clear the chart (no data to display)
        this.close();
        return;
      }

      callback(data);
    };
  }

  public close() {
    this.socket.close();
  }

  private isStockDataArray(data: unknown): data is StockData[] {
    return Array.isArray(data) && data.every(this.isStockData);
  }

  private isStockData(data: unknown): data is StockData {
    return (
      typeof data === "object" &&
      data !== null &&
      typeof (data as StockData).Date === "string" &&
      typeof (data as StockData).Open === "number" &&
      typeof (data as StockData).High === "number" &&
      typeof (data as StockData).Low === "number" &&
      typeof (data as StockData).Close === "number" &&
      typeof (data as StockData).Volume === "number"
    );
  }
}

export default WebSocketService;
