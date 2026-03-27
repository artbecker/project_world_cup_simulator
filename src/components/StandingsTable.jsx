// =============================================================
// src/components/StandingsTable.jsx
// =============================================================
// Exibe a tabela de classificação de um grupo.
//
// PROPS que recebe:
//   standings → array ordenado de times com estatísticas
//               (retorno de calcGroupStandings())
//   groupLetter → letra do grupo (para lógica de classificados)
// =============================================================

import { getTeamById } from '../data/teams';
import FlagImage from './FlagImage';

// Quantos times avançam de cada posição
// 1° e 2° lugar avançam direto — 3° lugar pode avançar como
// um dos 8 melhores terceiros (indicamos com cor diferente)
const POSITION_STYLES = {
  0: 'bg-emerald-500/20', // 1° — classificado
  1: 'bg-emerald-500/20', // 2° — classificado
  2: 'bg-yellow-500/10', // 3° — possível classificado
  3: 'bg-transparent', // 4° — eliminado
};

export default function StandingsTable({ standings }) {
  return (
    <div className='w-full'>
      {/* ── CABEÇALHO DA TABELA ── */}
      <div
        className='
        grid text-white/40 text-xs font-semibold uppercase tracking-wider
        px-3 pb-2 border-b border-white/10
      '
        // CSS Grid com colunas fixas:
        // "1fr" = fração do espaço disponível (nome do time)
        // valores fixos em px para as colunas numéricas
        style={{ gridTemplateColumns: '1fr 2rem 2rem 2rem 2rem 2rem' }}
      >
        <span>Seleção</span>
        {/* Abreviações padrão FIFA */}
        <span className='text-center'>P</span> {/* Pontos */}
        <span className='text-center'>J</span> {/* Jogos */}
        <span className='text-center'>V</span> {/* Vitórias */}
        <span className='text-center'>SG</span> {/* Saldo de gols */}
        <span className='text-center'>GM</span> {/* Gols marcados */}
      </div>

      {/* ── LINHAS DOS TIMES ── */}
      {standings.map((teamStats, index) => {
        // Busca o objeto completo do time para pegar nome e bandeira
        const team = getTeamById(teamStats.teamId);

        return (
          <div
            key={teamStats.teamId}
            className={`
              grid items-center px-3 py-2
              border-b border-white/5 last:border-0
              transition-colors duration-200
              ${POSITION_STYLES[index]}
            `}
            style={{ gridTemplateColumns: '1fr 2rem 2rem 2rem 2rem 2rem' }}
            // "last:border-0" remove a borda do último item da lista
            // Isso é uma "variant" do Tailwind — aplica estilo
            // só no último elemento filho
          >
            {/* Posição + bandeira + nome */}
            <div className='flex items-center gap-2 min-w-0'>
              {/* Número da posição */}
              <span className='text-white/40 text-xs w-4 shrink-0'>
                {index + 1}
              </span>

              {/* Bandeira */}
              <FlagImage team={team} size={20} />

              {/* Nome — trunca se necessário */}
              <span className='text-white text-sm font-medium truncate'>
                {team?.name}
              </span>
            </div>

            {/* Estatísticas — cada uma centralizada na coluna */}
            <span className='text-white font-bold text-sm text-center'>
              {teamStats.points}
            </span>
            <span className='text-white/60 text-sm text-center'>
              {teamStats.played}
            </span>
            <span className='text-white/60 text-sm text-center'>
              {teamStats.won}
            </span>

            {/* Saldo de gols — verde se positivo, vermelho se negativo */}
            <span
              className={`text-sm text-center font-medium ${
                teamStats.goalDifference > 0
                  ? 'text-emerald-400'
                  : teamStats.goalDifference < 0
                    ? 'text-red-400'
                    : 'text-white/60'
              }`}
            >
              {/* Adiciona "+" nos positivos para ficar explícito */}
              {teamStats.goalDifference > 0
                ? `+${teamStats.goalDifference}`
                : teamStats.goalDifference}
            </span>

            <span className='text-white/60 text-sm text-center'>
              {teamStats.goalsFor}
            </span>
          </div>
        );
      })}

      {/* ── LEGENDA ── */}
      <div className='flex gap-4 mt-3 px-3'>
        <div className='flex items-center gap-1'>
          <div className='w-2 h-2 rounded-full bg-emerald-400/20' />
          <span className='text-white/40 text-xs'>Classificado</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-2 h-2 rounded-full bg-yellow-400/10' />
          <span className='text-white/40 text-xs'>Possível classificado</span>
        </div>
      </div>
    </div>
  );
}
