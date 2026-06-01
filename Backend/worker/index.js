import { Worker } from 'bullmq';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {createServer} from 'http';
import {Server} from 'socket.io';
dotenv.config();


const httpServer=createServer();

const io=new Server(httpServer,{
    cors:{
        origin:'http://localhost:5173',
        methods:['GET','POST']
    }
});

const SOCKET_PORT=4003;
httpServer.listen(SOCKET_PORT,()=>{
    console.log("Socket.io server is running");
})

io.on('connection',(socket)=>{
    console.log(`[socket.io] Dashboard connected: ${socket.id}`);

    socket.on('disconnect', () => {
    console.log(`[Socket.io] Dashboard disconnected: ${socket.id}`);
  });
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Worker connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err.message));


const logSchema = new mongoose.Schema({
  route:     String,
  method:    String,
  status:    Number,
  duration:  Number,
  ip:        String,
  userId:    String,
  userRole:  String,
  timestamp: Number
});

const Log = mongoose.model('Log', logSchema);

const calculateStats=async()=>{
    const currentTime=Date.now();
    const oneMinuteAgo=currentTime-60*1000;

    const totalRequests=await Log.Documents();

    const requestsPerMinute= await Log.countDocuments({
      timestamp:{$gte:oneMinuteAgo}
    });


    const avgResult= await Log.aggregate([
      {
        $group:{
          _id:null,
          avgDuration:{$avg:'$duration'}
        }
      }
    ]);
    const averageResponse = avgResult[0]
  ? Math.round(avgResult[0].avgDuration)
  : 0;


  const errorCount = await Log.countDocuments({
  status: { $gte: 400 }
});

const errorRate = totalRequests > 0
  ? Math.round((errorCount / totalRequests) * 100)
  : 0;


const topRoutes=await Log.aggregate([
  {
    $group:{
      _id:"$route",
      count:{$sum:1}
    }
  },{ $sort:{count:-1}},
  {$limit:5},
  {$project:{
    route:'$_id',
    count:1,
    _id:0
  }}
]);

const recentLogs = await Log.find()
  .sort({ timestamp: -1 })  
  .limit(5)                  
  .select('route method status duration timestamp -_id');


    return {
    totalRequests,
    requestsPerMinute,
    averageResponse,
    errorRate,
    topRoutes,
    recentLogs
  };
}




const worker = new Worker(
  'logQueue',
  async (job) => {

    console.log(`[Worker] Processing job ${job.id}`);
    console.log(`[Worker] Data:`, job.data);
    const log = new Log(job.data);
    await log.save();

    console.log(`[Worker] Log saved to MongoDB`);
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379
    }
  }
);

worker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job.id} failed`, err.message);
});

worker.on('error', (err) => {
  console.error('[Worker] Worker error:', err.message);
});

console.log('Worker is running and listening to queue');