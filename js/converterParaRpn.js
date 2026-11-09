function precedencia(operador) {

    // Encontrar ( empilhe e ao encontrar ) retire operadores até encontrar a abertura novamente
    if (operador === 'x' || operador === '/' || operador === '÷' || operador === '%')
        return 2;
    if (operador === '+' || operador === '-') {
        return 1;
    }

    return 0;
}

export function converterParaRpn(tokensConvertidos) { // {12, +, 34}
    const pilhaOperadores = []; // +
    const saida = []; // 12, 34, +

    for (let i = 0; i < tokensConvertidos.length; i++) {
        const token = tokensConvertidos[i];

        // Número: vai direto para a saída
        if (!isNaN(Number(token)) && token !== '') {
            saida.push(token); // Adiciona o 12 na saida
        }
        
        // Abre parêntese: só empilha
        else if (token === '(') {
            pilhaOperadores.push(token); // Adiciona na pilhaOperadores
        }
        
        // Fecha parêntese: desempilha tudo até achar o '('
        else if (token === ')') {
            while (
                pilhaOperadores.length > 0 &&
                pilhaOperadores[pilhaOperadores.length -1] !== ('(') // Para de desempilhar quando encontrar '('.
            ) {
                saida.push(pilhaOperadores.pop()); // Desempilhando
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
                precedencia(pilhaOperadores[pilhaOperadores.length -1]) >= precedencia(token) // Verifica se o operador no topo da pilha tem precedência maior ou igual à do operador atual.
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

    // return pilha.pop;

    const resultado = pilha.pop();

    // Pilha vazia, como em (), ou resultado inválido
    if (!Number.isFinite(resultado)) {
        throw new Error ('Erro');
    }

    // Inteiros não têm erro de casas decimais e não devem perder dígitos
    if (Number.isInteger(resultado)) {
        return resultado;
    }

    // Arredonda para 12 dígitos significativos
    return Number(resultado.toPrecision(12));
}
