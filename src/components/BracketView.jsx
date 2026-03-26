// =============================================================
// src/components/BracketView.jsx
// =============================================================
// Componente visual do mata-mata. Exibe uma fase por vez com
// linhas conectoras que "acendem" conforme o caminho é definido.
//
// PROPS:
//   bracket       → objeto com todas as fases (de buildBracket)
//   knockoutPicks → escolhas do usuário { matchId: teamId }
//   onPick        → função para registrar escolha do usuário
// =============================================================

import { useState, useRef, useEffect } from 'react';
import {
  ROUNDS,
  ROUND_LABELS,
  ROUND_ORDER,
  getNextRound,
  getPrevRound,
} from '../logic/bracket';
import { getTeamById } from '../data/teams';
import FlagImage from './FlagImage';

// =============================================================
// MATCHCARD
// =============================================================
// Card de um confronto individual. O usuário clica em um time
// para defini-lo como vencedor. Clicando novamente, desfaz.
// =============================================================
const MatchCard = ({ match, onPick, isLast }) => {
  const teamA = getTeamById(match.teamA);
  const teamB = getTeamById(match.teamB);
  const hasWinner = !!match.winner;

  // Renderiza um slot de time (pode estar vazio ainda)
  const TeamSlot = ({ team, teamId, isWinner }) => {
    const isEmpty = !teamId;

    return (
      <button
        onClick={() => !isEmpty && onPick(match.id, teamId)}
        disabled={isEmpty}
        className={`
          w-full flex items-center gap-2 px-3 py-2
          rounded-lg transition-all duration-300
          ${
            isEmpty
              ? // Slot vazio — placeholder sutil
                'opacity-30 cursor-not-allowed'
              : // Time definido mas sem vencedor ainda
                !hasWinner
                ? 'hover:bg-white/15 cursor-pointer'
                : // Vencedor — destaque em dourado
                  isWinner
                  ? 'bg-yellow-400/20 border border-yellow-400/50'
                  : // Perdedor — esmaecido
                    'opacity-30'
          }
        `}
      >
        {isEmpty ? (
          // Placeholder para vaga ainda não definida
          <>
            <div className='w-6 h-4 rounded bg-white/10' />
            <span className='text-white/30 text-sm'>A definir</span>
          </>
        ) : (
          <>
            <FlagImage team={team} size={20} />
            <span
              className={`
              text-sm font-medium truncate
              ${isWinner ? 'text-yellow-400' : 'text-white'}
            `}
            >
              {team?.name ?? teamId}
            </span>
            {/* Ícone de check quando vencedor */}
            {isWinner && (
              <span className='ml-auto text-yellow-400 text-xs'>✓</span>
            )}
          </>
        )}
      </button>
    );
  };

  return (
    // "group" aqui é uma classe especial do Tailwind que permite
    // estilizar filhos com "group-hover:" — não é o grupo da Copa!
    <div className='relative flex items-center gap-3'>
      {/* Card do confronto */}
      <div
        className={`
        flex-1 bg-white/5 backdrop-blur-sm
        border rounded-xl overflow-hidden
        transition-all duration-300
        ${hasWinner ? 'border-yellow-400/30 bg-white/8' : 'border-white/10'}
      `}
      >
        {/* Time A */}
        <TeamSlot
          team={teamA}
          teamId={match.teamA}
          isWinner={match.winner === match.teamA}
        />

        {/* Divisor */}
        <div className='mx-3 h-px bg-white/10' />

        {/* Time B */}
        <TeamSlot
          team={teamB}
          teamId={match.teamB}
          isWinner={match.winner === match.teamB}
        />
      </div>

      {/* ── LINHA CONECTORA ── */}
      {/* Linha que sai do card em direção à próxima fase */}
      {/* Só renderiza se não for o último jogo da fase */}
      {!isLast && (
        <div className='absolute -right-6 top-1/2 w-6 flex items-center'>
          <div
            className={`
            h-px w-full transition-all duration-500
            ${
              hasWinner
                ? 'bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.6)]'
                : 'bg-white/15'
            }
          `}
          />
        </div>
      )}
    </div>
  );
};

// =============================================================
// BRACKETCOLUMN
// =============================================================
// Coluna de uma fase do bracket. Renderiza os cards dos jogos
// com as linhas verticais conectando pares de jogos.
// =============================================================
const BracketColumn = ({ matches, onPick, showConnectors }) => {
  return (
    <div className='flex flex-col gap-8 min-w-[200px] flex-1'>
      {matches.map((match, index) => {
        // Pares de jogos se conectam ao mesmo jogo na próxima fase
        // índices 0-1 → mesmo próximo jogo
        // índices 2-3 → mesmo próximo jogo, etc.
        const isFirstOfPair = index % 2 === 0;
        const isSecondOfPair = index % 2 === 1;
        const pairHasWinners =
          matches[index % 2 === 0 ? index : index - 1]?.winner &&
          matches[index % 2 === 0 ? index + 1 : index]?.winner;

        return (
          <div key={match.id} className='relative flex flex-col'>
            {/* Card do jogo */}
            <div className='relative'>
              <MatchCard
                match={match}
                onPick={onPick}
                isLast={!showConnectors}
              />

              {/* ── LINHA VERTICAL ── */}
              {/* Liga os dois jogos de um par (sobe ou desce) */}
              {showConnectors && (
                <>
                  {isFirstOfPair && (
                    // Linha que desce do primeiro jogo do par
                    <div
                      className={`
                      absolute -right-6 top-1/2 bottom-0
                      w-px transition-all duration-500
                      ${
                        pairHasWinners
                          ? 'bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.4)]'
                          : 'bg-white/15'
                      }
                    `}
                      style={{ height: 'calc(100% + 2rem)' }}
                    />
                  )}
                  {isSecondOfPair && (
                    // Linha que sobe do segundo jogo do par
                    <div
                      className={`
                      absolute -right-6 bottom-1/2 top-0
                      w-px transition-all duration-500
                      ${
                        pairHasWinners
                          ? 'bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.4)]'
                          : 'bg-white/15'
                      }
                    `}
                      style={{ height: 'calc(100% + 2rem)' }}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// =============================================================
// BRACKETVIEW — COMPONENTE PRINCIPAL
// =============================================================
export default function BracketView({ bracket, onPick, knockoutPicks }) {
  // Fase ativa na navegação — começa no Round of 32
  const [activeRound, setActiveRound] = useState(ROUNDS.ROUND_OF_32);

  const currentMatches = bracket[activeRound] ?? [];
  const nextRound = getNextRound(activeRound);
  const prevRound = getPrevRound(activeRound);
  const nextMatches = nextRound ? bracket[nextRound] : null;

  return (
    <div>
      {/* ── NAVEGAÇÃO DE FASES ── */}
      <div className='flex items-center justify-center gap-2 mb-6 flex-wrap'>
        {ROUND_ORDER.map((round) => {
          // Conta quantos vencedores já foram definidos nessa fase
          const matches = bracket[round] ?? [];
          const defined = matches.filter((m) => m.winner).length;
          const total = matches.length;
          const complete = defined === total && total > 0;

          return (
            <button
              key={round}
              onClick={() => setActiveRound(round)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-semibold
                transition-all duration-200 flex items-center gap-1.5
                ${
                  activeRound === round
                    ? 'bg-yellow-400 text-[#001040]'
                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                }
              `}
            >
              {ROUND_LABELS[round]}
              {/* Indicador de progresso da fase */}
              {total > 0 && (
                <span
                  className={`
                  text-xs rounded-full px-1
                  ${
                    activeRound === round
                      ? 'bg-[#001040]/30 text-[#001040]'
                      : complete
                        ? 'text-yellow-400'
                        : 'text-white/40'
                  }
                `}
                >
                  {defined}/{total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── ÁREA DO BRACKET ── */}
      <div
        className='
        bg-white/5 backdrop-blur-md border border-white/10
        rounded-2xl p-6 overflow-x-auto
      '
      >
        <div className='flex gap-12 min-w-max'>
          {/* Fase atual */}
          <div className='flex flex-col'>
            <p className='text-white/40 text-xs font-semibold uppercase tracking-wider mb-4 text-center'>
              {ROUND_LABELS[activeRound]}
            </p>
            <BracketColumn
              matches={currentMatches}
              onPick={onPick}
              showConnectors={!!nextMatches}
            />
          </div>

          {/* Próxima fase — só os slots, sem interação */}
          {nextMatches && (
            <div className='flex flex-col justify-around'>
              <p className='text-white/40 text-xs font-semibold uppercase tracking-wider mb-4 text-center'>
                {ROUND_LABELS[nextRound]}
              </p>

              {/* Slots da próxima fase — mostra quem já avançou */}
              <div className='flex flex-col justify-around gap-0 min-w-[200px] flex-1'>
                {nextMatches.map((match, index) => {
                  const teamA = getTeamById(match.teamA);
                  const teamB = getTeamById(match.teamB);

                  return (
                    <div key={match.id}>
                      {index > 0 && index % 1 === 0 && <div className='h-8' />}
                      <div
                        className={`
                        bg-white/3 border rounded-xl overflow-hidden
                        transition-all duration-300
                        ${
                          match.teamA || match.teamB
                            ? 'border-white/20'
                            : 'border-white/5'
                        }
                      `}
                      >
                        {/* Slot time A */}
                        <div className='flex items-center gap-2 px-3 py-2'>
                          {match.teamA ? (
                            <>
                              <FlagImage team={teamA} size={20} />
                              <span className='text-white/70 text-sm truncate'>
                                {teamA?.name ?? match.teamA}
                              </span>
                            </>
                          ) : (
                            <span className='text-white/20 text-sm'>
                              A definir
                            </span>
                          )}
                        </div>
                        <div className='mx-3 h-px bg-white/10' />
                        {/* Slot time B */}
                        <div className='flex items-center gap-2 px-3 py-2'>
                          {match.teamB ? (
                            <>
                              <FlagImage team={teamB} size={20} />
                              <span className='text-white/70 text-sm truncate'>
                                {teamB?.name ?? match.teamB}
                              </span>
                            </>
                          ) : (
                            <span className='text-white/20 text-sm'>
                              A definir
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── INSTRUÇÃO ── */}
      <p className='text-white/30 text-xs text-center mt-4'>
        Clique em um time para defini-lo como vencedor. Clique novamente para
        desfazer.
      </p>
    </div>
  );
}
