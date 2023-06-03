/**
 * Params:
 *  + dateTime: Javascript datetime onbject
 * Des: Xử lí việc chuyển đổi datetime -> dd/mm/yyyy
 * Author: DDKhang
 * CreateAt: 24/4/2023
 * ModifierAt: 24/4/2023
 */
export function convertDate(dateTime) {
  const date = new Date(dateTime);

  // Get values day, month, year
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  var formattedDate =
    (day < 10 ? "0" : "") +
    day +
    "/" +
    (month < 10 ? "0" : "") +
    month +
    "/" +
    year;

  return formattedDate;
}
