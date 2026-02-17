import { getProblemId, initRandom, randInt } from './randutils.js';
import {
  generators,
  getSelectedCategories,
  setSelectedCategories,
  generatorConfig,
} from './generators/problemgenerators.js';

import { toNoteNumber } from './generators/notegenerator.js';

import { getStats, recordPlayed } from './stats.js';
import Cookies from 'js-cookie';

declare global {
  interface Window {
    newProblem: (wasCorrect: boolean) => void;
    showAllSteps: () => void;
    initTrainer: () => void;
    saveSettings: () => void;
    MathJax: any;
    acceptCookies: () => void;
    rejectCookies: () => void;
  }
}

async function renderRandom() {
  initRandom();

  if (generators().length == 0) {
    document.querySelector('[data-generated="title"]')!.innerHTML = 'No categories selected';
    return;
  }

  let generated = generators()[randInt(generators().length)]();

  document.querySelectorAll('[data-generated]').forEach((el) => {
    el.innerHTML = (generated as any)[el.getAttribute('data-generated')!];
  });

  // Draw the bass clef staff with the note
  drawBassClefNote(generated.note);

  document.getElementById('problemId')!.innerHTML =
    `Problem ID: ${getProblemId()}`;
  document
    .getElementById('ghIssueLink')!
    .setAttribute(
      'href',
      `https://github.com/BiteSizedMusic/BiteSizedMusic.github.io/issues/new?title=${encodeURIComponent(`Problem ID: ${getProblemId()}`)}`,
    );
  document
    .getElementById('mailToLink')!
    .setAttribute(
      'href',
      `mailto:bergmannmatthias1+bitesizedmusic@gmail.com?subject=${encodeURIComponent(`Problem ID: ${getProblemId()}`)}`,
    );
}

function drawBassClefNote(note: any) {
  const svg = document.getElementById('staffSvg') as unknown as SVGSVGElement;
  svg.innerHTML = '';
  
  const staffY = 80; // Top of staff
  const lineSpacing = 15; // Space between staff lines
  const clefX = 30;
  const noteX = 200;

  const linePosition = toNoteNumber(note) - toNoteNumber('G2'); // G2 is the bottom line (linePosition 0)
  
  // Draw staff lines
  for (let i = 0; i < 5; i++) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '20');
    line.setAttribute('x2', '380');
    line.setAttribute('y1', String(staffY + i * lineSpacing));
    line.setAttribute('y2', String(staffY + i * lineSpacing));
    line.setAttribute('stroke', 'white');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);
  }
  
  // Draw bass clef symbol (simplified)
  const clef = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  clef.setAttribute('x', String(clefX));
  clef.setAttribute('y', String(staffY + 45));
  clef.setAttribute('font-size', '70');
  clef.setAttribute('fill', 'white');
  clef.setAttribute('font-family', 'serif');
  clef.textContent = '𝄢';
  svg.appendChild(clef);
  
  // Calculate note Y position based on linePosition
  // linePosition 0 = bottom line (G2), position 8 = top ledger line (A3)
  const noteY = staffY + (8 - linePosition) * (lineSpacing / 2);
  
  // Draw ledger lines if needed
  if (linePosition > 8) {
    // Above staff
    for (let i = 10; i <= linePosition; i += 2) {
      const ledger = document.createElementNS('http://www.w3.org/2000/svg', 'line');
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
      const ledger = document.createElementNS('http://www.w3.org/2000/svg', 'line');
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
  const noteHead = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
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

window.newProblem = (wasCorrect: boolean) => {
  document.querySelectorAll('[data-is-solution]').forEach((el) => {
    el.classList.add('hidden');
  });

  document.getElementById('next')!.classList.remove('hidden');
  recordPlayed(wasCorrect);
  refreshStats();
  renderRandom();
};

window.showAllSteps = () => {
  document.getElementById('next')!.classList.add('hidden');
  document.querySelectorAll('[data-is-solution]').forEach((el) => {
    el.classList.remove('hidden');
  });
};

window.initTrainer = async () => {
  initSettings();
  refreshStats();
  renderRandom();
};

function initSettings() {
  document.getElementById('settings')!.children[1].innerHTML = Object.keys(
    generatorConfig,
  )
    .map(
      (c) =>
        `<div><input type="checkbox" id="setting-cb-${c}" name="${c}" ${getSelectedCategories().includes(c) ? 'checked' : ''} class="accent-black">` +
        `<label for="setting-cb-${c}">&nbsp;${generatorConfig[c as keyof typeof generatorConfig].name}</label></div>`,
    )
    .join('');
}

function refreshStats() {
  const stats = getStats();
  document.getElementById('stats')!.innerHTML = `
        Played: ${stats.totalSolvedCorrect} / ${stats.totalSolved}<br>
        Today: ${stats.solvedTodayCorrect} / ${stats.solvedToday}`;
}

window.saveSettings = () => {
  const selectedCategories = Array.from(
    document.getElementById('settings')!.children[1].children,
  )
    .filter(
      (c) =>
        (<HTMLInputElement>c.firstElementChild!).type === 'checkbox' &&
        (<HTMLInputElement>c.firstElementChild!).checked,
    )
    .map((c) => (<HTMLInputElement>c.firstElementChild!).name);
  setSelectedCategories(selectedCategories.join(''));

  window.location.reload();
};

if (Cookies.get('cookiesEnabled') !== 'true') {
  document.getElementById('cookieBanner')!.classList.remove('hidden');
}

window.rejectCookies = () => {
  document.getElementById('cookieBanner')!.classList.add('hidden');
};

window.acceptCookies = () => {
  Cookies.set('cookiesEnabled', 'true', { sameSite: 'strict', expires: 10000 });
  document.getElementById('cookieBanner')!.classList.add('hidden');
};
