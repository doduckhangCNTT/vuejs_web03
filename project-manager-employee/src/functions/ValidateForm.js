import MISAResource from "../js/MISAResource";
import EntityEnum from "../config/EntityEnum";
import { filterInfoEntity } from "../config/FetchData";
/**
 * Params:
 *  + data: object
 * Des: Thực hiện validate form
 * Author: DDKhang
 * CreateAt: 3/5/2023
 * ModifierAt: 3/5/2023
 */
function validateForm(data) {
  // Kiem tra trong
}

/**
 *
 * @param {*} data - Dữ liệu muốn kiểm tra
 * @returns {status: trạng thái(boolean), msg: thông báo}
 * - Author: DDKhang (24/5/2023)
 */
export function checkBlank(data) {
  if (data.value?.trim() === "" || !data.value) {
    return {
      status: true,
      msg: data.title + " bắt buộc nhập.",
    };
  }
  return {
    status: false,
    msg: "",
  };
}

/**
 *
 * @param {*} employees - Danh sách các nhân viên
 * @param {*} employeeCode - Mã nhân viên
 * @returns {status: number, msg: string}
 * - Des: Thực hiện kiểm tra có trùng mã nhân viên
 */
export async function checkDuplicateEmployeeCode(entityName, entityFilter) {
  // const employee = employees.find(
  //   (employee) => employee.EmployeeCode === employeeCode?.trim()
  // );
  const res = await filterInfoEntity(entityName, entityFilter);
  const entity = res.data.Data;

  if (entity.length > 0) {
    return {
      status: true,
      msg: MISAResource.Validate.textCheckExistEmployeeCode,
    };
  }
  return {
    status: false,
    msg: "",
  };
}

/**
 *
 * @param {*} email - Email cần kiểm tra
 * @returns {status: trạng thái kiểm tra, msg: Nội dụng lỗi}
 * - Author: DDKhang (24/5/2023)
 */
export function checkEmail(email) {
  const regexString = "^[a-zA-Z0-9]+@[a-z]+\\.[a-z]{2,3}$";
  const regex = new RegExp(regexString);
  return {
    status: regex.test(email),
    msg: MISAResource.Validate.textCheckEmail,
  };
}

/**
 *
 * @param {*} dateOfBirth - Ngày sinh
 * @returns boolean
 * - Des: Thực hiện kiểm tra ngày sinh có nhỏ hơn ngày hiện tại
 * - Author: DDKhang (7/6/2023)
 */
export function checkDateOfBirth(dateOfBirth) {
  const currentDate = new Date();
  const date = new Date(dateOfBirth);
  const isCheck = date < currentDate;
  return {
    status: isCheck,
    msg: MISAResource.Validate.textCheckDateOfBirth,
  };
}
