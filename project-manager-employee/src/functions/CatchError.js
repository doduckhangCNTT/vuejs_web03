import MISAEnum from "../js/MISAEnum";
import emitter from "tiny-emitter/instance";
import MISAResource from "../js/MISAResource";

/**
 * - Params:
 *    + err: thông tin lỗi
 * - Des: Thực hiện hiển thị dialog lỗi
 * - Author: DDKhang
 * - CreateAt: 24/4/2023
 * - ModifierAt: 24/4/2023
 */
export function CatchError(err) {
  // const eventEmitter = new emitter();
  const statusCode = err.response?.status;
  let errors = [];
  switch (statusCode) {
    case MISAEnum.HttpStatusCode.BadRequest:
      console.log(err);
      const errorsValidate = err.response.data.UserMessages;
      ShowValidate(errorsValidate);
      break;
    case MISAEnum.HttpStatusCode.ServerError:
      // Thực hiện thông báo
      // 1. Thông tin thông báo
      // const toastInfo = {
      //   status: MISAResource.Toast.Server.Error.status,
      //   // msg: MISAResource.Toast.Server.Error.msg,
      //   msg: err.response.data.UserMessage,
      // };
      // 2. Phát lên App.vue -> để hiển thị Toast
      // emitter.emit("showToast", toastInfo);
      console.log(err);
      ShowValidate(err.response.data.UserMessages);
      // errors.push(err.response.data.userMsg);
      // // errors.push(MISAResource[this.$langCode].ErrorMsg);
      // emitter.emit("showNotice", errors); // phát đến App.vue thực hiện thông báo lỗi
      break;
    default:
      // Thực hiện thông báo
      // 1. Thông tin thông báo
      const toastInfo1 = {
        status: MISAResource.Toast.Server.Error.status,
        // msg: MISAResource.Toast.Server.Error.msg,
        msg: err.response?.data.UserMessage,
      };
      // 2. Phát lên App.vue -> để hiển thị Toast
      console.log(err);
      emitter.emit("showToast", toastInfo1);
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
  errors.push(...message);
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

/**
 * Des: Thực hiện hiển thị dialog hỏi người dùng thay đổi dữ liệu
 * Author: DDKhang
 * CreateAt: 3/5/2023
 * ModifierAt: 3/5/2023
 * @param {} msg Nội dụng của dialog question
 */
export async function ShowQuestionChangeValue(msg) {
  let errors = [];
  errors.push(msg);
  await emitter.emit("showQuestionChangeValue", errors); // phát đến App.vue thực hiện thông báo lỗi
}

// export function statusDeleteEmployee(status) {
//   console.log("Status 1: ", status);
//   return status;
// }
