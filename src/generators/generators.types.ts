export type Clef = 'treble' | 'bass' | 'alto';

export type Note = {
  name: string;
  number: number;
  clef: Clef;
};

export type GeneratorResult = {
  title: string;
  note: Note;
  answer: string;
};
