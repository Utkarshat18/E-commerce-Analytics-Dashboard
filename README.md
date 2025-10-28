## 🛒 Real-Time E-commerce Analytics Dashboard (Remix + Node.js + TypeScript)

Start the WebSocket + Express server
npm run dev:server

Start the frontend server
npm run dev

The Real-Time E-commerce Analytics Dashboard is important because it provides instant visibility into business performance, helping companies make data-driven decisions quickly. It enables real-time monitoring of sales trends, allowing teams to identify best-selling products and respond immediately to market changes.

## 🚀 Features
✅ **Real-Time Data Updates**
- Node.js backend continuously generates and pushes new dummy product orders via WebSocket.

✅ **Beautiful Charts**
- Responsive live-updating charts using Chart.js with a dark theme.

✅ **Fully TypeScript-Based**
- Both backend (Node.js) and frontend (Remix/React) written in TypeScript for type safety.

✅ **Modular Structure**
- Clean folder separation: server, components, and alert services for maintainability.

## 🧩 Project Flow (Step-by-Step)
1. Initialization & Server Setup
-The backend begins with a Node.js + Express + TypeScript server (server/index.ts).
-A WebSocket server (ws) is created on top of Express to enable real-time communication.

2. Dummy Data Generation
-The dataGenerator.ts module is responsible for creating fake (dummy) e-commerce order data.
-after every 3 second dummy data generator for different orders.

3. Real-Time Chart Updates
-The chart component uses Chart.js with react-chartjs-2 to display data dynamically.
-Each time new data is received, the order counts per product are recalculated.
-The chart is then re-rendered automatically to visualize live product sales updates.
-real time data will update automatically when new data order arrives.

4. Order Table
-Alongside the live sales chart, the dashboard also includes a Real-Time Order Table.
-The most recent orders always appear first also we can show latest orders.

