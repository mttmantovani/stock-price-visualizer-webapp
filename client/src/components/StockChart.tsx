import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { StockData } from "../models/StockData";
import WebSocketService from "../services/WebSocketService";

interface StockChartProps {
  symbol: string;
  interval: string;
  period: string;
}

const StockChart: React.FC<StockChartProps> = ({
  symbol,
  interval,
  period,
}) => {
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    setData([]);

    const webSocketService = new WebSocketService(
      `ws://localhost:8000/ws/${symbol}/${interval}/${period}`
    );
    webSocketService.onMessage((data: StockData[]) => {
      if (data.length === 0) {
        setError(true);
        setLoading(false);
      } else {
        setData(data);
        setError(false);
        setLoading(false);
        setLastUpdate(new Date());
      }
    });

    return () => {
      webSocketService.close();
    };
  }, [symbol, interval, period]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLastUpdate((prev) => (prev ? new Date(prev) : undefined));
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  if (symbol.length === 0) {
    return (
      <div>
        <i>Enter a symbol (at least 1 character) </i>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <i>Loading...</i>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <i>No data to display</i>
      </div>
    );
  }

  const plotData: Plotly.Data[] = [
    {
      x: data.map((d) => d.Date),
      y: data.map((d) => d.Close),
      type: "scatter",
      mode: "lines",
      marker: { color: "coral" },
    },
  ];

  const layout = {
    title: `${symbol} Stock Price`,
  };

  return (
    <div>
      <Plot data={plotData} layout={layout} />
      {lastUpdate && (
        <div>
          Last update: {formatDistanceToNow(lastUpdate, { addSuffix: true })}
        </div>
      )}
    </div>
  );
};

export default StockChart;
