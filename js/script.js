// Algoritmo Shunting-yard
import { tokenizar } from './tokenizar.js'
import { converterParaRpn, calcularRPN } from './converterParaRpn.js';

// Referencia aos elementos da tela
const teclas = document.querySelectorAll('#teclado button');
const display = document.getElementById('display');

const tokens = [];

let houveErro = false;

// addEventListener captura o clique
// dataset.value obtém o valor da tecla clicada
for (let i = 0; i < teclas.length; i++) {
    teclas[i].addEventListener('click', function() {
        const valor = teclas[i].dataset.value;

        if (houveErro && (valor === 'C' || valor === '⌫')) {
            display.value = '0';
            tokens.length = 0;
            houveErro = false;
        }

        // Função CLEAR
        else if (valor === 'C') {
            display.value = '0';
            tokens.length = 0;
        } // Apagar a ultima e dar pop na pilha
        else if (valor === 'backspace' || valor === '⌫') {
            display.value = display.value.slice(0, -1);
            tokens.pop();
        }
        else if (valor === '=') {
            try {
                const tokensConvertidos = tokenizar(tokens); // Retorna resultado {12, +, 34}

                // Verifica se o último token é operador. Ex:  {12, +} removeria o +
                const ultimoToken = tokensConvertidos[tokensConvertidos.length - 1];

                if (['+', '-', 'x', '÷', '/'].includes(ultimoToken)) {
                    tokensConvertidos.pop();
                }
                
                // Só verifica depois do pop, quando a lista já tem o tamanho final.
                if (tokensConvertidos.length === 0) {
                    display.value = 0;
                    tokens.length = 0;
                    return;
                }
                
                // Converte para Padrão Polonês
                const rpn = converterParaRpn(tokensConvertidos);
                const resultado = calcularRPN(rpn);

                display.value = String(resultado);
                tokens.length = 0;
                tokens.push(String(resultado)); // Exibe o resultado
                // Captura erro
            } catch (erro) {
                houveErro = true;
                display.value = erro.message;
                tokens.length = 0;
            }
            
        } else {
            // Se for zero substitui pelo valor pressionado
            if (display.value === '0' && valor !== '.') {
                display.value = valor;
            } else {
                display.value += valor; // Se não, apenas add valor.
            }

            tokens.push(valor);
        }
        console.log(tokens);
    });
}