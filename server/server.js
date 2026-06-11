const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./db');
const { syncAll } = require('./integrations/sync');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: en producción se restringe a los orígenes de CORS_ORIGIN (separados por coma).
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

if (allowedOrigins.length) {
  app.use(cors({ origin: allowedOrigins }));
} else {
  console.warn('⚠️  CORS_ORIGIN no definido: permitiendo todos los orígenes (solo para desarrollo).');
  app.use(cors());
}
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, async () => {
      console.log(`\n✅ Server running on port ${PORT}`);

      // Repuebla los paquetes de mayoristas al arrancar (clave en hosts sin
      // disco persistente, donde la DB se reinicia). Desactivable con SYNC_ON_STARTUP=false.
      if (process.env.SYNC_ON_STARTUP !== 'false') {
        try {
          const results = await syncAll();
          console.log('Sync inicial de mayoristas:', JSON.stringify(results));
        } catch (err) {
          console.error('Sync inicial falló:', err.message);
        }
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

module.exports = app;
