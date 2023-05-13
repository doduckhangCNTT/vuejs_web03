import MISAEnum from "../js/MISAEnum";
import emitter from "tiny-emitter/instance";

/**
 * Params:
 *  + err: thông tin lỗi
 * Des: Thực hiện hiển thị dialog lỗi
 * Author: DDKhang
 * CreateAt: 24/4/2023
 * ModifierAt: 24/4/2023
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

export function ShowValidate(msg) {
  let errors = [];
  errors.push(msg);
  emitter.emit("showNotice", errors); // phát đến App.vue thực hiện thông báo lỗi
}

export async function ShowQuestion(msg) {
  let errors = [];
  errors.push(msg);
  await emitter.emit("showQuestion", errors); // phát đến App.vue thực hiện thông báo lỗi
}

// export function statusDeleteEmployee(status) {
//   console.log("Status 1: ", status);
//   return status;
// }
