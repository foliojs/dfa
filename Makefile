SOURCES = $(shell find src)

SHELL := /bin/bash
PATH := ./node_modules/.bin:$(PATH)

all: index.js compile.js

src/grammar.js: src/grammar.peg
	pegjs src/grammar.peg

index.js: $(SOURCES)
	rollup -c -m -i src/StateMachine.js -o index.js

compile.js: $(SOURCES) src/grammar.js
	rollup -c -m -i src/compile.js -o compile.js

clean:
	rm -f index.js index.js.map compile.js compile.js.map src/grammar.js
