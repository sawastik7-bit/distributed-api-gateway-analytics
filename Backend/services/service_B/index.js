import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const products = [
  { id: 1, name: 'Laptop',     price: 999,  category: 'electronics', stock: 50  },
  { id: 2, name: 'Phone',      price: 699,  category: 'electronics', stock: 100 },
  { id: 3, name: 'Headphones', price: 199,  category: 'electronics', stock: 200 },
  { id: 4, name: 'Desk Chair', price: 349,  category: 'furniture',   stock: 30  },
];

app.get('/products', (req, res) => {
  console.log(`[Service B] GET /products called`);
  res.json({
    success: true,
    service: process.env.SERVICE_NAME,
    count: products.length,
    data: products
  });
});


app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  console.log(`[Service B] GET /products/${id} called`);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Product with id ${id} not found`
    });
  }

  res.json({
    success: true,
    service: process.env.SERVICE_NAME,
    data: product
  });
});

app.post('/products', (req, res) => {
  const { name, price, category, stock } = req.body;
  console.log(`[Service B] POST /products called`, req.body);

  if (!name || !price) {
    return res.status(400).json({
      success: false,
      message: 'Name and price are required'
    });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price,
    category: category || 'general',
    stock: stock || 0
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    service: process.env.SERVICE_NAME,
    message: 'Product created successfully',
    data: newProduct
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

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Service B (Products) running on port ${PORT}`);
});