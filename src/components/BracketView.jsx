// =============================================================
// src/components/BracketView.jsx — sem tamanhos absolutos
// =============================================================
// Todas as células crescem para preencher o espaço disponível
// na sua fase, sem nenhum px fixo.
//
// A cadeia de flex funciona assim:
//
// Desktop (paisagem):
//   bracket (flex-row, h-[85vh])
//     └── BracketSide (flex-1)
//           └── fases (flex-row, flex-1)
//                 └── fase (flex-col, flex-1)
//                       └── células (flex-col, flex-1)
//                             └── TeamCell (w-full aspect-square)
//
// Mobile (retrato):
//   bracket (flex-col)
//     └── BracketSide (flex-1)
//           └── fases (flex-col, flex-1)
//                 └── fase (flex-row, flex-1)
//                       └── células (flex-row, flex-1)
//                             └── TeamCell (h-full aspect-square)
// =============================================================

import { useState, forwardRef } from 'react';
import { ROUNDS } from '../logic/bracket';
import { getTeamById } from '../data/teams';
import FlagImage from './FlagImage';
import MatchInput from './MatchInput';

// =============================================================
// TEAMCELL — célula individual de um time
// =============================================================
// Sem tamanho fixo — preenche 100% do container pai.
// Desktop: pai controla a largura → w-full + aspect-square
// Mobile:  pai controla a altura  → h-full + aspect-square
// =============================================================
const TeamCell = forwardRef(({ teamId, isWinner }, ref) => {
  const team = getTeamById(teamId);

  return (
    <div
      ref={ref}
      className={`
        w-full h-full
        flex flex-col items-center justify-center gap-0.5
        border rounded-xl text-center
        transition-all duration-300
        ${
          teamId
            ? isWinner
              ? 'bg-yellow-400/20 border-yellow-400/60 shadow-[0_0_8px_rgba(250,204,21,0.3)]'
              : 'bg-white/8 border-white/20'
            : 'bg-white/3 border-white/8'
        }
      `}
    >
      {teamId ? (
        <>
          <FlagImage team={team} size={14} />
          <span
            className={`
              text-[7px] font-medium leading-tight
              px-0.5 w-full text-center truncate
              ${isWinner ? 'text-yellow-400' : 'text-white/80'}
            `}
          >
            {team?.code ?? teamId}
          </span>
        </>
      ) : (
        <span className='text-[6px] text-white/20 leading-tight px-0.5'>
          TBD
        </span>
      )}
    </div>
  );
});

TeamCell.displayName = 'TeamCell';

// =============================================================
// BRACKETSIDE — único componente para todos os breakpoints
// =============================================================
// A célula cresce para preencher o espaço disponível via
// flex-1 em toda a cadeia — sem nenhum px fixo.
//
// Desktop: fases são COLUNAS
//   - Container externo: flex-row
//   - Cada fase: flex-col + flex-1
//   - Células: flex-col + flex-1, w-full + aspect-square
//
// Mobile: fases são LINHAS
//   - Container externo: flex-col
//   - Cada fase: flex-row + flex-1
//   - Células: flex-row + flex-1, h-full + aspect-square
// =============================================================
const BracketSide = ({ rounds, reversed = false }) => {
  const phaseKeys = reversed
    ? ['sf', 'qf', 'r16', 'r32']
    : ['r32', 'r16', 'qf', 'sf'];

  const phaseLabels = {
    r32: 'R32',
    r16: 'R16',
    qf: 'QF',
    sf: 'Semi',
  };

  return (
    // Container externo:
    //   Mobile  → flex-col (fases empilhadas)
    //   Desktop → flex-row (fases lado a lado)
    // flex-1 em ambos para dividir o espaço igualmente
    // min-w-0 min-h-0 para permitir encolhimento
    <div className='flex flex-col sm:flex-row flex-1 min-w-0 min-h-0 gap-1'>
      {phaseKeys.map((key) => {
        const matches = rounds[key] ?? [];

        const cells = matches.flatMap((match, matchIndex) => [
          {
            key: `${key}_${matchIndex}_A`,
            teamId: match?.teamA ?? null,
            isWinner: match?.winner === match?.teamA && !!match?.winner,
          },
          {
            key: `${key}_${matchIndex}_B`,
            teamId: match?.teamB ?? null,
            isWinner: match?.winner === match?.teamB && !!match?.winner,
          },
        ]);

        return (
          // Container da fase:
          //   Mobile  → flex-row (label à esq + células em linha)
          //   Desktop → flex-col (label em cima + células em coluna)
          // flex-1 divide o espaço igualmente entre as fases
          <div
            key={key}
            className='flex flex-row sm:flex-col flex-1 min-w-0 min-h-0 gap-1 sm:gap-0'
          >
            {/* Label da fase */}
            <div className='flex items-center sm:justify-center w-5 sm:w-full shrink-0 sm:mb-1'>
              <span className='text-white/25 text-[6px] font-bold uppercase tracking-wider'>
                {phaseLabels[key]}
              </span>
            </div>

            {/* Container das células:
                Mobile  → flex-row, células lado a lado
                Desktop → flex-col, células empilhadas
                flex-1 em cada célula divide o espaço igualmente
                A TeamCell preenche com w-full aspect-square */}
            <div className='flex flex-row sm:flex-col flex-1 min-w-0 min-h-0 gap-0.5'>
              {cells.map((cell) => (
                // flex-1 faz cada célula ocupar espaço igual
                // min-w-0 min-h-0 permite encolhimento
                <div
                  key={cell.key}
                  className='flex-1 min-w-0 min-h-0 flex items-center justify-center'
                >
                  <TeamCell teamId={cell.teamId} isWinner={cell.isWinner} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// =============================================================
// FINALCELL — único componente para todos os breakpoints
// =============================================================
// Mobile:  final e 3º lado a lado (flex-row)
// Desktop: final centralizada + 3º no fundo (flex-col)
//
// MatchBlock reutiliza a estrutura de um jogo (final ou 3º)
// As células da FinalCell têm tamanho fixo relativo ao
// container — usamos w-full no bloco para que o pai controle
// =============================================================
const FinalCell = ({ bracket }) => {
  const finalMatch = bracket[ROUNDS.FINAL]?.[0];
  const thirdMatch = bracket[ROUNDS.THIRD_PLACE]?.[0];
  const champion = finalMatch?.winner;
  const thirdPlaceWinner = thirdMatch?.winner;
  const champTeam = getTeamById(champion);
  const thirdTeam = getTeamById(thirdPlaceWinner);

  // Bloco de um jogo — reutilizado para final e 3º lugar
  const MatchBlock = ({
    match,
    label,
    labelColor,
    winner,
    winnerTeam,
    emoji,
  }) => (
    <div className='flex flex-col items-center gap-1'>
      <p
        className={`text-[6px] sm:text-[7px] font-bold uppercase tracking-widest ${labelColor}`}
      >
        {label}
      </p>

      {/* Duas células lado a lado — sempre flex-row */}
      <div className='flex flex-row items-center gap-1'>
        <div className='w-8 sm:w-10 aspect-square'>
          <TeamCell
            teamId={match?.teamA ?? null}
            isWinner={match?.winner === match?.teamA && !!match?.winner}
          />
        </div>
        <span className='text-white/30 text-[7px] font-bold shrink-0'>×</span>
        <div className='w-8 sm:w-10 aspect-square'>
          <TeamCell
            teamId={match?.teamB ?? null}
            isWinner={match?.winner === match?.teamB && !!match?.winner}
          />
        </div>
      </div>

      {/* Vencedor — min-h reserva espaço mesmo sem vencedor */}
      <div className='min-h-[24px] flex flex-col items-center gap-0.5'>
        {winner && (
          <>
            <span className='text-xs'>{emoji}</span>
            <span
              className={`text-[6px] sm:text-[7px] font-bold text-center ${labelColor}`}
            >
              {winnerTeam?.code}
            </span>
          </>
        )}
      </div>
    </div>
  );

  return (
    // Mobile:  flex-row — final e 3º lado a lado
    // Desktop: flex-col — final centralizada, 3º no fundo
    <div className='flex flex-row sm:flex-col items-center justify-center sm:justify-between gap-3 sm:gap-0 px-1 sm:px-2 shrink-0 sm:self-stretch'>
      {/* Final — flex-1 no desktop para centralizar verticalmente */}
      <div className='flex sm:flex-1 items-center justify-center'>
        <MatchBlock
          match={finalMatch}
          label='Final'
          labelColor='text-yellow-400'
          winner={champion}
          winnerTeam={champTeam}
          emoji='🏆'
        />
      </div>

      {/* Divisória: vertical no mobile, horizontal no desktop */}
      <div className='h-8 w-px sm:h-px sm:w-full bg-white/10 shrink-0' />

      {/* 3º Lugar — fica no fundo no desktop */}
      <MatchBlock
        match={thirdMatch}
        label='3º Lugar'
        labelColor='text-white/40'
        winner={thirdPlaceWinner}
        winnerTeam={thirdTeam}
        emoji='🥉'
      />
    </div>
  );
};

// =============================================================
// BRACKETVIEW — COMPONENTE PRINCIPAL
// =============================================================
export default function BracketView({ bracket, onPick, knockoutScores }) {
  const [activePhase, setActivePhase] = useState('r32');
  const [inputPage, setInputPage] = useState(0);

  const phaseMatches = {
    r32: [...(bracket.left?.r32 ?? []), ...(bracket.right?.r32 ?? [])],
    r16: [...(bracket.left?.r16 ?? []), ...(bracket.right?.r16 ?? [])],
    qf: [...(bracket.left?.qf ?? []), ...(bracket.right?.qf ?? [])],
    sf: [...(bracket.left?.sf ?? []), ...(bracket.right?.sf ?? [])],
    final: [
      ...(bracket[ROUNDS.FINAL] ?? []),
      ...(bracket[ROUNDS.THIRD_PLACE] ?? []),
    ],
  };

  const phaseLabelsInput = {
    r32: 'Round of 32',
    r16: 'Oitavas',
    qf: 'Quartas',
    sf: 'Semifinal',
    final: 'Final & 3º Lugar',
  };

  const MATCHES_PER_PAGE = 4;
  const currentPhaseMatches = phaseMatches[activePhase] ?? [];
  const totalPages = Math.ceil(currentPhaseMatches.length / MATCHES_PER_PAGE);
  const pageMatches = currentPhaseMatches.slice(
    inputPage * MATCHES_PER_PAGE,
    (inputPage + 1) * MATCHES_PER_PAGE,
  );

  const PHASE_ORDER = ['r32', 'r16', 'qf', 'sf', 'final'];
  const activePhaseIndex = PHASE_ORDER.indexOf(activePhase);
  const isVeryFirst = activePhaseIndex === 0 && inputPage === 0;
  const isVeryLast =
    activePhaseIndex === PHASE_ORDER.length - 1 && inputPage === totalPages - 1;

  const handlePhaseChange = (phase) => {
    setActivePhase(phase);
    setInputPage(0);
  };

  const handlePrev = () => {
    if (inputPage > 0) {
      setInputPage((p) => p - 1);
    } else {
      const prevPhase = PHASE_ORDER[activePhaseIndex - 1];
      const prevPhaseMatches = phaseMatches[prevPhase] ?? [];
      const prevTotalPages = Math.ceil(
        prevPhaseMatches.length / MATCHES_PER_PAGE,
      );
      setActivePhase(prevPhase);
      setInputPage(prevTotalPages - 1);
    }
  };

  const handleNext = () => {
    if (inputPage < totalPages - 1) {
      setInputPage((p) => p + 1);
    } else {
      const nextPhase = PHASE_ORDER[activePhaseIndex + 1];
      setActivePhase(nextPhase);
      setInputPage(0);
    }
  };

  const scores = knockoutScores ?? {};

  return (
    <div className='flex flex-col gap-5'>
      {/* ══════════════════════════════════════
          PAINEL DE INPUTS
      ══════════════════════════════════════ */}
      <div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4'>
        <div className='flex gap-1 mb-4 overflow-x-auto pb-1'>
          {Object.entries(phaseLabelsInput).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handlePhaseChange(key)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap
                transition-all duration-200
                ${
                  activePhase === key
                    ? 'bg-yellow-400 text-[#001040]'
                    : 'bg-white/10 text-white/50 hover:text-white hover:bg-white/20'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        <div className='flex items-center justify-between mb-3'>
          <button
            onClick={handlePrev}
            disabled={isVeryFirst}
            className='w-7 h-7 flex items-center justify-center rounded-lg
              text-white/50 hover:text-white hover:bg-white/10
              disabled:opacity-20 disabled:cursor-not-allowed text-lg'
          >
            ‹
          </button>

          <div className='flex gap-1'>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setInputPage(i)}
                className={`rounded-full transition-all duration-200
                  ${
                    inputPage === i
                      ? 'bg-yellow-400 w-3 h-1.5'
                      : 'bg-white/20 w-1.5 h-1.5'
                  }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={isVeryLast}
            className='w-7 h-7 flex items-center justify-center rounded-lg
              text-white/50 hover:text-white hover:bg-white/10
              disabled:opacity-20 disabled:cursor-not-allowed text-lg'
          >
            ›
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {pageMatches.map((match) => {
            const isLocked = !match.teamA || !match.teamB;
            return (
              <MatchInput
                key={match.id}
                match={match}
                scores={scores}
                onScoreChange={onPick}
                locked={isLocked}
              />
            );
          })}
          {pageMatches.length === 0 && (
            <div className='col-span-2 text-center text-white/30 text-sm py-6'>
              Preencha a fase anterior para desbloquear estes jogos.
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          BRACKET VISUAL
      ══════════════════════════════════════ */}
      <div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 sm:p-3 lg:p-4'>
        {/* Container principal:
            Mobile  → flex-col, overflow-x-auto se necessário
            Desktop → flex-row, altura da viewport */}
        <div
          className='
          flex flex-col sm:flex-row
          items-stretch
          gap-1 sm:gap-2
          overflow-x-auto sm:overflow-visible
          sm:h-[85vh]
        '
        >
          {bracket.left && (
            <BracketSide rounds={bracket.left} reversed={false} />
          )}

          <FinalCell bracket={bracket} />

          {bracket.right && (
            <BracketSide rounds={bracket.right} reversed={true} />
          )}
        </div>
      </div>

      <p className='text-white/25 text-xs text-center'>
        Preencha os placares acima para avançar os times no bracket.
      </p>
    </div>
  );
}
