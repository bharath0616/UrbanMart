const payBtn = document.querySelector(".btn-buy");

payBtn.addEventListener("click", () => {
  fetch("/stripe-checkout", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      items: JSON.parse(localStorage.getItem("cartItems")),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.url) {
        location.href = data.url; // Redirect to the Stripe checkout session
        clearCart();
      } else {
        console.error("No URL returned from server");
      }
    })
    .catch((err) => console.log(err));
});
