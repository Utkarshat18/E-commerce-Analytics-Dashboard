import React, { use, useEffect, useMemo, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

type Order = {
  orderId: string;
  productName: string;
  quantity: number;
  price: number;
  timestamp: number;
  status?: "pending" | "shipped" | "delivered" | string;
};

export default function Realtimechart(){
  const [orders, setOrders] = useState<Order[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const wsUrl="ws://localhost:3001/ws";
  const MAX_ORDERS = 200;

  useEffect(() => {
    const url=wsUrl;
     const ws = new WebSocket(url);
     wsRef.current = ws;
     ws.onopen = () => console.log("WS connected to", url);
    ws.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        
        if (payload && payload.orderId) {
          const order: Order = {
            orderId: payload.orderId,
            productName: payload.productName,
            quantity: payload.quantity,
            price: payload.price,
            timestamp: payload.timestamp,
            status: payload.status,
          };
          setOrders(prev => {
            const next = [...prev, order].slice(-MAX_ORDERS);
            return next;
          });
        } else {
          console.log("Facing some error with payload",payload);
        }
      } catch (err) {
        console.error("WS parse error", err);
      }
    };
    ws.onerror = (e) => console.error("WS error", e);
    ws.onclose = () => console.log("WS closed");

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [wsUrl]);

  const salesTimeSeries = useMemo(() => {
    //storing data in bucket for every 1 minute
    const buckets = new Map<number, number>(); 
    orders.forEach(o => {
      const bucket = Math.floor(o.timestamp / (1000 * 60)) * 60 * 1000; 
      const sale = o.price * o.quantity;
      buckets.set(bucket, (buckets.get(bucket) ?? 0) + sale);
    });
    const entries = Array.from(buckets.entries()).sort((a, b) => a[0] - b[0]);

    return {
      labels: entries.map(e => e[0]),
      data: entries.map(e => parseFloat(e[1].toFixed(2))),
    };
  }, [orders]);

  const ordersPerProduct = useMemo(() => {
    const counts = new Map<string, number>();
    orders.forEach(o => {
      counts.set(o.productName, (counts.get(o.productName) ?? 0) + 1);
    });

    const entries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]); 
    return { labels: entries.map(e => e[0]), data: entries.map(e => e[1]) };
  }, [orders]);

  const lineData = useMemo(() => ({
    datasets: [
      {
        label: "Total Sales (per minute)",
        data: salesTimeSeries.labels.map((ts, i) => ({ x: ts, y: salesTimeSeries.data[i] })),
        tension: 0.3,
        fill: false,
        pointRadius: 3,
      },
    ],
  }), [salesTimeSeries]);

  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: true }, title: { display: true, text: "Total Sales Over Time" } },
    scales: {
      x: { type: "time" as const, time: { unit: "minute" as const } },
      y: { beginAtZero: true, title: { display: true, text: "Sales (currency)" } }
    }
  };


  const recentOrders = [...orders].slice(-10).reverse();
  return (
    <div style={{ padding: 16 }}>
      <h2>Real-time Orders Dashboard</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 16, alignItems: "start" }}>
        <div>
          <div style={{ marginBottom: 12, background:"white" }}>
          {/* Linechart will come here */}
          </div>

          <div style={{background:"white"}}>
           {/* bargraph will come here */}
          </div>
        </div>

        <aside style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Recent Orders</h3>
          <div style={{ maxHeight: 420, overflowY: "auto" }}>
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "6px 8px" }}>Order</th>
                  <th style={{ textAlign: "left", padding: "6px 8px" }}>Product</th>
                  <th style={{ textAlign: "right", padding: "6px 8px" }}>Qty</th>
                  <th style={{ textAlign: "right", padding: "6px 8px" }}>Price</th>
                  <th style={{ textAlign: "right", padding: "6px 8px" }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 && <tr><td colSpan={5} style={{ padding: 8 }}>No orders yet</td></tr>}
                {recentOrders.map(ord => (
                  <tr key={ord.orderId}>
                    <td style={{ padding: "6px 8px" }}>{ord.orderId.slice(-8)}</td>
                    <td style={{ padding: "6px 8px" }}>{ord.productName}</td>
                    <td style={{ padding: "6px 8px", textAlign: "right" }}>{ord.quantity}</td>
                    <td style={{ padding: "6px 8px", textAlign: "right" }}>{(ord.price * ord.quantity).toFixed(2)}</td>
                    <td style={{ padding: "6px 8px", textAlign: "right" }}>{new Date(ord.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </aside>
      </div>
    </div>
  )
};