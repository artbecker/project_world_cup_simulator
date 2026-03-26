// =============================================================
// src/logic/standings.js
// =============================================================
// Esse arquivo é o coração do simulador. Ele recebe os jogos
// de um grupo com os placares preenchidos e devolve os times
// ordenados pela classificação real da FIFA.
//
// ESTRUTURA:
// 1. calculateStats()      → calcula pontos, saldo e gols de cada time
// 2. resolveHeadToHead()   → desempate por confronto direto
// 3. sortStandings()       → ordena pelo ranking FIFA
// 4. calcGroupStandings()  → função principal que orquestra tudo
// =============================================================

// =============================================================
// 1. CALCULATESTATS
// =============================================================
// Recebe os jogos de um grupo (com placares) e devolve um objeto
// com as estatísticas acumuladas de cada time.
//
// "scores" é um objeto que o React vai passar com os placares
// que o usuário digitou. Ex:
// {
//   "C_BRA_MAR": { scoreA: 2, scoreB: 1 },
//   "C_BRA_HAI": { scoreA: 3, scoreB: 0 },
//   ...
// }
// =============================================================
const calculateStats = (matches, scores) => {
  // "stats" começa vazio e vai sendo preenchido conforme
  // iteramos os jogos. A estrutura de cada time será:
  // {
  //   teamId, points, played, won, drawn, lost,
  //   goalsFor, goalsAgainst, goalDifference
  // }
  const stats = {};

  // Função auxiliar que garante que um time existe no objeto
  // stats antes de tentarmos somar valores nele.
  // Se o time ainda não existe, cria com tudo zerado.
  const ensureTeam = (teamId) => {
    if (!stats[teamId]) {
      stats[teamId] = {
        teamId,
        points: 0,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0, // gols marcados
        goalsAgainst: 0, // gols sofridos
        goalDifference: 0, // saldo (calculado no final)
      };
    }
  };

  // Itera cada jogo do grupo
  matches.forEach((match) => {
    // Pega o placar desse jogo no objeto "scores"
    // Se o usuário ainda não preencheu, score será undefined
    const score = scores[match.id];

    // Só processa o jogo se ambos os placares foram preenchidos
    // (não nulos e não undefined)
    if (score?.scoreA == null || score?.scoreB == null) return;

    const { scoreA, scoreB } = score;

    // Garante que ambos os times existem no objeto stats
    ensureTeam(match.teamA);
    ensureTeam(match.teamB);

    // Incrementa jogos disputados para os dois times
    stats[match.teamA].played++;
    stats[match.teamB].played++;

    // Acumula gols marcados e sofridos
    stats[match.teamA].goalsFor += scoreA;
    stats[match.teamA].goalsAgainst += scoreB;
    stats[match.teamB].goalsFor += scoreB;
    stats[match.teamB].goalsAgainst += scoreA;

    // Distribui pontos conforme o resultado
    if (scoreA > scoreB) {
      // Time A venceu
      stats[match.teamA].points += 3;
      stats[match.teamA].won++;
      stats[match.teamB].lost++;
    } else if (scoreB > scoreA) {
      // Time B venceu
      stats[match.teamB].points += 3;
      stats[match.teamB].won++;
      stats[match.teamA].lost++;
    } else {
      // Empate
      stats[match.teamA].points += 1;
      stats[match.teamB].points += 1;
      stats[match.teamA].drawn++;
      stats[match.teamB].drawn++;
    }
  });

  // Calcula o saldo de gols no final (gols marcados - sofridos)
  // Fazemos isso aqui pois precisamos que todos os jogos já
  // tenham sido processados antes de calcular o saldo final
  Object.values(stats).forEach((team) => {
    team.goalDifference = team.goalsFor - team.goalsAgainst;
  });

  // Retorna o objeto stats como array de times
  // (mais fácil de ordenar na próxima etapa)
  return Object.values(stats);
};

// =============================================================
// 2. RESOLVEHEADTOHEAD
// =============================================================
// Quando dois ou mais times estão empatados em pontos, saldo
// e gols marcados, a FIFA usa o confronto direto entre eles.
//
// Essa função recebe o grupo de times empatados e os jogos
// originais, e recalcula as estatísticas considerando APENAS
// os jogos entre esses times — ignorando o resto do grupo.
// =============================================================
const resolveHeadToHead = (tiedTeams, matches, scores) => {
  // Pega só os ids dos times empatados para comparação rápida
  const tiedIds = new Set(tiedTeams.map((t) => t.teamId));

  // Filtra só os jogos onde AMBOS os times estão entre os empatados
  const headToHeadMatches = matches.filter(
    (match) => tiedIds.has(match.teamA) && tiedIds.has(match.teamB),
  );

  // Recalcula as estatísticas usando apenas esses jogos
  const headToHeadStats = calculateStats(headToHeadMatches, scores);

  // Ordena esses times pelo mini-ranking do confronto direto
  // (mesmos critérios: pontos → saldo → gols marcados)
  return headToHeadStats.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference)
      return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
};

// =============================================================
// 3. SORTSTANDINGS
// =============================================================
// Ordena o array de times pelos critérios da FIFA em sequência.
// Quando dois times empatam em todos os critérios gerais,
// chama resolveHeadToHead() para o desempate final.
//
// CONCEITO: Array.sort() com função comparadora
// O sort recebe dois elementos (a, b) e espera:
//   número negativo → a vem antes de b
//   número positivo → b vem antes de a
//   zero            → empate (mesma posição)
// =============================================================
const sortStandings = (teams, matches, scores) => {
  return [...teams].sort((a, b) => {
    // Critério 1: pontos
    if (b.points !== a.points) return b.points - a.points;

    // Critério 2: saldo de gols
    if (b.goalDifference !== a.goalDifference)
      return b.goalDifference - a.goalDifference;

    // Critério 3: gols marcados
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

    // Critério 4: confronto direto
    // Chegamos aqui só se os dois times estão empatados em tudo acima.
    // Chamamos resolveHeadToHead() com esses dois times e vemos
    // quem sai na frente no mini-ranking.
    const headToHead = resolveHeadToHead([a, b], matches, scores);
    if (!headToHead.length) return 0;
    return headToHead[0].teamId === a.teamId ? -1 : 1;
  });
};

// =============================================================
// 4. CALCGROUPSTANDINGS — FUNÇÃO PRINCIPAL
// =============================================================
// Essa é a única função que o resto do app vai importar e usar.
// Ela orquestra tudo: calcula, ordena e devolve a classificação
// completa de um grupo.
//
// PARÂMETROS:
//   matches → array de jogos do grupo (de getMatchesByGroup())
//   scores  → objeto com placares digitados pelo usuário
//
// RETORNO: array de times ordenados com todas as estatísticas
// Ex: [
//   { teamId: "BRA", points: 9, played: 3, won: 3, ... },
//   { teamId: "MAR", points: 6, played: 3, won: 2, ... },
//   ...
// ]
// =============================================================
export const calcGroupStandings = (matches, scores) => {
  // Times que ainda não jogaram nenhuma partida não aparecem
  // em calculateStats (pois nunca foram "ensureTeam'd").
  // Precisamos garanti-los na tabela mesmo sem jogos.
  const allTeamIds = [...new Set(matches.flatMap((m) => [m.teamA, m.teamB]))];

  // Calcula as estatísticas dos jogos preenchidos
  const stats = calculateStats(matches, scores);

  // Adiciona times que ainda não têm nenhum jogo preenchido
  // com estatísticas zeradas — para aparecerem na tabela
  allTeamIds.forEach((id) => {
    if (!stats.find((t) => t.teamId === id)) {
      stats.push({
        teamId: id,
        points: 0,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
      });
    }
  });

  // Ordena e retorna a classificação final
  return sortStandings(stats, matches, scores);
};
