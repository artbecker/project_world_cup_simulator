// =============================================================
// src/App.jsx — atualizado com knockoutPicks
// =============================================================
import { useState } from 'react';
import { GROUP_LETTERS } from './data/teams';
import { getMatchesByGroup } from './data/matches';
import { calcGroupStandings } from './logic/standings';
import {
  buildBracket,
  ROUNDS,
  ROUND_LABELS,
  ROUND_ORDER,
} from './logic/bracket';
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
  const [scores, setScores] = useState(buildInitialScores);
  const [knockoutScores, setKnockoutScores] = useState({});
  // knockoutPicks: { "r32_1": "BRA", "r16_1": "GER", ... }
  // Cada chave é o id do jogo, cada valor é o teamId do vencedor

  // Aba ativa: grupos ou bracket
  const [activeTab, setActiveTab] = useState(TABS.GROUPS);

  const handleScoreChange = (matchId, scoreA, scoreB) => {
    setScores((prev) => ({
      ...prev,
      [matchId]: { scoreA, scoreB },
    }));
  };

  // Atualiza o vencedor de um jogo do mata-mata
  // Se clicar no mesmo time duas vezes, desfaz a escolha (toggle)
  const handleKnockoutPick = (matchId, scoreA, scoreB) => {
    setKnockoutScores((prev) => ({
      ...prev,
      [matchId]: { scoreA, scoreB },
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
          <div className='flex items-center justify-between py-3'>
            <div className='flex items-center gap-3'>
              <span className='text-3xl'>⚽</span>
              <div>
                <h1 className='text-white font-bold text-xl leading-none'>
                  Simulador
                </h1>
                <p className='text-yellow-400 text-xs font-semibold tracking-widest uppercase'>
                  Copa do Mundo 2026
                </p>
              </div>
            </div>
          </div>

          {/* ── ABAS ── */}
          <div className='flex gap-1 pb-0'>
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
    </div>
  );
}
