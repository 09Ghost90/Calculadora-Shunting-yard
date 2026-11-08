function precedencia(operador) {

    // Encontrar ( empilhe e ao encontrar ) retire operadores até encontrar a abertura novamente
    if (operador === 'x' || operador === '/' || operador === '÷' || operador === '%')
        return 2;
    if (operador === '+' || operador === '-') {
        return 1;
    }

    return 0;
}

export function converterParaRpn(tokensConvertidos) {
    const pilhaOperadores = [];
    const saida = [];

    for (let i = 0; i < tokensConvertidos.length; i++) {
        const token = tokensConvertidos[i];

        // Número: vai direto para a saída
        if (!isNaN(Number(token)) && token !== '') {
            saida.push(token);
        }
        
        // Abre parêntese: só empilha
        else if (token === '(') {
            pilhaOperadores.push(token);
        }
        
        // Fecha parêntese: desempilha tudo até achar o '('
        else if (token === ')') {
            while (
                pilhaOperadores.length > 0 &&
                pilhaOperadores[pilhaOperadores.length -1] !== ('(')
            ) {
                saida.push(pilhaOperadores.pop());
            }
            pilhaOperadores.pop(); // Descarta o '(' (ele não vai para a saída)
        }

        // Operadores Gerais
        else {
            // Enquanto a pilha tiver elementos E a precedência do operador
            // no topo for maior ou igual à do token atual,
            // o operador do topo deve ser calculado primeiro:
            // tira ele da pilha e manda para a saída
            while (
                pilhaOperadores.length > 0 &&
                precedencia(pilhaOperadores[pilhaOperadores.length -1]) >= precedencia(token)
            ) {
                saida.push(pilhaOperadores.pop());
            }
            pilhaOperadores.push(token);
        }
    }
    // Acabaram os tokens: esvazia o que sobrou na pilha
    while (pilhaOperadores.length > 0) {
        saida.push(pilhaOperadores.pop());
    }
    return saida;
}

export function calcularRPN(rpn) {
    const pilha = [];

    for (let i = 0; i < rpn.length; i++) {
        const token = rpn[i]

        if (!isNaN(Number(token)) && token !== '') {
            pilha.push(Number(token));
        } else {
            const b = pilha.pop(); // Segundo operando
            const a = pilha.pop(); // Primeiro operando

            if (token === '+') pilha.push(a + b);
            else if (token === '-') pilha.push(a - b);
            else if (token === 'x') pilha.push(a * b);
            else if (token === '/' || token === '÷') {
                if (b === 0) {
                    throw new Error('Erro');
                }
                pilha.push(a / b)
            }
            else if (token === '%') pilha.push(a % b);
        }
    }
    return pilha.pop();
}
