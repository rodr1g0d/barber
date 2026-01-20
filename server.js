// ============================================
// BARBERX - Server Principal
// Sistema de Gestao para Barbearias
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

// Arquivos estaticos
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/app', express.static(path.join(__dirname, 'app')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ============================================
// API Routes
// ============================================

// Configuracao publica (apenas chaves publicas)
app.get('/api/config', (req, res) => {
    res.json({
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    });
});

// ============================================
// Page Routes
// ============================================

// Rota principal - Landing Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// App Cliente - Agendamento
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

app.get('/app/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

// Admin - Painel da Barbearia
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'barberx' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║         BARBERX - Servidor Ativo           ║');
    console.log('╠════════════════════════════════════════════╣');
    console.log(`║  URL: http://localhost:${PORT}              ║`);
    console.log('║  Status: Rodando                           ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');
});
