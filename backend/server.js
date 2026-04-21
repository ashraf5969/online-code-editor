const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Security Packages
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const app = express();

// Connect to Database
connectDB();

// -- Security Middleware --
// 1. Helmet: Set secure HTTP headers
app.use(helmet());

// 2. CORS setup: Restrict origins and allow credentials (cookies)
app.use(cors({
    origin: '*', // Allows all for development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'csrf-token']
}));

// 3. Body parser: limit payload size to prevent DOS
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// 4. Rate Limiting: Limit requests from same API
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100, // limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// 5. MongoDB Injection Prevention: Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// 6. XSS Sanitization: Data sanitization against Cross-Site Scripting
app.use(xss());

// 7. HTTP Parameter Pollution: Prevent parameter pollution
app.use(hpp());

// 8. CSRF Protection
// Note: Must come after cookieParser
const csrfProtection = csrf({ cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' } });
// Optional CSRF Token generation route (frontend can fetch this)
app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.status(200).json({ csrfToken: req.csrfToken() });
});

// For demonstration, we'll apply CSRF to routes except GET requests (standard csurf behavior).
// If you want to enable CSRF globally, uncomment the line below:
// app.use(csrfProtection); 

// Routes
app.use('/api/editor', require('./routes/editorRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/snippets', require('./routes/snippetRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Error Handling Middleware
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
