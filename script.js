const teclas = document.querySelectorAll('#teclado button');
const display = document.getElementById('display');
const mensagemErro = document.getElementById('mensagemErro');

let tempExpressao = '';          // número que está sendo digitado
let mostrandoResultado = false;  // true logo após o '='
let houveErro = false;           // true enquanto o display mostra 'Erro'
const expressao = [];            // números e operadores já confirmados
const operadores = ['+', '-', 'x', '/', '÷'];

for (let i = 0; i < teclas.length; i++) {
    teclas[i].addEventListener('click', function() {
        const digitado = this.dataset.value;
        console.log(digitado);

        const ehLimpar = digitado === 'C';
        const ehApagar = digitado === 'backspace' || digitado === '⌫';

        // Depois de um erro, qualquer tecla começa do zero
        if (houveErro) {
            limpaTudo();
            if (ehLimpar || ehApagar) {
                return;
            }
        }

        // Função CLEAR
        if (ehLimpar) {
            limpaTudo();
            return;
        }

        // Apaga o último caractere digitado
        if (ehApagar) {
            if (mostrandoResultado) {
                limpaTudo();
            } else if (tempExpressao !== '') {
                tempExpressao = tempExpressao.slice(0, -1);
            } else if (expressao.length > 0) {
                expressao.pop();                        // remove o último item (operador, '(' ou ')')
                if (!isNaN(expressao.at(-1))) {         // sobrou um número no fim?
                    tempExpressao = expressao.pop();    // então volta a editá-lo
                }
            }
            atualizaDisplay();
            return;
        }

        // Realizar o cálculo
        if (digitado === '=') {
            if (!numeroCompleto() && expressao.at(-1) !== ')') {
                return;
            }

            if (tempExpressao !== '') {
                expressao.push(tempExpressao);
            }

            const resultado = calcula(listaConvertida(expressao));

            console.log(resultado);
            expressao.length = 0;

            // Divisão por zero (NaN) ou estouro (Infinity)
            if (!Number.isFinite(resultado)) {
                tempExpressao = '';
                houveErro = true;
                mostraNoDisplay('Erro');
                mensagemErro.textContent = 'Expressão inválida';
                mensagemErro.hidden = false;
                return;
            }

            // Guarda o resultado para continuar a conta
            tempExpressao = String(resultado);
            mostrandoResultado = true;
            mostraNoDisplay(resultado);
            return;
        }

        if (digitado === '(' || digitado === ')') {
            // '(' não pode vir colado em um número nem em ')'
            if (mostrandoResultado) {
                tempExpressao = '';
            }

            if (digitado === ')' && tempExpressao !== '' && !numeroCompleto()) {
                return;
            }

            if (digitado === '(' && (tempExpressao !== '' || expressao.at(-1) === ')')) {
                return;
            }

            if (tempExpressao !== '') {
                expressao.push(tempExpressao);
            }
            expressao.push(digitado);
            tempExpressao = '';
        } else if (operadores.includes(digitado)) {
            if (numeroCompleto()) {
                expressao.push(tempExpressao);
                expressao.push(digitado);
                tempExpressao = '';
            } else if (tempExpressao === '' && expressao.at(-1) === ')') { // Operador depois ')', ex.: (2+3) - 1
                expressao.push(digitado);
            } else if (digitado === '-' && tempExpressao === '') {
                // '-' sem número antes é o sinal de um número negativo
                tempExpressao = '-';
            } else {
                return;
            }
        } else {
            // Dígito ou ponto logo após um resultado começa um número novo
            if (mostrandoResultado) {
                tempExpressao = '';
            }

            // Não aceita número colado em ')'
            if (expressao.at(-1) === ')') {
                return;
            }

            // Só um ponto por número
            if (digitado === '.' && tempExpressao.includes('.')) {
                return;
            }

            tempExpressao += digitado;
        }

        mostrandoResultado = false;
        atualizaDisplay();
    });
}

// O número em digitação pode ser usado numa conta?
// ('' , '-' e '.' ainda não são números)
function numeroCompleto() {
    return tempExpressao !== '' && !isNaN(Number(tempExpressao));
}

function limpaTudo() {
    expressao.length = 0;
    tempExpressao = '';
    mostrandoResultado = false;
    houveErro = false;
    mensagemErro.hidden = true;
    atualizaDisplay();
}

// Mostra a expressão inteira, ou '0' se estiver vazia
function atualizaDisplay() {
    const texto = expressao.join('') + tempExpressao;
    mostraNoDisplay(texto === '' ? '0' : texto);
}

function mostraNoDisplay(valor) {
    if ('value' in display) {
        display.value = valor;
    } else {
        display.textContent = valor;
    }
}

function listaConvertida(expressao) {
    const listaConvertidaNumero = expressao.map(item => {
        if (operadores.includes(item)) {
            return item;
        }
        const numero = Number(item);
        return isNaN(numero) ? item : numero;
    });

    return listaConvertidaNumero;
}

// Varredura para identificar os operadores e suas posições:
function precedencia(expressao) {
    const posicao = [];

    const precedencias = {
        '+': 1,
        '-': 1,
        'x': 2,
        '/': 2,
        '÷': 2
    };

    // Varre a expressão:
    for (let i = 0; i < expressao.length; i++) {
        if (operadores.includes(expressao[i])) {
            posicao.push({
                operador: expressao[i],
                indice: i,
                peso: precedencias[expressao[i]]
            });
        }
    }

    // Ordena por precedência, considera o peso e preserva a ordem de chegada
    const ordenada = posicao.toSorted(
        (a, b) => b.peso - a.peso
    );

    return ordenada;
}

function calcula(listaConvertidaNumero) {

    for (let i = 0; i < listaConvertidaNumero.length; i++) {
        if (listaConvertidaNumero[i] === ')') {
            // Percorre de trás para frente:
            const abre = listaConvertidaNumero.lastIndexOf('(', i);
            if (abre === -1) {
                return NaN; // Basicamente teve o fecha e não teve uma abertura -> Implica em gerar erro
            }

            const dentro = listaConvertidaNumero.slice(abre + 1, i);
            listaConvertidaNumero.splice(abre, i - abre + 1, calcula(dentro));
            i = abre;
        }
    }

    const ordenada = precedencia(listaConvertidaNumero);

    for (let i = 0; i < ordenada.length; i++) {
        const operadorAtual = ordenada[i].operador;
        const indice = ordenada[i].indice;

        const a = listaConvertidaNumero[indice - 1];
        const b = listaConvertidaNumero[indice + 1];

        let resultado;

        switch (operadorAtual) {
            case '+':
                resultado = soma(a, b);
                break;
            case '-':
                resultado = subtracao(a, b);
                break;
            case 'x':
                resultado = multiplicacao(a, b);
                break;
            case '/':
            case '÷':
                resultado = divisao(a, b);
                break;
        }

        // Troca (a, operador, b) = resultado
        listaConvertidaNumero.splice(indice - 1, 3, resultado);

        // Lista fica 2 posições menor: Então move os elementos que estão à direita do operadores operado.
        for (let j = i + 1; j < ordenada.length; j++) {
            if (ordenada[j].indice > indice) {
                ordenada[j].indice -= 2;
            }
        }
    }

    return listaConvertidaNumero[0];
}

function soma(a, b) {
    return a + b;
}

function subtracao(a, b) {
    return a - b;
}

function multiplicacao(a, b) {
    return a * b;
}

function divisao(a, b) {

    if (b === 0) {
        console.log('Divisão por Zero');
        return NaN;
    }

    return a / b;
}