const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ 
  origin: [
    process.env.CLIENT_URL, 
    'http://localhost:5173',
    'https://riddhi-jewellers-dncx.vercel.app'
  ], 
  credentials: true 
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/chat', require('./routes/chatRoutes')); // ← yeh add karo

// ✅ DEBUG - Har request log hogi
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`, req.body);
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/collections', require('./routes/collectionRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contact', require('./routes/contact'));

app.get('/', (req, res) => res.json({ message: 'Riddhi Jewellers API Running' }));

// ✅ DEBUG - Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));