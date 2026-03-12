import type { Clef, GeneratorResult } from "./generators.types";

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

function generateNote(minNoteName: string, maxNoteName: string, clef: Clef): GeneratorResult {
  const notePosition = Math.floor(Math.random() * (toNoteNumber(maxNoteName) - toNoteNumber(minNoteName) + 1)) + toNoteNumber(minNoteName);
  return {
    title: 'Notes',
    note: {
      name: toNoteName(notePosition),
      number: notePosition,
      clef: clef,
    },
    answer: toNoteName(notePosition),
  };
}

export function generateBassNotes(): GeneratorResult {
  return {
    ...generateNote('C2', 'C4', 'bass'),
    title: 'Bass Notes',
  };
}

export function generateTrebleNotes(): GeneratorResult {
  return {
    ...generateNote('C4', 'C6', 'treble'),
    title: 'Treble Notes',
  };
}

export function generateAltoNotes(): GeneratorResult {
  return {
    ...generateNote('C3', 'E5', 'alto'),
    title: 'Alto Notes',
  };
}
