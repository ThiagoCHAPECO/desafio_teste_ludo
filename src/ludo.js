const SEGURAS = new Set([0, 8, 13, 21, 26, 34, 39, 47]);
export class Ludo {
  #pecas = [Array(4).fill(-1), Array(4).fill(-1)];
  #vez = 0; #dado = null; #seis = 0; #vencedor = null;
  #global(j, pos) { return (pos + j * 26) % 52; }
  #ocupantes(casa) {
    return this.#pecas.map((p, j) => p.filter(pos => pos >= 0 && pos < 52 && this.#global(j, pos) === casa).length);
  }

  #pode(j, i) {
    const pos = this.#pecas[j][i], destino = pos === -1 ? 0 : pos + this.#dado;
    if (pos === 57 || (pos === -1 && this.#dado !== 6) || destino > 57) return false;
    for (let p = pos === -1 ? 0 : pos + 1; p <= Math.min(destino, 51); p++) {
      const ocupacao = this.#ocupantes(this.#global(j, p));
      if (ocupacao.some(n => n >= 2)) return false;
    }
    return true;
  }

  lancarDado(j, valor) {
    if (this.#vencedor !== null) throw new Error('Partida encerrada');
    if (j !== this.#vez || this.#dado !== null) throw new Error('Nao pode lancar agora');
    if (!Number.isInteger(valor) || valor < 1 || valor > 6) throw new RangeError('Dado invalido');
    this.#dado = valor;
    this.#seis = valor === 6 ? this.#seis + 1 : 0;
    if (this.#seis === 3) { this.#proximo(); return []; }
    const jogaveis = this.jogaveis;
    if (!jogaveis.length) this.#proximo();
    return jogaveis;
  }

  #proximo() { this.#vez = 1 - this.#vez; this.#dado = null; this.#seis = 0; }

  mover(j, i) {
    if (this.#vencedor !== null) throw new Error('Partida encerrada');
    if (j !== this.#vez || this.#dado === null) throw new Error('Nao pode mover agora');
    if (!Number.isInteger(i) || i < 0 || i > 3 || !this.#pode(j, i))
      throw new RangeError('Movimento invalido');
    const pos = this.#pecas[j][i];
    const destino = pos === -1 ? 0 : pos + this.#dado;
    if (destino < 52) {
      const casa = this.#global(j, destino);
      if (!SEGURAS.has(casa)) {
        const outro = 1 - j;
        this.#pecas[outro] = this.#pecas[outro].map(p =>
          p >= 0 && p < 52 && this.#global(outro, p) === casa ? -1 : p);
      }
    }
    this.#pecas[j][i] = destino;
    if (this.#pecas[j].every(p => p === 57)) this.#vencedor = j;
    const extra = this.#dado === 6;
    this.#dado = null;
    if (!extra) this.#proximo();
  }

  get jogaveis() {
    return this.#dado === null ? [] : [0, 1, 2, 3].filter(i => this.#pode(this.#vez, i));
  }
  get estado() {
    return { pecas: this.#pecas.map(p => [...p]), vez: this.#vez, dado: this.#dado, vencedor: this.#vencedor };
  }
}
