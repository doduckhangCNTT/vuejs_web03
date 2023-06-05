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

export function checkBlank(data) {
  if (data?.trim() === "" || !data) {
    return {
      status: true,
      msg: "Vui lòng nhập thông tin bắt buộc",
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
export function checkDuplicateEmployeeCode(employees, employeeCode) {
  const employee = employees.find(
    (employee) => employee.EmployeeCode === employeeCode?.trim()
  );
  if (employee)
    return {
      status: true,
      msg: "Mã nhân viên đã tồn tại!",
    };
  return false;
}

/**
 *
 * @param {*} email - Email cần kiểm tra
 * @returns {status: trạng thái kiểm tra, msg: Nội dụng lỗi}
 */
export function checkEmail(email) {
  const regexString = "^[a-zA-Z0-9]+@[a-z]+\\.[a-z]{2,3}$";
  const regex = new RegExp(regexString);
  return {
    status: regex.test(email),
    msg: "Email không hợp lệ",
  };
}
