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

                    const enviar = document.createElement('botao2');
                    enviar.className = 'botao-copiar';
                    enviar.textContent = 'Enviar';
                    enviar.onclick = () => {
                        fetch('https://teleaulaapi-prod.renova.app.br/api/Notificacao/Financeiro', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${window.tokenGlobal}`, 
                            },
                            body: JSON.stringify(jsonObj)
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(response.status);
                            }
                            return response.json();
                        })
                        .then(data => {
                            enviar.textContent = "Enviando";
                            enviar.style.backgroundColor = 'rgba(37, 109, 43, 0.97)';
                            console.log(data);
                            enviar.style.pointerEvents = 'none';
                            enviar.style.padding = '2px 40px';
                            setTimeout(() => {enviar.textContent = "Enviando.";},750);
                            setTimeout(() => {enviar.textContent = "Enviando..";},1500);
                            setTimeout(() => {enviar.textContent = "Enviando...";},2250);
                            setTimeout(() => {enviar.textContent = "Enviado!";},3000);
                            if (!enviar.clicado) {
                                contarClique1();
                                enviar.clicado = true;
                            }
                            const botoes = document.querySelectorAll('.botao-copiar');
                            botoes.forEach(btn => {
                                btn.disabled = true;
                                btn.style.opacity = '0.4';
                            });
                            setTimeout(() => {
                                botoes.forEach(btn => {
                                    if (btn.textContent !== 'Enviado!') {
                                        btn.disabled = false;
                                        btn.style.opacity = '1';
                                    }
                                });
                            }, 3000);
                        })
                        .catch(error => {
                            console.error("Erro no envio:", error);
                            enviar.textContent = `Erro ${error.message}`;
                            enviar.style.backgroundColor = 'red';
                            enviar.style.pointerEvents = 'none';
                            enviar.style.opacity = '0.4';
                            enviar.style.padding = '2px 30px';
                        });
                    };
                    
                    resultItem.appendChild(enviar);
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



// Botão token
window.tokenGlobal = '';
window.obterToken = function() {
    return sessionStorage.getItem('meu_token') || '';
};
window.definirToken = function(novoToken) {
    sessionStorage.setItem('meu_token', novoToken);
    window.tokenGlobal = novoToken;
};
document.addEventListener('DOMContentLoaded', () => {
    window.tokenGlobal = sessionStorage.getItem('meu_token') || '';
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

    const botaoToken = document.createElement('button1');
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
    window.inputToken = inputToken;

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

    const info = document.createElement('p');
    info.textContent = 'Salvo apenas na sessão atual. Ao fechar o navegador, será perdido!';
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
        const tokenSalvo = sessionStorage.getItem('meu_token') || '';
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
        mostrarEdicao();
    });

    botaoSalvar.addEventListener('click', () => {
        const token = inputToken.value.trim();
        if (token) {
            sessionStorage.setItem('meu_token', token);
            window.tokenGlobal = token;
            esconderEdicao();
            botaoToken.textContent = 'Salvo!';
            botaoToken.style.backgroundColor = 'rgba(33, 157, 105, 0.93)';
            console.log(window.tokenGlobal); 
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


async function getapi() {
    const cpfInput = document.getElementById("puxaruuid");
    const cpf = cpfInput.value;

    fetch(`https://teleaulaapi-prod.renova.app.br/api/Matricula/BuscarMatricula?cpf=${cpf}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.tokenGlobal}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("Dados da matrícula:", data);
        const aparecer = document.createElement("div");
        aparecer.style.position = "fixed";
        aparecer.style.top = "0";
        aparecer.style.left = "0";
        aparecer.style.width = "100vw";
        aparecer.style.height = "100vh";
        aparecer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        aparecer.style.backdropFilter = "blur(6px)";
        aparecer.style.display = "flex";
        aparecer.style.justifyContent = "center";
        aparecer.style.alignItems = "center";
        aparecer.style.zIndex = "10000";
        aparecer.style.opacity = "0";
        aparecer.style.transition = "opacity 0.3s ease-out";

        const frente = document.createElement("div");
        frente.style.backgroundColor = "#2a2a2a";
        frente.style.padding = "0";
        frente.style.borderRadius = "12px";
        frente.style.maxWidth = "90%";
        frente.style.maxHeight = "85%";
        frente.style.width = "700px";
        frente.style.overflowY = "auto";
        frente.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)";
        frente.style.border = "1px solid #404040";
        frente.style.transform = "translateY(-20px)";
        frente.style.transition = "transform 0.3s ease-out";
        frente.style.color = "#ffffff";

        const header = document.createElement("div");
        header.style.padding = "24px 32px";
        header.style.background = "linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)";
        header.style.borderBottom = "3px solid #dc2626";
        header.style.borderRadius = "12px 12px 0 0";
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "center";

        const titulo = document.createElement("h2");
        titulo.textContent = "DADOS COLETADOS DA RENOVA";
        titulo.style.margin = "0";
        titulo.style.fontSize = "18px";
        titulo.style.fontWeight = "600";
        titulo.style.color = "#ffffff";
        titulo.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        titulo.style.letterSpacing = "0.5px";
        titulo.style.textTransform = "uppercase";

        const btnX = document.createElement("button");
        btnX.innerHTML = "×";
        btnX.style.background = "none";
        btnX.style.border = "none";
        btnX.style.fontSize = "24px";
        btnX.style.cursor = "pointer";
        btnX.style.color = "#9ca3af";
        btnX.style.padding = "4px 8px";
        btnX.style.borderRadius = "6px";
        btnX.style.transition = "all 0.2s ease";
        btnX.style.lineHeight = "1";

        btnX.onmouseover = () => {
            btnX.style.backgroundColor = "#404040";
            btnX.style.color = "#ffffff";
        };
        btnX.onmouseout = () => {
            btnX.style.backgroundColor = "transparent";
            btnX.style.color = "#9ca3af";
        };

        const conteudo = document.createElement("div");
        conteudo.style.padding = "32px";

        const pre = document.createElement("pre");
        pre.style.whiteSpace = "pre-wrap";
        pre.style.fontFamily = "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace";
        pre.style.fontSize = "13px";
        pre.style.lineHeight = "1.6";
        pre.style.backgroundColor = "#1a1a1a";
        pre.style.border = "1px solid #404040";
        pre.style.borderRadius = "8px";
        pre.style.padding = "20px";
        pre.style.margin = "0";
        pre.style.maxHeight = "400px";
        pre.style.overflowY = "auto";
        pre.style.color = "#e5e7eb";
        pre.style.boxShadow = "inset 0 2px 4px rgba(0, 0, 0, 0.3)";

        const footer = document.createElement("div");
        footer.style.display = "flex";
        footer.style.justifyContent = "flex-end";
        footer.style.gap = "12px";
        footer.style.padding = "24px 32px";
        footer.style.backgroundColor = "#1f1f1f";
        footer.style.borderTop = "1px solid #404040";
        footer.style.borderRadius = "0 0 12px 12px";

        const info = document.createElement("div");
        info.textContent = "Observação: Os dados são enviados diretamente da API oficial da Renova, por meio de requisições autenticadas, conforme autorização do gestor Nadson Hugo.";
        info.style.padding = "8px 24px";
        info.style.fontSize = "14px";
        info.style.fontWeight = "500";
        info.style.borderRadius = "8px";
        info.style.border = "none";
        info.style.color = "#ffffff";
        info.style.cursor = "pointer";
        info.style.transition = "all 0.2s ease";
        info.style.fontStyle = 'italic';
        info.style.fontSize = '12px';

        function fecharModal() {
            aparecer.style.opacity = "0";
            frente.style.transform = "translateY(-20px)";
            setTimeout(() => {
                if (document.body.contains(aparecer)) {
                    document.body.removeChild(aparecer);
                    document.body.style.overflow = "";
                }
            }, 300);
        }

        btnX.onclick = fecharModal;

        aparecer.onclick = (e) => {
            if (e.target === aparecer) {
                fecharModal();
            }
        };

        const escapeHandler = function(e) {
            if (e.key === 'Escape' && document.body.contains(aparecer)) {
                fecharModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        const texto = JSON.stringify(data, null, 2);
        let i = 0;

        function digitar() {
            if (i < texto.length) {
                pre.textContent += texto.charAt(i);
                i++;
                setTimeout(digitar, 0.1);
            } else {
                console.log("erro")
            }
        }

        header.appendChild(titulo);
        header.appendChild(btnX);
        conteudo.appendChild(pre);
        footer.appendChild(info);
        frente.appendChild(header);
        frente.appendChild(conteudo);
        frente.appendChild(footer);
        aparecer.appendChild(frente);

        document.body.appendChild(aparecer);
        document.body.style.overflow = "hidden";

        requestAnimationFrame(() => {
            aparecer.style.opacity = "1";
            frente.style.transform = "translateY(0)";
            setTimeout(digitar, 500);
        });


    })
    .catch(error => {
        console.error("Erro ao buscar matrícula:", error);
    });
}


