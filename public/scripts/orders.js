document.getElementById("orders-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const phone = event.target.phone.value;

  fetch("/get-orders", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ phone }),
  })
    .then((res) => res.json())
    .then((orders) => {
      const ordersList = document.getElementById("orders-list");
      ordersList.innerHTML = ""; // Clear previous orders

      orders.forEach((order) => {
        const orderDiv = document.createElement("div");
        orderDiv.className = "order";
        orderDiv.innerHTML = `
          <h3>Order ID: ${order.order_id}</h3>
          <p>Total: $${order.total}</p>
          <p>Status: ${order.status}</p>
        `;
        ordersList.appendChild(orderDiv);
      });
    })
    .catch((err) => console.log(err));
});
