import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const payload = {
  id:   '64abc123',
  name: 'Sawastik Bhullar',
  role: 'admin'
};

const token = jwt.sign(
  payload,
  process.env.JWT_SECRET,
  { expiresIn: '1d' }  
);

console.log('Your test token:');
console.log(token);

