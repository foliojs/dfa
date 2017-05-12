import {addAll, union} from './utils';

/**
 * Base AST node
 */
export class Node {
  constructor() {
    Object.defineProperty(this, 'followpos', {value: new Set})
  }

  calcFollowpos() {
    for (let key in this) {
      if (this[key] instanceof Node) {
        this[key].calcFollowpos();
      }
    }
  }
}

/**
 * Represents a variable reference
 */
export class Variable extends Node {
  constructor(name) {
    super();
    this.name = name;
  }

  copy() {
    return new Variable(this.name);
  }
}

/**
 * Represents a comment
 */
export class Comment extends Node {
  constructor(value) {
    super();
    this.value = value;
  }
}

/**
 * Represents an assignment statement.
 * e.g. `variable = expression;`
 */
export class Assignment extends Node {
  constructor(variable, expression) {
    super();
    this.variable = variable;
    this.expression = expression;
  }
}

/**
 * Represents an alternation.
 * e.g. `a | b`
 */
export class Alternation extends Node {
  constructor(a, b) {
    super();
    this.a = a;
    this.b = b;
  }

  get nullable() {
    return this.a.nullable || this.b.nullable;
  }

  get firstpos() {
    return union(this.a.firstpos, this.b.firstpos);
  }

  get lastpos() {
    return union(this.a.lastpos, this.b.lastpos);
  }

  copy() {
    return new Alternation(this.a.copy(), this.b.copy());
  }
}

/**
 * Represents a concatenation, or chain.
 * e.g. `a b c`
 */
export class Concatenation extends Node {
  constructor(a, b) {
    super();
    this.a = a;
    this.b = b;
  }

  get nullable() {
    return this.a.nullable && this.b.nullable;
  }

  get firstpos() {
    let s = this.a.firstpos;
    if (this.a.nullable) {
      s = union(s, this.b.firstpos);
    }

    return s;
  }

  get lastpos() {
    let s = this.b.lastpos;
    if (this.b.nullable) {
      s = union(s, this.a.lastpos);
    }

    return s;
  }

  calcFollowpos() {
    super.calcFollowpos();
    for (let n of this.a.lastpos) {
      addAll(n.followpos, this.b.firstpos);
    }
  }

  copy() {
    return new Concatenation(this.a.copy(), this.b.copy());
  }
}

/**
 * Represents a repetition.
 * e.g. `a+`, `b*`, or `c?`
 */
export class Repeat extends Node {
  constructor(expression, op) {
    super();
    this.expression = expression;
    this.op = op;
  }

  get nullable() {
    return this.op === '*' || this.op === '?';
  }

  get firstpos() {
    return this.expression.firstpos;
  }

  get lastpos() {
    return this.expression.lastpos;
  }

  calcFollowpos() {
    super.calcFollowpos();
    if (this.op === '*' || this.op === '+') {
      for (let n of this.lastpos) {
        addAll(n.followpos, this.firstpos);
      }
    }
  }

  copy() {
    return new Repeat(this.expression.copy(), this.op);
  }
}

export function buildRepetition(expression, min = 0, max = Infinity) {
  if (min < 0 || min > max) {
    throw new Error(`Invalid repetition range: ${min} ${max}`);
  }

  let res = null;
  for (let i = 0; i < min; i++) {
    res = concat(res, expression.copy());
  }

  if (max === Infinity) {
    res = concat(res, new Repeat(expression.copy(), '*'));
  } else {
    for (let i = min; i < max; i++) {
      res = concat(res, new Repeat(expression.copy(), '?'))
    }
  }

  return res;
}

function concat(a, b) {
  if (!a) {
    return b;
  }

  return new Concatenation(a, b);
}

/**
 * Base class for leaf nodes
 */
class Leaf extends Node {
  get nullable() {
    return false;
  }

  get firstpos() {
    return new Set([this]);
  }

  get lastpos() {
    return new Set([this]);
  }
}

/**
 * Represents a literal value, e.g. a number
 */
export class Literal extends Leaf {
  constructor(value) {
    super();
    this.value = value;
  }

  copy() {
    return new Literal(this.value);
  }
}

/**
 * Marks the end of an expression
 */
export class EndMarker extends Leaf {}

/**
 * Represents a tag
 * e.g. `a:(a b)`
 */
export class Tag extends Leaf {
  constructor(name) {
    super();
    this.name = name;
  }

  get nullable() {
    return true;
  }

  copy() {
    return new Tag(this.name);
  }
}
