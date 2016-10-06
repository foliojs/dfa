import compile from '../compile';
import assert from 'assert';

describe('state machine compiler', function () {
  it('should compile a state machine with a single literal', function () {
    let stateMachine = compile('a = 0; b = 1; main = a;');
    let matches = Array.from(stateMachine.match([0, 0, 1, 0]));
    assert.deepEqual(matches, [
      [0, 0, []],
      [1, 1, []],
      [3, 3, []]
    ]);
  });

  it('should compile a state machine with a concatenation', function () {
    let stateMachine = compile('a = 0; b = 1; main = a b;');
    let matches = Array.from(stateMachine.match([0, 0, 1, 1, 0, 1, 0]));
    assert.deepEqual(matches, [
      [1, 2, []],
      [4, 5, []]
    ]);
  });

  it('should compile a state machine with an alternation', function () {
    let stateMachine = compile('a = 0; b = 1; main = (a b) | (b a);');
    let matches = Array.from(stateMachine.match([0, 0, 1, 1, 0, 1, 0]));
    assert.deepEqual(matches, [
      [1, 2, []],
      [3, 4, []],
      [5, 6, []]
    ]);
  });

  it('should compile a state machine with a repeat', function () {
    let stateMachine = compile('a = 0; b = 1; main = (a b)+;');
    let matches = Array.from(stateMachine.match([0, 0, 1, 0, 1, 1, 0, 1]));
    assert.deepEqual(matches, [
      [1, 4, []],
      [6, 7, []]
    ]);
  });

  it('should compile a state machine with an optional repeat', function () {
    let stateMachine = compile('a = 0; b = 1; main = b a (a b)*;');
    let matches = Array.from(stateMachine.match([0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0]));
    assert.deepEqual(matches, [
      [2, 7, []],
      [9, 10, []]
    ]);
  });

  it('should compile a state machine with an optional group', function () {
    let stateMachine = compile('a = 0; b = 1; main = b a (a b)?;');
    let matches = Array.from(stateMachine.match([0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0]));
    assert.deepEqual(matches, [
      [2, 5, []],
      [9, 10, []]
    ]);
  });

  it('should compile a state machine with tags', function () {
    let stateMachine = compile('a = 0; b = 1; main = x:(b a) | y:(a b);');
    let input = [1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0];
    let matches = Array.from(stateMachine.match(input));
    assert.deepEqual(matches, [
      [2, 3, ['x']],
      [4, 5, ['y']],
      [6, 7, ['y']],
      [9, 10, ['x']]
    ]);

    let applied = [];
    stateMachine.apply(input, {
      x: (start, end, slice) => applied.push(['x', start, end, slice]),
      y: (start, end, slice) => applied.push(['y', start, end, slice])
    });

    assert.deepEqual(applied, [
      ['x', 2, 3, [1, 0]],
      ['y', 4, 5, [0, 1]],
      ['y', 6, 7, [0, 1]],
      ['x', 9, 10, [1, 0]]
    ]);
  });
});
