# 📈 Stock price visualizer webapp

A simple web application to visualize stock prices charts (in real time).

🔗 [stock-price-visualizer-webapp.onrender.com](https://stock-price-visualizer-webapp.onrender.com)

## Tech stack

### Frontend

- [TypeScript](https://www.typescriptlang.org/) + ⚛ [React](https://react.dev/) + ⚡️ [Vite](https://vitejs.dev/)
- [Plotly](https://plotly.com/) for chart generation

### Backend

- 🐍 [Python](https://www.python.org/) + [FastAPI](https://fastapi.tiangolo.com/)
- 📈 Stock data is fetched using the Yahoo [Finance API](https://github.com/ranaroussi/yfinance) (`yfinance`).
- Client-server communication occurs via WebSocket.

## 🔧 Local installation

Install all dependencies of both client and server:

```bash
npm install
```

Make sure you have [node](https://nodejs.org/) >= v18 and [python](https://www.python.org) >= 3.11. You can use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to manage `node` versions and [pyenv](https://github.com/pyenv/pyenv) for `python`.

## 🌐 Start the app

### Using Docker

You can start client and server in Docker using

```bash
npm run start:docker
```

### In the terminal

Alternatively, you can also start simultaneously client and server in your terminal with

```bash
npm run dev
```

or separately by running

```bash
npm run dev:client
npm run dev:server
```

in two separate shells.

The application will be available on your browser at [http://localhost:5173](http://localhost:5173). After input of a symbol, the plot will be shown and will be updated in real time according to the chosen `interval`.

## WebSocket API definition

Once the server is up and running, the following endpoint is exposed:

```
ws://localhost:8000/{symbol}/{interval}/{period}
```

### symbol

- The stock symbol (a list of symbols is [here](https://finance.yahoo.com/lookup/?guccounter=1))

### interval

- Update interval between data points
- Valid values: `1m, 2m, 5m, 15m, 30m, 60, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo`
- Default: `1m`

### period

- Duration range of data
- Valid values: `1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max`
- Default: `1d`
