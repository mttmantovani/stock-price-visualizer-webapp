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
      `${symbol}/${interval}/${period}`
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
      <div className="message">
        <i>Enter a symbol (at least 1 character) </i>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="plot-container">
        <div className="message">
          <i>Loading...</i>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="message">
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
      marker: { color: "lightblue" },
      line: { width: 4 },
    },
  ];

  const layout = {
    title: {
      text: `${symbol} Stock Price`,
      font: {
        color: "#ffffff",
      },
    },
    xaxis: {
      gridcolor: "#444444",
      color: "#ffffff",
      title: {
        text: "Date",
        font: {
          color: "#ffffff",
        },
      },
    },
    yaxis: {
      autorange: true,
      gridcolor: "#444444",
      color: "#ffffff",
      title: {
        text: "Price (USD)",
        font: {
          color: "#ffffff",
        },
      },
    },
    paper_bgcolor: "#333333",
    plot_bgcolor: "#333333",
  };

  return (
    <div>
      <Plot data={plotData} layout={layout} />
      {lastUpdate && (
        <div className="message">
          Last update: {formatDistanceToNow(lastUpdate, { addSuffix: true })}
        </div>
      )}
    </div>
  );
};

export default StockChart;
