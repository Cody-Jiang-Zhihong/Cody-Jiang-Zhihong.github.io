import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRoute, aliases } from '../castle/routes.js';
import { content } from '../castle/content.js';
import { hallway, exhibits } from '../castle/scene-map.js';

test('old portfolio hashes migrate to the corresponding content',()=>{
  assert.equal(parseRoute('#experience').hash,'#study/experience');
  assert.equal(parseRoute('#projects').hash,'#great-hall');
  assert.equal(parseRoute('#resume').hash,'#study/cv');
  for(const [old,target] of Object.entries(aliases)) assert.equal(parseRoute('#'+old).hash,'#'+target);
});
test('all rooms and exhibits round-trip to a stable deep link',()=>{
  for(const [room,data] of Object.entries(content.rooms)) {
    assert.equal(parseRoute('#'+room).room,room);
    for(const id of data.entries) {
      assert.ok(content.details[id]);
      assert.deepEqual(parseRoute(`#${room}/${id}`),{room,detail:id,hash:`#${room}/${id}`});
    }
  }
});
test('invalid, foreign, and malformed URLs fail to a usable room',()=>{
  assert.equal(parseRoute('').room,'gate');
  assert.equal(parseRoute('#missing').hash,'#hall');
  assert.equal(parseRoute('#%XX').hash,'#hall');
  assert.equal(parseRoute('#study/steam').hash,'#study');
  assert.equal(parseRoute('#workshop/games/extra').hash,'#workshop');
});
test('architectural regions target the four agreed destinations',()=>{
  assert.deepEqual(hallway.map(point=>point.room),['great-hall','study','observatory','workshop']);
  for(const [room,points] of Object.entries(exhibits)) {
    for(const point of points) {
      assert.ok(content.rooms[room].entries.includes(point.detail));
      assert.ok(point.points.every(([x,y])=>x>=0 && x<=1 && y>=0 && y<=1));
    }
  }
});
