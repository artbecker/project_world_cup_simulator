// =============================================================
// src/App.jsx — atualizado com knockoutPicks
// =============================================================
import { useState, useEffect } from 'react';
import { GROUP_LETTERS } from './data/teams';
import { getMatchesByGroup } from './data/matches';
import { calcGroupStandings } from './logic/standings';
import { buildBracket } from './logic/bracket';
import GroupSection from './components/GroupSection';
import BracketView from './components/BracketView';

const buildInitialScores = () => {
  const initial = {};
  GROUP_LETTERS.forEach((letter) => {
    getMatchesByGroup(letter).forEach((match) => {
      initial[match.id] = { scoreA: null, scoreB: null };
    });
  });
  return initial;
};

// Abas principais da aplicação
const TABS = {
  GROUPS: 'groups',
  BRACKET: 'bracket',
};

export default function App() {
  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('scores');
    return saved ? JSON.parse(saved) : buildInitialScores();
  });

  const [knockoutScores, setKnockoutScores] = useState(() => {
    const saved = localStorage.getItem('knockoutScores');
    return saved ? JSON.parse(saved) : {};
  });
  // knockoutPicks: { "r32_1": "BRA", "r16_1": "GER", ... }
  // Cada chave é o id do jogo, cada valor é o teamId do vencedor

  // Aba ativa: grupos ou bracket
  const [activeTab, setActiveTab] = useState(TABS.GROUPS);

  useEffect(() => {
    localStorage.setItem('scores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem('knockoutScores', JSON.stringify(knockoutScores));
  }, [knockoutScores]);

  const handleScoreChange = (matchId, scoreA, scoreB) => {
    setScores((prev) => ({
      ...prev,
      [matchId]: { scoreA, scoreB },
    }));
  };

  // Atualiza o vencedor de um jogo do mata-mata
  // Se clicar no mesmo time duas vezes, desfaz a escolha (toggle)
  const handleKnockoutPick = (
    matchId,
    scoreA,
    scoreB,
    penaltyWinner = null,
  ) => {
    setKnockoutScores((prev) => ({
      ...prev,
      [matchId]: { scoreA, scoreB, penaltyWinner },
    }));
  };

  // Monta o bracket completo com os dados atuais
  const bracket = buildBracket(scores, knockoutScores);

  return (
    <div
      className='min-h-screen'
      style={{
        background:
          'linear-gradient(135deg, #001a57 0%, #003087 50%, #001a57 100%)',
      }}
    >
      {/* ── CABEÇALHO ── */}
      <header className='bg-[#001040]/80 backdrop-blur-md border-b border-white/10'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='py-3 flex items-center gap-3 justify-center'>
            <img className='size-12' src='../public/favicon.png' />
            <h1 className='text-white font-bold text-xl leading-none uppercase break'>
              Simulador copa do mundo 2026
            </h1>
          </div>

          {/* ── ABAS ── */}
          <div className='flex gap-1 pb-0 justify-center'>
            {[
              { id: TABS.GROUPS, label: 'Fase de Grupos' },
              { id: TABS.BRACKET, label: 'Mata-Mata' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 text-sm font-semibold rounded-t-lg
                  transition-all duration-200
                  ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white border-b-2 border-yellow-400'
                      : 'text-white/40 hover:text-white/70'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── CONTEÚDO ── */}
      <main className='max-w-6xl mx-auto px-4 py-6'>
        {/* Fase de Grupos */}
        {activeTab === TABS.GROUPS && (
          <>
            <p className='text-white/40 text-sm mb-6'>
              Preencha os placares e veja a classificação atualizar em tempo
              real.
            </p>
            {GROUP_LETTERS.map((letter) => {
              const matches = getMatchesByGroup(letter);
              const standings = calcGroupStandings(matches, scores);
              return (
                <GroupSection
                  key={letter}
                  groupLetter={letter}
                  scores={scores}
                  onScoreChange={handleScoreChange}
                  standings={standings}
                />
              );
            })}
          </>
        )}

        {/* Mata-Mata */}
        {activeTab === TABS.BRACKET && (
          <BracketView
            bracket={bracket}
            onPick={handleKnockoutPick}
            knockoutScores={knockoutScores}
          />
        )}
      </main>
      <footer>
        <p className='text-white/25 text-xs text-center pb-6'>
          © 2026 ArtBecker
        </p>
      </footer>
    </div>
  );
}
