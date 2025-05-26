const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

// Middleware para cookies
app.use(cookieParser());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para salvar cookie via servidor
app.get('/set-cookie/:nome/:valor', (req, res) => {
    res.cookie(req.params.nome, req.params.valor, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
        httpOnly: false,
        path: '/',
        sameSite: 'lax'
    });
    res.send({ success: true });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor Suquinho Store rodando em http://localhost:${port}`);
});