import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import mysql from "mysql2/promise";

// Load environment variables
dotenv.config();

// Ensure the Stripe secret key is loaded
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY in .env file");
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

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

// Checkout Route
app.get("/checkout", (req, res) => {
  res.sendFile("checkout.html", { root: "public/views" });
});

// Orders Route
app.get("/orders", (req, res) => {
  res.sendFile("orders.html", { root: "public/views" });
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
    const { items, user } = req.body;

    if (!items || !user || !user.name || !user.email || !user.phone) {
      throw new Error("Missing required user or item data");
    }

    const [userResult] = await pool.execute(
      'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)',
      [user.name, user.email, user.phone]
    );

    const userId = userResult.insertId;

    const lineItems = items.map((item) => {
      const unitAmount = item.price * 100; // Convert to the smallest currency unit
      return {
        price_data: {
          currency: "usd",
          product_data: { name: item.title, images: [item.productImg] },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.DOMAIN}/success`,
      cancel_url: `${process.env.DOMAIN}/cancel`,
      line_items: lineItems,
      billing_address_collection: "required",
    });

    const [orderResult] = await pool.execute(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
      [userId, session.amount_total / 100, 'Pending']
    );

    const orderId = orderResult.insertId;

    await Promise.all(
      items.map((item) => {
        if (!item.quantity || !item.price) {
          console.error("Invalid item data:", item);
          throw new Error("Missing required item data");
        }
        return pool.execute(
          'INSERT INTO order_items (order_id, quantity, price) VALUES (?, ?, ?)',
          [orderId, item.quantity, item.price]
        );
      })
    );

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Retrieve orders based on phone number
app.post("/get-orders", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      throw new Error("Phone number is required");
    }
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE user_id = (SELECT user_id FROM users WHERE phone = ?)',
      [phone]
    );

    res.json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
