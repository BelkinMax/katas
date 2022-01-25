const skyscrapers4 = require('../katas/skyscrapers-4');

describe('Skyscrapers should', () => {
  test('solve 4x4 puzzle 1', () => {
    const clues = [2, 2, 1, 3,
      2, 2, 3, 1,
      1, 2, 2, 3,
      3, 2, 1, 3];
    const expected = [[1, 3, 4, 2],
    [4, 2, 1, 3],
    [3, 4, 2, 1],
    [2, 1, 3, 4]];
    const actual = skyscrapers4.init(clues);

    expect(actual).toEqual(expected)
  });

  // test('solve 4x4 puzzle 2', () => {
  //   const clues = [0, 0, 1, 2,
  //     0, 2, 0, 0,
  //     0, 3, 0, 0,
  //     0, 1, 0, 0];
  //   const expected = [[2, 1, 4, 3],
  //   [3, 4, 1, 2],
  //   [4, 2, 3, 1],
  //   [1, 3, 2, 4]];
  //   const actual = skyscrapers4.init(clues);

  //   expect(actual).toEqual(expected)
  // });
})