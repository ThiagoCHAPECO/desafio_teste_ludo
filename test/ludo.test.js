import test from 'node:test';
import assert from 'node:assert/strict';
import { Ludo } from '../src/ludo.js';

function turno(jogo, jogador, dado, peca = 0) {
  const legais = jogo.lancarDado(jogador, dado);
  if (legais.length) jogo.mover(jogador, peca);
}
function ate55() {
  const j = new Ludo();
  turno(j,0,6); turno(j,0,5); turno(j,1,1);
  for (let n=0;n<10;n++) { turno(j,0,5); turno(j,1,1); }
  return j;
}

test('CT01 - dois jogadores iniciam com quatro pecas na base', () => {
  assert.deepEqual(new Ludo().estado, { pecas:[[-1,-1,-1,-1],[-1,-1,-1,-1]], vez:0, dado:null, vencedor:null });
});
test('CT02 - somente seis retira uma peca da base e concede outra jogada', () => {
  const j = new Ludo();
  assert.deepEqual(j.lancarDado(0,5), []);
  assert.equal(j.estado.vez,1);
  turno(j,1,6);
  assert.equal(j.estado.pecas[1][0],0);
  assert.equal(j.estado.vez,1);
});
test('CT03 - dado invalido e jogador fora da vez nao alteram estado', () => {
  const j = new Ludo(), antes=j.estado;
  for(const valor of [0,7,1.5,NaN]) assert.throws(()=>j.lancarDado(0,valor),RangeError);
  assert.throws(()=>j.lancarDado(1,6));
  assert.deepEqual(j.estado,antes);
});
test('CT04 - precisa lancar antes de mover e nao pode lancar duas vezes', () => {
  const j = new Ludo();
  assert.throws(()=>j.mover(0,0));
  j.lancarDado(0,6);
  assert.throws(()=>j.lancarDado(0,1));
  assert.throws(()=>j.mover(1,0));
  assert.throws(()=>j.mover(0,4),RangeError);
});
test('CT05 - movimento comum avanca e alterna a vez', () => {
  const j = new Ludo(); turno(j,0,6); turno(j,0,4);
  assert.equal(j.estado.pecas[0][0],4);
  assert.equal(j.estado.vez,1);
});
test('CT06 - terceiro seis consecutivo perde a vez sem mover', () => {
  const j = new Ludo(); turno(j,0,6); turno(j,0,6);
  const antes=j.estado.pecas;
  assert.deepEqual(j.lancarDado(0,6),[]);
  assert.deepEqual(j.estado.pecas,antes);
  assert.equal(j.estado.vez,1);
});
test('CT07 - duas pecas formam barreira e impedem terceira na mesma casa', () => {
  const j = new Ludo(); turno(j,0,6,0); turno(j,0,6,1);
  j.lancarDado(0,6); turno(j,1,1);
  assert.deepEqual(j.lancarDado(0,6),[0,1]);
  assert.throws(()=>j.mover(0,2),RangeError);
  assert.deepEqual(j.estado.pecas[0],[0,0,-1,-1]);
});
test('CT08 - captura adversario em casa nao segura e devolve a base', () => {
  const j = new Ludo();
  turno(j,0,6); turno(j,0,6); turno(j,0,5);
  turno(j,1,6); turno(j,1,1);
  for(let n=0;n<3;n++) { turno(j,0,5); turno(j,1,1); }
  assert.equal(j.estado.pecas[1][0],4);
  turno(j,0,4);
  assert.equal(j.estado.pecas[0][0],30);
  assert.equal(j.estado.pecas[1][0],-1);
});
test('CT09 - casa segura permite coexistencia sem captura', () => {
  const j = new Ludo();
  turno(j,0,6); turno(j,0,6); turno(j,0,5);
  turno(j,1,6); turno(j,1,1);
  for(let n=0;n<3;n++) { turno(j,0,5); turno(j,1,4); }
  // Adversario na casa segura global 39 (posicao relativa 13).
  turno(j,0,5); turno(j,1,6,1); turno(j,1,1,1);
  turno(j,0,5); turno(j,1,1,1); turno(j,0,3);
  assert.equal(j.estado.pecas[0][0],39);
  assert.equal(j.estado.pecas[1][0],13);
});
test('CT10 - chegada exige valor exato e nao permite ultrapassar 57', () => {
  const j=ate55();
  assert.equal(j.estado.pecas[0][0],55);
  assert.deepEqual(j.lancarDado(0,3),[]);
  assert.equal(j.estado.pecas[0][0],55);
  turno(j,1,1); turno(j,0,2);
  assert.equal(j.estado.pecas[0][0],57);
});
test('CT11 - consulta retorna copia independente', () => {
  const j=new Ludo(); const copia=j.estado; copia.pecas[0][0]=57;
  assert.equal(j.estado.pecas[0][0],-1);
});
test('CT12 - quatro pecas na chegada vencem e bloqueiam novas acoes', () => {
  const j=new Ludo();
  for(let p=0;p<4;p++) {
    turno(j,0,6,p); turno(j,0,5,p); turno(j,1,1);
    for(let n=0;n<10;n++) { turno(j,0,5,p); turno(j,1,1); }
    turno(j,0,2,p);
    if(p<3) turno(j,1,1);
  }
  assert.equal(j.estado.vencedor,0);
  assert.deepEqual(j.estado.pecas[0],[57,57,57,57]);
  assert.throws(()=>j.lancarDado(j.estado.vez,6));
  assert.throws(()=>j.mover(j.estado.vez,0));
});
