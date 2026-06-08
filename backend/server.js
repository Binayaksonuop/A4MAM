require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Middleware
const allowedOrigins = [
  'http://localhost:4200',
  'https://a4mam.com',
  'https://spirulina-mam.vercel.app',
  'https://a4mam.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check against allowedOrigins list or FRONTEND_URL env var
    if (allowedOrigins.indexOf(origin) !== -1 || (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL)) {
      return callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Support base64 images
app.use(express.urlencoded({ extended: false }));

// Security & Performance Middlewares
app.use(helmet()); // Security headers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(compression()); // Gzip compression

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Routes
app.use('/api', require('./routes/publicRoutes'));
app.use('/api/pages', require('./routes/pageRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/success-stories', require('./routes/successStoryRoutes'));
app.use('/api/faqs', require('./routes/faqRoutes'));
app.use('/api/research', require('./routes/researchRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/media', require('./routes/mediaRoutes'));

// Root Route
app.get('/', (req, res) => {
  res.send('A4MAM API is running...');
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Port Configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
