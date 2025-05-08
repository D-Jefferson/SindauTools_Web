let resultados = [];
verificarlogado()

//---------- Notificação ----------
function formatar_notificacao() {
    try {
        const texto = document.getElementById('colocar').value.trim();
        const linhas = texto.split("\n");
        resultados = [];
        document.getElementById('resultados-area').innerHTML = '';

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
                    resultados.push(resultadoJson);

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
                        copiarBotao.style.pointerEvents = "none";
                        contarClique1();
                    };

                    resultItem.appendChild(copiarBotao);
                    document.getElementById('resultados-area').appendChild(resultItem);
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
        const texto = document.getElementById('colocar').value.trim();
        const linhas = texto.split("\n");
        resultados = [];
        document.getElementById('resultados-area').innerHTML = '';

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
                    resultados.push(resultadoJson);

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
                        copiarBotao.style.pointerEvents = "none";
                        contarClique4();
                    };

                    resultItem.appendChild(copiarBotao);
                    document.getElementById('resultados-area').appendChild(resultItem);
                } catch (e) {
                    console.error('Erro ao processar a linha:', linha, e);
                }
            }
        });
    } catch (e) {
        console.error('Erro ao formatar o texto:', e);
    }
}


//----------  (Des)Vincular ----------
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

function formatar_vincular() {
    const uuids = document.getElementById('colocar').value.trim().split("\n").map(uuid => uuid.trim()).filter(uuid => uuid !== "");
    const cpf = document.getElementById('cpf').value.trim();
    const operacao = document.getElementById('operacao').value;
    if (!uuids.length || !cpf) {
        alert("Por favor, preencha todos os campos.");
        return;
    }
    mostrarResultados(uuids, cpf, operacao);
}

function mostrarResultados(uuids, cpf, operacao) {
    const resultadosDiv = document.getElementById('resultados-area');
    resultadosDiv.innerHTML = '';

    uuids.forEach((uuid) => {
        const jsonObj = {
            "_id": uuid,
            "operacao": operacao,
            "data_hora": obterDataHoraAtual(),
            "agendamento": { "uuid": uuid },
            "candidato": { "cpf": cpf }
        };
        const resultadoJson = JSON.stringify(jsonObj, null, 4);
        resultados.push(resultadoJson);

        const resultItem = document.createElement('div');
        resultItem.className = 'resultados-item';
        resultItem.textContent = resultadoJson;

        const copiarBotao = document.createElement('botao');
        copiarBotao.className = 'botao-copiar';
        copiarBotao.textContent = 'Copiar';
        copiarBotao.onclick = () => {
            copiarTexto(resultadoJson);
            if (operacao === "VINCULADO") {
                contarClique2();
            } else if (operacao === "DESVINCULADO") {
                contarClique3();}
            copiarBotao.innerText = "Copiado!";
            copiarBotao.style.backgroundColor = "#264d88";
            copiarBotao.style.pointerEvents = "none";
        };

        resultItem.appendChild(copiarBotao);
        document.getElementById('resultados-area').appendChild(resultItem);
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

function limparResultados() {
    document.getElementById('colocar').value = '';
    resultados = [];
    document.getElementById('resultados-area').innerHTML = '';
    document.getElementById('cpf').value = '';
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
