let resultadosMatricula = [];
let resultadosVincular = [];
let resultadosDesvincular = [];
let resultadosNotificacao = [];

verificarlogado()

//---------- Notificação ----------
function formatar_notificacao() {
    try {
        const texto = document.getElementById('colocar1').value.trim();
        const linhas = texto.split("\n");
        resultadosNotificacao = [];
        document.getElementById('resultados-area1').innerHTML = '';

        linhas.forEach((linha) => {
            const elementos = linha.split("\t");
            if (elementos.length === 13 && (elementos[12] === "paid" || elementos[12] === "New")) {
                try {
                    const valor = parseFloat(elementos[8]);
                    const jsonObj = {
                        "_id": elementos[0],
                        "operacao": elementos[1],
                        "data_hora": elementos[2],
                        "uuid_matricula": elementos[3],
                        "cnpj": elementos[4],
                        "financeiro": {
                            "situacao": elementos[5],
                            "numero_cobranca": elementos[6],
                            "operadora": elementos[7],
                            "valor": valor,
                            "data_criacao": elementos[9],
                            "data_atualizacao": elementos[10],
                            "data_vencimento": elementos[11],
                            "status_atual": elementos[12],
                        }
                    };
                    const resultadoJson = JSON.stringify(jsonObj, null, 4);
                    resultadosNotificacao.push(resultadoJson);

                    const resultItem = document.createElement('div');
                    resultItem.className = 'resultados-item';
                    resultItem.textContent = resultadoJson;

                    const copiarBotao = document.createElement('botao');
                    copiarBotao.className = 'botao-copiar';
                    copiarBotao.textContent = 'Copiar';
                    copiarBotao.onclick = () => {
                        copiarTexto(resultadoJson);
                        copiarBotao.innerText = "Copiado!";
                        copiarBotao.style.backgroundColor = "#264d88";
                            if (!copiarBotao.clicado) {
                                contarClique1();
                                copiarBotao.clicado = true;
                            }
                        };

                    resultItem.appendChild(copiarBotao);
                    document.getElementById('resultados-area1').appendChild(resultItem);
                } catch (e) {
                    console.error('Erro ao processar a linha:', linha, e);
                }
            }
        });
    } catch (e) {
        console.error('Erro ao formatar o texto:', e);
    }
}


//---------- Matricula ---------- 
function formatar_matricula() {
    try {
        const texto = document.getElementById('colocar4').value.trim();
        const linhas = texto.split("\n");
        resultadosMatricula = [];
        document.getElementById('resultados-area4').innerHTML = '';

        linhas.forEach((linha) => {
            const elementos = linha.split("\t");
            if (elementos.length === 10) {
                try {
                    const jsonObj = {
                        "_id": elementos[0],
                        "operacao": elementos[1],
                        "data_hora": elementos[2],
                        "matricula": {
                        "uuid": elementos[3],
                        "candidato": {
                        "nome": elementos[4],
                        "cpf": elementos[5]
                        },
                        "detran": {
                        "renach": elementos[6],
                        "situacao": elementos[7],
                        "servicoCodigo": elementos[8]
                        }
                        },
                        "cfc": {
                        "cnpj": elementos[9]
                        }
                    };
                    const resultadoJson = JSON.stringify(jsonObj, null, 4);
                    resultadosMatricula.push(resultadoJson);

                    const resultItem = document.createElement('div');
                    resultItem.className = 'resultados-item';
                    resultItem.textContent = resultadoJson;

                    const copiarBotao = document.createElement('botao');
                    copiarBotao.className = 'botao-copiar';
                    copiarBotao.textContent = 'Copiar';
                    copiarBotao.onclick = () => {
                        copiarTexto(resultadoJson);
                        copiarBotao.innerText = "Copiado!";
                        copiarBotao.style.backgroundColor = "#264d88";
                            if (!copiarBotao.clicado) {
                                contarClique4();
                                copiarBotao.clicado = true;
                            }
                    };

                    resultItem.appendChild(copiarBotao);
                    document.getElementById('resultados-area4').appendChild(resultItem);
                } catch (e) {
                    console.error('Erro ao processar a linha:', linha, e);
                }
            }
        });
    } catch (e) {
        console.error('Erro ao formatar o texto:', e);
    }
}


//----------  Vincular ----------
function formatar_vincular() {
    const uuids = document.getElementById('colocar2').value.trim().split("\n").map(uuid => uuid.trim()).filter(uuid => uuid !== "");
    const cpf = document.getElementById('cpf1').value.trim();
    if (!uuids.length || !cpf) {
        alert("Por favor, preencha todos os campos.");
        return;
    }
    mostrarResultados1(uuids, cpf);
}

function mostrarResultados1(uuids, cpf) {
    const resultadosDiv = document.getElementById('resultados-area2');
    resultadosDiv.innerHTML = '';

    uuids.forEach((uuid) => {
        const jsonObj = {
            "_id": uuid,
            "operacao": "VINCULADO",
            "data_hora": obterDataHoraAtual(),
            "agendamento": { "uuid": uuid },
            "candidato": { "cpf": cpf }
        };
        const resultadoJson = JSON.stringify(jsonObj, null, 4);
        resultadosVincular.push(resultadoJson);

        const resultItem = document.createElement('div');
        resultItem.className = 'resultados-item';
        resultItem.textContent = resultadoJson;

        const copiarBotao = document.createElement('botao');
        copiarBotao.className = 'botao-copiar';
        copiarBotao.textContent = 'Copiar';
        copiarBotao.onclick = () => {
            copiarTexto(resultadoJson);
            copiarBotao.innerText = "Copiado!";
            copiarBotao.style.backgroundColor = "#264d88";
                if (!copiarBotao.clicado) {
                    contarClique3();
                    copiarBotao.clicado = true;
                }
        };

        resultItem.appendChild(copiarBotao);
        document.getElementById('resultados-area2').appendChild(resultItem);
    });
}


//----------  Desvincular ----------
function formatar_desvincular() {
    const uuids = document.getElementById('colocar3').value.trim().split("\n").map(uuid => uuid.trim()).filter(uuid => uuid !== "");
    const cpf = document.getElementById('cpf2').value.trim();
    if (!uuids.length || !cpf) {
        alert("Por favor, preencha todos os campos.");
        return;
    }
    mostrarResultados2(uuids, cpf);
}

function mostrarResultados2(uuids, cpf) {
    const resultadosDiv = document.getElementById('resultados-area3');
    resultadosDiv.innerHTML = '';

    uuids.forEach((uuid) => {
        const jsonObj = {
            "_id": uuid,
            "operacao": "DESVINCULADO",
            "data_hora": obterDataHoraAtual(),
            "agendamento": { "uuid": uuid },
            "candidato": { "cpf": cpf }
        };
        const resultadoJson = JSON.stringify(jsonObj, null, 4);
        resultadosDesvincular.push(resultadoJson);

        const resultItem = document.createElement('div');
        resultItem.className = 'resultados-item';
        resultItem.textContent = resultadoJson;

        const copiarBotao = document.createElement('botao');
        copiarBotao.className = 'botao-copiar';
        copiarBotao.textContent = 'Copiar';
        copiarBotao.onclick = () => {
            copiarTexto(resultadoJson);
            copiarBotao.innerText = "Copiado!";
            copiarBotao.style.backgroundColor = "#264d88";
                if (!copiarBotao.clicado) {
                    contarClique3();
                    copiarBotao.clicado = true;
                }
        };

        resultItem.appendChild(copiarBotao);
        document.getElementById('resultados-area3').appendChild(resultItem);
    });
}




// Copiar e Limpar
function copiarTexto(linha) {
    navigator.clipboard.writeText(linha).then(() => {
        console.log("copiado");
    }).catch(err => {
        console.error("Erro ao copiar texto: ", err);
    });
}

function limparResultados(tipo) {
    if (tipo === 'notificacao') {
        const colocar = document.getElementById('colocar1');
        if (colocar) colocar.value = '';
        const resultado = document.getElementById('resultados-area1');
        if (resultado) resultado.innerHTML = '';
        resultadosNotificacao = [];}

    if (tipo === 'vincular') {
        const colocar = document.getElementById('colocar2');
        if (colocar) colocar.value = '';
        const resultado = document.getElementById('resultados-area2');
        if (resultado) resultado.innerHTML = '';
        const cpf = document.getElementById('cpf1');
        if (cpf) cpf.value = '';
        resultadosVincular = [];}

    if (tipo === 'desvincular') {
        const colocar = document.getElementById('colocar3');
        if (colocar) colocar.value = '';
        const resultado = document.getElementById('resultados-area3');
        if (resultado) resultado.innerHTML = '';
        const cpf = document.getElementById('cpf2');
        if (cpf) cpf.value = '';
        resultadosDesvincular = [];}

    if (tipo === 'matricula') {
        const colocar = document.getElementById('colocar4');
        if (colocar) colocar.value = '';
        const resultado = document.getElementById('resultados-area4');
        if (resultado) resultado.innerHTML = '';
        resultadosMatricula = [];}
}


function contarClique1() {
    let contador = parseInt(localStorage.getItem('totalCliques') || '0');
    contador++;
    localStorage.setItem('totalCliques', contador);
    atualizarContadorNaInterface();
}

function contarClique2() {
    let contador2 = parseInt(localStorage.getItem('totalCliques2') || '0');
    contador2++;
    localStorage.setItem('totalCliques2', contador2);
    atualizarContadorNaInterface();
}

function contarClique3() {
    let contador3 = parseInt(localStorage.getItem('totalCliques3') || '0');
    contador3++;
    localStorage.setItem('totalCliques3', contador3);
    atualizarContadorNaInterface();
}

function contarClique4() {
    let contador4 = parseInt(localStorage.getItem('totalCliques4') || '0');
    contador4++;
    localStorage.setItem('totalCliques4', contador4);
    atualizarContadorNaInterface();
}


function atualizarContadorNaInterface() {
    const elementos = document.querySelectorAll('.cartao-info-valor');
    elementos.forEach(elemento => {
        const cartao = elemento.closest('.cartao-info');
        if (cartao && cartao.querySelector('.cartao-info-titulo').textContent === 'Notificações Financeiras') {
            const total = localStorage.getItem('totalCliques') || '0';
            elemento.textContent = total;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const elementos = document.querySelectorAll('.cartao-info-titulo');
    elementos.forEach(elemento => {
        if (elemento.textContent === 'Notificações Financeiras') {
            const cartao = elemento.closest('.cartao-info');
            if (cartao) {
                const valorElemento = cartao.querySelector('.cartao-info-valor');
                if (valorElemento) {
                    const total = localStorage.getItem('totalCliques') || '0';
                    valorElemento.textContent = total;
                }
            }
        }
    });
});


function atualizarContadorNaInterface() {
    const elementos = document.querySelectorAll('.cartao-info-valor');
    elementos.forEach(elemento => {
        const cartao = elemento.closest('.cartao-info');
        if (cartao && cartao.querySelector('.cartao-info-titulo').textContent === 'Candidatos Vinculados') {
            const total = localStorage.getItem('totalCliques2') || '0';
            elemento.textContent = total;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const elementos = document.querySelectorAll('.cartao-info-titulo');
    elementos.forEach(elemento => {
        if (elemento.textContent === 'Candidatos Vinculados') {
            const cartao = elemento.closest('.cartao-info');
            if (cartao) {
                const valorElemento = cartao.querySelector('.cartao-info-valor');
                if (valorElemento) {
                    const total = localStorage.getItem('totalCliques2') || '0';
                    valorElemento.textContent = total;
                }
            }
        }
    });
});


function atualizarContadorNaInterface() {
    const elementos = document.querySelectorAll('.cartao-info-valor');
    elementos.forEach(elemento => {
        const cartao = elemento.closest('.cartao-info');
        if (cartao && cartao.querySelector('.cartao-info-titulo').textContent === 'Candidatos Desvinculados') {
            const total = localStorage.getItem('totalCliques3') || '0';
            elemento.textContent = total;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const elementos = document.querySelectorAll('.cartao-info-titulo');
    elementos.forEach(elemento => {
        if (elemento.textContent === 'Candidatos Desvinculados') {
            const cartao = elemento.closest('.cartao-info');
            if (cartao) {
                const valorElemento = cartao.querySelector('.cartao-info-valor');
                if (valorElemento) {
                    const total = localStorage.getItem('totalCliques3') || '0';
                    valorElemento.textContent = total;
                }
            }
        }
    });
});



function atualizarContadorNaInterface() {
    const elementos = document.querySelectorAll('.cartao-info-valor');
    elementos.forEach(elemento => {
        const cartao = elemento.closest('.cartao-info');
        if (cartao && cartao.querySelector('.cartao-info-titulo').textContent === 'Matrículas Enviadas') {
            const total = localStorage.getItem('totalCliques4') || '0';
            elemento.textContent = total;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const elementos = document.querySelectorAll('.cartao-info-titulo');
    elementos.forEach(elemento => {
        if (elemento.textContent === 'Matrículas Enviadas') {
            const cartao = elemento.closest('.cartao-info');
            if (cartao) {
                const valorElemento = cartao.querySelector('.cartao-info-valor');
                if (valorElemento) {
                    const total = localStorage.getItem('totalCliques4') || '0';
                    valorElemento.textContent = total;
                }
            }
        }
    });
});

// Exportar notificação
function exportarnoti(){
    if (!resultadosNotificacao || resultadosNotificacao.length === 0) {
        alert("Nenhum dado para exportar.");
        return;
    }
    const headers = [
        "_id", "operacao", "data_hora", "uuid_matricula", "cnpj",
        "situacao", "numero_cobranca", "operadora",
        "valor", "data_criacao", "data_atualizacao",
        "data_vencimento", "status_atual"
    ];
    const linhasCSV = [headers.join(",")];

    resultadosNotificacao.forEach(jsonString => {
        const obj = JSON.parse(jsonString);
        const linha = [
            obj._id,
            obj.operacao,
            obj.data_hora,
            obj.uuid_matricula,
            obj.cnpj,
            obj.financeiro.situacao,
            obj.financeiro.numero_cobranca,
            obj.financeiro.operadora,
            obj.financeiro.valor,
            obj.financeiro.data_criacao,
            obj.financeiro.data_atualizacao,
            obj.financeiro.data_vencimento,
            obj.financeiro.status_atual
        ];
        linhasCSV.push(linha.join(","));
    });
    const blob = new Blob([linhasCSV.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "notificação.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


// Exportar matricula
function exportarmatri(){
    if (!resultadosMatricula || resultadosMatricula.length === 0) {
        alert("Nenhum dado para exportar.");
        return;
    }
    const headers = [
        "_id", "operacao", "data_hora", "matricula_uuid", "candidato_nome",
        "cpf", "renach", "situacao", "servicoCodigo", "cnpj"
    ];
    const linhasCSV = [headers.join(",")];

    resultadosMatricula.forEach(jsonString => {
        const obj = JSON.parse(jsonString);
        const linha = [
            obj._id,
            obj.operacao,
            obj.data_hora,
            obj.matricula.uuid,
            obj.matricula.candidato.nome,
            obj.matricula.candidato.cpf,
            obj.matricula.detran.renach,
            obj.matricula.detran.situacao,
            obj.matricula.detran.servicoCodigo,
            obj.cfc.cnpj
        ];
        linhasCSV.push(linha.join(","));
    });
    const blob = new Blob([linhasCSV.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "resultados.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Exportar vincular
function exportarvinc(){
    if (!resultadosVincular || resultadosVincular.length === 0) {
        alert("Nenhum dado para exportar.");
        return;
    }
    const headers = [
        "_id", "operacao", "data_hora", "uuid", "cpf"
    ];
    const linhasCSV = [headers.join(",")];

    resultadosVincular.forEach(jsonString => {
        const obj = JSON.parse(jsonString);
        const linha = [
            obj._id,
            obj.operacao,
            obj.data_hora,
            obj.agendamento.uuid,
            obj.candidato.cpf
        ];
        linhasCSV.push(linha.join(","));
    });
    const blob = new Blob([linhasCSV.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "resultados.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Exportar desvincular
function exportardesvinc(){
    if (!resultadosDesvincular || resultadosDesvincular.length === 0) {
        alert("Nenhum dado para exportar.");
        return;
    }
    const headers = [
        "_id", "operacao", "data_hora", "uuid", "cpf"
    ];
    const linhasCSV = [headers.join(",")];

    resultadosDesvincular.forEach(jsonString => {
        const obj = JSON.parse(jsonString);
        const linha = [
            obj._id,
            obj.operacao,
            obj.data_hora,
            obj.agendamento.uuid,
            obj.candidato.cpf
        ];
        linhasCSV.push(linha.join(","));
    });
    const blob = new Blob([linhasCSV.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "resultados.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};



function mostrar(secaoId) {
    document.querySelectorAll('section').forEach(sec => {
        sec.classList.remove('active');
    });
    const ativa = document.getElementById(secaoId);
    if (ativa) {
        ativa.classList.add('active');
    }
  }

window.onload = function() {
const secaoAtiva = localStorage.getItem('ativaSecao');
if (secaoAtiva) {
    document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
    const ativa = document.getElementById(secaoAtiva);
    if (ativa) ativa.classList.add('active');
    localStorage.removeItem('ativaSecao');
}
};


function obterDataHoraAtual() {
    const now = new Date();
    const options = { 
        timeZone: 'America/Sao_Paulo', 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit'
    };
    let dataHora = now.toLocaleString('pt-BR', options).replace(',', '');
    let [data, hora] = dataHora.split(' ');
    let [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia} ${hora}`;
}

// Extensão acesso rapido api
const estilo = document.createElement('style');
estilo.textContent = `
  .seta-lateral {
    position: fixed;
    right: 0;
    top: 45%;
    width: 20px;
    height: 100px;
    background-color: rgba(199, 199, 199, 0.45);
    border-radius: 5px 0 0 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 999;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.4);
  }
  
  .seta-lateral::before {
    content: '◀';
    color: #333;
    font-size: 16px;
    transition: transform 0.3s;
  }
  
  .seta-lateral.aberto::before {
    transform: rotate(180deg);
    color: #c4404b;
  }
  
  .iframe-lateral {
    position: fixed;
    right: -35%;
    top: 0;
    width: 31%;
    height: 100%;
    background-color: white;
    z-index: 998;
    box-shadow: -3px 0 10px rgba(0, 0, 0, 0.2);
    transition: right 0.4s ease;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.4);
  }
  
  .iframe-lateral.aberto {
    right: 0;
  }
  
  .conteudo-principal {
    transition: margin-left 0.4s ease;
    margin-right: 0;
  }
  
  .conteudo-principal.deslocado {
    margin-right: 30%;
    margin-left: 0%;
  }
`;
document.head.appendChild(estilo);
function adicionarIframeLateral() {
  const setaLateral = document.createElement('div');
  setaLateral.className = 'seta-lateral';
  document.body.appendChild(setaLateral);
  const iframeLateral = document.createElement('div');
  iframeLateral.className = 'iframe-lateral';
  iframeLateral.innerHTML = '<iframe src="https://teleaulaapi-prod.renova.app.br/swagger/index.html" style="width:100%; height:100%; border:none;"></iframe>';
  document.body.appendChild(iframeLateral);
  const conteudosPrincipais = document.querySelectorAll('.container, #conteudo');
  conteudosPrincipais.forEach(el => el.classList.add('conteudo-principal'));
  setaLateral.addEventListener('click', function() {
    const iframeAberto = iframeLateral.classList.toggle('aberto');
    setaLateral.classList.toggle('aberto');
    conteudosPrincipais.forEach(el => {
        el.classList.toggle('deslocado', iframeAberto);
        const menuLateral = document.querySelector(".menu-lateral-inicio");
        const transformAtual = getComputedStyle(menuLateral).transform;
        if (transformAtual === "none" || transformAtual === "matrix(1, 0, 0, 1, 0, 0)") {
        menuLateral.style.transform = "translateX(-100%)";
        } else {
        menuLateral.style.transform = "translateX(0%)";
        }
      });
  });
}
document.addEventListener('DOMContentLoaded', adicionarIframeLateral);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  adicionarIframeLateral();
}


// Botão token
document.addEventListener('DOMContentLoaded', () => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '1%';
    container.style.right = '0px';
    container.style.zIndex = '1000';
    container.style.backgroundColor = 'transparent';
    container.style.padding = '0';
    container.style.border = 'none';
    container.style.borderRadius = '0';
    container.style.fontFamily = 'Arial, sans-serif';

    const botaoToken = document.createElement('button');
    botaoToken.textContent = 'Token';
    botaoToken.style.padding = '6px 10px';
    botaoToken.style.marginRight = '8px';
    botaoToken.style.cursor = 'pointer';
    botaoToken.style.backgroundColor = 'rgba(135, 25, 25, 0.62)';
    botaoToken.style.color = '#fff';
    botaoToken.style.border = 'none';
    botaoToken.style.borderRadius = '8px';
    botaoToken.style.transition = 'background-color 0.3s ease, transform 0.1s ease';
    botaoToken.style.fontSize = '14px';
    botaoToken.style.fontWeight = 'bold';


    const inputToken = document.createElement('input');
    inputToken.type = 'text';
    inputToken.placeholder = 'Insira o token';
    inputToken.style.padding = '6px';
    inputToken.style.display = 'none';
    inputToken.style.marginRight = '8px';
    inputToken.style.width = 'calc(100% - 100px)';
    inputToken.style.borderRadius = '8px';

    const botaoSalvar = document.createElement('button');
    botaoSalvar.textContent = 'Salvar';
    botaoSalvar.style.padding = '6px 10px';
    botaoSalvar.style.marginRight = '8px';
    botaoSalvar.style.cursor = 'pointer';
    botaoSalvar.style.backgroundColor = 'rgba(135, 25, 25, 0.62)';
    botaoSalvar.style.color = '#fff';
    botaoSalvar.style.border = 'none';
    botaoSalvar.style.borderRadius = '8px';
    botaoSalvar.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    botaoSalvar.style.transition = 'background-color 0.3s ease, transform 0.1s ease';
    botaoSalvar.style.fontSize = '14px';
    botaoSalvar.style.fontWeight = 'bold';
    botaoSalvar.style.display = 'none';
    botaoSalvar.style.cursor = 'pointer';

    const info = document.createElement('p');
    info.textContent = 'Salva localmente. Caso queira editar posteriormente clique com botão direito sobre o botão token!';
    info.style.fontSize = '12px';
    info.style.color = 'rgba(233, 228, 228, 0.62)';
    info.style.marginTop = '10px';
    info.style.fontStyle = 'italic';
    info.style.userSelect = 'none';
    info.style.display = 'none';

    container.appendChild(botaoToken);
    container.appendChild(inputToken);
    container.appendChild(botaoSalvar);
    container.appendChild(info);

    document.body.appendChild(container);

    function mostrarEdicao() {
        const tokenSalvo = localStorage.getItem('meu_token') || '';
        inputToken.value = tokenSalvo;
        inputToken.style.display = 'inline-block';
        botaoSalvar.style.display = 'inline-block';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '8px';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.84)';
        container.style.padding = '10px 15px';
        info.style.display = 'block';
        botaoToken.style.display = 'none';
    }

    function esconderEdicao() {
        inputToken.style.display = 'none';
        botaoSalvar.style.display = 'none';
        info.style.display = 'none'; 
        botaoToken.style.display = 'inline-block';
        container.style.backgroundColor = 'transparent';
        container.style.padding = '0';
        container.style.border = 'none';
        container.style.borderRadius = '0';
    }

    botaoToken.addEventListener('click', () => {
        const tokenSalvo = localStorage.getItem('meu_token');

        if (!tokenSalvo) {
            mostrarEdicao();
        } else {
            navigator.clipboard.writeText(tokenSalvo).then(() => {
                botaoToken.textContent = 'Copiado!';
                botaoToken.style.backgroundColor = 'rgb(135, 25, 25)';
                setTimeout(() => {
                botaoToken.textContent = 'Token';
                botaoToken.style.backgroundColor = 'rgba(135, 25, 25, 0.62)';
                }, 1500);
            });
        }
    });

    botaoToken.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        mostrarEdicao();
    });

    botaoSalvar.addEventListener('click', () => {
        const token = inputToken.value.trim();
        if (token) {
            localStorage.setItem('meu_token', token);
            esconderEdicao();
            botaoToken.textContent = 'Salvo!';
            botaoToken.style.backgroundColor ='rgba(33, 157, 105, 0.93)';
            setTimeout(() => {
                botaoToken.style.color = '#fff';
                botaoToken.textContent = 'Token';
                botaoToken.style.padding = '6px 10px';
                botaoToken.style.marginRight = '8px';
                botaoToken.style.cursor = 'pointer';
                botaoToken.style.backgroundColor = 'rgba(135, 25, 25, 0.62)';
                botaoToken.style.border = 'none';
                botaoToken.style.borderRadius = '8px';
                botaoToken.style.transition = 'background-color 0.3s ease, transform 0.1s ease';
                botaoToken.style.fontSize = '14px';
                botaoToken.style.fontWeight = 'bold';
              }, 1000);
        } else {
            alert('Por favor, insira um token válido.');
        }
    });
});
