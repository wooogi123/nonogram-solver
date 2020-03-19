'use strict';

const Solver = (answer, width, height, columnHints, rowHints) => {
  /*
   * function check: boolean
   * params: answer: Array[Array<number>], row: number, column: number
   * description
   *  - 해당 cell의 row, column값을 parameters로 받음
   *  - 해당 cell의 columnHints, rowHints 를 받아 검증
   */
  function check(answer, row, column) {
    const columnCheck = checkLine({
      hints: columnHints[column],
      hintsLen: columnHints[column].length,
      len: height,
      idx: row,
      getValue: (idx) => {
        return answer[idx][column];
      }
    });
    const rowCheck = checkLine({
      hints: rowHints[row],
      hintsLen: rowHints[row].length,
      len: width,
      idx: column,
      getValue: (idx) => {
        return answer[row][idx];
      }
    });
    return columnCheck && rowCheck;
  }

  /*
   * function checkLine: boolean
   * params: hints: Array<number>, len: number, idx: number, getValue: function
   * description
   *  - column의 경우 해당 cell의 columnHints, height, cell의 row index을 parameters 로 받음
   *  - row의 경우 해당 cell의 rowHints, width, column index를 parameters로 받음
   *  - getValue는 column 또는 row의 값을 받아오기 위한 closure
   */
  function checkLine({hints, hintsLen, len, idx, getValue, isLast = false}) {
    let countHint = 0;
    let checkHint = 0;
    for (let i = 0; i <= idx; i++) {
      if (getValue(i) === 1) {
        if (!isLast) {
          if (countHint >= hintsLen) return false;
        }
        checkHint++;
        isLast = true;
      } else {
        if (isLast) {
          if (hints[countHint] !== checkHint) return false;
          checkHint = 0;
          countHint++;
        }
        isLast = false;
      }
    }
    if (idx === len - 1) {
      if (isLast) return (countHint === hintsLen - 1 && checkHint === hints[countHint]);
      else return (countHint === hintsLen);
    }
    return true;
  }

  return {
    /*
     * function solve: boolean
     * params: row: number, column: number
     * description
     *  - row, column을 처음부터 끝까지 돌리는 재귀함수
     *  - row가 0일때부터 height와 같을 때 까지 재귀 반복
     *  - 0, 0부터 width, height 까지 값을 하나씩 넣어보며 유추
     */
    solve: function (row, column) {
      if (row === height) return true;
      const nextRow = (column + 1 === width ? row + 1 : row);
      const nextColumn = (column + 1 === width ? 0 : column + 1);
      answer[row][column] = 1;
      if (check(answer, row, column) && this.solve(nextRow, nextColumn)) {
        return true;
      }
      answer[row][column] = -1;
      if (check(answer, row, column) && this.solve(nextRow, nextColumn)) {
        return true;
      }
      return false;
    }
  }
};

function solve(width, height, columnHints, rowHints) {
  const answer = [];
  answer.push(
    ...Array(height)
      .fill()
      .map(() => Array(width).fill(0)));

  const s = Solver(answer, width, height, columnHints, rowHints);
  if (s.solve(0, 0)) {
    const ret = [];
    answer.forEach(el => {
      for (let i = 0; i < width; i++) {
        if (el[i] === -1) el[i] = 0;
      }
      ret.push(...el);
    });

    // 만약 2차원 배열로 return 하려는 경우
    //return answer;
    // 1차원 배열로 return 하려는 경우
    return ret;

  }
  return null;
}

exports.default = solve;