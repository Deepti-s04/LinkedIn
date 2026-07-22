import express from "express";
import dotenv from "dotenv";
import connectdb from "./config/db.js";
import router from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.router.js";
import http from "http";
import { Server } from "socket.io";
import connectionRouter from "./routes/connection.routes.js";
import notificationRouter from "./routes/notification.routes.js"
dotenv.config();
let app = express();
let server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
let port = process.env.PORT || 5000;
app.use("/api/auth", router);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/connection", connectionRouter);
app.use("/api/notification", notificationRouter);


export const userSocketMap=new Map()
io.on("connection",(socket)=>{
    console.log("user conected ",socket.id);
    socket.on("register",(userId)=>{
      userSocketMap.set(userId,socket.id)
      console.log(userSocketMap);
      
    })
    socket.on("disconnect",(socket)=>{
        console.log("user disconnected",socket.id);        
    })    
})


server.listen(8000, () => {
  connectdb();
  console.log("server started");
});
