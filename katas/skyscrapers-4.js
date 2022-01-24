// https://www.codewars.com/kata/5671d975d81d6c1c87000022

const _ = require('lodash');

const init = (clues) => {
  // Get all the possible combinations
  const LINE_SIZE = 4;
  const BASE_LINE = [1, 2, 3, 4];

  const permutator = (inputArr) => {
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

    permute(inputArr)

    return result;
  }
  const allCombinations = permutator(BASE_LINE);
  // Create chunks
  const cluesChunks = clues.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / LINE_SIZE)

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])

  // Create col and row chunks
  const cols = [[...cluesChunks[0]], [...cluesChunks[2]].reverse()];
  const rows = [[...cluesChunks[1]], [...cluesChunks[3]].reverse()];


  const colsTuples = []
  for (let i = 0; i < cols[0].length; i++) {
    const top = cols[0][i]
    const bottom = cols[1][i]
    colsTuples.push([top, bottom])
  }

  const rowsTuples = []
  for (let i = 0; i < rows[0].length; i++) {
    const right = rows[0][i]
    const left = rows[1][i]
    rowsTuples.push([left, right])
  }

  // Filter valid solutions
  const allCombinationsSolutions = []
  for (const comb of allCombinations) {
    let left = 0;
    let right = 0;

    // Calculate...
    let maxLeft = 0;
    for (const num of comb) {
      if (num > maxLeft) {
        left++
        maxLeft = num
      }
    }
    let maxRight = 0;
    for (const num of (_.cloneDeep(comb)).reverse()) {
      if (num > maxRight) {
        right++
        maxRight = num
      }
    }

    allCombinationsSolutions.push([left, right])
  }



  const colsSolutions = []
  for (let i = 0; i < colsTuples.length; i++) {
    const lineSolutions = []
    allCombinationsSolutions.forEach((el, idx) => {
      if (_.isEqual(el, colsTuples[i])) {
        lineSolutions.push(_.cloneDeep(allCombinations[idx]).reverse())
      }
    })
    colsSolutions.push(lineSolutions)
  }
  console.log('=== cols result ===')
  console.log(colsSolutions)

  const rowsSolutions = []
  for (let i = 0; i < rowsTuples.length; i++) {
    const lineSolutions = []
    allCombinationsSolutions.forEach((el, idx) => {
      if (_.isEqual(el, rowsTuples[i])) {
        lineSolutions.push(allCombinations[idx])
      }
    })
    rowsSolutions.push(lineSolutions)
  }
  console.log('=== rows result ===')
  console.log(rowsSolutions)

  // 

  // TEST RETURN
  return [1, 2, 3, 4]
}

module.exports = {
  init
}