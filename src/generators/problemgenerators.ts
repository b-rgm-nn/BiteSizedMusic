import { cookiesSetSafe } from '../stats.js';
import Cookies from 'js-cookie';
import {
  generateBasicNotes,
  generateExtendedNotes,
} from './notegenerator.js';

export type GeneratorResult = {
  title: string;
  note: string;
  answer: string;
};

export const generatorConfig = {
  a: { generators: [generateBasicNotes], name: 'Basic Notes (C2-C4)' },
  b: { generators: [generateExtendedNotes], name: 'Extended Range (G1-G4)' },
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
  for (let key of (
    Cookies.get('filter') ?? 'ab'
  ).split('')) {
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
