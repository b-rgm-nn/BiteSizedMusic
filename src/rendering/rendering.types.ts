import type { Clef } from '../generators/generators.types';

export type DrawClefFn = (
  svg: SVGSVGElement,
  staffY: number,
  lineSpacing: number,
) => SVGTextElement;

export type ClefDrawingConfig = Record<Clef, { draw: DrawClefFn; baseNote: string }>;
