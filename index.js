import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";

// Load environment variables
dotenv.config();

// Ensure the Stripe secret key is loaded
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY in .env file");
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Start server
const app = express();

app.use(express.static("public"));
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public/views" });
});
// Products Route
app.get("/product", (req, res) => {
  res.sendFile("product.html", { root: "public/views" });
});
// Success
app.get("/success", (req, res) => {
  res.sendFile("success.html", { root: "public/views" });
});

// Cancel
app.get("/cancel", (req, res) => {
  res.sendFile("cancel.html", { root: "public/views" });
});

// Stripe Checkout
app.post("/stripe-checkout", async (req, res) => {
  try {
    const lineItems = req.body.items.map((item) => {
      const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/, "") * 100);
      return {
        price_data: {
          currency: "usd",
          product_data: { name: item.title, images: [item.productImg] },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.DOMAIN}/success`,
      cancel_url: `${process.env.DOMAIN}/cancel`,
      line_items: lineItems,
      billing_address_collection: "required",
    });

    res.json({ url: session.url }); // Ensure the URL is returned correctly
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});