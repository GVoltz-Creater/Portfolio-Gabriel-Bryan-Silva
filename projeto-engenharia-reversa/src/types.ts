export enum PhilosophicalTradition {
  UTILITARIANISM = 'utilitarianism',
  DEONTOLOGY = 'deontology',
  CONTRACTUALISM = 'contractualism',
  PLURALISM = 'pluralism'
}

export interface Scores {
  [PhilosophicalTradition.UTILITARIANISM]: number;
  [PhilosophicalTradition.DEONTOLOGY]: number;
  [PhilosophicalTradition.CONTRACTUALISM]: number;
  [PhilosophicalTradition.PLURALISM]: number;
}

export interface Choice {
  id: 'A' | 'B';
  text: string;
  scores: Partial<Scores>;
}

export interface Dilemma {
  id: number;
  title: string;
  category: string;
  scenario: string;
  imageUrl: string;
  choices: Choice[];
}

export interface UserChoice {
  dilemmaId: number;
  choiceId: 'A' | 'B';
  analysis?: string;
}

export interface FinalProfile {
  dominantTradition: PhilosophicalTradition;
  title: string;
  description: string;
  percentages: { [key in PhilosophicalTradition]: number };
  philosopher: string;
  reflectionQuestion: string;
}
