// =============================================================
// src/components/MatchInput.jsx
// =============================================================
// Responsividade com um único elemento por time.
// Em vez de criar 3 divs separados com hidden/flex,
// usamos prefixos responsivos apenas nas propriedades
// que mudam entre breakpoints — igual ao CSS normal.
//
// O que muda por breakpoint:
//   Mobile (< 640px):  flex-col, bandeira menor, code abaixo
//   Tablet (640-1023px): flex-row, bandeira média, code ao lado
//   Desktop (≥ 1024px): flex-row, bandeira maior, nome ao lado
// =============================================================

import { getTeamById } from '../data/teams';
import FlagImage from './FlagImage';

export default function MatchInput({
  match,
  scores,
  onScoreChange,
  locked = false,
}) {
  const teamA = getTeamById(match.teamA);
  const teamB = getTeamById(match.teamB);

  const score = scores[match.id];
  const scoreA = score?.scoreA ?? '';
  const scoreB = score?.scoreB ?? '';

  const handleInput = (side, value) => {
    const parsed = value === '' ? null : parseInt(value, 10);
    if (parsed !== null && (parsed < 0 || parsed > 99)) return;
    const newScoreA = side === 'A' ? parsed : (score?.scoreA ?? null);
    const newScoreB = side === 'B' ? parsed : (score?.scoreB ?? null);
    onScoreChange(match.id, newScoreA, newScoreB);
  };

  const aWinning =
    scoreA !== '' && scoreB !== '' && Number(scoreA) > Number(scoreB);
  const bWinning =
    scoreA !== '' && scoreB !== '' && Number(scoreB) > Number(scoreA);

  // Nome ou code dependendo do breakpoint — resolvido aqui
  // para não repetir a lógica dentro do JSX
  const nameA = teamA?.name ?? (locked ? 'TBD' : '');
  const nameB = teamB?.name ?? (locked ? 'TBD' : '');
  const codeA = teamA?.code ?? (locked ? 'TBD' : '');
  const codeB = teamB?.code ?? (locked ? 'TBD' : '');

  return (
    <div
      className={`
        flex items-center justify-between
        border border-white/10 rounded-xl px-4 py-3
        transition-all duration-200 gap-2
        ${
          locked
            ? 'bg-white/3 opacity-40 pointer-events-none'
            : 'bg-white/5 hover:bg-white/10'
        }
      `}
    >
      {/* ── TIME A (esquerda) ── */}
      <div
        className={`
          flex-1 flex flex-col sm:flex-row
          items-center sm:items-center
          gap-0.5 sm:gap-2
          transition-opacity duration-200
          ${bWinning ? 'opacity-40' : 'opacity-100'}
        `}
      >
        {/* Bandeira — tamanho cresce com o breakpoint */}
        <FlagImage team={teamA} size={20} />

        {/* Texto — code no mobile/tablet, nome no desktop */}
        <span
          className='text-white font-medium leading-tight text-center sm:text-left
          text-[10px] sm:text-xs lg:text-sm'
        >
          {/* lg: nome completo | menor que lg: code */}
          <span className='lg:hidden'>{codeA}</span>
          <span className='hidden lg:inline'>{nameA}</span>
        </span>
      </div>

      {/* ── PLACAR (centro) ── */}
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

      {/* ── TIME B (direita) ── */}
      <div
        className={`
          flex-1 flex flex-col sm:flex-row-reverse
          items-center sm:items-center
          gap-0.5 sm:gap-2
          transition-opacity duration-200
          ${aWinning ? 'opacity-40' : 'opacity-100'}
        `}
      >
        {/* Bandeira */}
        <FlagImage team={teamB} size={20} />

        {/* Texto — espelhado: alinhado à direita no desktop */}
        <span
          className='text-white font-medium leading-tight text-center sm:text-right
          text-[10px] sm:text-xs lg:text-sm'
        >
          <span className='lg:hidden'>{codeB}</span>
          <span className='hidden lg:inline'>{nameB}</span>
        </span>
      </div>
    </div>
  );
}
