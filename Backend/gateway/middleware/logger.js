import {Queue} from 'bullmq';


const logQueue=new Queue('logQueue',{
    connection:{
        host:'localhost',
        port:6379
    }
});

console.log("log queue connected");

const logger=(req,res,next)=>{

    const start=Date.now();

    res.on('finish',async()=>{
        const duration=Date.now()-start;
    
         const logData = {
      route:     req.originalPath || req.path,
      method:    req.method,
      status:    res.statusCode,
      duration:  duration,
      ip:        req.ip || req.connection.remoteAddress,
      userId:    req.user?.id   || 'unauthenticated',
      userRole:  req.user?.role || 'none',
      timestamp: Date.now()
    };

    try{

        await logQueue.add('log',logData);

        console.log(`[Logger] job pushed to queue`);
    }catch(err){
        console.error(`[Logger] failed to push job`,err.message);
    }
    
    })
    next();
}

export default logger;