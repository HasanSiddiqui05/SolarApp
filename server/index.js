import express from 'express'
import {connectDB }from './dbConnection.js';
import cors from 'cors'
import dotenv from 'dotenv'
import CategoryRoutes from './Routes/categoryRoutes.js'
import ProductRoutes from './Routes/productRoutes.js'
import SalesRoutes from './Routes/salesRoutes.js'
import ServiceRoutes from './Routes/serviceRoutes.js'

dotenv.config()
const allowedOrigins = [
  "http://localhost:5173",
  "https://solar-app-theta.vercel.app"
];
const app = express()

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json())

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({ success: true, message: "Login successful" });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.use('/api/category', CategoryRoutes)
app.use('/api/product', ProductRoutes)
app.use('/api/sales', SalesRoutes)
app.use('/api/services', ServiceRoutes)

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(` Server running on port: ${PORT}`));
});