import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../app/journey.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { initialJourney, restoreJourney, chapterFinished } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('migrates the original unlock-only browser save', () => {
  const state = restoreJourney({ started: true, unlocked: ['arrival', 'twins', 'garden'] });
  assert.equal(state.started, true);
  assert.deepEqual(state.unlocked, ['arrival', 'twins', 'garden']);
  assert.equal(state.trace, 0);
  assert.equal(state.active, 'arrival');
});

test('rejects malformed storage and impossible prerequisite states', () => {
  for (const value of [null, false, 'bad', 200]) assert.deepEqual(restoreJourney(value), initialJourney);
  const state = restoreJourney({ active: 'finale', unlocked: ['oops', 'oops'], trace: 20,
    matched: ['mind', 'mind', 'fake'], bloomed: [0, 0, -1, 20], activeLily: 5,
    developed: [0], opened: ['bogart'], letter: 'bogart', revealed: 1, sent: true, yes: true });
  assert.deepEqual(state.unlocked, ['arrival']);
  assert.equal(state.active, 'arrival');
  assert.equal(state.trace, 0);
  assert.deepEqual(state.matched, ['mind']);
  assert.deepEqual(state.bloomed, [0]);
  assert.equal(state.activeLily, null);
  assert.deepEqual(state.opened, []);
  assert.equal(state.letter, null);
  assert.equal(state.sent, false);
  assert.equal(state.yes, false);
});

test('round-trips completed chapters and a note awaiting manual continuation', () => {
  const state = { ...initialJourney, started: true, active: 'signal', unlocked: ['arrival','twins','signal'],
    trace: 3, matched: ['mind','laugh','home','heart'], step: 1, correct: true };
  const restored = restoreJourney(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(restored, state);
  assert.equal(chapterFinished('arrival', restored), true);
  assert.equal(chapterFinished('twins', restored), true);
  assert.equal(chapterFinished('signal', restored), false);
});

test('rereading the finale does not take a collected keepsake away', () => {
  const restored = restoreJourney({ ...initialJourney, finaleKept: true, revealed: 1, sent: false, yes: false });
  assert.equal(chapterFinished('finale', restored), true);
});
