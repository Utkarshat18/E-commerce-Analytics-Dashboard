
const products = [
  "Laptop",
  "Smartphone",
  "Headphones",
  "Keyboard",
  "Mouse",
  "Monitor",
  "Camera",
];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function startGenerator(broadcast: (order: any) => void) {
  setInterval(() => {
    const order = {
      orderId: `ORD-${Date.now()}-${getRandomInt(100, 999)}`,
      productName: products[getRandomInt(0, products.length - 1)],
      quantity: getRandomInt(1, 5),
      price: parseFloat((getRandomInt(100, 1000) + Math.random()).toFixed(2)),
      timestamp: Date.now(),
      status: ["pending", "shipped", "delivered"][getRandomInt(0, 2)],
    };

    broadcast(order);
  }, 3000); 
}
