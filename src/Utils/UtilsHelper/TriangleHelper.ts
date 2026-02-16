export default class TriangleHelper {
  public static generateTriangle(length: number) {
    console.log(makeTriangle(length));
    console.log(makeUpsideDownTriangle(length));
  }
}

function makeUpsideDownTriangle(lengthNum: number) {
  let triangle = '';
  for (let i = lengthNum - 1; i >= 1; i--) {
    triangle += makeLine(lengthNum, i, 'upsideDown');
  }
  return triangle;
}

function makeTriangle(lengthNum: number) {
  let triangle = '';
  for (let i = 1; i <= lengthNum; i++) {
    triangle += makeLine(lengthNum, i, 'normal');
  }
  return triangle;
}

function makeLine(lengthNum: number, height: number, mode: string) {
  let line = '';
  for (let j = 1; j <= height; j++) {
    line += '* ';
  }

  switch (mode) {
    case 'normal': {
      if (height != lengthNum) {
        return line + '\n';
      }
      return line;
    }
    case 'upsideDown': {
      if (height == 1) {
        return line;
      }
      return line + '\n';
    }
  }
}
