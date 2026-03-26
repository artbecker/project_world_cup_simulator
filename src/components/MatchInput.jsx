// =============================================================
// src/components/MatchInput.jsx
// =============================================================
// Componente responsável por exibir UM jogo e receber o placar
// digitado pelo usuário.
//
// PROPS que recebe:
//   match           → objeto do jogo (id, teamA, teamB, round)
//   scores          → objeto com todos os placares do estado
//   onScoreChange   → função do App para atualizar o placar
// =============================================================

import { getTeamById } from '../data/teams';
import FlagImage from './FlagImage';

export default function MatchInput({ match, scores, onScoreChange }) {
  // Busca os objetos completos dos dois times pelo id
  // Ex: getTeamById("BRA") → { id:"BRA", name:"Brasil", flag:"🇧🇷" }
  const teamA = getTeamById(match.teamA);
  const teamB = getTeamById(match.teamB);

  // Pega o placar atual desse jogo no estado central
  // Se ainda não foi preenchido, usa null como fallback
  const score = scores[match.id];
  const scoreA = score?.scoreA ?? '';
  const scoreB = score?.scoreB ?? '';
  // O "??" (nullish coalescing) retorna o lado direito
  // quando o lado esquerdo é null ou undefined.
  // Assim o input mostra vazio ("") em vez de "null"

  // =============================================================
  // HANDLEINPUT
  // =============================================================
  // Chamada sempre que o usuário digita em qualquer input.
  // "side" indica se foi o time A ou B que mudou.
  // =============================================================
  const handleInput = (side, value) => {
    // Converte o valor digitado para número inteiro
    // parseInt("2") → 2
    // parseInt("") → NaN (Not a Number) → tratamos como null
    const parsed = value === '' ? null : parseInt(value, 10);

    // Ignora valores negativos ou absurdos (> 99)
    if (parsed !== null && (parsed < 0 || parsed > 99)) return;

    // Monta os novos placares mantendo o outro lado intacto
    const newScoreA = side === 'A' ? parsed : (score?.scoreA ?? null);
    const newScoreB = side === 'B' ? parsed : (score?.scoreB ?? null);

    // Chama a função do App para atualizar o estado central
    onScoreChange(match.id, newScoreA, newScoreB);
  };

  // Determina visualmente quem está ganhando para destacar
  // Usado para aplicar estilos diferentes no time vencedor
  const aWinning =
    scoreA !== '' && scoreB !== '' && Number(scoreA) > Number(scoreB);
  const bWinning =
    scoreA !== '' && scoreB !== '' && Number(scoreB) > Number(scoreA);

  return (
    // Container do jogo — glass card com hover sutil
    <div
      className='
      flex items-center justify-between
      bg-white/5 hover:bg-white/10
      border border-white/10
      rounded-xl px-4 py-3
      transition-all duration-200
      gap-2
    '
    >
      {/* ── TIME A (esquerda) ── */}
      {/* "flex-1" faz o time ocupar espaço igual dos dois lados */}
      <div
        className={`
        flex items-center gap-2 flex-1
        transition-opacity duration-200
        ${bWinning ? 'opacity-40' : 'opacity-100'}
      `}
      >
        <FlagImage team={teamA} size={24} />

        {/* Nome do time — trunca se for muito longo no mobile */}
        <span className='text-white font-medium text-sm break'>
          {teamA?.name}
        </span>
      </div>

      {/* ── PLACAR (centro) ── */}
      <div className='flex items-center gap-2 shrink-0'>
        {/* Input do time A */}
        {/* "shrink-0" evita que o placar encolha no mobile */}
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
            placeholder:text-white/30
            transition-all duration-150
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
          '
          // As duas últimas classes removem as setinhas do
          // input type="number" que ficam feias visualmente
        />

        {/* Separador "x" entre os placares */}
        <span className='text-white/40 font-bold text-sm'>×</span>

        {/* Input do time B */}
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
            placeholder:text-white/30
            transition-all duration-150
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
          '
        />
      </div>

      {/* ── TIME B (direita) ── */}
      <div
        className={`
        flex items-center gap-2 flex-1 justify-end
        transition-opacity duration-200
        ${aWinning ? 'opacity-40' : 'opacity-100'}
      `}
      >
        {/* Nome à direita — texto alinhado à direita */}
        <span className='text-white font-medium text-sm truncate text-right'>
          {teamB?.name}
        </span>
        <FlagImage team={teamB} size={24} />
      </div>
    </div>
  );
}
