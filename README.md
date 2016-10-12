# dfa

Compiles a regular expression like syntax to fast deterministic finite automata.
Useful for pattern matching against non-string sequences.

## Example

This example matches [Hangul](https://en.wikipedia.org/wiki/Hangul) syllables. The symbols defined in the machine are Unicode character categories which could be mapped from code points.

Machine definition:

```coffeescript
# define symbols
X   = 0; # Other character
L   = 1; # Leading consonant
V   = 2; # Medial vowel
T   = 3; # Trailing consonant
LV  = 4; # Composed <LV> syllable
LVT = 5; # Composed <LVT> syllable
M   = 6; # Tone mark

# define variables
decomposed = L V T?;
partial = LV T?;
composed = LVT;

# define main state machine pattern
main = (decomposed | partial | composed) M?;
```

Visualized, the machine looks like this (double circles are accepting states):

![dfa](https://cloud.githubusercontent.com/assets/19409/19143719/8fbc6a12-8b5a-11e6-868d-99621644d094.png)

Compiling and using the machine:

```javascript
import compile from 'dfa/compile';
import fs from 'fs';

let stateMachine = compile(fs.readFileSync('hangul.machine', 'utf8'));

// find matches
for (let [startIndex, endIndex] of stateMachine.match([0, 1, 2, 3, 0, 4, 6]) {
  console.log('match:', startIndex, endIndex);
}
```

Output:
```
match: 1 3
match: 5 6
```

## License

MIT
