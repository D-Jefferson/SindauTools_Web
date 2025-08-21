let validCpfs = [];
let invalidCpfs = [];

function cleanCpf(cpf) {
    return cpf.replace(/[^0-9]/g, '');
}

function validateCpf(cpf) {
    cpf = cleanCpf(cpf);
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf[i]) * (10 - i);
    }
    let firstDigit = (sum * 10) % 11;
    if (firstDigit === 10) firstDigit = 0;
    if (firstDigit !== parseInt(cpf[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf[i]) * (11 - i);
    }
    let secondDigit = (sum * 10) % 11;
    if (secondDigit === 10) secondDigit = 0;
    if (secondDigit !== parseInt(cpf[10])) return false;
    
    return true;
}

function extrairCPFs(line) {
    const cpfs = [];
    const cpfRegex = /\b\d{3}\.?\d{3}\.?\d{3}[-.]?\d{2}\b/g;
    
    let match;
    while ((match = cpfRegex.exec(line)) !== null) {
        const potentialCpf = cleanCpf(match[0]);
        if (potentialCpf.length === 11) {
            cpfs.push(potentialCpf);
        }
    }

    if (cpfs.length === 0) {
        const numbers = line.replace(/[^0-9]/g, '');
        for (let i = 0; i <= numbers.length - 11; i++) {
            const potential = numbers.substr(i, 11);
            if (potential.length === 11) {
                cpfs.push(potential);
                break;
            }
        }
    }
    
    return cpfs;
}

function formatCpfs() {
    const input = document.getElementById('cpfInput').value;
    
    if (!input.trim()) {
        aviso('Por favor, insira pelo menos um CPF.', 'error');
        return;
    }

    validCpfs = [];
    invalidCpfs = [];
    let lines = [];

    if (input.includes('\n')) {
        lines = input.split('\n').filter(line => line.trim() !== '');
    } else {
        lines = input.split(/\d+\s+/).filter(line => line.trim() !== '');
        lines.push(input);
    }
    
    lines.forEach(line => {
        const foundCpfs = extrairCPFs(line.trim());
        
        foundCpfs.forEach(cpf => {
            if (validateCpf(cpf)) {
                if (!validCpfs.includes(cpf)) {
                    validCpfs.push(cpf);
                }
            } else {
                if (!invalidCpfs.includes(cpf)) {
                    invalidCpfs.push(cpf);
                }
            }
        });
    });
    updateResults();
    updateStats();
    showResults();
}

function updateResults() {
    const validList = document.getElementById('validList');
    const invalidList = document.getElementById('invalidList');

    if (validCpfs.length > 0) {
        validList.innerHTML = validCpfs.map(cpf => 
            `<div class="valid-cpf">${cpf}</div>`
        ).join('');
    } else {
        validList.innerHTML = '<div>Nenhum CPF válido encontrado.</div>';
    }

    if (invalidCpfs.length > 0) {
        invalidList.innerHTML = invalidCpfs.map(cpf => 
            `<div class="invalid-cpf">${cpf}</div>`
        ).join('');
    } else {
        invalidList.innerHTML = '<div>Nenhum</div>';
    }
}

function updateStats() {
    const total = validCpfs.length + invalidCpfs.length;
    document.getElementById('validCount').textContent = validCpfs.length;
    document.getElementById('invalidCount').textContent = invalidCpfs.length;
}

function showResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.style.display = 'block';
    
    const total = validCpfs.length + invalidCpfs.length;
    if (total > 0) {
        aviso(`Processamento concluído: ${validCpfs.length} válidos, ${invalidCpfs.length} inválidos.`, 'success');
    } else {
        aviso('Nenhum CPF foi encontrado no texto inserido.', 'info');
    }
}

function aviso(message, type = 'info') {
    const alertDiv = document.getElementById('resultAlert');
    const messageSpan = document.getElementById('resultMessage');
    
    alertDiv.className = `alert ${type}`;
    messageSpan.textContent = message;
    alertDiv.style.display = 'block';
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 5000);
}

function clearInput() {
    document.getElementById('cpfInput').value = '';
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('resultAlert').style.display = 'none';
    validCpfs = [];
    invalidCpfs = [];
    updateStats();
}

function copyToClipboard() {
    if (validCpfs.length === 0) {
        aviso('Nenhum CPF válido para copiar.', 'error');
        return;
    }
    
    const cpfList = validCpfs.join('\n');
    navigator.clipboard.writeText(cpfList).then(() => {
        aviso(`${validCpfs.length} CPFs válidos copiados para a área de transferência.`, 'success');
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = cpfList;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        aviso(`${validCpfs.length} CPFs válidos copiados para a área de transferência.`, 'success');
    });
}

function exportCsv() {
    if (validCpfs.length === 0 && invalidCpfs.length === 0) {
        aviso('Nenhum dado para exportar.', 'error');
        return;
    }
    
    let csvContent = 'CPF,Status,Formatado\n';
    
    validCpfs.forEach(cpf => {
        csvContent += `${cpf},Válido}\n`;
    });
    
    invalidCpfs.forEach(cpf => {
        csvContent += `${cpf},Inválido,N/A\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cpfs_processados_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    aviso('Arquivo CSV exportado com sucesso.', 'success');
}