// app/routes/index.tsx
import React from "react";
import RealTimeOrders from "~/components/Realtimechart"

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>My E-commerce Analytics</h1>
      <RealTimeOrders />
    </main>
  );
}
