---
name: "data-visualizer"
description: "Creates interactive charts and graphs for financial data. Invoke when user asks for charts, graphs, trends, or data analysis visualization."
---

# Data Visualizer Skill

This skill specializes in implementing data visualization components, which is crucial for financial applications.

## Capabilities

1.  **Chart Implementation**: Creates Line Charts (trends), Pie Charts (distribution), Candlestick Charts (stock prices), and Bar Charts using libraries like `recharts` or `chart.js`.
2.  **Data Transformation**: Helper functions to transform raw API data or state data into formats suitable for charting libraries.
3.  **Interactive Elements**: Adds tooltips, legends, zoom/pan functionality, and responsive resizing to charts.

## Recommended Libraries
- **Recharts**: Best for React, composable, reliable.
- **Chart.js / react-chartjs-2**: Good for canvas-based rendering.
- **Lightweight Charts (TradingView)**: Best for financial candlestick charts.

## Usage

When the user asks for "show me a graph of my profits" or "visualize the stock price history":
1.  Check if a charting library is installed (e.g., `npm list recharts`). If not, recommend or install it.
2.  Create a reusable Chart component (e.g., `components/ProfitChart.tsx`).
3.  Implement the data processing logic to feed the chart.
4.  Integrate the component into the relevant screen.
