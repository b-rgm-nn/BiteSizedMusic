import { GeneratorResult } from './problemgenerators.js';

export type Note = {
  name: string;
  octave: number;
}

export function toNoteNumber(noteName: string): number {
  let noteIndex = 'CDEFGAB'.indexOf(noteName.charAt(0));
  let octave = parseInt(noteName.charAt(1))
  return octave * 7 + noteIndex;
}

export function toNoteName(noteNumber: number): string {
  const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  let octave = Math.floor(noteNumber / 7);
  let noteIndex = noteNumber % 7;
  return noteNames[noteIndex] + octave;
}

function generateNote(minNoteName: string, maxNoteName: string): GeneratorResult {
  const notePosition = Math.floor(Math.random() * (toNoteNumber(maxNoteName) - toNoteNumber(minNoteName) + 1)) + toNoteNumber(minNoteName);
  console.log(notePosition + ' ' + toNoteName(notePosition) + ' range: ' + toNoteNumber(minNoteName) + '-' + toNoteNumber(maxNoteName));
  return {
    title: 'Notes',
    note: toNoteName(notePosition),
    answer: toNoteName(notePosition),
  };
}

export function generateBasicNotes(): GeneratorResult {
  return {
    ...generateNote('C2', 'C4'),
    title: 'Basic Notes',
  };
}

export function generateExtendedNotes(): GeneratorResult {
  return {
    ...generateNote('G1', 'G4'),
    title: 'Extended Notes',
  };
}
