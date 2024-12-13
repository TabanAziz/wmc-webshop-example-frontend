const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initial products array with predefined IDs and descriptions
let products = [
  { id: 1, name: "Buch", price: 5, description: "Ein spannendes Buch über Abenteuer." },
  { id: 2, name: "Stuhl", price: 70, description: "Bequemer Stuhl für den Schreibtisch." },
  { id: 3, name: "Laptop", price: 700, description: "Leistungsstarker Laptop für Arbeit und Studium." }
];

// Set initial next ID based on the highest ID in the existing products
let nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

// Route to get products with filtering
app.get('/api/products', (req, res) => {
  const { minPrice, maxPrice, name } = req.query;
  let filteredProducts = products;

  if (minPrice) filteredProducts = filteredProducts.filter(p => p.price >= +minPrice);
  if (maxPrice) filteredProducts = filteredProducts.filter(p => p.price <= +maxPrice);
  if (name) filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));

  res.json(filteredProducts);
});

// Route to delete a product
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  res.sendStatus(204);
});

// Route to add a new product
app.post('/api/products', (req, res) => {
  const newProduct = { id: nextId++, ...req.body };  // Increment ID with each new product
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
