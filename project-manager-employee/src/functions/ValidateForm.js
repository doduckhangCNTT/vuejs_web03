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
      status: false,
      msg: "Vui lòng nhập thông tin bắt buộc",
    };
  }
  return {
    status: true,
    msg: "",
  };
}

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
