// ============================================
// BARBER.XRTEC1 - Server Principal
// Sistema de Gestão para Barbearias
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
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Rota principal - Landing Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'barber-xrtec1' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║       BARBER.XRTEC1 - Servidor Ativo       ║');
    console.log('╠════════════════════════════════════════════╣');
    console.log(`║  URL: http://localhost:${PORT}              ║`);
    console.log('║  Status: Rodando                           ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');
});
