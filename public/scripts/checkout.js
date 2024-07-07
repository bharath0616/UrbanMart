document.getElementById("checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const user = {
    name: event.target.name.value,
    email: event.target.email.value,
    phone: event.target.phone.value,
  };
  const items = JSON.parse(localStorage.getItem("cartItems"));
  
  if (!items || items.length === 0) {
    console.error("Cart is empty");
    return;
  }
  
  items.forEach((item) => {
    if (!item.quantity || !item.price) {
      console.error("Invalid item data:", item);
      return;
    }
  });
  
  fetch("/stripe-checkout", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ user, items }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.url) {
        location.href = data.url; // Redirect to the Stripe checkout session
      } else {
        console.error("No URL returned from server");
      }
    })
    .catch((err) => console.log(err));
});
