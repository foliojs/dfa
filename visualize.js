import graphviz from 'graphviz';
import {parse, build} from './compile';
import {Literal} from './src/nodes';

export default function visualize(string) {
  let symbolTable = parse(string);
  let dfa = build(symbolTable);

  var g = graphviz.digraph('G');
  g.set('rankdir', 'LR');

  var symbols = {};
  for (let key in symbolTable.symbols) {
    let val = symbolTable.symbols[key];
    symbols[val] = key;
  }

  var start = g.addNode('');
  start.set('shape', 'none');

  var nodes = [];
  for (let i = 1; i < dfa.stateTable.length; i++) {
    let n = g.addNode(i + (dfa.tags[i].length ? ' (' + Array.from(dfa.tags[i]).join(',') + ')' : ''));
    n.set('shape', dfa.accepting[i] ? 'doublecircle' : 'circle');

    if (i === 1) {
      g.addEdge(start, n);
    }

    nodes.push(n);
  }

  for (let i = 1; i < dfa.stateTable.length; i++) {
    let state = dfa.stateTable[i];
    for (let j = 0; j < state.length; j++) {
      let transition = state[j];
      if (transition !== 0) {
        g.addEdge(nodes[i - 1], nodes[transition - 1])
         .set('label', symbols[j]);
      }
    }
  }

  return g;
}
