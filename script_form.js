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