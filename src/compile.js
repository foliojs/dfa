import grammar from './grammar';
import SymbolTable from './SymbolTable';
import buildDFA from './dfa';
import StateMachine from './StateMachine';

export function parse(string, externalSymbols) {
  let ast = grammar.parse(string);
  return new SymbolTable(ast, externalSymbols);
}

export function build(symbolTable) {
  let states = buildDFA(symbolTable.main, symbolTable.size);

  return new StateMachine({
    stateTable: states.map(s => Array.from(s.transitions)),
    accepting: states.map(s => s.accepting),
    tags: states.map(s => Array.from(s.tags))
  });
}

export default function compile(string, externalSymbols) {
  return build(parse(string, externalSymbols));
}
