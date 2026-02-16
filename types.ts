
export enum Difficulty {
  MUGGLE = 'מוגל',
  WIZARD = 'קוסם',
  MASTER = 'מאסטר'
}

export enum House {
  GRYFFINDOR = 'גריפינדור',
  HUFFLEPUFF = 'הפלפאף',
  RAVENCLAW = 'רייבנקלו',
  SLYTHERIN = 'סלית\'רין'
}

export interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export type GameState = 'HOME' | 'LOADING' | 'PLAYING' | 'SORTING' | 'RESULTS';

export interface Score {
  correct: number;
  total: number;
}

export interface SortingResult {
  house: House;
  dialogue: string;
}
