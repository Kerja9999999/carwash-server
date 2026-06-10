const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const Stripe = require("stripe");

const app = express();

app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.get("/", (req, res) => {
  res.send("CarWash API работает");
});

app.get("/users", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

app.post("/register", async (req, res) => {
  const { name, phone, washbox } = req.body;

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        name,
        phone,
        credits: 0,
        washbox: washbox || 1
      }
    ])
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

app.get("/stripe-test", async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve();
    res.json(balance);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
