

  import express from "express";
  import mongoose from "mongoose";
  import router from "./routes/event.route.js";
  import cors from "cors";
  import dotenv from "dotenv";
  
  const app = express();
  dotenv.config();
  
  const connectToMongoDB = async () => {
    try {
      const uri = process.env.MONGOURI;
      if (!uri) {
        throw new Error("MongoDB URI is not defined in environment variables");
      }
  
      await mongoose.connect(uri);
      console.log("Connected to MongoDB!");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      // Optionally, you might want to exit the application if MongoDB connection fails
      process.exit(1);
    }
  };
  connectToMongoDB();
  // Middleware
  app.use(cors({ origin: "*", credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // Routes
  app.use("/api/uploads/",router);
  

app.listen('8000', ()=>{console.log("server is up and running")})