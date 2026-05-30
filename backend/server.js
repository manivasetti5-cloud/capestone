require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
const v1Routes = require('./routes/v1');
const adminRoutes = require('./routes/admin');
const b2bRoutes = require('./routes/b2b');

// Basic rate limiting for standard requests (not API calls)
const { defaultLimiter } = require('./middleware/rateLimiter');
app.use(defaultLimiter);

// API Routes
app.use('/v1', v1Routes);
app.use('/admin', adminRoutes);
app.use('/b2b', b2bRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/', (req, res) => res.json({ message: 'All India Villages API is running!' }));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});