import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());


const users = [
  { id: 1, name: 'Sawastik Bhullar', email: 'sawastik@gmail.com', role: 'admin' },
  { id: 2, name: 'John Doe',         email: 'john@gmail.com',     role: 'user'  },
  { id: 3, name: 'Jane Smith',       email: 'jane@gmail.com',     role: 'user'  },
];


app.get('/users',(req,res)=>{
    console.log('SERVICE A GET/users called');

    res.json({
        success:true,
        service:process.env.SERVICE_NAME,
        count:users.length,
        data:users
    });
});


app.get("/users/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    const user=users.find(u => u.id ===id);
    console.log(`[SERVICE A] GET /users/${id} called`);

if(!user){
    return res.status(404).json({
        success:false,
        message:`User with id ${id} not found`
    });
}
return res.json({
    success:true,
    service:process.env.SERVICE_NAME,
    data:user
});

});


app.post("/users",(req,res)=>{

    const {name,email,role}=req.body;

    console.log("[SERVICE A] POST /users called",req.body);

    if(!name || !email){
        return res.status(400).json({
            success:false,
            message:"Name and email are required"
        });
    }

const newUser={
    id:users.length +1,
    name,
    email,
    role:role || 'user'
};
users.push(newUser);

 res.status(201).json({
    success: true,
    service: process.env.SERVICE_NAME,
    message: 'User created successfully',
    data: newUser
  });
});


app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: process.env.SERVICE_NAME,
    status: 'running',
    port: process.env.PORT
  });
});


const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Service A (Users) running on port ${PORT}`);
});