import { content } from './content.js';

export const roomIds = ['gate','hall', ...Object.keys(content.rooms)];
export const aliases = {
  home:'gate', castle:'hall', gallery:'great-hall', projects:'great-hall',
  experience:'study/experience', about:'study/about', resume:'study/cv',
  contact:'study/contact', album:'study/album'
};
export const pathFor = (room, detail) => '#' + room + (detail ? '/' + detail : '');

export function parseRoute(hash = '') {
  let value;
  try { value = decodeURIComponent(hash.replace(/^#/,'')); }
  catch { value = 'hall'; }
  value = aliases[value] || value || 'gate';
  let [room, detail, extra] = value.split('/');
  if (!roomIds.includes(room)) { room = 'hall'; detail = undefined; }
  if (extra || !content.rooms[room]?.entries.includes(detail)) detail = undefined;
  return { room, detail, hash:pathFor(room,detail) };
}
