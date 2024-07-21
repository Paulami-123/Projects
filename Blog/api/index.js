import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import postRouter from "./routes/post.route.js"

dotenv.config()

mongoose.connect(process.env.MONGODB_URL)
.then(()=> {
    console.log("Database is connected")
})
.catch(err => {
    console.log(err);
})

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000, ()=> {
    console.log("Listening at PORT 3000 🎧")
})


app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/post', postRouter)

app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message
    })
})