import {EndMarker, Concatenation, Literal, Tag} from './nodes';
import {addAll, equal} from './utils';

const END_MARKER = new EndMarker;

/**
 * This is an implementation of the direct regular expression to DFA algorithm described
 * in section 3.9.5 of "Compilers: Principles, Techniques, and Tools" by Aho,
 * Lam, Sethi, and Ullman. http://dragonbook.stanford.edu
 * There is a PDF of the book here:
 * http://www.informatik.uni-bremen.de/agbkb/lehre/ccfl/Material/ALSUdragonbook.pdf
 */
export default function buildDFA(root, numSymbols) {
  root = new Concatenation(root, END_MARKER);
  root.calcFollowpos();

  let failState = new State(new Set, numSymbols);
  let initialState = new State(root.firstpos, numSymbols);
  let dstates = [failState, initialState];

  // while there is an unmarked state S in dstates
  while (1) {
    let s = null;

    for (let j = 1; j < dstates.length; j++) {
      if (!dstates[j].marked) {
        s = dstates[j];
        break;
      }
    }

    if (s == null) {
      break;
    }

    // mark S
    s.marked = true;

    // for each input symbol a
    for (let a = 0; a < numSymbols; a++) {
      // let U be the union of followpos(p) for all
      //  p in S that correspond to a
      let u = new Set;
      for (let p of s.positions) {
        if (p instanceof Literal && p.value === a) {
          addAll(u, p.followpos);
        }
      }

      if (u.size === 0) {
        continue;
      }

      // if U is not in dstates
      let ux = -1;
      for (let i = 0; i < dstates.length; i++) {
        if (equal(u, dstates[i].positions)) {
          ux = i;
          break;
        }
      }

      if (ux === -1) {
        // Add U as an unmarked state to dstates
        dstates.push(new State(u, numSymbols));
        ux = dstates.length - 1;
      }

      s.transitions[a] = ux;
    }
  }

  return dstates;
}

class State {
  constructor(positions, len) {
    this.positions = positions;
    this.transitions = new Uint16Array(len);
    this.accepting = positions.has(END_MARKER);
    this.marked = false;
    this.tags = new Set;

    for (let pos of positions) {
      if (pos instanceof Tag) {
        this.tags.add(pos.name);
      }
    }
  }
}
