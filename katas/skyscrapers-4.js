// https://www.codewars.com/kata/5671d975d81d6c1c87000022
const { chunk, cloneDeep, flatten } = require('lodash')

const init = (clues) => {
  class Cell {
    row = 0;
    col = 0;
    value = 0;
    possibleValues = [];
    neighborsValues = [];

    constructor({ row, col }) {
      this.row = row
      this.col = col
    }

    get row() { return this.row }
    get col() { return this.col }
    get value() { return this.value }
    get isValid() {
      const wasSet = this.value !== 0
      const isPossible = this.possibleValues.indexOf(this.value) >= 0
      const isUnique = this.neighborsValues.indexOf(this.value) === -1
      return wasSet && isPossible && isUnique
    }
    set val(value) { this.value = value }
  }
  class Board {
    len = 0;
    clues = [];
    board = [];

    constructor(clues) {
      this.len = Math.sqrt(clues.length)
      this.clues = chunk(clues, this.len)
      this.board = this.createEmptyBoard()
    }

    get layout() { return this.board }
    get len() { return this.len }
    get isValid() {
      const flat = flatten(this.values())
      return flat.every(num => num !== 0)
    }

    createEmptyBoard() {
      const getEmptyLine = () => new Array(this.len).fill(null)
      const board = getEmptyLine()
      return board.map(_val => getEmptyLine())
    }

    cell({ row, col }) {
      return this.board[row][col]
    }

    setCell(cell) {
      this.board[cell.row][cell.col] = cell
    }

    setCellValue({ row, col, value }) {
      this.board[row][col].val = value
    }

    neighbors({ row, col }) {
      const cells = [...this.board[row]]
      this.board.forEach(r => {
        if (!cells.includes(r[col])) cells.push(r[col])
      })

      const values = []
      cells.forEach(cell => {
        values.push(cell.value)
      })

      return { cells, values }
    }

    combinations({ row, col }) {
      let values = []
      let rules = []
      if (col !== undefined) {
        values = this.values({ col })
        rules = this.rules({ col })
      } else if (row !== undefined) {
        values = this.values({ row })
        rules = this.rules({ row })
      }

      const list = this.getCombinations({ matchLine: values, matchRules: rules })
      const defined = new Array(this.len).fill(0)

      for (let i = 0; i < defined.length; i++) {
        let value = list[0][i]
        const filtered = list.filter(el => el[i] === value)
        if (list.length === filtered.length) defined[i] = value
      }

      return { list, defined }
    }

    rules({ row, col }) {
      if (row !== undefined) {
        const [right, left] = [this.clues[1], this.clues[3]]
        return [left[this.len - 1 - row], right[row]]
      } else if (col !== undefined) {
        const [top, bottom] = [this.clues[0], this.clues[2]]
        return [top[col], bottom[this.len - 1 - col]]
      }
    }

    values({ row, col } = {}) {
      if (row !== undefined) {
        const rowValues = []
        this.board[row].forEach(cell => {
          rowValues.push(cell.value)
        })
        return rowValues
      } else if (col !== undefined) {
        const colValues = []
        this.board.forEach(r => {
          colValues.push(r[col].value)
        })
        return colValues
      } else {
        const allValues = []
        this.board.forEach(r => {
          const rowValues = []
          r.forEach(cell => {
            rowValues.push(cell.value)
          })
          allValues.push(rowValues)
        })
        return allValues
      }
    }

    getCombinations({ matchRules, matchLine }, base = this.getBaseValues()) {
      let result = [];

      const permute = (arr, m = []) => {
        if (arr.length === 0) {
          result.push(m)
        } else {
          for (let i = 0; i < arr.length; i++) {
            let curr = arr.slice();
            let next = curr.splice(i, 1);
            permute(curr.slice(), m.concat(next))
          }
        }
      }
      permute(base)

      if (matchLine) {
        matchLine.forEach((num, idx) => {
          if (num !== 0) result = result.filter(el => el[idx] === num)
        })
      }

      if (matchRules) {
        result = result.filter(el => {
          const [left, right] = matchRules

          let curLeft = 0
          let curRight = 0

          if (left !== 0) {
            let maxLeft = 0
            for (const num of el) {
              if (num > maxLeft) {
                curLeft++
                maxLeft = num
              }
            }
          }

          if (right !== 0) {
            let maxRight = 0
            for (const num of cloneDeep(el).reverse()) {
              if (num > maxRight) {
                curRight++
                maxRight = num
              }
            }
          }

          if (curLeft && curRight) { return curLeft === left && curRight === right }
          else if (curLeft && !curRight) { return curLeft === left }
          else if (!curLeft && curRight) { return curRight === right }
          else { return true }
        })
      }

      return result;
    }

    getBaseValues() {
      return Array.from({ length: this.len }, (_, i) => i + 1)
    }
  }

  const board = new Board(clues)
  const len = board.len

  for (let row = 0; row < len; row++) {
    for (let col = 0; col < len; col++) {
      board.setCell(new Cell(
        {
          row: row,
          col: col
        }
      ))
    }
  }


  do {
    for (let step = 0; step < len; step++) {
      const definedRow = board.combinations({ row: step }).defined
      definedRow.forEach((num, iCol) => {
        if (num !== 0) {
          board.setCellValue({
            row: step,
            col: iCol,
            value: num
          })
        }
      })

      const definedCol = board.combinations({ col: step }).defined
      definedCol.forEach((num, iRow) => {
        if (num !== 0) {
          board.setCellValue({
            row: iRow,
            col: step,
            value: num
          })
        }
      })
    }

    console.log(board.values());
  } while (!board.isValid)

  return board.values()
}

module.exports = {
  init
}