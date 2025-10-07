import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import aiRouter from "./routes/aiRoute.js";
import "dotenv/config";

// App config
const app = express();
const port = process.env.PORT || 4000;

// ✅ Middleware
app.use(express.json());

// ✅ CORS with full control
app.use(
  cors({
    origin: "*", // You can replace "*" with your frontend URL for more security
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Static file serving for images with proper headers
app.use(
  "/images",
  express.static("uploads", {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

// ✅ Database connection
connectDB();

// ✅ API endpoints
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/ai", aiRouter);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("API Working 🚀");
});

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server started on http://localhost:${port}`);
});
