import MISAEnum from "../js/MISAEnum";
import emitter from "tiny-emitter/instance";

/**
 * - Params:
 *    + err: thông tin lỗi
 * - Des: Thực hiện hiển thị dialog lỗi
 * - Author: DDKhang
 * - CreateAt: 24/4/2023
 * - ModifierAt: 24/4/2023
 */
export function CatchError(err) {
  const statusCode = err.response.status;
  let errors = [];
  switch (statusCode) {
    case MISAEnum.HttpStatusCode.BadRequest:
      break;
    case MISAEnum.HttpStatusCode.ServerError:
      errors.push(err.response.data.userMsg);
      // errors.push(MISAResource[this.$langCode].ErrorMsg);
      emitter.emit("showNotice", errors); // phát đến App.vue thực hiện thông báo lỗi
      break;
    default:
      errors.push("Vui lòng liên hệ MISA để được trợ giúp!");
      break;
  }
}

/**
 *
 * @param {*} message - Thông tin lỗi
 * - Des: Thực hiện hiển thị thông tin lỗi
 * Author: DDKhang (3/5/2023)
 */
export function ShowValidate(message) {
  let errors = [];
  errors.push(message);
  emitter.emit("showNotice", errors); // phát đến App.vue thực hiện thông báo lỗi
}

/**
 * Des: Thực hiện hiển thị dialog question
 * Author: DDKhang
 * CreateAt: 3/5/2023
 * ModifierAt: 3/5/2023
 * @param {} msg Nội dụng của dialog question
 */
export async function ShowQuestion(msg) {
  let errors = [];
  errors.push(msg);
  await emitter.emit("showQuestion", errors); // phát đến App.vue thực hiện thông báo lỗi
}

// export function statusDeleteEmployee(status) {
//   console.log("Status 1: ", status);
//   return status;
// }
