import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import rateLimiter from './middleware/rateLimiter.js';
import logger from './middleware/logger.js';
import { userServiceProxy,productServiceProxy } from '../routes/proxy.js';
import auth from './middleware/auth.js';
dotenv.config();

const app=express();
app.use(cors());
app.use(rateLimiter);
app.use(logger);



app.use('/api/users',auth,userServiceProxy);
app.use('/api/products',auth,productServiceProxy);
app.use(express.json());

app.get('/health',(req,res)=>{
    res.json({
        success:true,
        service:'API Gateway',
        status:"Running",
        port:process.env.PORT,
        routes:{
            users:'/api/users -> Service A (4001)',
            products:"/api/products -> Service B (4002)"
        }
    });
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found on gateway`
  });
});

app.listen(process.env.PORT || 3000,()=>{
    console.log("The gateway server is live");
});