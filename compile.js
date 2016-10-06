import grammar from './src/grammar';
import SymbolTable from './src/SymbolTable';
import buildDFA from './src/dfa';
import StateMachine from './src/StateMachine';

export function parse(string) {
  let ast = grammar.parse(string);
  let symbolTable = new SymbolTable(ast);
  return symbolTable;
}

export function build(symbolTable) {
  let states = buildDFA(symbolTable.main, symbolTable.size);

  return new StateMachine({
    stateTable: states.map(s => Array.from(s.transitions)),
    accepting: states.map(s => s.accepting),
    tags: states.map(s => Array.from(s.tags))
  });
}

export default function compile(string) {
  return build(parse(string));
}
