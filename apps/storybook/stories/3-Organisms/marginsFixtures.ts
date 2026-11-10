import type {
  OrganizationMargin,
  MarginsSummary,
  MarginTimeSeriesPoint,
  MarginProviderTimeSeriesPoint,
  MarginStatus,
} from '@autonexhub/react';

const getStatus = (percent: number): MarginStatus => {
  if (percent < 20) return 'critical';
  if (percent < 50) return 'warning';
  return 'healthy';
};

export const mockOrganizations: OrganizationMargin[] = [
  {
    id: 1,
    name: 'Acme Corp',
    slug: 'acme',
    income: 800,
    costs: 750,
    margin: 50,
    marginPercent: 6,
    status: 'critical',
    trend: 'down',
    trendValue: '-8%',
    hasAlert: true,
    costBreakdown: {
      providers: [
        { provider: 'llm', label: 'LLM', units: '1.2M tokens', cost: 320, percent: 43 },
        { provider: 'livekit', label: 'LiveKit', units: '45 min', cost: 180, percent: 24 },
        { provider: 'tts', label: 'TTS', units: '82K chars', cost: 150, percent: 20 },
        { provider: 'stt', label: 'STT', units: '38 min', cost: 100, percent: 13 },
      ],
      channels: { voice: 620, whatsapp: 90, web: 40 },
      total: 750,
    },
  },
  {
    id: 2,
    name: 'Beta Industries',
    slug: 'beta',
    income: 1200,
    costs: 720,
    margin: 480,
    marginPercent: 40,
    status: 'warning',
    trend: 'stable',
    trendValue: '+1%',
    hasAlert: false,
    costBreakdown: {
      providers: [
        { provider: 'llm', label: 'LLM', units: '900K tokens', cost: 280, percent: 39 },
        { provider: 'livekit', label: 'LiveKit', units: '60 min', cost: 200, percent: 28 },
        { provider: 'tts', label: 'TTS', units: '95K chars', cost: 140, percent: 19 },
        { provider: 'stt', label: 'STT', units: '45 min', cost: 100, percent: 14 },
      ],
      channels: { voice: 520, whatsapp: 150, web: 50 },
      total: 720,
    },
  },
  {
    id: 3,
    name: 'Gamma Solutions',
    slug: 'gamma',
    income: 2500,
    costs: 800,
    margin: 1700,
    marginPercent: 68,
    status: 'healthy',
    trend: 'up',
    trendValue: '+12%',
    hasAlert: false,
    costBreakdown: {
      providers: [
        { provider: 'llm', label: 'LLM', units: '1.5M tokens', cost: 350, percent: 44 },
        { provider: 'livekit', label: 'LiveKit', units: '80 min', cost: 220, percent: 28 },
        { provider: 'tts', label: 'TTS', units: '110K chars', cost: 130, percent: 16 },
        { provider: 'stt', label: 'STT', units: '52 min', cost: 100, percent: 12 },
      ],
      channels: { voice: 600, whatsapp: 120, web: 80 },
      total: 800,
    },
  },
  {
    id: 4,
    name: 'Delta Corp',
    slug: 'delta',
    income: 500,
    costs: 450,
    margin: 50,
    marginPercent: 10,
    status: 'critical',
    trend: 'down',
    trendValue: '-15%',
    hasAlert: true,
    costBreakdown: {
      providers: [
        { provider: 'llm', label: 'LLM', units: '800K tokens', cost: 200, percent: 44 },
        { provider: 'livekit', label: 'LiveKit', units: '35 min', cost: 120, percent: 27 },
        { provider: 'tts', label: 'TTS', units: '60K chars', cost: 80, percent: 18 },
        { provider: 'stt', label: 'STT', units: '25 min', cost: 50, percent: 11 },
      ],
      channels: { voice: 380, whatsapp: 50, web: 20 },
      total: 450,
    },
  },
  {
    id: 5,
    name: 'Epsilon Tech',
    slug: 'epsilon',
    income: 3200,
    costs: 960,
    margin: 2240,
    marginPercent: 70,
    status: 'healthy',
    trend: 'up',
    trendValue: '+8%',
    hasAlert: false,
    costBreakdown: {
      providers: [
        { provider: 'llm', label: 'LLM', units: '2M tokens', cost: 450, percent: 47 },
        { provider: 'livekit', label: 'LiveKit', units: '100 min', cost: 280, percent: 29 },
        { provider: 'tts', label: 'TTS', units: '130K chars', cost: 140, percent: 15 },
        { provider: 'stt', label: 'STT', units: '55 min', cost: 90, percent: 9 },
      ],
      channels: { voice: 750, whatsapp: 140, web: 70 },
      total: 960,
    },
  },
  {
    id: 6,
    name: 'Zeta Services',
    slug: 'zeta',
    income: 1800,
    costs: 1080,
    margin: 720,
    marginPercent: 40,
    status: 'warning',
    trend: 'down',
    trendValue: '-3%',
    hasAlert: false,
    costBreakdown: {
      providers: [
        { provider: 'llm', label: 'LLM', units: '1.8M tokens', cost: 480, percent: 44 },
        { provider: 'livekit', label: 'LiveKit', units: '90 min', cost: 300, percent: 28 },
        { provider: 'tts', label: 'TTS', units: '120K chars', cost: 180, percent: 17 },
        { provider: 'stt', label: 'STT', units: '60 min', cost: 120, percent: 11 },
      ],
      channels: { voice: 800, whatsapp: 200, web: 80 },
      total: 1080,
    },
  },
];

export const mockSummary: MarginsSummary = {
  totalIncome: 10000,
  totalCosts: 4760,
  netMargin: 5240,
  marginPercent: 52,
  incomeDelta: { value: '+8%', direction: 'up' },
  costsDelta: { value: '+3%', direction: 'up' },
  marginDelta: { value: '+12%', direction: 'up' },
  marginPercentDelta: { value: '+4pp', direction: 'up' },
  counts: {
    critical: 2,
    warning: 2,
    healthy: 2,
    total: 6,
  },
};

export const mockTimeSeries: MarginTimeSeriesPoint[] = [
  { date: 'Ago 1', income: 320, costs: 150, margin: 170 },
  { date: 'Ago 5', income: 380, costs: 170, margin: 210 },
  { date: 'Ago 10', income: 420, costs: 180, margin: 240 },
  { date: 'Ago 15', income: 390, costs: 165, margin: 225 },
  { date: 'Ago 20', income: 450, costs: 195, margin: 255 },
  { date: 'Ago 25', income: 480, costs: 210, margin: 270 },
  { date: 'Ago 29', income: 510, costs: 220, margin: 290 },
];

export const mockProviderTimeSeries: MarginProviderTimeSeriesPoint[] = [
  { date: 'Ago 1', llm: 65, tts: 35, stt: 25, livekit: 45 },
  { date: 'Ago 5', llm: 72, tts: 38, stt: 28, livekit: 50 },
  { date: 'Ago 10', llm: 78, tts: 42, stt: 30, livekit: 55 },
  { date: 'Ago 15', llm: 70, tts: 38, stt: 27, livekit: 48 },
  { date: 'Ago 20', llm: 85, tts: 45, stt: 32, livekit: 58 },
  { date: 'Ago 25', llm: 92, tts: 48, stt: 35, livekit: 62 },
  { date: 'Ago 29', llm: 98, tts: 52, stt: 38, livekit: 68 },
];
