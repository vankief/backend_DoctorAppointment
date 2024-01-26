import { arraysAreEqual } from './index'; // Đảm bảo rằng đường dẫn này đúng với vị trí của hàm arraysAreEqual

describe('arraysAreEqual', () => {
  test('should return true for identical arrays', () => {
    const array1 = [
      {
        name: 'John',
        age: 30,
      },
      {
        name: 'John1',
        age: 30,
      },
      {
        name: 'John2',
        age: 30,
      },
    ];
    const array2 = [
      {
        name: 'John',
        age: 30,
      },
      {
        name: 'John2',
        age: 30,
      },
      {
        age: 30,
        name: 'John1',
      },
    ];
    expect(arraysAreEqual(array1, array2)).toBe(true);
  });

  test('should return false for different arrays', () => {
    const array1 = [1, 2, 3];
    const array2 = [4, 5, 6];
    expect(arraysAreEqual(array1, array2)).toBe(false);
  });

  test('should return true for empty arrays', () => {
    const array1 = [];
    const array2 = [];
    expect(arraysAreEqual(array1, array2)).toBe(true);
  });

  test('should return false for arrays with different lengths', () => {
    const array1 = [1, 2, 3];
    const array2 = [1, 2];
    expect(arraysAreEqual(array1, array2)).toBe(false);
  });
});
