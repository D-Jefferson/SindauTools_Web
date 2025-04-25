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
  container.innerHTML = "---";
  document.getElementById("fundo-sobrepor").style.display = "block";
  document.getElementById("fundo-sobrepor").style.padding = "0 250px" ;
}

function auto(){
  const container = document.getElementById("conteudo-sobrepor");
  container.innerHTML = "---";
  document.getElementById("fundo-sobrepor").style.display = "block";
  document.getElementById("fundo-sobrepor").style.padding = "200px 500px" ;
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
  window.location.href = "vincular.html";
}

function formatar4(){ 
  window.location.href = "matricula.html";
}