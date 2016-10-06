import {Assignment, Literal, Node, Variable} from './nodes';

/**
 * Processes a list of statements into a symbol table
 */
export default class SymbolTable {
  constructor(statements) {
    this.variables = {};
    this.symbols = {};
    this.main = null;
    this.size = 0;
    this.process(statements);
  }

  process(statements) {
    for (let statement of statements) {
      if (statement instanceof Assignment) {
        this.variables[statement.variable.name] = this.processExpression(statement.expression);

        if (statement.expression instanceof Literal) {
          this.symbols[statement.variable.name] = statement.expression.value;
          this.size++;
        }
      }
    }

    this.main = this.variables.main;
    if (!this.main) {
      throw new Error('No main variable declaration found');
    }
  }

  processExpression(expr) {
    // Process children
    for (let key in expr) {
      if (expr[key] instanceof Node) {
        expr[key] = this.processExpression(expr[key]);
      }
    }

    // Replace variable references with their values
    if (expr instanceof Variable) {
      let value = this.variables[expr.name];
      if (value == null)
        throw new Error(`Undeclared indentifier ${expr.name}`);

      expr = this.processExpression(value.copy());
    }

    return expr;
  }
}
