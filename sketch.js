let editor;
let turtle;
let tokens;

function setup() {
  createCanvas(200, 200);
  angleMode(DEGREES);
  background(0);

  editor = select('#code');
  editor.input(goTurtle);

  turtle = new Turtle(100, 100, 0);
  goTurtle();
}

function goTurtle() {
  background(0);
  push();
  turtle.reset();

  let code = editor.value().replace(/(\s)\s+/,'$1');
  tokens = code.split(' ');
  //console.log(tokens);

  try {
    runBloc(0, 1);
  } catch(e) {
    console.log(e);
  }

  pop();
}

function runBloc (start, repeat) {
  let index;

  for (let count = repeat; count > 0; count -= 1) {
    index = start;

    for (let arg; true; ) {
      if (index >= tokens.length) {
        if (start > 0) throw "Syntax error. Found end of file.";
        break;
      }

      let token = tokens[index++];

      if (token === ']') {
        break;

      } else if (token === 'repeat') {
        arg = 1*tokens[index++];
        if (arg !== 0 && (!arg || arg < 1)) throw "Syntax error. Found '"+tokens[index-1]+"' but wanted a number.";

        if (tokens[index] !== '[') throw "Syntax error. Found '"+tokens[index]+"' but wanted '['.";
        index++;

        index = runBloc(index, arg);

      } else if (commands1arg[token]) {
        commands1arg[token]();

      } else if (commands2arg[token]) {
        arg = 1*tokens[index++];
        if (arg !== 0 && (!arg || arg < 1)) throw "Syntax error. Found '"+tokens[index-1]+"' but wanted a number.";

        commands2arg[token](arg);
      } else {
        throw "Syntax error. Found unknown command '"+tokens[index-1]+"'.";
      }
    }
  }
  return index;
}
