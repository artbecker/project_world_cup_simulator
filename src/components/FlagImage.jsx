// =============================================================
// src/components/FlagImage.jsx
// =============================================================
// Componente reutilizável para exibir a bandeira de um time.
//
// Usa o flagcdn.com para carregar imagens de bandeiras por
// código ISO de 2 letras. Times sem ISO (play-offs) recebem
// um ícone de bandeira branca como fallback.
//
// PROPS:
//   team  → objeto do time com campos iso, flag e name
//   size  → tamanho em pixels (padrão: 24)
// =============================================================

export default function FlagImage({ team, size = 24 }) {
  // Se o time não tem ISO definido, mostra emoji de fallback
  // Isso cobre os play-offs que ainda não têm país definido
  if (!team?.iso) {
    return <span style={{ fontSize: size * 0.8 }}>🏳️</span>;
  }

  return (
    <img
      // URL da bandeira no flagcdn.com
      // w40 = largura de 40px (suficiente para nossa UI)
      // O ISO em minúsculo já está salvo assim no teams.js
      src={`https://flagcdn.com/w40/${team.iso}.png`}
      // Texto alternativo para acessibilidade
      alt={`Bandeira ${team?.name}`}
      // Estilos inline para controle preciso do tamanho
      // "objectFit: cover" garante que a imagem não distorce
      style={{
        width: size * 1.4, // bandeiras são mais largas que altas
        height: size,
        objectFit: 'cover',
        borderRadius: 3,
        display: 'inline-block',
        flexShrink: 0, // não encolhe em containers flex
      }}
      // onError: se a imagem falhar (ex: iso inválido),
      // esconde a imagem quebrada e mostra o emoji como fallback
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.insertAdjacentText('afterend', team?.flag ?? '🏳️');
      }}
    />
  );
}
