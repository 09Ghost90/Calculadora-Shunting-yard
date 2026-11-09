// Agrupar os dígitos consecutivos em números completos.
export function tokenizar(tokens)  {
    const resultado = [];
    let numero = ''; // String para acumular os dígitos do número | // Verifica se o token é numérico ou um ponto decimal.

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]; // Faço apenas um acesso a memória

        //  isNaN(Number('Olá')): Retorna True
        // !isNaN(Number('1')): Retorna True

        // Se for número adiciona o array
        if ((!isNaN(Number(token)) && token !== '') || token === '.') {
            numero += token;
        } else {
            // Chegar no final ele da Push em tudo para a Const Resultado
            if (numero !== '') {
                resultado.push(numero); // Adiciona o numero acumulado na variável numero
                numero = '';
            }
            
            // O "-" é unário no início da expressão, depois de um operador ou depois de "("
            const anterior = resultado[resultado.length - 1];
            const ehUnario = token === '-' && (
                anterior === undefined ||
                ['+', '-', 'x', '÷', '/', '%', '(', '~'].includes(anterior)
            );

            resultado.push(ehUnario ? '~' : token); // Operador ou outro token que não faz parte do número
        }
    }

    // Adiciona o último número acumulado, pois o laço pode terminar
    // sem encontrar outro operador para adicionar esse número ao resultado.
    if (numero !== '') {
        resultado.push(numero);
    }

    return resultado;
}