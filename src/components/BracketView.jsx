import { useState, forwardRef } from 'react';
import { ROUNDS } from '../logic/bracket';
import { getTeamById } from '../data/teams';
import FlagImage from './FlagImage';
import MatchInput from './MatchInput';

// =============================================================
// TEAMCIRCLE — bolinha de um time
// =============================================================
const TeamCircle = forwardRef(
  ({ teamId, isWinner, size = 'min(5vw, 5vh)' }, ref) => {
    const team = getTeamById(teamId);
    return (
      <div
        ref={ref}
        style={{ width: size, height: size }}
        className={`
        rounded-full flex items-center justify-center
        transition-all duration-300 shrink-0
        ${
          teamId
            ? isWinner
              ? 'bg-yellow-400/20 border-2 border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]'
              : 'bg-white/10 border border-white/20'
            : 'bg-white/5 border border-white/10'
        }
      `}
      >
        {teamId &&
          (team?.iso ? (
            <img
              src={`https://flagcdn.com/w160/${team.iso}.png`}
              alt={team?.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
              }}
            />
          ) : null)}
      </div>
    );
  },
);
TeamCircle.displayName = 'TeamCircle';

// =============================================================
// BRACKETSIDE — uma chave completa
// =============================================================
// A cadeia de flex propaga a altura do container pai:
//   bracket (h-[85vh])
//     BracketSide (h-full, flex-1)
//       fase (h-full, flex-1)
//         bolinhas (h-full, flex-1)
//           TeamCircle (w-full aspect-square)
// =============================================================
const BracketSide = ({ rounds, reversed = false }) => {
  const phaseKeys = reversed
    ? ['sf', 'qf', 'r16', 'r32']
    : ['r32', 'r16', 'qf', 'sf'];

  const phaseLabels = { r32: 'R32', r16: 'OITAVAS', qf: 'QUARTAS', sf: 'SEMI' };

  return (
    <div className='flex flex-col sm:flex-row flex-1 min-w-0 gap-1 sm:gap-2'>
      {phaseKeys.map((key) => {
        const matches = rounds[key] ?? [];
        const circles = matches.flatMap((match, i) => [
          {
            key: `${key}_${i}_A`,
            teamId: match?.teamA ?? null,
            isWinner: match?.winner === match?.teamA && !!match?.winner,
          },
          {
            key: `${key}_${i}_B`,
            teamId: match?.teamB ?? null,
            isWinner: match?.winner === match?.teamB && !!match?.winner,
          },
        ]);

        return (
          <div key={key} className='flex flex-row sm:flex-col flex-1 min-w-0'>
            {/* Label */}
            <span
              className='hidden sm:flex text-white/25 text-[8px] font-bold uppercase tracking-wider
              flex items-center sm:justify-center w-5 sm:w-full shrink-0 sm:mb-1'
            >
              {phaseLabels[key]}
            </span>

            {/* Bolinhas — justify-around centraliza e distribui igualmente
                items-center centraliza no eixo perpendicular */}
            <div
              className='flex flex-row sm:flex-col flex-1 min-w-0
              justify-around items-center'
            >
              {circles.map((c) => (
                <TeamCircle
                  key={c.key}
                  teamId={c.teamId}
                  isWinner={c.isWinner}
                  size={key === 'r32' ? 'min(5vw, 5vh)' : 'min(7vw, 7vh)'}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// =============================================================
// GAMECELL — dois círculos lado a lado com × entre eles
// Usado na final e no 3º lugar
// =============================================================
const GameCell = ({ match, label, labelColor, winner, emoji }) => {
  const winnerTeam = getTeamById(winner);
  return (
    <div className='flex flex-col items-center gap-1'>
      <p
        className={`text-[6px] sm:text-[7px] font-bold uppercase tracking-widest ${labelColor}`}
      >
        {label}
      </p>
      <div className='flex items-center gap-1 sm:gap-2'>
        <div className='w-8 h-8 sm:w-10 sm:h-10'>
          <TeamCircle
            teamId={match?.teamA ?? null}
            isWinner={match?.winner === match?.teamA && !!match?.winner}
          />
        </div>
        <span className='text-white/30 text-[7px] shrink-0'>×</span>
        <div className='w-8 h-8 sm:w-10 sm:h-10'>
          <TeamCircle
            teamId={match?.teamB ?? null}
            isWinner={match?.winner === match?.teamB && !!match?.winner}
          />
        </div>
      </div>
      <div className='min-h-[20px] flex flex-col items-center'>
        {winner && (
          <>
            <span className='text-xs'>{emoji}</span>
            <span className={`text-[6px] font-bold ${labelColor}`}>
              {winnerTeam?.code}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

// =============================================================
// BRACKETVIEW — COMPONENTE PRINCIPAL
// =============================================================
export default function BracketView({ bracket, onPick, knockoutScores }) {
  const [activePhase, setActivePhase] = useState('r32');
  const [inputPage, setInputPage] = useState(0);

  const finalMatch = bracket[ROUNDS.FINAL]?.[0];
  const thirdMatch = bracket[ROUNDS.THIRD_PLACE]?.[0];

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
    sf: 'Semifinais',
    final: 'Final e 3º Lugar',
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
      return;
    }
    const prev = PHASE_ORDER[activePhaseIndex - 1];
    const prevPages = Math.ceil(
      (phaseMatches[prev]?.length ?? 0) / MATCHES_PER_PAGE,
    );
    setActivePhase(prev);
    setInputPage(prevPages - 1);
  };

  const handleNext = () => {
    if (inputPage < totalPages - 1) {
      setInputPage((p) => p + 1);
      return;
    }
    setActivePhase(PHASE_ORDER[activePhaseIndex + 1]);
    setInputPage(0);
  };

  return (
    <div className='flex flex-col gap-5'>
      {/* INPUTS */}
      <div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4'>
        {/* Abas */}
        <div className='flex flex-wrap gap-1 mb-4 justify-center'>
          {Object.entries(phaseLabelsInput).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handlePhaseChange(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200
                ${activePhase === key ? 'bg-yellow-400 text-[#001040]' : 'bg-white/10 text-white/50 hover:text-white hover:bg-white/20'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Paginação */}
        <div className='flex items-center justify-between mb-3'>
          <button
            onClick={handlePrev}
            disabled={isVeryFirst}
            className='w-7 h-7 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed text-lg'
          >
            ‹
          </button>
          <div className='flex gap-1'>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setInputPage(i)}
                className={`rounded-full transition-all duration-200 ${inputPage === i ? 'bg-yellow-400 w-3 h-1.5' : 'bg-white/20 w-1.5 h-1.5'}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={isVeryLast}
            className='w-7 h-7 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed text-lg'
          >
            ›
          </button>
        </div>

        {/* Jogos */}
        <div
          className={`grid gap-3 ${currentPhaseMatches.length <= 2 ? 'grid-cols-1 mx-auto max-w-140' : 'grid-cols-1 md:grid-cols-2'}`}
        >
          {pageMatches.map((match) => {
            const isLocked = !match.teamA || !match.teamB;
            return (
              <MatchInput
                key={match.id}
                match={match}
                scores={knockoutScores ?? {}}
                onScoreChange={onPick}
                locked={isLocked}
                showPenalty={true}
                // Fases finais sempre têm pênaltis disponíveis
                // Grupos não passam essa prop — default é false
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

      {/* BRACKET VISUAL */}
      <div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 sm:p-4'>
        <div className='flex flex-col sm:flex-row items-stretch gap-2 sm:h-[85vh]'>
          {/* Chave esquerda */}
          {bracket.left && <BracketSide rounds={bracket.left} />}

          {/* Centro — final */}
          <div className='flex flex-col items-center justify-center gap-2 shrink-0 px-2'>
            {/* 3 bolinhas em linha: SF esq → campeão → SF dir */}
            <div className='flex items-center gap-2'>
              {/* Finalista esquerdo — vencedor da SF esquerda */}
              <TeamCircle
                teamId={bracket.left?.sf?.[0]?.winner ?? null}
                isWinner={false}
                size='min(7vw, 7vh)'
              />

              {/* Campeão — bolinha maior no centro */}
              <div className='flex flex-col items-center gap-1'>
                <TeamCircle
                  teamId={finalMatch?.winner ?? null}
                  isWinner={!!finalMatch?.winner}
                  size='min(12vw, 12vh)'
                />
                {/* Nome do campeão */}
                {finalMatch?.winner && (
                  <span className='text-yellow-400 text-[8px] font-bold text-center whitespace-nowrap'>
                    Campeão: {getTeamById(finalMatch.winner)?.name}
                  </span>
                )}
              </div>

              {/* Finalista direito — vencedor da SF direita */}
              <TeamCircle
                teamId={bracket.right?.sf?.[0]?.winner ?? null}
                isWinner={false}
                size='min(7vw, 7vh)'
              />
            </div>
          </div>

          {/* Chave direita */}
          {bracket.right && <BracketSide rounds={bracket.right} reversed />}
        </div>
      </div>

      <p className='text-white/25 text-xs text-center'>
        Preencha os placares acima para avançar os times no bracket.
      </p>
    </div>
  );
}
