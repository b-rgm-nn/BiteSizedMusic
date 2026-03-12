import type { Note } from '../generators/generators.types';
import { toNoteNumber } from '../generators/notegenerator';
import type { ClefDrawingConfig } from './rendering.types';

const clefDrawingConfig: ClefDrawingConfig = {
  bass: { draw: drawBassClef, baseNote: 'G2' },
  treble: { draw: drawTrebleClef, baseNote: 'E4' },
  alto: { draw: drawAltoClef, baseNote: 'F3' },
} as const;

function drawStaffLines(
  svg: SVGSVGElement,
  staffY: number,
  lineSpacing: number,
) {
  // Draw staff lines
  for (let i = 0; i < 5; i++) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(0));
    line.setAttribute('x2', String(svg.clientWidth));
    line.setAttribute('y1', String(staffY + i * lineSpacing));
    line.setAttribute('y2', String(staffY + i * lineSpacing));
    line.setAttribute('stroke', 'white');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);
  }
}

function drawBassClef(svg: SVGSVGElement, staffY: number, lineSpacing: number) {
  const clef = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  clef.setAttribute('x', String(30));
  clef.setAttribute('y', String(staffY + lineSpacing * 3.3));
  clef.setAttribute('font-size', '70');
  clef.setAttribute('fill', 'white');
  clef.setAttribute('font-family', 'serif');
  clef.textContent = '𝄢';
  svg.appendChild(clef);
  return clef;
}

function drawTrebleClef(
  svg: SVGSVGElement,
  staffY: number,
  lineSpacing: number,
) {
  const clef = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  clef.setAttribute('x', String(30));
  clef.setAttribute('y', String(staffY + lineSpacing * 4));
  clef.setAttribute('font-size', '100');
  clef.setAttribute('fill', 'white');
  clef.setAttribute('font-family', 'serif');
  clef.textContent = '𝄞';
  svg.appendChild(clef);
  return clef;
}

function drawAltoClef(svg: SVGSVGElement, staffY: number, lineSpacing: number) {
  const clef = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  clef.setAttribute('x', String(30));
  clef.setAttribute('y', String(staffY + lineSpacing * 4));
  clef.setAttribute('font-size', '90');
  clef.setAttribute('fill', 'white');
  clef.setAttribute('font-family', 'serif');
  clef.textContent = '𝄡';
  svg.appendChild(clef);
  return clef;
}

function drawSingleNote(
  linePosition: number,
  svg: SVGSVGElement,
  staffY: number,
  lineSpacing: number,
  noteX: number,
) {
  const noteY = staffY + (8 - linePosition) * (lineSpacing / 2);
  // Draw ledger lines if needed
  if (linePosition > 8) {
    // Above staff
    for (let i = 10; i <= linePosition; i += 2) {
      const ledger = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'line',
      );
      const ledgerY = staffY + (8 - i) * (lineSpacing / 2);
      ledger.setAttribute('x1', String(noteX - 20));
      ledger.setAttribute('x2', String(noteX + 20));
      ledger.setAttribute('y1', String(ledgerY));
      ledger.setAttribute('y2', String(ledgerY));
      ledger.setAttribute('stroke', 'white');
      ledger.setAttribute('stroke-width', '2');
      svg.appendChild(ledger);
    }
  } else if (linePosition < 0) {
    // Below staff
    for (let i = -2; i >= linePosition; i -= 2) {
      const ledger = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'line',
      );
      const ledgerY = staffY + (8 - i) * (lineSpacing / 2);
      ledger.setAttribute('x1', String(noteX - 20));
      ledger.setAttribute('x2', String(noteX + 20));
      ledger.setAttribute('y1', String(ledgerY));
      ledger.setAttribute('y2', String(ledgerY));
      ledger.setAttribute('stroke', 'white');
      ledger.setAttribute('stroke-width', '2');
      svg.appendChild(ledger);
    }
  }

  // Draw note head (filled circle)
  const noteHead = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'ellipse',
  );
  noteHead.setAttribute('cx', String(noteX));
  noteHead.setAttribute('cy', String(noteY));
  noteHead.setAttribute('rx', '10');
  noteHead.setAttribute('ry', '8');
  noteHead.setAttribute('fill', 'white');
  noteHead.setAttribute('transform', `rotate(-20 ${noteX} ${noteY})`);
  svg.appendChild(noteHead);

  // Draw note stem
  const stem = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  stem.setAttribute('x1', String(noteX + 9));
  stem.setAttribute('x2', String(noteX + 9));
  stem.setAttribute('y1', String(noteY));
  stem.setAttribute('y2', String(noteY - 50));
  stem.setAttribute('stroke', 'white');
  stem.setAttribute('stroke-width', '2');
  svg.appendChild(stem);
}

export function drawNote(note: Note, svg: SVGSVGElement) {
  svg.innerHTML = '';

  const lineSpacing = 15;

  const clefHeight = lineSpacing * 4;
  const staffY = svg.clientHeight / 2 - clefHeight / 2;

  drawStaffLines(svg, staffY, lineSpacing);

  const drawingConfig = clefDrawingConfig[note.clef];
  const clef = drawingConfig.draw(svg, staffY, lineSpacing);
  const baseNoteNumber = toNoteNumber(drawingConfig.baseNote);

  const noteX =
    clef.getBBox().x +
    clef.getBBox().width +
    (svg.clientWidth - clef.getBBox().x - clef.getBBox().width) / 2;

  const linePosition = note.number - baseNoteNumber;

  drawSingleNote(linePosition, svg, staffY, lineSpacing, noteX);
}
