import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());//This allows Express to read JSON data sent by the client.

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});