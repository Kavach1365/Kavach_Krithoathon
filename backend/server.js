import express, { urlencoded } from 'express';
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv';
import connectMongoDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 1234;

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use('/api/auth',authRoutes);

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}!`)
    connectMongoDB();
})