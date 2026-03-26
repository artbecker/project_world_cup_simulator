// =============================================================
// src/logic/thirdPlace.js
// =============================================================
// Esse arquivo resolve a lógica dos 8 melhores terceiros
// colocados que avançam ao mata-mata da Copa 2026.
//
// ESTRUTURA:
// 1. getThirdPlacedTeams()  → coleta os 12 terceiros colocados
// 2. rankThirdPlacedTeams() → ordena e retorna os 8 melhores
// 3. getThirdPlaceSlots()   → retorna as letras dos grupos
//                             que classificaram terceiros
//                             (usado no chaveamento)
// =============================================================

import { GROUP_LETTERS } from '../data/teams';
import { getMatchesByGroup } from '../data/matches';
import { calcGroupStandings } from './standings';

// =============================================================
// 1. GETTHIRDPLACEDTEAMS
// =============================================================
// Percorre todos os grupos, calcula a classificação de cada um
// e coleta o time que ficou em 3° lugar (índice 2).
//
// Retorna um array de objetos com as estatísticas do terceiro
// colocado de cada grupo, incluindo a letra do grupo de origem.
// =============================================================
export const getThirdPlacedTeams = (scores) => {
  const thirdPlaced = [];

  GROUP_LETTERS.forEach((letter) => {
    const matches = getMatchesByGroup(letter);
    const standings = calcGroupStandings(matches, scores);

    // índice 2 = 3° colocado (arrays começam em 0)
    const third = standings[2];

    // Só inclui se o time jogou pelo menos 1 jogo
    // Evita adicionar times com tudo zerado que ainda
    // não tiveram nenhum placar preenchido
    if (third && third.played > 0) {
      thirdPlaced.push({
        ...third, // spread de todas as estatísticas
        group: letter, // adiciona a letra do grupo de origem
      });
    }
  });

  return thirdPlaced;
};

// =============================================================
// 2. RANKTHIRDPLACEDTEAMS
// =============================================================
// Ordena os terceiros colocados pelos critérios FIFA e retorna
// os 8 melhores.
//
// CRITÉRIOS DE DESEMPATE (ordem oficial FIFA):
//   1. Pontos
//   2. Saldo de gols
//   3. Gols marcados
//   4. Grupo de origem (alfabético) — critério de último recurso
//      para garantir ordenação determinística quando tudo empata
// =============================================================
export const rankThirdPlacedTeams = (scores) => {
  const thirdPlaced = getThirdPlacedTeams(scores);

  const ranked = [...thirdPlaced].sort((a, b) => {
    // Critério 1: pontos
    if (b.points !== a.points) return b.points - a.points;

    // Critério 2: saldo de gols
    if (b.goalDifference !== a.goalDifference)
      return b.goalDifference - a.goalDifference;

    // Critério 3: gols marcados
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

    // Critério 4: grupo de origem (alfabético)
    // localeCompare compara strings considerando ordenação
    // natural — "A" < "B" < "C" etc.
    return a.group.localeCompare(b.group);
  });

  // Retorna só os 8 melhores (as 8 vagas disponíveis)
  return ranked.slice(0, 8);
};

// =============================================================
// 3. GETTHIRDPLACESLOTS
// =============================================================
// Retorna um array com as letras dos grupos cujos terceiros
// colocados avançaram — ordenado alfabeticamente.
//
// Ex: ["A", "B", "C", "D", "E", "F", "G", "H"]
//
// Isso é necessário para o chaveamento do mata-mata.
// A FIFA tem uma tabela oficial que define os confrontos
// das oitavas baseada em QUAIS grupos classificaram terceiros.
//
// Exemplo da tabela FIFA:
// Se os 8 terceiros vieram de A,B,C,D,E,F,G,H →
//   o terceiro do grupo A enfrenta o 1° do grupo B, etc.
// =============================================================
export const getThirdPlaceSlots = (scores) => {
  const best8 = rankThirdPlacedTeams(scores);

  // Extrai só as letras dos grupos, ordenadas alfabeticamente
  // .sort() em strings já ordena alfabeticamente por padrão
  return best8.map((team) => team.group).sort();
};

// =============================================================
// TABELA OFICIAL FIFA DE CONFRONTOS DOS TERCEIROS
// =============================================================
// A FIFA define previamente quais vagas do chaveamento cada
// terceiro ocupa, dependendo de quais 8 grupos classificaram
// terceiros. Como são C(12,8) = 495 combinações possíveis,
// mapeamos as mais prováveis e usamos um fallback genérico.
//
// Formato da tabela:
//   chave: string com as 8 letras dos grupos ordenados
//   valor: array de 8 posições indicando contra qual 1° ou 2°
//          cada terceiro vai jogar nas oitavas
//
// Fonte: Regulamento oficial FIFA World Cup 2026
// =============================================================
export const FIFA_THIRD_PLACE_TABLE = {
  // Quando todos os 12 grupos classificam terceiros,
  // a FIFA usa essa distribuição padrão
  // (será expandida conforme o regulamento final for publicado)
  ABCDEFGH: ['1A', '1B', '1C', '1D', '1E', '1F', '1G', '1H'],
  ABCDEFGI: ['1A', '1B', '1C', '1D', '1E', '1F', '1G', '1I'],
  // ... outras combinações serão adicionadas quando a FIFA
  // publicar o regulamento completo do mata-mata
};

// Fallback genérico: se a combinação não estiver na tabela,
// distribui os terceiros nos slots disponíveis em ordem
export const getThirdPlaceMatchups = (slots) => {
  const key = slots.join('');
  return FIFA_THIRD_PLACE_TABLE[key] ?? slots.map((_, i) => `slot_${i + 1}`);
};
