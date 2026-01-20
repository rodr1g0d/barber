// ============================================
// BARBER - Landing Page
// URL: https://barber.xrtec1.com
// Porta: 5901
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5901;

// Middlewares
app.use(cors());
app.use(express.json());

// Arquivos estaticos
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Landing Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'barber-landing' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║      BARBER - Landing Page Ativa           ║');
    console.log('╠════════════════════════════════════════════╣');
    console.log(`║  URL: http://localhost:${PORT}              ║`);
    console.log('║  Status: Rodando                           ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');
});
