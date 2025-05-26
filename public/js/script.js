// Elementos da página
const loginPage = document.getElementById('loginPage');
const mainPage = document.getElementById('mainPage');
const nomeInput = document.getElementById('nome');
const entrarBtn = document.getElementById('entrarBtn');
const welcomeMessage = document.getElementById('welcomeMessage');
const sucoSelect = document.getElementById('suco');
const salvarSucoBtn = document.getElementById('salvarSucoBtn');
const temaSelect = document.getElementById('tema');
const sairBtn = document.getElementById('sairBtn');

// Elementos de exibição de dados
const displayNome = document.getElementById('displayNome');
const displayVisitas = document.getElementById('displayVisitas');
const displayLocalStorage = document.getElementById('displayLocalStorage');
const displayCookie = document.getElementById('displayCookie');
const displaySucosFavoritos = document.getElementById('displaySucosFavoritos');

// Funções para gerenciar armazenamento
function salvarNoLocalStorage(nome, valor) {
    localStorage.setItem(nome, valor);
}

function obterDoLocalStorage(nome) {
    return localStorage.getItem(nome);
}

function salvarNaSessao(nome, valor) {
    sessionStorage.setItem(nome, valor);
}

function obterDaSessao(nome) {
    return sessionStorage.getItem(nome);
}

function salvarCookie(nome, valor, dias) {
    const data = new Date();
    data.setTime(data.getTime() + (dias * 24 * 60 * 60 * 1000));
    const expira = "expires=" + data.toUTCString();
    // Adicionando atributo SameSite=Lax para compatibilidade com navegadores modernos
    document.cookie = `${nome}=${valor};${expira};path=/;SameSite=Lax`;
    
    // Adicionando log para debug
    console.log("Cookie sendo salvo:", `${nome}=${valor};${expira};path=/;SameSite=Lax`);
    console.log("Cookies após salvar:", document.cookie);
}

function obterCookie(nome) {
    const nomeCookie = nome + "=";
    // Adicionando log para debug
    console.log("Cookies disponíveis:", document.cookie);
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nomeCookie) === 0) {
            const valor = cookie.substring(nomeCookie.length, cookie.length);
            console.log(`Cookie ${nome} encontrado com valor: ${valor}`);
            return valor;
        }
    }
    console.log(`Cookie ${nome} não encontrado`);
    return "";
}

// Função para atualizar a exibição de dados
function atualizarDados() {
    const nome = obterDoLocalStorage('nome') || 'Não definido';
    const visitas = obterDoLocalStorage('visitas') || '0';
    const sucoLocalStorage = obterDoLocalStorage('sucoFavorito') || 'nenhum';
    // Usar localStorage como fallback para cookies
    const sucoCookie = obterCookie('sucoFavorito') || obterDoLocalStorage('cookieFallback') || 'nenhum';
    const sucoSessao = obterDaSessao('sucoFavorito') || 'nenhum';

    displayNome.textContent = nome;
    displayVisitas.textContent = visitas;
    displayLocalStorage.textContent = sucoLocalStorage;
    displayCookie.textContent = sucoCookie;
    displaySucosFavoritos.textContent = sucoSessao;
}

// Evento de salvar suco favorito
salvarSucoBtn.addEventListener('click', () => {
    const sucoSelecionado = sucoSelect.value;
    salvarNoLocalStorage('sucoFavorito', sucoSelecionado);
    salvarCookie('sucoFavorito', sucoSelecionado, 30);
    // Backup em localStorage para o caso de cookies não funcionarem
    salvarNoLocalStorage('cookieFallback', sucoSelecionado);
    salvarNaSessao('sucoFavorito', sucoSelecionado);
    atualizarDados();
    alert(`Suco ${sucoSelecionado} salvo como favorito!`);
});

// Função para alternar entre temas
function alterarTema(tema) {
    if (tema === 'escuro') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    salvarNoLocalStorage('tema', tema);
}

// Evento de login
entrarBtn.addEventListener('click', () => {
    const nome = nomeInput.value.trim();
    if (nome) {
        // Salvar nome e incrementar visitas
        salvarNoLocalStorage('nome', nome);
        const visitas = parseInt(obterDoLocalStorage('visitas') || '0') + 1;
        salvarNoLocalStorage('visitas', visitas.toString());
        
        // Atualizar mensagem de boas-vindas
        welcomeMessage.textContent = `Bem-vindo, ${nome}!`;
        
        // Mostrar página principal
        loginPage.style.display = 'none';
        mainPage.style.display = 'block';
        
        // Atualizar dados exibidos
        atualizarDados();
    }
});

// Evento de alteração de tema
temaSelect.addEventListener('change', () => {
    alterarTema(temaSelect.value);
});

// Evento de sair
sairBtn.addEventListener('click', () => {
    mainPage.style.display = 'none';
    loginPage.style.display = 'block';
    nomeInput.value = '';
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se já existe um nome salvo
    const nomeSalvo = obterDoLocalStorage('nome');
    if (nomeSalvo) {
        nomeInput.value = nomeSalvo;
    }
    
    // Aplicar tema salvo
    const temaSalvo = obterDoLocalStorage('tema') || 'claro';
    temaSelect.value = temaSalvo;
    alterarTema(temaSalvo);
});