// =============================================================
// src/components/GroupSection.jsx
// =============================================================
// Componente que representa um grupo inteiro.
// Layout: jogos por rodada (esquerda/topo) + classificação
// (direita/baixo), responsivo para mobile e desktop.
//
// PROPS que recebe:
//   groupLetter   → letra do grupo ("A", "B", etc.)
//   scores        → estado central de placares
//   onScoreChange → função para atualizar placar
//   standings     → classificação calculada do grupo
// =============================================================

import { useState } from 'react';
import { useSwipe } from '../hooks/useSwipe';
import { GROUPS } from '../data/teams';
import { getMatchesByRound } from '../data/matches';
import MatchInput from './MatchInput';
import StandingsTable from './StandingsTable';

// Número total de rodadas — sempre 3 em grupos de 4 times
const TOTAL_ROUNDS = 3;

export default function GroupSection({
  groupLetter,
  scores,
  onScoreChange,
  standings,
}) {
  // Estado local da rodada ativa — começa na rodada 1
  // "local" porque cada grupo controla sua própria rodada
  // independentemente dos outros grupos
  const [activeRound, setActiveRound] = useState(1);

  // Pega os jogos da rodada ativa desse grupo
  // Retorna um objeto { 1: [...], 2: [...], 3: [...] }
  const matchesByRound = getMatchesByRound(groupLetter);
  const currentMatches = matchesByRound[activeRound] ?? [];

  // Nome do grupo para exibir no cabeçalho
  const groupName = GROUPS[groupLetter].name;

  const { handleTouchStart, handleTouchEnd } = useSwipe(
    () => setActiveRound((r) => Math.min(TOTAL_ROUNDS, r + 1)), // swipe esquerda → próxima rodada
    () => setActiveRound((r) => Math.max(1, r - 1)), // swipe direita → rodada anterior
  );

  return (
    // Container principal do grupo — glass card
    <div
      className='
      bg-white/5 backdrop-blur-md
      border border-white/10
      rounded-2xl overflow-hidden
      mb-6
    '
    >
      {/* ── CABEÇALHO DO GRUPO ── */}
      <div
        className='
        px-5 py-4
        border-b border-white/10
        bg-white/5
      '
      >
        <h2 className='text-white font-bold text-lg tracking-wide uppercase'>
          {groupName}
        </h2>
      </div>

      {/* ── CONTEÚDO: grid responsivo ── */}
      {/* No mobile: coluna única (flex-col) */}
      {/* No desktop (md:): duas colunas lado a lado */}
      <div className='flex flex-col md:flex-row'>
        {/* ── PAINEL DE JOGOS (esquerda no desktop, topo no mobile) ── */}
        <div className='flex-1 p-4 md:border-r border-white/10'>
          {/* Navegação de rodadas */}
          <div className='flex items-center justify-between mb-4'>
            {/* Botão rodada anterior */}
            <button
              onClick={() => setActiveRound((r) => Math.max(1, r - 1))}
              disabled={activeRound === 1}
              className='
                w-8 h-8 flex items-center justify-center
                text-white/60 hover:text-white
                disabled:opacity-20 disabled:cursor-not-allowed
                transition-all duration-150
                rounded-lg hover:bg-white/10
              '
              // "disabled:" é uma variant do Tailwind — aplica
              // estilos quando o botão está desabilitado
            >
              ‹
            </button>

            {/* Título da rodada com indicadores de pontos */}
            <div className='flex flex-col items-center gap-1'>
              <span className='text-white font-semibold text-sm'>
                {activeRound}ª Rodada
              </span>

              {/* Indicadores de rodada — bolinhas como no GE */}
              <div className='flex gap-1'>
                {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveRound(i + 1)}
                    className={`
                      w-1.5 h-1.5 rounded-full transition-all duration-200
                      ${
                        activeRound === i + 1
                          ? 'bg-yellow-400 w-3' // ativa: dourada e mais larga
                          : 'bg-white/20' // inativa: cinza sutil
                      }
                    `}
                  />
                ))}
              </div>
            </div>

            {/* Botão próxima rodada */}
            <button
              onClick={() =>
                setActiveRound((r) => Math.min(TOTAL_ROUNDS, r + 1))
              }
              disabled={activeRound === TOTAL_ROUNDS}
              className='
                w-8 h-8 flex items-center justify-center
                text-white/60 hover:text-white
                disabled:opacity-20 disabled:cursor-not-allowed
                transition-all duration-150
                rounded-lg hover:bg-white/10
              '
            >
              ›
            </button>
          </div>

          {/* Lista de jogos da rodada ativa */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className='flex flex-col gap-2'
          >
            {currentMatches.map((match) => (
              <MatchInput
                key={match.id}
                match={match}
                scores={scores}
                onScoreChange={onScoreChange}
              />
            ))}
          </div>
        </div>

        {/* ── PAINEL DE CLASSIFICAÇÃO (direita no desktop, baixo no mobile) ── */}
        <div className='flex-1 p-4'>
          <p
            className='
            text-white/40 text-xs font-semibold uppercase
            tracking-wider mb-3
          '
          >
            Classificação
          </p>
          <StandingsTable standings={standings} />
        </div>
      </div>
    </div>
  );
}
