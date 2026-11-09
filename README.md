# Calculadora com Shunting-yard

Calculadora web feita em HTML, CSS e JavaScript puro. Ela respeita a precedência dos operadores (`*` e `/` antes de `+` e `-`) sem usar `eval()`. Para isso, converte a expressão para Notação Polonesa Reversa (RPN) com o algoritmo **Shunting-yard**, de Dijkstra, e depois calcula a RPN com uma pilha.

<!-- Coloque aqui um print ou GIF da calculadora funcionando -->
![Calculadora em funcionamento](docs/screenshot.png)

## Funcionalidades

- Operações: soma `+`, subtração `-`, multiplicação `*`, divisão `/`
- Precedência correta: `12 + 3 / 2 - 1` resulta em `12.5`
- Operadores de mesma prioridade resolvidos da esquerda para a direita: `8 - 3 - 2` resulta em `3`
- `C` limpa tudo e `⌫` apaga o último caractere
- Dá para continuar a conta a partir do resultado

## Como executar

Não precisa instalar nada.

1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU-USUARIO/NOME-DO-REPO.git
   ```
2. Abra o `index.html` no navegador.

## Estrutura

```
├── index.html   # teclado (botões com data-value) e display
├── style.css    # aparência da calculadora
└── script.js    # captura dos cliques, tokenização, Shunting-yard e cálculo
```

## Como funciona

Toda conta passa pelo mesmo caminho:

```
clique → tokens[] → tokenizar() → converterParaRpn() → calcularRPN() → display
```

### 1. Captura dos cliques

Cada botão tem um atributo `data-value`. A cada clique, o valor é adicionado ao display e guardado no array `tokens`, um caractere por clique:

```
12+3/2-1  →  ['1', '2', '+', '3', '/', '2', '-', '1']
```

### 2. `tokenizar()`

Junta os dígitos seguidos em números completos:

```
['1', '2', '+', ...]  →  ['12', '+', '3', '/', '2', '-', '1']
```

### 3. `converterParaRpn()`: algoritmo Shunting-yard

Reordena os tokens para que os operadores fiquem na ordem em que devem ser calculados. Uma pilha guarda os operadores que estão esperando a vez:

- **Número**: vai direto para a saída.
- **Operador**: antes de entrar na pilha, tira dela todos os operadores com precedência **maior ou igual** à sua e os manda para a saída.
- **Fim dos tokens**: o que sobrou na pilha vai para a saída, de cima para baixo.

| Operador | Precedência |
|---|---|
| `*` `/` `%` | 2 |
| `+` `-` | 1 |

Exemplo com `12 + 3 / 2 - 1`:

| Token | Pilha | Saída |
|---|---|---|
| 12 | `[]` | `12` |
| + | `[+]` | `12` |
| 3 | `[+]` | `12 3` |
| / | `[+, /]` | `12 3` |
| 2 | `[+, /]` | `12 3 2` |
| - | `[-]` | `12 3 2 / +` |
| 1 | `[-]` | `12 3 2 / + 1` |
| fim | `[]` | `12 3 2 / + 1 -` |

O `>=` (e não só `>`) faz operadores de mesma prioridade saírem da esquerda para a direita. Só com `>`, `8 - 3 - 2` seria calculado como `8 - (3 - 2) = 7`.

### 4. `calcularRPN()`

Percorre a RPN com uma pilha de números. Cada número é empilhado. Cada operador tira dois números da pilha, calcula o resultado e o empilha. O primeiro `pop()` é o operando da direita (`b`):

```
12 3 2 / + 1 -
→ 3 / 2 = 1.5
→ 12 + 1.5 = 13.5
→ 13.5 - 1 = 12.5
```

### 5. Exibição

Ao clicar em `=`, o resultado vai para o display com `display.value = String(resultado)` e vira o primeiro token da próxima conta.

## Limitações conhecidas

- **Parênteses**: ainda não implementados.
- **Números negativos**: um `-` no início da expressão (menos unário) não é reconhecido.
- **`%`**: calcula o resto da divisão, não porcentagem.
- **Ponto flutuante**: `0.1 + 0.2` mostra `0.30000000000000004`, como em qualquer cálculo com `Number` no JavaScript.

## Próximos passos

- [ ] Suporte a números decimais
- [ ] Parênteses no Shunting-yard
- [ ] Menos unário
- [ ] Mensagem de erro para expressões inválidas e divisão por zero
- [ ] Suporte ao teclado físico

## Referências

- [Shunting yard algorithm (Wikipedia)](https://en.wikipedia.org/wiki/Shunting_yard_algorithm)
- [Reverse Polish notation (Wikipedia)](https://en.wikipedia.org/wiki/Reverse_Polish_notation)

## Autor

Bruno Sousa Pereira, estudante de Engenharia de Computação na UFU.