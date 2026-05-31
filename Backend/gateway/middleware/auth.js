import jwt from 'jsonwebtoken';

const auth=(req,res,next)=>{
    
    const authHeader=req.headers.authorization;
if(!authHeader){
    return res.status(401).json({
        success:false,
        message:"access denied"
    });
}

const token =authHeader.split(' ')[1];

if(!token){
    return res.status(401).json({
        success:false,
        message:"access denied- invalid token format"
    });
}

try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);

    req.user=decoded;

    next();
}catch(err){
    console.log(err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
        hint: 'Please login again to get a new token'
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        hint: 'Token may be tampered or malformed'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
}
}
export default auth;