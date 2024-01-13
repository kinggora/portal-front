function dateTimeToString(date) {
  const temp = new Date(date);
  const year = temp.getFullYear();
  const month = temp.getMonth() + 1;
  const day = temp.getDate();
  const hour = temp.getHours();
  const minute = temp.getMinutes();
  return `${year}.${month < 10 ? "0" + month : month}.${
    day < 10 ? "0" + day : day
  } ${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute}`;
}

function dateToString(date) {
  const temp = new Date(date);
  const year = temp.getFullYear();
  const month = temp.getMonth() + 1;
  const day = temp.getDate();
  return `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;
}

function getToday() {
  const date = new Date();
  return dateToString(date);
}

function getLastWeek() {
  const date = new Date();
  const day = date.getDate();
  date.setDate(day - 7);
  return dateToString(date);
}

export default { dateToString, dateTimeToString, getToday, getLastWeek };
