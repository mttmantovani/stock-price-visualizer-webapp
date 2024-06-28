import React, { useState } from "react";
import "./App.css";
import StockChart from "./components/StockChart";

const App: React.FC = () => {
  const [symbol, setSymbol] = useState("META");
  const [interval, setInterval] = useState("1m");
  const [period, setPeriod] = useState("1d");

  return (
    <div>
      <h1>Stock Price Visualizer</h1>
      <div>
        <label>
          Symbol:
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          />
        </label>

        <label>
          Interval:
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          >
            <option value="1m">1 Minute</option>
            <option value="15m">15 Minutes</option>
            <option value="1d">Daily</option>
            <option value="1wk">Weekly</option>
          </select>
        </label>

        <label>
          Period:
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="1d">1 Day</option>
            <option value="5d">5 Days</option>
            <option value="1mo">1 Month</option>
            <option value="3mo">3 Months</option>
            <option value="6mo">6 Months</option>
            <option value="1y">1 Year</option>
            <option value="2y">2 Years</option>
            <option value="5y">5 Years</option>
            <option value="10y">10 Years</option>
            <option value="ytd">Year to Date</option>
            <option value="max">Max</option>
          </select>
        </label>
      </div>
      <br />
      <StockChart symbol={symbol} interval={interval} period={period} />
    </div>
  );
};

export default App;
