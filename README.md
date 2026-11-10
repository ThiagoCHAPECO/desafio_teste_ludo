# Ludo - dois jogadores

**Colaborador:** Thiago Gimenes.

**Identificação acadêmica:** preencher RA e turma antes de publicar. Se houver dupla, incluir o nome e o RA do segundo integrante e contribuições reais de ambos.

## Especificação do desafio

Base: [desafios da disciplina](https://github.com/JoaoChoma/teste_software_2026/blob/main/desafios.md). Implementação e testes em JavaScript, conforme solicitado. Este projeto é independente e deve ser publicado em um repositório chamado **desafio_teste_ludo**.

Dois jogadores, cada um com quatro peças. A base é representada por -1. O percurso relativo de cada jogador tem 52 casas compartilhadas (0 a 51) e seis casas de chegada (52 a 57). As entradas dos jogadores estão afastadas por 26 casas no circuito global. O objetivo é colocar as quatro peças na posição 57.

É necessário tirar seis para sair da base, colocando a peça na posição 0. Um seis concede outra jogada; o terceiro seis consecutivo perde a vez sem movimento. Se não houver movimento legal, a vez é passada. A entrada na chegada exige valor exato, sem ultrapassar 57.

As casas globais seguras são 0, 8, 13, 21, 26, 34, 39 e 47. Uma peça adversária isolada é capturada ao receber uma peça em casa não segura, voltando à base. Casas seguras permitem coexistência sem captura. Duas peças da mesma cor formam uma barreira: não é permitido atravessá-la nem colocar uma terceira peça nessa casa; uma das peças da barreira pode sair para desfazê-la. O corredor de chegada é privativo e não tem capturas ou barreiras.

Capturar e concluir uma peça não concedem jogada extra; apenas o seis concede. Essas regras de variante foram declaradas porque o enunciado define apenas o número de jogadores. O valor do dado é recebido por `lancarDado`, para que uma interface possa fornecer o sorteio e os testes possam fixar os valores.

## Executar

Requisito: Node.js 22 ou superior, com npm. O projeto não possui dependências externas; não é necessário executar `npm install`.

```bash
npm test
npm run coverage
```

O primeiro comando executa todos os testes com `node:test` e `node:assert/strict`. O segundo acrescenta o relatório de cobertura nativo do Node. O processo termina com código diferente de zero se algum teste falhar.

## Exemplo de uso

```javascript
import { Ludo } from './src/ludo.js';
const jogo = new Ludo();
console.log(jogo.lancarDado(0, 6)); // [0,1,2,3]
jogo.mover(0, 0);
console.log(jogo.estado.pecas[0][0]); // 0
console.log(jogo.estado.vez); // 0: seis concede outra jogada
```

Os exemplos são executados como módulos ES, em um arquivo `.js` dentro deste projeto. A lógica fica em [src/ludo.js](src/ludo.js) e os testes em [test/ludo.test.js](test/ludo.test.js).

## Casos de teste e funcionamento

Cada teste prepara uma partida independente, executa uma ação pública do motor e compara o resultado ou o estado esperado. Operações inválidas são verificadas com `assert.throws`; quando relevante, o estado anterior e posterior também é comparado. Os testes não substituem a implementação por mocks.

| Caso | Comportamento verificado |
|---|---|
| CT01 | dois jogadores iniciam com quatro pecas na base |
| CT02 | somente seis retira uma peca da base e concede outra jogada |
| CT03 | dado invalido e jogador fora da vez nao alteram estado |
| CT04 | precisa lancar antes de mover e nao pode lancar duas vezes |
| CT05 | movimento comum avanca e alterna a vez |
| CT06 | terceiro seis consecutivo perde a vez sem mover |
| CT07 | duas pecas formam barreira e impedem terceira na mesma casa |
| CT08 | captura adversario em casa nao segura e devolve a base |
| CT09 | casa segura permite coexistencia sem captura |
| CT10 | chegada exige valor exato e nao permite ultrapassar 57 |
| CT11 | consulta retorna copia independente |
| CT12 | quatro pecas na chegada vencem e bloqueiam novas acoes |

## Evidências da execução

Execução em 10/11/2026, Node.js 22.19.0: **12 testes aprovados, zero falhas, zero ignorados**. Saída completa em [evidencias/testes.log](evidencias/testes.log).

Cobertura do arquivo de produção: **100.00% de linhas, 98.53% de ramificações e 100.00% de funções**. Os percentuais são do arquivo `src/ludo.js`; não foi usada a média que inclui o código dos testes. Cobertura indica código exercitado e não prova ausência de defeitos ou atendimento de variantes não especificadas.

## Organização e entrega

`src/` contém o motor do jogo; `test/` contém os casos automatizados; `evidencias/` registra o resultado real. O projeto não exige navegador, banco ou interface gráfica. Há uma configuração de GitHub Actions para repetir os testes a cada push ou pull request.

O professor exige um repositório por desafio e aceita no máximo cinco para avaliação. Este pacote permite revisar o projeto individualmente antes de escolher quais cinco serão enviados. Não há histórico de contribuição artificial: commits devem registrar as contribuições reais dos integrantes.
