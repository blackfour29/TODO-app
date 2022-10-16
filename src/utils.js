const monthsWith31Days = [1, 3, 5, 7, 8, 10, 12];
const monthsWith30Days = [4, 6, 9, 11];

const Utils = (() => {
  function generateUniqueId() {
    let timestamp = Date.now();
    timestamp = timestamp.toString().slice(5);
    let randomNumber = Math.floor(Math.random() * 10000);
    let id = `${timestamp}${randomNumber}`;
    return id;
  }

  function getCurrentMonthDays(monthNumber) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();

    if (monthsWith31Days.includes(monthNumber)) {
      return 31;
    } else if (monthsWith30Days.includes(monthNumber)) {
      return 30;
    } else if ((year % 4 == 0 && year % 400 == 0) || year % 100 !== 0) {
      return 29;
    } else {
      return 28;
    }
  }

  return { generateUniqueId, getCurrentMonthDays };
})();

export default Utils;
