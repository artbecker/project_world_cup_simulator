// =============================================================
// src/logic/bracket.js
// =============================================================
// Esse arquivo monta a estrutura completa do mata-mata da
// Copa 2026, desde o Round of 32 até a Final.
//
// ESTRUTURA DO MATA-MATA:
//   Round of 32 → 16 jogos (32 times)
//   Oitavas     → 8 jogos  (16 times)
//   Quartas     → 4 jogos  (8 times)
//   Semifinal   → 2 jogos  (4 times)
//   Final       → 1 jogo   (2 times)
//
// COMO OS 32 TIMES CHEGAM AO ROUND OF 32:
//   - 12 primeiros colocados
//   - 12 segundos colocados
//   - 8 melhores terceiros colocados
// =============================================================

import { GROUP_LETTERS } from '../data/teams';
import { getMatchesByGroup } from '../data/matches';
import { calcGroupStandings } from './standings';
import { rankThirdPlacedTeams } from './thirdPlace';

// =============================================================
// CONSTANTES DAS FASES
// =============================================================
// Identificadores de cada fase — usados como chaves no objeto
// de bracket e como labels na navegação da interface
// =============================================================
export const ROUNDS = {
  ROUND_OF_32: 'round_of_32',
  ROUND_OF_16: 'round_of_16', // oitavas
  QUARTER: 'quarter', // quartas
  SEMI: 'semi', // semifinal
  FINAL: 'final',
};

export const ROUND_LABELS = {
  [ROUNDS.ROUND_OF_32]: 'Round of 32',
  [ROUNDS.ROUND_OF_16]: 'Oitavas',
  [ROUNDS.QUARTER]: 'Quartas',
  [ROUNDS.SEMI]: 'Semifinal',
  [ROUNDS.FINAL]: 'Final',
};

// Ordem das fases — usado para navegação (anterior/próxima)
export const ROUND_ORDER = [
  ROUNDS.ROUND_OF_32,
  ROUNDS.ROUND_OF_16,
  ROUNDS.QUARTER,
  ROUNDS.SEMI,
  ROUNDS.FINAL,
];

// =============================================================
// GETCLASSIFIEDTEAMS
// =============================================================
// Coleta todos os classificados da fase de grupos:
//   - 1° e 2° de cada grupo (24 times)
//   - 8 melhores terceiros (8 times)
//
// Retorna um objeto organizado por posição e grupo:
// {
//   first:  { A: "BRA", B: "GER", ... },  // 1° de cada grupo
//   second: { A: "MAR", B: "JPN", ... },  // 2° de cada grupo
//   thirds: [ { teamId: "FRA", group: "I", ... }, ... ] // 8 melhores
// }
// =============================================================
const getClassifiedTeams = (scores) => {
  const first = {};
  const second = {};

  GROUP_LETTERS.forEach((letter) => {
    const matches = getMatchesByGroup(letter);
    const standings = calcGroupStandings(matches, scores);

    // índice 0 = 1° colocado, índice 1 = 2° colocado
    // Guardamos só o teamId — o componente busca o objeto
    // completo via getTeamById() quando precisar exibir
    first[letter] = standings[0]?.teamId ?? null;
    second[letter] = standings[1]?.teamId ?? null;
  });

  // 8 melhores terceiros já ordenados pelo thirdPlace.js
  const thirds = rankThirdPlacedTeams(scores);

  return { first, second, thirds };
};

// =============================================================
// CONFRONTOS OFICIAIS DO ROUND OF 32
// =============================================================
// A FIFA define previamente os 16 confrontos do Round of 32.
// Cada confronto é definido como "1° do grupo X vs 2° do grupo Y"
// ou "1° do grupo X vs melhor terceiro do grupo Z".
//
// IMPORTANTE: Esses confrontos são baseados no formato oficial
// da Copa 2026. A FIFA ainda não publicou o regulamento completo,
// então usamos a estrutura mais provável baseada em edições
// anteriores e nas informações disponíveis.
//
// Formato de cada confronto:
//   teamA: { type: "first"|"second"|"third", group: "A"|index }
//   teamB: { type: "first"|"second"|"third", group: "A"|index }
//   id:    identificador único do confronto
// =============================================================
const ROUND_OF_32_MATCHUPS = [
  // Chave 1
  {
    id: 'r32_1',
    teamA: { type: 'first', group: 'A' },
    teamB: { type: 'second', group: 'B' },
  },
  {
    id: 'r32_2',
    teamA: { type: 'first', group: 'C' },
    teamB: { type: 'third', index: 0 },
  },
  {
    id: 'r32_3',
    teamA: { type: 'first', group: 'B' },
    teamB: { type: 'second', group: 'A' },
  },
  {
    id: 'r32_4',
    teamA: { type: 'first', group: 'D' },
    teamB: { type: 'third', index: 1 },
  },

  // Chave 2
  {
    id: 'r32_5',
    teamA: { type: 'first', group: 'E' },
    teamB: { type: 'second', group: 'F' },
  },
  {
    id: 'r32_6',
    teamA: { type: 'first', group: 'G' },
    teamB: { type: 'third', index: 2 },
  },
  {
    id: 'r32_7',
    teamA: { type: 'first', group: 'F' },
    teamB: { type: 'second', group: 'E' },
  },
  {
    id: 'r32_8',
    teamA: { type: 'first', group: 'H' },
    teamB: { type: 'third', index: 3 },
  },

  // Chave 3
  {
    id: 'r32_9',
    teamA: { type: 'first', group: 'I' },
    teamB: { type: 'second', group: 'J' },
  },
  {
    id: 'r32_10',
    teamA: { type: 'first', group: 'K' },
    teamB: { type: 'third', index: 4 },
  },
  {
    id: 'r32_11',
    teamA: { type: 'first', group: 'J' },
    teamB: { type: 'second', group: 'I' },
  },
  {
    id: 'r32_12',
    teamA: { type: 'first', group: 'L' },
    teamB: { type: 'third', index: 5 },
  },

  // Chave 4
  {
    id: 'r32_13',
    teamA: { type: 'first', group: 'B' },
    teamB: { type: 'second', group: 'C' },
  },
  {
    id: 'r32_14',
    teamA: { type: 'second', group: 'D' },
    teamB: { type: 'third', index: 6 },
  },
  {
    id: 'r32_15',
    teamA: { type: 'first', group: 'C' },
    teamB: { type: 'second', group: 'D' },
  },
  {
    id: 'r32_16',
    teamA: { type: 'second', group: 'L' },
    teamB: { type: 'third', index: 7 },
  },
];

// =============================================================
// RESOLVETOTEAMID
// =============================================================
// Converte uma referência de time ({ type, group/index }) em
// um teamId real, usando os classificados da fase de grupos.
//
// Ex: { type: "first", group: "C" } → "BRA"
//     { type: "third", index: 0   } → "FRA" (melhor terceiro)
// =============================================================
const resolveToTeamId = (ref, classified) => {
  if (ref.type === 'first') return classified.first[ref.group] ?? null;
  if (ref.type === 'second') return classified.second[ref.group] ?? null;
  if (ref.type === 'third') return classified.thirds[ref.index]?.teamId ?? null;
  return null;
};

// =============================================================
// CREATEEMPTYMATCH
// =============================================================
// Cria um objeto de confronto vazio — usado para as fases
// seguintes (oitavas, quartas, semi, final) que começam sem
// times definidos e vão sendo preenchidas conforme o usuário
// clica nos vencedores.
// =============================================================
const createEmptyMatch = (id) => ({
  id,
  teamA: null, // null = vaga ainda não preenchida
  teamB: null,
  winner: null, // null = jogo ainda não decidido
});

// =============================================================
// BUILDBRACKET
// =============================================================
// Função principal — monta a estrutura completa do bracket.
//
// PARÂMETROS:
//   scores         → placares da fase de grupos (do useState)
//   knockoutPicks  → objeto com as escolhas do usuário no
//                    mata-mata { matchId: winnerId }
//
// RETORNO: objeto com todas as fases e seus confrontos
// {
//   round_of_32: [ { id, teamA, teamB, winner }, ... ],
//   round_of_16: [ ... ],
//   quarter:     [ ... ],
//   semi:        [ ... ],
//   final:       [ ... ],
// }
// =============================================================
export const buildBracket = (scores, knockoutPicks = {}) => {
  // Coleta os classificados da fase de grupos
  const classified = getClassifiedTeams(scores);

  // ── ROUND OF 32 ──
  // Resolve as referências para teamIds reais
  const roundOf32 = ROUND_OF_32_MATCHUPS.map((matchup) => ({
    id: matchup.id,
    teamA: resolveToTeamId(matchup.teamA, classified),
    teamB: resolveToTeamId(matchup.teamB, classified),
    // Pega a escolha do usuário para esse jogo, se existir
    winner: knockoutPicks[matchup.id] ?? null,
  }));

  // ── OITAVAS (Round of 16) ──
  // Os times vêm dos vencedores do Round of 32.
  // Jogos adjacentes se enfrentam: vencedor do r32_1 vs r32_2,
  // vencedor do r32_3 vs r32_4, etc.
  const roundOf16 = Array.from({ length: 8 }, (_, i) => {
    const id = `r16_${i + 1}`;
    // Cada par de jogos do round of 32 alimenta um jogo das oitavas
    // i=0 → jogos 0 e 1 do round of 32
    // i=1 → jogos 2 e 3 do round of 32, etc.
    const teamA = knockoutPicks[roundOf32[i * 2].id] ?? null;
    const teamB = knockoutPicks[roundOf32[i * 2 + 1].id] ?? null;
    return { id, teamA, teamB, winner: knockoutPicks[id] ?? null };
  });

  // ── QUARTAS ──
  // Vencedores das oitavas, mesma lógica de pareamento
  const quarters = Array.from({ length: 4 }, (_, i) => {
    const id = `qf_${i + 1}`;
    const teamA = knockoutPicks[roundOf16[i * 2].id] ?? null;
    const teamB = knockoutPicks[roundOf16[i * 2 + 1].id] ?? null;
    return { id, teamA, teamB, winner: knockoutPicks[id] ?? null };
  });

  // ── SEMIFINAL ──
  const semis = Array.from({ length: 2 }, (_, i) => {
    const id = `sf_${i + 1}`;
    const teamA = knockoutPicks[quarters[i * 2].id] ?? null;
    const teamB = knockoutPicks[quarters[i * 2 + 1].id] ?? null;
    return { id, teamA, teamB, winner: knockoutPicks[id] ?? null };
  });

  // ── FINAL ──
  const final = [
    {
      id: 'final',
      teamA: knockoutPicks[semis[0].id] ?? null,
      teamB: knockoutPicks[semis[1].id] ?? null,
      winner: knockoutPicks['final'] ?? null,
    },
  ];

  return {
    [ROUNDS.ROUND_OF_32]: roundOf32,
    [ROUNDS.ROUND_OF_16]: roundOf16,
    [ROUNDS.QUARTER]: quarters,
    [ROUNDS.SEMI]: semis,
    [ROUNDS.FINAL]: final,
  };
};

// =============================================================
// GETNEXTROUND
// =============================================================
// Utilitário: dado o id de uma fase, retorna o id da próxima.
// Usado pela interface para saber para onde as linhas apontam.
// Retorna null se já estiver na final.
// =============================================================
export const getNextRound = (roundId) => {
  const index = ROUND_ORDER.indexOf(roundId);
  return index < ROUND_ORDER.length - 1 ? ROUND_ORDER[index + 1] : null;
};

// =============================================================
// GETPREVROUND
// =============================================================
// Utilitário: dado o id de uma fase, retorna o id da anterior.
// Retorna null se já estiver no Round of 32.
// =============================================================
export const getPrevRound = (roundId) => {
  const index = ROUND_ORDER.indexOf(roundId);
  return index > 0 ? ROUND_ORDER[index - 1] : null;
};
