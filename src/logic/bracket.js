// =============================================================
// src/logic/bracket.js
// =============================================================
// Mudanças nesta versão:
// 1. Adicionada função getLoser() — retorna o perdedor de um
//    jogo do mata-mata. Retorna null se não há vencedor ainda.
// 2. buildBracket() agora também monta o jogo do 3º lugar
//    (thirdPlace) entre os perdedores das duas semifinais.
// =============================================================

import { GROUP_LETTERS } from '../data/teams';
import { getMatchesByGroup } from '../data/matches';
import { calcGroupStandings } from './standings';
import { rankThirdPlacedTeams } from './thirdPlace';

export const ROUNDS = {
  ROUND_OF_32: 'round_of_32',
  ROUND_OF_16: 'round_of_16',
  QUARTER: 'quarter',
  SEMI: 'semi',
  FINAL: 'final',
  THIRD_PLACE: 'third_place', // ← novo
};

export const ROUND_LABELS = {
  [ROUNDS.ROUND_OF_32]: 'Round of 32',
  [ROUNDS.ROUND_OF_16]: 'Oitavas',
  [ROUNDS.QUARTER]: 'Quartas',
  [ROUNDS.SEMI]: 'Semifinal',
  [ROUNDS.FINAL]: 'Final',
  [ROUNDS.THIRD_PLACE]: '3º Lugar', // ← novo
};

export const ROUND_ORDER = [
  ROUNDS.ROUND_OF_32,
  ROUNDS.ROUND_OF_16,
  ROUNDS.QUARTER,
  ROUNDS.SEMI,
  ROUNDS.FINAL,
];

// =============================================================
// GETWINNER — retorna o vencedor de um jogo
// =============================================================
// Retorna null se:
//   - ainda não há placar preenchido
//   - o placar está empatado (no mata-mata = sem vencedor)
// =============================================================
export const getWinner = (match, knockoutPicks) => {
  const pick = knockoutPicks[match.id];
  if (!pick || pick.scoreA == null || pick.scoreB == null) return null;
  if (pick.scoreA > pick.scoreB) return match.teamA;
  if (pick.scoreB > pick.scoreA) return match.teamB;
  // Empate — decide nos pênaltis
  if (pick.penaltyWinner) return pick.penaltyWinner;
  return null;
};

// =============================================================
// GETLOSER — retorna o perdedor de um jogo
// =============================================================
// Só existe perdedor quando há um vencedor definido.
// Se o jogo empatou ou ainda não tem placar, retorna null.
//
// Lógica: se o vencedor é o teamA, o perdedor é o teamB
//         e vice-versa.
// =============================================================
export const getLoser = (match) => {
  if (!match?.winner) return null;
  return match.winner === match.teamA ? match.teamB : match.teamA;
};

const getClassifiedTeams = (scores) => {
  const first = {};
  const second = {};
  GROUP_LETTERS.forEach((letter) => {
    const matches = getMatchesByGroup(letter);
    const standings = calcGroupStandings(matches, scores);

    // Só classifica times que jogaram pelo menos 1 partida.
    // Sem isso, times com tudo zerado seriam ordenados por
    // padrão e preencheriam o bracket antes de qualquer jogo.
    const played = standings.filter((t) => t.played > 0);
    first[letter] = played.length >= 1 ? (standings[0]?.teamId ?? null) : null;
    second[letter] = played.length >= 2 ? (standings[1]?.teamId ?? null) : null;
  });
  const thirds = rankThirdPlacedTeams(scores);
  return { first, second, thirds };
};

const FIFA_THIRD_PLACE_TABLE = {
  EFGHIJKL: ['3E', '3J', '3I', '3F', '3H', '3G', '3L', '3K'],
  DFGHIJKL: ['3H', '3G', '3I', '3D', '3J', '3F', '3L', '3K'],
  DEGHIJKL: ['3E', '3J', '3I', '3D', '3H', '3G', '3L', '3K'],
  DEFHIJKL: ['3E', '3J', '3I', '3D', '3H', '3F', '3L', '3K'],
  DEFGIJKL: ['3E', '3G', '3I', '3D', '3J', '3F', '3L', '3K'],
  DEFGHJKL: ['3E', '3G', '3J', '3D', '3H', '3F', '3L', '3K'],
  DEFGHIKL: ['3E', '3G', '3I', '3D', '3H', '3F', '3L', '3K'],
  DEFGHIJL: ['3E', '3G', '3J', '3D', '3H', '3F', '3L', '3I'],
  DEFGHIJK: ['3E', '3G', '3J', '3D', '3H', '3F', '3I', '3K'],
  CFGHIJKL: ['3H', '3G', '3I', '3C', '3J', '3F', '3L', '3K'],
  CEGHIJKL: ['3E', '3J', '3I', '3C', '3H', '3G', '3L', '3K'],
  CEFHIJKL: ['3E', '3J', '3I', '3C', '3H', '3F', '3L', '3K'],
  CEFGIJKL: ['3E', '3G', '3I', '3C', '3J', '3F', '3L', '3K'],
  CEFGHJKL: ['3E', '3G', '3J', '3C', '3H', '3F', '3L', '3K'],
  CEFGHIKL: ['3E', '3G', '3I', '3C', '3H', '3F', '3L', '3K'],
  CEFGHIJL: ['3E', '3G', '3J', '3C', '3H', '3F', '3L', '3I'],
  CEFGHIJK: ['3E', '3G', '3J', '3C', '3H', '3F', '3I', '3K'],
  CDGHIJKL: ['3H', '3G', '3I', '3C', '3J', '3D', '3L', '3K'],
  CDFHIJKL: ['3C', '3J', '3I', '3D', '3H', '3F', '3L', '3K'],
  CDFGIJKL: ['3C', '3G', '3I', '3D', '3J', '3F', '3L', '3K'],
  CDFGHJKL: ['3C', '3G', '3J', '3D', '3H', '3F', '3L', '3K'],
  CDFGHIKL: ['3C', '3G', '3I', '3D', '3H', '3F', '3L', '3K'],
  CDFGHIJL: ['3C', '3G', '3J', '3D', '3H', '3F', '3L', '3I'],
  CDFGHIJK: ['3C', '3G', '3J', '3D', '3H', '3F', '3I', '3K'],
  CDEHIJKL: ['3E', '3J', '3I', '3C', '3H', '3D', '3L', '3K'],
  CDEGIJKL: ['3E', '3G', '3I', '3C', '3J', '3D', '3L', '3K'],
  CDEGHIJL: ['3E', '3G', '3J', '3C', '3H', '3D', '3L', '3I'],
  CDEGHIKL: ['3E', '3G', '3I', '3C', '3H', '3D', '3L', '3K'],
  CDEGHIJK: ['3E', '3G', '3J', '3C', '3H', '3D', '3I', '3K'],
  CDEFIJKL: ['3C', '3J', '3E', '3D', '3I', '3F', '3L', '3K'],
  CDEFHJKL: ['3C', '3J', '3E', '3D', '3H', '3F', '3L', '3K'],
  CDEFHIKL: ['3C', '3J', '3E', '3D', '3H', '3F', '3L', '3K'],
  CDEFHIJK: ['3C', '3J', '3E', '3D', '3H', '3F', '3I', '3K'],
};

const resolveThirdPlace = (thirds, slot) => {
  const groups = thirds
    .map((t) => t.group)
    .sort()
    .join('');
  const combination = FIFA_THIRD_PLACE_TABLE[groups];
  if (!combination) return thirds[slot]?.teamId ?? null;
  const thirdCode = combination[slot];
  if (!thirdCode) return null;
  const groupLetter = thirdCode[1];
  return thirds.find((t) => t.group === groupLetter)?.teamId ?? null;
};

const resolveToTeamId = (ref, classified) => {
  if (ref.type === 'first') return classified.first[ref.group] ?? null;
  if (ref.type === 'second') return classified.second[ref.group] ?? null;
  if (ref.type === 'third')
    return resolveThirdPlace(classified.thirds, ref.slot);
  return null;
};

const LEFT_MATCHUPS = [
  {
    id: 'm73',
    teamA: { type: 'second', group: 'A' },
    teamB: { type: 'second', group: 'B' },
  },
  {
    id: 'm74',
    teamA: { type: 'first', group: 'E' },
    teamB: { type: 'third', slot: 3 },
  },
  {
    id: 'm75',
    teamA: { type: 'first', group: 'F' },
    teamB: { type: 'second', group: 'C' },
  },
  {
    id: 'm76',
    teamA: { type: 'first', group: 'C' },
    teamB: { type: 'second', group: 'F' },
  },
  {
    id: 'm77',
    teamA: { type: 'first', group: 'I' },
    teamB: { type: 'third', slot: 5 },
  },
  {
    id: 'm78',
    teamA: { type: 'second', group: 'E' },
    teamB: { type: 'second', group: 'I' },
  },
  {
    id: 'm79',
    teamA: { type: 'first', group: 'A' },
    teamB: { type: 'third', slot: 0 },
  },
  {
    id: 'm80',
    teamA: { type: 'first', group: 'L' },
    teamB: { type: 'third', slot: 7 },
  },
];

const RIGHT_MATCHUPS = [
  {
    id: 'm81',
    teamA: { type: 'first', group: 'D' },
    teamB: { type: 'third', slot: 2 },
  },
  {
    id: 'm82',
    teamA: { type: 'first', group: 'G' },
    teamB: { type: 'third', slot: 4 },
  },
  {
    id: 'm83',
    teamA: { type: 'second', group: 'K' },
    teamB: { type: 'second', group: 'L' },
  },
  {
    id: 'm84',
    teamA: { type: 'first', group: 'H' },
    teamB: { type: 'second', group: 'J' },
  },
  {
    id: 'm85',
    teamA: { type: 'first', group: 'B' },
    teamB: { type: 'third', slot: 1 },
  },
  {
    id: 'm86',
    teamA: { type: 'first', group: 'J' },
    teamB: { type: 'second', group: 'H' },
  },
  {
    id: 'm87',
    teamA: { type: 'first', group: 'K' },
    teamB: { type: 'third', slot: 6 },
  },
  {
    id: 'm88',
    teamA: { type: 'second', group: 'D' },
    teamB: { type: 'second', group: 'G' },
  },
];

const resolveMatchup = (matchup, classified, knockoutPicks) => {
  const match = {
    id: matchup.id,
    teamA: resolveToTeamId(matchup.teamA, classified),
    teamB: resolveToTeamId(matchup.teamB, classified),
    scoreA: knockoutPicks[matchup.id]?.scoreA ?? null,
    scoreB: knockoutPicks[matchup.id]?.scoreB ?? null,
  };
  return { ...match, winner: getWinner(match, knockoutPicks) };
};

const buildRound = (prevMatches, idPrefix, knockoutPicks) =>
  Array.from({ length: prevMatches.length / 2 }, (_, i) => {
    const id = `${idPrefix}_${i + 1}`;
    const teamA = prevMatches[i * 2].winner ?? null;
    const teamB = prevMatches[i * 2 + 1].winner ?? null;
    const match = {
      id,
      teamA,
      teamB,
      scoreA: knockoutPicks[id]?.scoreA ?? null,
      scoreB: knockoutPicks[id]?.scoreB ?? null,
    };
    return { ...match, winner: getWinner(match, knockoutPicks) };
  });

export const buildBracket = (scores, knockoutPicks = {}) => {
  const classified = getClassifiedTeams(scores);

  // Resolve as duas chaves do Round of 32
  const leftR32 = LEFT_MATCHUPS.map((m) =>
    resolveMatchup(m, classified, knockoutPicks),
  );
  const rightR32 = RIGHT_MATCHUPS.map((m) =>
    resolveMatchup(m, classified, knockoutPicks),
  );

  // Cada chave evolui independentemente até a semifinal
  const leftR16 = buildRound(leftR32, 'l_r16', knockoutPicks);
  const rightR16 = buildRound(rightR32, 'r_r16', knockoutPicks);

  const leftQF = buildRound(leftR16, 'l_qf', knockoutPicks);
  const rightQF = buildRound(rightR16, 'r_qf', knockoutPicks);

  const leftSF = buildRound(leftQF, 'l_sf', knockoutPicks);
  const rightSF = buildRound(rightQF, 'r_sf', knockoutPicks);

  // Final: vencedor da chave esquerda vs vencedor da chave direita
  const finalMatch = {
    id: 'final',
    teamA: leftSF[0]?.winner ?? null,
    teamB: rightSF[0]?.winner ?? null,
    scoreA: knockoutPicks['final']?.scoreA ?? null,
    scoreB: knockoutPicks['final']?.scoreB ?? null,
  };
  finalMatch.winner = getWinner(finalMatch, knockoutPicks);

  // =============================================================
  // DISPUTA DE 3º LUGAR
  // =============================================================
  // Os dois times que perderam as semifinais se enfrentam.
  // getLoser() retorna null se a semi ainda não tem vencedor,
  // então o jogo do 3º lugar fica "a definir" até lá.
  // =============================================================
  const thirdPlaceMatch = {
    id: 'third_place',
    teamA: getLoser(leftSF[0]) ?? null, // perdedor da SF esquerda
    teamB: getLoser(rightSF[0]) ?? null, // perdedor da SF direita
    scoreA: knockoutPicks['third_place']?.scoreA ?? null,
    scoreB: knockoutPicks['third_place']?.scoreB ?? null,
  };
  thirdPlaceMatch.winner = getWinner(thirdPlaceMatch, knockoutPicks);

  return {
    [ROUNDS.ROUND_OF_32]: [...leftR32, ...rightR32],
    [ROUNDS.ROUND_OF_16]: [...leftR16, ...rightR16],
    [ROUNDS.QUARTER]: [...leftQF, ...rightQF],
    [ROUNDS.SEMI]: [...leftSF, ...rightSF],
    [ROUNDS.FINAL]: [finalMatch],
    [ROUNDS.THIRD_PLACE]: [thirdPlaceMatch], // ← novo
    // Chaves separadas para o bracket visual em espelho
    left: { r32: leftR32, r16: leftR16, qf: leftQF, sf: leftSF },
    right: { r32: rightR32, r16: rightR16, qf: rightQF, sf: rightSF },
  };
};

export const getNextRound = (roundId) => {
  const index = ROUND_ORDER.indexOf(roundId);
  return index < ROUND_ORDER.length - 1 ? ROUND_ORDER[index + 1] : null;
};

export const getPrevRound = (roundId) => {
  const index = ROUND_ORDER.indexOf(roundId);
  return index > 0 ? ROUND_ORDER[index - 1] : null;
};
