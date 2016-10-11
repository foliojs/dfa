SOURCES = $(shell find src)

all: index.js compile.js

src/grammar.js:
	pegjs src/grammar.peg

index.js: $(SOURCES)
	rollup -c -m -i src/StateMachine.js -o index.js

compile.js: $(SOURCES) src/grammar.js
	rollup -c -m -i src/compile.js -o compile.js

clean:
	rm -f index.js index.js.map compile.js compile.js.map src/grammar.js
