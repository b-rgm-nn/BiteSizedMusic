import { cookiesSetSafe } from '../stats.js';
import Cookies from 'js-cookie';
import {
  generateAltoNotes,
  generateBassNotes,
  generateTrebleNotes,
} from './notegenerator.js';

export const generatorConfig = {
  b: { generators: [generateBassNotes], name: 'Bass clef (C2-C4)' },
  t: { generators: [generateTrebleNotes], name: 'Treble clef (C4-C6)' },
  a: { generators: [generateAltoNotes], name: 'Alto clef (C3-E5)' },
};

export function generators() {
  const filter: (keyof typeof generatorConfig)[] =
    getSelectedCategories().split('') as (keyof typeof generatorConfig)[];

  const g = [];
  for (let key of filter) {
    if (generatorConfig[key]) {
      g.push(...Object.values(generatorConfig[key].generators));
    }
  }
  return g;
}

function initFilter() {
  const url = new URL(window.location.href);
  if (url.searchParams.get('filter')) {
    setSelectedCategories(url.searchParams.get('filter')!);
  }
  url.searchParams.set('filter', getSelectedCategories());
  window.history.replaceState(getSelectedCategories(), '', url.toString());
}
initFilter();

export function getSelectedCategories() {
  let filter = new Set();
  for (let key of (Cookies.get('filter') ?? 'bta').split('')) {
    if (Object.keys(generatorConfig).includes(key)) filter.add(key);
  }
  return [...filter].sort().join('');
}

export function setSelectedCategories(categories: string) {
  cookiesSetSafe('filter', categories, { sameSite: 'strict', expires: 10000 });
  const url = new URL(window.location.href);
  url.searchParams.set('filter', getSelectedCategories());
  window.history.replaceState(getSelectedCategories(), '', url.toString());
}
