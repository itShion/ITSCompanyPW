// postazioni-map.ts

export interface Postazione {
  id: string;
  x: string;
  y: string;
}

export const POSTAZIONI: Postazione[] = [
  { id: 'POSTAZIONE-01', x: '139.44', y: '100' },
  { id: 'POSTAZIONE-02', x: '209.44', y: '100' },
  { id: 'POSTAZIONE-03', x: '139.44', y: '160' },
  { id: 'POSTAZIONE-04', x: '209.44', y: '160' }, 
  { id: 'POSTAZIONE-05', x: '139.44', y: '220' },  
  { id: 'POSTAZIONE-06', x: '209.44', y: '220' },
  { id: 'POSTAZIONE-07', x: '209.44', y: '300' },  
  { id: 'POSTAZIONE-08', x: '279.44', y: '300' },
  { id: 'POSTAZIONE-09', x: '349.44', y: '300' },
  { id: 'POSTAZIONE-10', x: '676', y: '116' },
  { id: 'POSTAZIONE-11', x: '677', y: '186' },
  { id: 'POSTAZIONE-12', x: '769.44', y: '141' },
  { id: 'POSTAZIONE-13', x: '839', y: '140' },
  { id: 'POSTAZIONE-14', x: '794.44', y: '221' },
  { id: 'POSTAZIONE-15', x: '839', y: '220' },
  { id: 'POSTAZIONE-16', x: '794.44', y: '281' },
  { id: 'POSTAZIONE-17', x: '839', y: '280' },
  { id: 'POSTAZIONE-18', x: '660.44', y: '351' },
  { id: 'POSTAZIONE-19', x: '730.44', y: '351' },
  { id: 'POSTAZIONE-20', x: '800', y: '350' },
  { id: 'POSTAZIONE-21', x: '908', y: '111' },
  { id: 'POSTAZIONE-22', x: '908', y: '191' },
  { id: 'POSTAZIONE-23', x: '908', y: '271' },
  { id: 'POSTAZIONE-240', x: '900', y: '355' }




];

export function resolvePostazioneId(el: SVGRectElement): string | null {
  const x = el.getAttribute('x');
  const y = el.getAttribute('y');

  const found = POSTAZIONI.find(p => p.x === x && p.y === y);
  return found?.id ?? null;
}
