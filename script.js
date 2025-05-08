  /*  Parte PWA  */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log("SW registrado"))
      .catch(err => console.log("Erro ao registrar SW:", err));
  }

  /*  Sobrepor  */
const sobrepor = document.getElementById("fundo-sobrepor");
const fechar = document.getElementById("fechar");
fechar.onclick = () => sobrepor.style.display = "none";
window.onclick = (e) => {
  if (e.target == sobrepor) sobrepor.style.display = "none";
};

function info(){
  const container = document.getElementById("conteudo-sobrepor");
  container.innerHTML = 'Sem Notificações';
  document.getElementById("fundo-sobrepor").style.display = "block";
  document.getElementById("fundo-sobrepor").style.padding = "30px 80px" ;
}

  /*  Menu Lateral  */
function lateral() {
  document.getElementById("menuLateral").classList.toggle("aberto");
}

  /*  Botoes do menu  */
function formatar1(){ 
  window.location.href = "notificacao.html";
}

function formatar2(){ 
  window.location.href = "vincular.html";
}

function formatar3(){ 
  window.location.href = "desvincular.html";
}

function formatar4(){ 
  window.location.href = "matricula.html";
}

  /*  Extensoes  */
function instalarapi(){ 
  const progresso = document.getElementById('carregamento');
  const botaoTexto = document.querySelector('.extensao-botao span');
  botaoTexto.innerText = '';
  document.getElementById("extensao-botao").style.padding = "4px 200px";
  progresso.style.backgroundColor = 'rgb(179, 179, 179)';
  progresso.style.width = '0%';
  document.getElementById("extensao-botao").style.pointerEvents = "none";
  setTimeout(() => {
    progresso.style.width = '100%';
  }, 10);
  setTimeout(() => {
    document.getElementById("extensao-botao").style.padding = "5px 30px";
    botaoTexto.innerText = 'Erro ao tentar instalar extensão. Consulte o Desenvolvedor!';
    progresso.style.backgroundColor = 'rgba(151, 40, 40, 0.61)';
  }, 5000);
  setTimeout(() => {
    progresso.style.width = '0%';
    progresso.style.backgroundColor = 'rgba(5, 37, 73, 0.61)';
    botaoTexto.innerText = 'Instalar';
    document.getElementById("extensao-botao").style.pointerEvents = "all";
    document.getElementById("extensao-botao").style.padding = "5px 30px";
  }, 10000);
}

  /*  Animação nome  */
  const palavras = ["@By Jefferson Levy","@By Jefferson Levy","@By Jefferson Levy","@By Jefferson Levy","Acredite em si mesmo e você será imparável."];
  let palavraIndex = 0;
  let letraIndex = 0;
  let escrevendo = true;
  const span = document.getElementById('nome');

  function digitar() {
    const palavraAtual = palavras[palavraIndex];

    if (!escrevendo) {
      if (letraIndex > 0) {
        span.textContent = palavraAtual.substring(0, letraIndex - 1);
        letraIndex--;
        setTimeout(digitar, 200);
      } else {
        escrevendo = true;
        palavraIndex = (palavraIndex + 1) % palavras.length;
        setTimeout(digitar, 500);
      }
    } else {
      if (letraIndex < palavraAtual.length) {
        span.textContent += palavraAtual.charAt(letraIndex);
        letraIndex++;
        setTimeout(digitar, 200);
      } else {
        escrevendo = false;
        setTimeout(digitar, 3000);
      }
    }
  }
span.textContent = palavras[palavraIndex];
letraIndex = palavras[palavraIndex].length;
setTimeout(digitar, 1000);
digitar();

function entrar() {
    sessionStorage.setItem('loggedIn', 'true');
    window.location.href = 'index.html';
  };

function verificarlogado() {
  document.addEventListener("DOMContentLoaded", function () {
      const temaSalvo = localStorage.getItem('tema');
  if (temaSalvo === 'claro') {
      document.body.classList.add('claro');
  }

      if (window.location.pathname !== 'login.html') {
          if (sessionStorage.getItem('loggedIn') !== "true") {
              window.location.href = 'login.html';
          }
      }
  });
}

function trocarmodo() {
  document.body.classList.toggle('claro');
  
  if (document.body.classList.contains('claro')) {
      localStorage.setItem('tema', 'claro');
  } else {
      localStorage.setItem('tema', 'escuro');
  }
}

/*  Aba de ajuda  */
function ajuda() {
  document.addEventListener('DOMContentLoaded', () => {
    const abasFiltro = document.querySelectorAll('.aba-filtro');
    const cartoesAjuda = document.querySelectorAll('.ajuda-itens');
    const pesquisaInput = document.querySelector('.pesquisa-ajuda input');
    const botaoPesquisa = document.querySelector('.botao-pesquisa');
    const categoriasMap = {
      'todos': [0, 1, 2, 3],
      'erros comuns': [3],
      'dúvidas frequentes': [0, 1, 2],
      'contatos': [4,5,6,7,8]
    };
    function filtrar(categoria) {
      const filtro = categoria.toLowerCase().trim();
      const indices = categoriasMap[filtro] || [];
      
      cartoesAjuda.forEach((cartao, i) => {
        cartao.style.display = filtro === 'todos' || indices.includes(i) ? 'flex' : 'none';
      });
    }
    abasFiltro.forEach(aba => {
      aba.addEventListener('click', function() {
        abasFiltro.forEach(t => t.classList.remove('ativo'));
        this.classList.add('ativo');
        filtrar(this.textContent);
      });
    });
    if (botaoPesquisa && pesquisaInput) {
      const buscar = () => {
        const termo = pesquisaInput.value.toLowerCase().trim();
        if (!termo) {
          filtrar(document.querySelector('.aba-filtro.ativo')?.textContent || 'todos');
          return;
        }
        
        cartoesAjuda.forEach(cartao => {
          const texto = cartao.textContent.toLowerCase();
          cartao.style.display = texto.includes(termo) ? 'flex' : 'none';
        });
      };
      
      botaoPesquisa.addEventListener('click', buscar);
      pesquisaInput.addEventListener('keypress', e => e.key === 'Enter' && buscar());
    }
    filtrar('todos');
  });
}