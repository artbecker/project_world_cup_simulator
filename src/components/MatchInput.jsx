import { getTeamById } from '../data/teams';
import FlagImage from './FlagImage';

export default function MatchInput({
  match,
  scores,
  onScoreChange,
  locked = false,
  // showPenalty indica se esse jogo pode ter pênaltis
  // (só nas fases finais — r32 em diante)
  showPenalty = false,
}) {
  const teamA = getTeamById(match.teamA);
  const teamB = getTeamById(match.teamB);

  const score = scores[match.id];
  const scoreA = score?.scoreA ?? '';
  const scoreB = score?.scoreB ?? '';
  // Vencedor nos pênaltis — salvo no mesmo objeto do placar
  const penaltyWinner = score?.penaltyWinner ?? null;

  // Empate preenchido — ambos os placares preenchidos e iguais
  const isDraw =
    scoreA !== '' && scoreB !== '' && Number(scoreA) === Number(scoreB);

  const handleInput = (side, value) => {
    const parsed = value === '' ? null : parseInt(value, 10);
    if (parsed !== null && (parsed < 0 || parsed > 99)) return;
    const newScoreA = side === 'A' ? parsed : (score?.scoreA ?? null);
    const newScoreB = side === 'B' ? parsed : (score?.scoreB ?? null);

    // Se o placar mudar e não for mais empate, limpa o pênalti
    const newIsDraw =
      newScoreA != null && newScoreB != null && newScoreA === newScoreB;
    onScoreChange(
      match.id,
      newScoreA,
      newScoreB,
      newIsDraw ? penaltyWinner : null,
    );
  };

  const handlePenalty = (teamId) => {
    // Toggle — se clicar no mesmo time, desfaz
    const newWinner = penaltyWinner === teamId ? null : teamId;
    onScoreChange(
      match.id,
      score?.scoreA ?? null,
      score?.scoreB ?? null,
      newWinner,
    );
  };

  const aWinning =
    scoreA !== '' && scoreB !== '' && Number(scoreA) > Number(scoreB);
  const bWinning =
    scoreA !== '' && scoreB !== '' && Number(scoreB) > Number(scoreA);

  const nameA = teamA?.name ?? (locked ? 'TBD' : '');
  const nameB = teamB?.name ?? (locked ? 'TBD' : '');
  const codeA = teamA?.code ?? (locked ? 'TBD' : '');
  const codeB = teamB?.code ?? (locked ? 'TBD' : '');

  return (
    <div
      className={`
        flex flex-col
        border border-white/10 rounded-xl
        transition-all duration-200
        ${
          locked
            ? 'bg-white/3 opacity-40 pointer-events-none'
            : 'bg-white/5 hover:bg-white/10'
        }
      `}
    >
      {/* ── PLACAR ── */}
      <div className='flex items-center justify-between px-4 py-3 gap-2'>
        {/* Time A */}
        <div
          className={`
          flex-1 flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2
          transition-opacity duration-200
          ${bWinning || (isDraw && penaltyWinner === match.teamB) ? 'opacity-40' : 'opacity-100'}
        `}
        >
          <FlagImage team={teamA} size={20} />
          <span className='text-white font-medium leading-tight text-center sm:text-left text-[10px] sm:text-xs lg:text-sm'>
            <span className='lg:hidden'>{codeA}</span>
            <span className='hidden lg:inline'>{nameA}</span>
          </span>
        </div>

        {/* Inputs */}
        <div className='flex items-center gap-2 shrink-0'>
          <input
            type='number'
            min='0'
            max='99'
            value={scoreA}
            onChange={(e) => handleInput('A', e.target.value)}
            placeholder='–'
            className='
              w-10 h-10 text-center text-white font-bold text-lg
              bg-white/10 border border-white/20 rounded-lg
              focus:outline-none focus:border-yellow-400 focus:bg-white/20
              placeholder:text-white/30 transition-all duration-150
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
            '
          />
          <span className='text-white/40 font-bold text-sm'>×</span>
          <input
            type='number'
            min='0'
            max='99'
            value={scoreB}
            onChange={(e) => handleInput('B', e.target.value)}
            placeholder='–'
            className='
              w-10 h-10 text-center text-white font-bold text-lg
              bg-white/10 border border-white/20 rounded-lg
              focus:outline-none focus:border-yellow-400 focus:bg-white/20
              placeholder:text-white/30 transition-all duration-150
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
            '
          />
        </div>

        {/* Time B */}
        <div
          className={`
          flex-1 flex flex-col sm:flex-row-reverse items-center gap-0.5 sm:gap-2
          transition-opacity duration-200
          ${aWinning || (isDraw && penaltyWinner === match.teamA) ? 'opacity-40' : 'opacity-100'}
        `}
        >
          <FlagImage team={teamB} size={20} />
          <span className='text-white font-medium leading-tight text-center sm:text-right text-[10px] sm:text-xs lg:text-sm'>
            <span className='lg:hidden'>{codeB}</span>
            <span className='hidden lg:inline'>{nameB}</span>
          </span>
        </div>
      </div>

      {/* ── BARRA DE PÊNALTIS ──
          Só aparece em jogos das fases finais (showPenalty=true).
          Espaço sempre reservado para não deslocar elementos.
          Conteúdo aparece apenas quando há empate. */}
      {showPenalty && (
        <div
          className='
          h-9 flex items-center justify-center
          border-t border-white/5 px-4
        '
        >
          {isDraw ? (
            <div className='flex items-center gap-2'>
              <span className='text-white/40 text-xs'>
                Quem leva nos pênaltis?
              </span>
              {/* Botão time A */}
              <button
                onClick={() => handlePenalty(match.teamA)}
                className={`
                  px-2 py-0.5 rounded-lg text-xs font-bold
                  transition-all duration-200
                  ${
                    penaltyWinner === match.teamA
                      ? 'bg-yellow-400 text-[#001040]'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }
                `}
              >
                {codeA}
              </button>
              <span className='text-white/30 text-xs'>×</span>
              {/* Botão time B */}
              <button
                onClick={() => handlePenalty(match.teamB)}
                className={`
                  px-2 py-0.5 rounded-lg text-xs font-bold
                  transition-all duration-200
                  ${
                    penaltyWinner === match.teamB
                      ? 'bg-yellow-400 text-[#001040]'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }
                `}
              >
                {codeB}
              </button>
            </div>
          ) : // Espaço reservado vazio — mantém altura mesmo sem empate
          null}
        </div>
      )}
    </div>
  );
}
