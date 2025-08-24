const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const apiRouter = require('./routes/api');

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
// Stripe webhook must receive the raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
// Standard parsers for every other route
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicDir = path.resolve(__dirname, '../../public');
app.use(express.static(publicDir));

app.use('/api', apiRouter);

// Serve admin dashboard explicitly
app.get('/admin', (req, res) => {
  res.redirect('/admin/');
});
app.get('/admin/', (req, res) => {
  res.sendFile(path.join(publicDir, 'admin', 'index.html'));
});
app.get('/admin/login.html', (req, res) => {
  res.sendFile(path.join(publicDir, 'admin', 'login.html'));
});
app.get('/admin/register.html', (req, res) => {
  res.sendFile(path.join(publicDir, 'admin', 'register.html'));
});
app.get('/admin/forgot.html', (req, res) => {
  res.sendFile(path.join(publicDir, 'admin', 'forgot.html'));
});
app.get('/admin/reset.html', (req, res) => {
  res.sendFile(path.join(publicDir, 'admin', 'reset.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Kodara-HQ server running on http://localhost:${PORT}`);
  console.log(`Server also accessible on http://127.0.0.1:${PORT}`);
});


