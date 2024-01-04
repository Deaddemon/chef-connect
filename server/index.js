import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/Users.js"; 
import { recipesRouter } from "./routes/Recipes.js"; 
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

const url = process.env.MONGO_URI;
const PORT = process.env.PORT ;
 
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(() => app.listen(PORT, () => console.log("Server up and running!")))
.catch((error) => console.log(error.message)); 
 
