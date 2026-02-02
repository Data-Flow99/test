
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  role: string;
}

export interface Prediction {
  id: string;
  timestamp: string;
  event: string;
  ripples: any[];
  actualOutcome?: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
  calibrationDelta?: number; // 0-100 error score
  insightExtracted?: string;
}

export interface ScanResult {
  id: string;
  timestamp: string;
  scenario: string;
  axes: {
    chronicDegradation: number;
    irreversibleInflection: number;
    judgmentSovereignty: number;
  };
  riskLevel: RiskLevel;
  summary: string;
  recommendations: string[];
}

export interface PowerActor {
  id: string;
  name: string;
  role: string;
  power: number;
  loyalty: number;
}

export interface PowerLink {
  source: string;
  target: string;
  type: 'CONSTRAIN' | 'SUPPORT' | 'CONFLICT';
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';
  category: 'AI' | 'STRATEGY' | 'EXECUTION';
}

export interface CaseEntry {
  id: string;
  title: string;
  category: string;
  description: string;
  riskTags: string[];
}
