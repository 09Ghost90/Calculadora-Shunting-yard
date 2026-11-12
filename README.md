---

## Funções

### Estado e display

**`numeroCompleto()`**
Retorna se o número em `tempExpressao` já pode ser usado na conta. `''`, `'-'` e `'.'` sozinhos ainda não são números.

**`limpaTudo()`**
- limpa a expressão (`expressao`)
- limpa o número temporário (`tempExpressao`)
- altera `mostrandoResultado` para `false`
- altera `houveErro` para `false`
- esconde a mensagem de erro
- atualiza o display

**`atualizaDisplay()`**
- junta a expressão confirmada com o número em digitação (`expressao.join('') + tempExpressao`)
- se estiver tudo vazio, mostra `0`
- envia o texto para `mostraNoDisplay`

**`mostraNoDisplay(valor)`**
Escreve o valor na tela. Se o display for um `<input>`, usa `value`. Se for outro elemento, usa `textContent`.

### Preparação da conta

**`listaConvertida(expressao)`**
Recebe a expressão com tudo em texto e devolve uma lista nova, pronta para calcular:
- operadores continuam como texto (`'+'`, `'x'`...)
- números viram `Number` (`'12'` vira `12`, `'-3'` vira `-3`)
- o que não é número continua como texto (`'('`, `')'`)

**`precedencia(expressao)`**
Monta a ordem em que os operadores devem ser calculados:
- percorre a lista e anota cada operador com a **posição** em que está e o **peso** dele (`x` e `÷` valem 2, `+` e `-` valem 1)
- ordena pelo peso, do maior para o menor
- entre operadores de mesmo peso, mantém a ordem da esquerda para a direita

Exemplo: `[2, '+', 3, 'x', 4]` devolve `x` (posição 3) e depois `+` (posição 1).

### Cálculo

**`calcula(listaConvertidaNumero)`**
Resolve a conta inteira em duas etapas.

1. **Parênteses.** Percorre a lista e, a cada `)`, procura o `(` mais próximo à esquerda. Calcula o que está entre os dois chamando a própria `calcula`, e troca o trecho `( ... )` pelo resultado. Assim o parêntese mais interno é resolvido primeiro. Se aparecer um `)` sem `(`, devolve `NaN`, que vira `Erro`.
2. **Operadores.** Chama `precedencia` para saber a ordem e, para cada operador:
   - pega o número da esquerda (`a`) e o da direita (`b`)
   - chama a operação certa (`soma`, `subtracao`, `multiplicacao` ou `divisao`)
   - troca os três itens `a`, `operador` e `b` pelo resultado
   - como a lista ficou 2 posições menor, diminui em 2 a posição guardada dos operadores que estavam à direita

No fim sobra um único item na lista: o resultado.

### Operações

**`soma(a, b)`**: retorna `a + b`.

**`subtracao(a, b)`**: retorna `a - b`.

**`multiplicacao(a, b)`**: retorna `a * b`.

**`divisao(a, b)`**: retorna `a / b`. Se `b` for `0`, escreve "Divisão por Zero" no console e devolve `NaN`, o que faz a calculadora mostrar `Erro`.
