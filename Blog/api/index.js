import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js"

dotenv.config()

mongoose.connect(process.env.MONGODB_URL)
.then(()=> {
    console.log("Database is connected")
})
.catch(err => {
    console.log(err);
})
const app = express();

app.use('/api/user', userRouter)

app.listen(3000, ()=> {
    console.log("Listening at PORT 3000 🎧")
})