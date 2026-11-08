// Agrupar os dígitos consecutivos em números completos.
export function tokenizar(tokens)  {
    const resultado = [];
    let numero = '';

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]; // Faço apenas um acesso a memória

        // Se for número adiciona o array
        if ((!isNaN(Number(token)) && token !== '') || token === '.') {
            numero += token;
        } else {
            if (numero !== '') {
                resultado.push(numero);
                numero = '';
            }
            resultado.push(token);
        }
    }

    if (numero !== '') {
        resultado.push(numero);
    }

    return resultado;
}