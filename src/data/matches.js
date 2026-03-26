// =============================================================
// src/data/matches.js
// =============================================================
// Essa é a única mudança em relação à versão anterior:
// adicionamos o campo "round" em cada jogo gerado.
//
// LÓGICA DAS RODADAS:
// Em cada grupo de 4 times, os 6 jogos se distribuem assim:
//   Rodada 1 → índices 0 e 1 (primeiros 2 jogos gerados)
//   Rodada 2 → índices 2 e 3
//   Rodada 3 → índices 4 e 5
//
// Math.floor(matchIndex / 2) + 1 converte o índice em rodada:
//   Math.floor(0/2)+1 = 1  → rodada 1
//   Math.floor(1/2)+1 = 1  → rodada 1
//   Math.floor(2/2)+1 = 2  → rodada 2
//   Math.floor(3/2)+1 = 2  → rodada 2
//   Math.floor(4/2)+1 = 3  → rodada 3
//   Math.floor(5/2)+1 = 3  → rodada 3
//
// FASE 2: quando vier da API, esse campo "round" continuará
// existindo — só mudará de onde ele vem. Os componentes
// visuais não precisarão mudar nada.
// =============================================================

import { GROUPS, GROUP_LETTERS } from './teams';

const generateGroupMatches = (groupLetter, teams) => {
  // Ordem fixa do round-robin para 4 times.
  // Cada par [i, m] representa os índices dos times no array.
  // Essa sequência garante que nenhuma rodada repete um time.
  const ROUND_ROBIN_ORDER = [
    [0, 1],
    [2, 3], // Rodada 1
    [0, 2],
    [1, 3], // Rodada 2
    [0, 3],
    [1, 2], // Rodada 3
  ];

  return ROUND_ROBIN_ORDER.map(([i, m], matchIndex) => ({
    id: `${groupLetter}_${teams[i].id}_${teams[m].id}`,
    group: groupLetter,
    teamA: teams[i].id,
    teamB: teams[m].id,
    round: Math.floor(matchIndex / 2) + 1,
    scoreA: null,
    scoreB: null,
  }));
};

// O restante do arquivo permanece igual
export const ALL_MATCHES = GROUP_LETTERS.flatMap((letter) =>
  generateGroupMatches(letter, GROUPS[letter].teams),
);

export const getMatchesByGroup = (groupLetter) =>
  ALL_MATCHES.filter((match) => match.group === groupLetter);

export const getMatchById = (id) =>
  ALL_MATCHES.find((match) => match.id === id) ?? null;

// Exportação nova — retorna os jogos de um grupo separados por rodada.
// Retorna um objeto assim:
// {
//   1: [ jogo1, jogo2 ],
//   2: [ jogo3, jogo4 ],
//   3: [ jogo5, jogo6 ],
// }
// Útil para o componente de jogos por rodada navegar entre elas.
//
// Object.groupBy é moderno (ES2024) — usamos reduce para
// garantir compatibilidade com todos os navegadores.
export const getMatchesByRound = (groupLetter) => {
  const matches = getMatchesByGroup(groupLetter);

  // .reduce() percorre o array acumulando um resultado.
  // Aqui acumulamos um objeto onde cada chave é uma rodada.
  return matches.reduce((acc, match) => {
    const round = match.round;

    // Se essa rodada ainda não existe no acumulador, cria array vazio
    if (!acc[round]) acc[round] = [];

    // Adiciona o jogo na rodada correta
    acc[round].push(match);

    return acc;
  }, {}); // {} é o valor inicial do acumulador
};
