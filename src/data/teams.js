// =============================================================
// src/data/teams.js — atualizado com campo "iso"
// =============================================================
// Adicionamos o campo "iso" em cada time:
//   iso: código de 2 letras no padrão ISO 3166-1 alpha-2
//   Usado para montar a URL da bandeira no flagcdn.com:
//   https://flagcdn.com/w40/{iso}.png
//
// Times sem bandeira oficial no flagcdn (play-offs e Curaçao)
// recebem iso: null — o componente de bandeira trata esse caso.
// =============================================================

export const GROUPS = {
  A: {
    name: 'Grupo A',
    teams: [
      { id: 'MEX', name: 'México', code: 'MEX', flag: '🇲🇽', iso: 'mx', pot: 1 },
      {
        id: 'RSA',
        name: 'África do Sul',
        code: 'RSA',
        flag: '🇿🇦',
        iso: 'za',
        pot: 3,
      },
      {
        id: 'KOR',
        name: 'Coreia do Sul',
        code: 'KOR',
        flag: '🇰🇷',
        iso: 'kr',
        pot: 2,
      },
      {
        id: 'POD',
        name: 'Play-off D',
        code: 'POD',
        flag: '🏳️',
        iso: null,
        pot: 4,
      },
    ],
  },
  B: {
    name: 'Grupo B',
    teams: [
      { id: 'CAN', name: 'Canadá', code: 'CAN', flag: '🇨🇦', iso: 'ca', pot: 1 },
      {
        id: 'POA',
        name: 'Play-off A',
        code: 'POA',
        flag: '🏳️',
        iso: null,
        pot: 4,
      },
      { id: 'QAT', name: 'Qatar', code: 'QAT', flag: '🇶🇦', iso: 'qa', pot: 3 },
      { id: 'SUI', name: 'Suíça', code: 'SUI', flag: '🇨🇭', iso: 'ch', pot: 2 },
    ],
  },
  C: {
    name: 'Grupo C',
    teams: [
      { id: 'BRA', name: 'Brasil', code: 'BRA', flag: '🇧🇷', iso: 'br', pot: 1 },
      {
        id: 'MAR',
        name: 'Marrocos',
        code: 'MAR',
        flag: '🇲🇦',
        iso: 'ma',
        pot: 2,
      },
      { id: 'HAI', name: 'Haiti', code: 'HAI', flag: '🇭🇹', iso: 'ht', pot: 3 },
      {
        id: 'SCO',
        name: 'Escócia',
        code: 'SCO',
        flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
        iso: 'gb-sct',
        pot: 2,
      },
    ],
  },
  D: {
    name: 'Grupo D',
    teams: [
      {
        id: 'USA',
        name: 'Estados Unidos',
        code: 'USA',
        flag: '🇺🇸',
        iso: 'us',
        pot: 1,
      },
      {
        id: 'PAR',
        name: 'Paraguai',
        code: 'PAR',
        flag: '🇵🇾',
        iso: 'py',
        pot: 3,
      },
      {
        id: 'AUS',
        name: 'Austrália',
        code: 'AUS',
        flag: '🇦🇺',
        iso: 'au',
        pot: 2,
      },
      {
        id: 'POC',
        name: 'Play-off C',
        code: 'POC',
        flag: '🏳️',
        iso: null,
        pot: 4,
      },
    ],
  },
  E: {
    name: 'Grupo E',
    teams: [
      {
        id: 'GER',
        name: 'Alemanha',
        code: 'GER',
        flag: '🇩🇪',
        iso: 'de',
        pot: 1,
      },
      {
        id: 'CUW',
        name: 'Curaçao',
        code: 'CUW',
        flag: '🏳️',
        iso: 'cw',
        pot: 3,
      },
      {
        id: 'CIV',
        name: 'Costa do Marfim',
        code: 'CIV',
        flag: '🇨🇮',
        iso: 'ci',
        pot: 2,
      },
      {
        id: 'ECU',
        name: 'Equador',
        code: 'ECU',
        flag: '🇪🇨',
        iso: 'ec',
        pot: 3,
      },
    ],
  },
  F: {
    name: 'Grupo F',
    teams: [
      {
        id: 'NED',
        name: 'Holanda',
        code: 'NED',
        flag: '🇳🇱',
        iso: 'nl',
        pot: 1,
      },
      { id: 'JPN', name: 'Japão', code: 'JPN', flag: '🇯🇵', iso: 'jp', pot: 2 },
      {
        id: 'POB',
        name: 'Play-off B',
        code: 'POB',
        flag: '🏳️',
        iso: null,
        pot: 4,
      },
      {
        id: 'TUN',
        name: 'Tunísia',
        code: 'TUN',
        flag: '🇹🇳',
        iso: 'tn',
        pot: 3,
      },
    ],
  },
  G: {
    name: 'Grupo G',
    teams: [
      {
        id: 'BEL',
        name: 'Bélgica',
        code: 'BEL',
        flag: '🇧🇪',
        iso: 'be',
        pot: 1,
      },
      { id: 'EGY', name: 'Egito', code: 'EGY', flag: '🇪🇬', iso: 'eg', pot: 3 },
      { id: 'IRN', name: 'Irã', code: 'IRN', flag: '🇮🇷', iso: 'ir', pot: 2 },
      {
        id: 'NZL',
        name: 'Nova Zelândia',
        code: 'NZL',
        flag: '🇳🇿',
        iso: 'nz',
        pot: 3,
      },
    ],
  },
  H: {
    name: 'Grupo H',
    teams: [
      {
        id: 'ESP',
        name: 'Espanha',
        code: 'ESP',
        flag: '🇪🇸',
        iso: 'es',
        pot: 1,
      },
      {
        id: 'CPV',
        name: 'Cabo Verde',
        code: 'CPV',
        flag: '🇨🇻',
        iso: 'cv',
        pot: 3,
      },
      {
        id: 'KSA',
        name: 'Arábia Saudita',
        code: 'KSA',
        flag: '🇸🇦',
        iso: 'sa',
        pot: 2,
      },
      {
        id: 'URU',
        name: 'Uruguai',
        code: 'URU',
        flag: '🇺🇾',
        iso: 'uy',
        pot: 2,
      },
    ],
  },
  I: {
    name: 'Grupo I',
    teams: [
      { id: 'FRA', name: 'França', code: 'FRA', flag: '🇫🇷', iso: 'fr', pot: 1 },
      {
        id: 'SEN',
        name: 'Senegal',
        code: 'SEN',
        flag: '🇸🇳',
        iso: 'sn',
        pot: 2,
      },
      {
        id: 'PO2',
        name: 'Play-off 2',
        code: 'PO2',
        flag: '🏳️',
        iso: null,
        pot: 4,
      },
      {
        id: 'NOR',
        name: 'Noruega',
        code: 'NOR',
        flag: '🇳🇴',
        iso: 'no',
        pot: 2,
      },
    ],
  },
  J: {
    name: 'Grupo J',
    teams: [
      {
        id: 'ARG',
        name: 'Argentina',
        code: 'ARG',
        flag: '🇦🇷',
        iso: 'ar',
        pot: 1,
      },
      {
        id: 'ALG',
        name: 'Argélia',
        code: 'ALG',
        flag: '🇩🇿',
        iso: 'dz',
        pot: 3,
      },
      {
        id: 'AUT',
        name: 'Áustria',
        code: 'AUT',
        flag: '🇦🇹',
        iso: 'at',
        pot: 2,
      },
      {
        id: 'JOR',
        name: 'Jordânia',
        code: 'JOR',
        flag: '🇯🇴',
        iso: 'jo',
        pot: 3,
      },
    ],
  },
  K: {
    name: 'Grupo K',
    teams: [
      {
        id: 'POR',
        name: 'Portugal',
        code: 'POR',
        flag: '🇵🇹',
        iso: 'pt',
        pot: 1,
      },
      {
        id: 'PO1',
        name: 'Play-off 1',
        code: 'PO1',
        flag: '🏳️',
        iso: null,
        pot: 4,
      },
      {
        id: 'UZB',
        name: 'Uzbequistão',
        code: 'UZB',
        flag: '🇺🇿',
        iso: 'uz',
        pot: 3,
      },
      {
        id: 'COL',
        name: 'Colômbia',
        code: 'COL',
        flag: '🇨🇴',
        iso: 'co',
        pot: 2,
      },
    ],
  },
  L: {
    name: 'Grupo L',
    teams: [
      {
        id: 'ENG',
        name: 'Inglaterra',
        code: 'ENG',
        flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        iso: 'gb-eng',
        pot: 1,
      },
      {
        id: 'CRO',
        name: 'Croácia',
        code: 'CRO',
        flag: '🇭🇷',
        iso: 'hr',
        pot: 2,
      },
      { id: 'GHA', name: 'Gana', code: 'GHA', flag: '🇬🇭', iso: 'gh', pot: 3 },
      { id: 'PAN', name: 'Panamá', code: 'PAN', flag: '🇵🇦', iso: 'pa', pot: 3 },
    ],
  },
};

export const GROUP_LETTERS = Object.keys(GROUPS);

export const ALL_TEAMS = Object.values(GROUPS).flatMap((group) => group.teams);

export const getTeamById = (id) =>
  ALL_TEAMS.find((team) => team.id === id) ?? null;
