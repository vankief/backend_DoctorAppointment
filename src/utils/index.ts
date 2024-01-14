/*
 * @desc: convert date to string eg. 09092001
 */
const convertDate = (date: Date) => {
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}${month}${year}`;
};

export { convertDate };
