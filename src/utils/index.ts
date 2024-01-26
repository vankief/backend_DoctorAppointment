/*
 * @desc: convert date to string eg. 09092001
 */

import _ from 'lodash';

const convertDate = (date: Date) => {
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}${month}${year}`;
};

function arraysAreEqual(array1, array2) {
  return _.isEmpty(_.xorWith(array1, array2, _.isEqual));
}

export { convertDate, arraysAreEqual };
