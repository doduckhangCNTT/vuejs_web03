<script>
import { getData } from "../../config/FetchData";
import { CatchError, ShowValidate } from "../../functions/CatchError";
import {
  checkBlank,
  checkDuplicateEmployeeCode,
} from "../../functions/ValidateForm";
import { showCombobox } from "../../functions/Combobox";
import MISAInput from "../../components/MISAInput.vue";

export default {
  name: "EmployeeForm",
  props: ["id"],
  components: { MISAInput },
  data() {
    return {
      employeeId: "",
      employee: {
        Gender: 0,
      },
      department: {},
      employees: [],
      departments: [],
      inputs: [],
      currentIndex: 0, // index của thẻ input hiện tại được chọn
    };
  },
  async created() {
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        // react to route changes...
        console.log({
          toParams,
          previousParams,
        });
      }
    );
    // Sử dụng tabIndex khi vào form info employee
    // useTabIndex();

    this.employeeId = this.$route.params.id;
    if (this.isAdd) {
      // Thực hiện post employee
      try {
        // Tạo mã employee mới
        // Kiểm tra xem DOM đã được render ra chưa
        this.$nextTick(async function () {
          const res = await getData(
            `https://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode`
          );
          this.employee.EmployeeCode = res.data;
          this.$refs.textCodeEmployee.focus();
        });
        // Thực hiện hiển thị thông báo trạng thái post
      } catch (error) {
        console.log(error.message);
      }
    } else {
      // Thực hiện put employee
      if (this.employeeId) {
        try {
          const res = await getData(
            `https://cukcuk.manhnv.net/api/v1/Employees/${this.employeeId}`
          );
          // const res = await getData(
          //   `https://jsonplaceholder.typicode.com/users?id=${this.employeeId}`
          // );
          this.employee = res.data;
          // this.employee = res.data[0];
          this.$refs.textCodeEmployee.focus();
        } catch (error) {
          console.log(error.message);
        }

        if (this.employee?.DepartmentId) {
          try {
            const res = await getData(
              `https://cukcuk.manhnv.net/api/v1/Departments/${this.employee?.DepartmentId}`
            );
            console.log("Data: ", res.data);
            this.department = res.data;
            // this.employee.DepartmentName = res.data.DepartmentName;
          } catch (error) {
            console.log(error);
          }
        }
      }
      // Thực hiện hiển thị thông báo trạng thái put
    }

    // Thực hiện lấy toàn bộ các phòng ban
    try {
      const res = await getData(`https://cukcuk.manhnv.net/api/v1/Departments`);
      this.departments = res.data;
    } catch (error) {
      console.log(error.message);
    }

    // Thực hiện lấy toàn bộ employees để check mã trùng lặp
    try {
      const res = await getData("https://cukcuk.manhnv.net/api/v1/Employees");
      this.employees = res.data;
    } catch (error) {
      console.log(error.message);
    }
  },
  mounted() {
    // =================== Handel Tab - Start =======================
    // Lấy toàn bộ những thẻ có thuộc tính "Ref"
    const tagsContainRefAttr = Object.values(this.$refs);
    const inputs = [];
    // Kiểm tra những thẻ khác có phải là thẻ INPUT hoặc BUTTON hay không
    tagsContainRefAttr.forEach((input) => {
      if (input.nodeName === "INPUT" || input.nodeName === "BUTTON") {
        inputs.push(input);
      }
    });
    // Thêm xử lý sự kiện khi nhấn phím Tab
    inputs.forEach((input, index) => {
      input.addEventListener("keydown", (event) => {
        if (
          event.key === "Tab" &&
          !event.shiftKey &&
          index === inputs.length - 1
        ) {
          // Nếu đang ở input cuối cùng và nhấn phím Tab, chuyển về input đầu tiên
          event.preventDefault();
          inputs[0].focus();
        }
      });
    });
    // Thêm xử lý sự kiện khi nhả phím Tab
    inputs.forEach((input, index) => {
      input.addEventListener("keyup", (event) => {
        if (event.key === "Tab" && event.shiftKey && index === 0) {
          // Nếu đang ở input đầu tiên và nhấn Shift + Tab, chuyển về input cuối cùng
          event.preventDefault();
          inputs[inputs.length - 1].focus();
        }
      });
    });
    // =================== Handel Tab - End =======================
  },
  beforeUpdate() {
    // Thực hiện xóa class "invalid" khỏi thẻ input khi thay đổi giá trị trên đó
    if (this.employee.FullName) {
      const tagCurrent = this.$refs.inputFullName;
      this.removeInvalidInputForm(tagCurrent);
    }

    if (this.employee.EmployeeCode) {
      const tagCurrent = this.$refs.textCodeEmployee;
      this.removeInvalidInputForm(tagCurrent);
    }

    if (this.employee.DepartmentId) {
      const tagCurrent = this.$refs.comboboxDepartment;
      this.removeInvalidInputForm(tagCurrent);
    }
  },
  watch: {
    /**
     * Params:
     *  + newValue: giá trị mới
     *  + oldValue: giá trị cũ
     * Des: Thực hiện theo dõi "employee.name"
     * Author: DDKhang
     * CreateAt: 11/5/2023
     * ModifierAt: 11/5/2023
     */
    "employee.name": function (newValue, oldValue) {
      if (newValue.trim() != "") {
        const fullName = this.employee.FullName.toUpperCase();
        this.employee.FullName = fullName;
      }
    },
  },
  methods: {
    /**
     * Params:
     *  + tagCurrent: thẻ input hiện tại
     * Des: Thực hiện xóa class "invalid" từ thẻ cha của input đó
     * Author: DDKhang
     * CreateAt: 11/5/2023
     * ModifierAt: 11/5/2023
     */
    removeInvalidInputForm(tagCurrent) {
      // Tham chieu len thẻ cha (".formGroup")
      const tagParent = tagCurrent.closest(".form-group");
      tagParent.classList.remove("invalid");
      tagCurrent.setAttribute("title", "");
    },

    /**
     * Params:
     * Des: Thực hiện chuyển sang trang table employee khi nhấn đóng form info
     * Author: DDKhang
     * CreateAt: 11/5/2023
     * ModifierAt: 11/5/2023
     */
    handleCloseFormEmployeeInfo() {
      this.$router.push("/employee");
    },

    /**
     * Params:
     * Des: Thực hiện cất thông tin nhân viên
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    async handleBtnSave() {
      // Thực validate form
      const checkFullName = checkBlank(this.employee?.FullName);
      const checkCodeEmployee = checkBlank(this.employee?.EmployeeCode);
      const isCheckDuplicateEmployeeCode = checkDuplicateEmployeeCode(
        this.employees,
        this.employee.EmployeeCode
      );
      if (!checkFullName.status || !checkCodeEmployee.status) {
        return ShowValidate(checkFullName.msg);
      }

      if (this.isAdd) {
        // Thuc hien goi api post
        if (isCheckDuplicateEmployeeCode.status) {
          return ShowValidate(isCheckDuplicateEmployeeCode.msg);
        }
        this.$axios
          .post(`https://cukcuk.manhnv.net/api/v1/Employees`, this.employee)
          .then((res) => {
            console.log(res);
            console.log("Add Success");
          })
          .catch((err) => {
            CatchError(err);
          });
        console.log("Employee: ", this.employee);
      } else {
        // Thuc hien goi api put
        this.$axios
          .put(
            `https://cukcuk.manhnv.net/api/v1/Employees/${this.employeeId}`,
            this.employee
          )
          .then((res) => {
            console.log(res);
            console.log("Edit Success");
          })
          .catch((err) => {
            CatchError(err);
          });
      }
      this.handleCloseFormEmployeeInfo();
    },

    /**
     * Params:
     * Des: Thực hiện bắt sự thay đổi trên input
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    handleChangeInput() {
      const tagCurrent = event.currentTarget;
      // Tham chieu len thẻ cha (".formGroup")
      const tagParent = tagCurrent.closest(".form-group");
      tagParent.classList.remove("invalid");
      tagCurrent.setAttribute("title", "");
    },
    /**
     * Params:
     * Des: Thực hiện validate input
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    validateInput() {
      const tagCurrent = event.currentTarget;
      const value = tagCurrent.value;
      if (!value) {
        // Tham chieu len thẻ cha (".formGroup")
        const tagParent = tagCurrent.closest(".form-group");
        tagParent.classList.add("invalid");
        tagCurrent.setAttribute(
          "title",
          this.$MISAResource.textError.textErrorRequired
        );
      } else {
        // Tham chieu len thẻ cha (".formGroup")
        const tagParent = tagCurrent.closest(".form-group");
        tagParent.classList.remove("invalid");
        tagCurrent.setAttribute("title", "");
      }
    },
    /**
     * Params:
     * Des: Thực hiện nhấn combobox
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    handlePressCombobox() {
      showCombobox();
    },

    /**
     * Params:
     * Des: Xử lí việc tab trên mỗi thẻ input
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    // handleTab(index, event) {
    //   if (index === this.inputs.length - 1) {
    //     // nếu đang ở thẻ input cuối cùng thì quay lại thẻ input đầu tiên
    //     event.preventDefault();
    //     this.inputs[0].focus();
    //   } else {
    //     // nếu đang ở thẻ input bất kỳ thì chuyển sang thẻ input tiếp theo
    //     this.currentIndex = index + 1;
    //     this.inputs[this.currentIndex].focus();
    //   }
    // },

    /**
     * Params:
     *  + departmentId:(string) - Id của department
     * Des: Thực hiện xử lí khi trên comboboxDepartment
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    async handleComboboxDepartment(departmentId) {
      this.employee.DepartmentId = departmentId;
    },
  },
  computed: {
    /**
     * Params:
     * Des:  Tính toán thêm hoặc cập nhật
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    isAdd: function () {
      if (this.employeeId) {
        return false; // Thực hiện Edit
      } else {
        return true; // Thực hiện Create
      }
    },
  },
};
</script>

<template>
  <div id="form-employee" class="form-employee dialog-close">
    <div class="form-employee-wrapper">
      <!-- UI FORM ADD EMPLOYEE -->
      <form action="" class="form-info-employee">
        <div class="info-employee">
          <!-- Info employee header -- Start -->
          <div class="info-employee-header">
            <div class="info-employee-header-title">
              {{
                this.isAdd
                  ? this.$MISAResource.textCRUD.textAddEmployee
                  : this.$MISAResource.textCRUD.textEditEmployee
              }}
            </div>
            <div class="icon-help-close" @click="handleCloseFormEmployeeInfo">
              <div class="dialog-btn--close icon-close"></div>
            </div>
          </div>
          <!-- Info employee header -- End -->

          <div class="info-employee-content">
            <div class="info-employee-content-place-first">
              <div class="info-employee-form-one">
                <div class="info-employee-form-one-idName">
                  <div class="info-employee-form-one-id-employee form-group">
                    <label class="textfield__label"
                      >Mã
                      <span class="icon-require">
                        <label for="" title="Bắt buộc nhập">*</label>
                      </span>
                    </label>
                    <!-- <input
                      ref="textCodeEmployee"
                      id="textfield_codeEmployee"
                      class="textfield__input input-hover input-focus firstElement"
                      type="text"
                      field-label="Mã nhân viên"
                      name="employeeCode"
                      v-model="this.employee.EmployeeCode"
                      @blur="validateInput"
                      placeholder="Mã nhân viên"
                      :tabindex="this.$TabIndex.formEmployeeInfo.codeEmployee"
                      required
                    /> -->
                    <MISAInput
                      ref="textCodeEmployee"
                      id="textfield_codeEmployee"
                      class="firstElement"
                      field-label="Mã nhân viên"
                      name="employeeCode"
                      v-model="this.employee.EmployeeCode"
                      :tabindex="this.$TabIndex.formEmployeeInfo.codeEmployee"
                      required="true"
                      @blur="validateInput"
                    ></MISAInput>
                    <!-- <input
                      id="textfield_codeEmployee"
                      class="textfield__input input-hover input-focus firstElement"
                      type="text"
                      field-label="Mã nhân viên"
                      name="employeeCode"
                      v-model="employee.id"
                      placeholder="Placeholder"
                      :tabindex="this.$TabIndex.formEmployeeInfo.codeEmployee"
                      required=""
                    /> -->
                    <small class="form-message--error"></small>
                  </div>

                  <div class="info-employee-form-one-name-employee form-group">
                    <label class="textfield__label"
                      >Tên
                      <span class="icon-require">*</span>
                    </label>
                    <input
                      id="textfield_EmployeeName"
                      class="textfield__input input-hover input-focus min-width-input"
                      type="text"
                      field-label="Tên nhân viên"
                      name="FullName"
                      v-model="this.employee.FullName"
                      @blur="validateInput"
                      placeholder="Nguyễn Ánh Bằng"
                      :tabindex="this.$TabIndex.formEmployeeInfo.employeeName"
                      required
                      ref="inputFullName"
                    />
                    <!-- <input
                      id="textfield_EmployeeName"
                      class="textfield__input input-hover input-focus min-width-input"
                      type="text"
                      field-label="Tên nhân viên"
                      name="fullname"
                      v-model="employee.name"
                      v-on:blur="
                        validateInput(
                          employee.FullName,
                          'textfield_EmployeeName',
                          'text'
                        )
                      "
                      placeholder="Nguyễn Ánh Bằng"
                      :tabindex="this.$TabIndex.formEmployeeInfo.employeeName"
                      required=""
                    /> -->
                    <small class="form-message--error"></small>
                  </div>
                </div>

                <div
                  id="info-employee-form-one-unit"
                  class="info-employee-form-one-unit form-group"
                >
                  <!-- Combobox -->
                  <label class="textfield__label"
                    >Đơn vị
                    <span class="icon-require">*</span>
                  </label>
                  <div class="dropdown width-full" @click="handlePressCombobox">
                    <div class="combobox-input">
                      <input
                        type="text"
                        placeholder="Phòng nhân sự"
                        :tabindex="this.$TabIndex.formEmployeeInfo.comboboxUnit"
                        name="unit"
                        v-model="this.department.DepartmentName"
                        ref="comboboxDepartment"
                      />
                      <div class="combobox-input__icon border-left-none">
                        <div class="icon-combobox--arrow"></div>
                      </div>
                    </div>
                    <ul
                      id="contentUnitCombobox"
                      class="options combobox-options--below"
                    >
                      <li
                        class="option"
                        v-for="department in this.departments"
                        @click="
                          this.handleComboboxDepartment(department.DepartmentId)
                        "
                      >
                        {{ department.DepartmentName }}
                      </li>
                    </ul>
                  </div>
                  <small class="form-message--error"></small>
                </div>

                <div class="info-employee-form-one-title form-group">
                  <label class="textfield__label">Chức danh</label>
                  <input
                    id="textfield__title"
                    class="textfield__input width-full input-hover input-focus"
                    type="text"
                    name="title"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.title"
                    ref="input4"
                  />
                  <small class="form-message--error"></small>
                </div>
              </div>

              <div class="info-employee-form-two">
                <div class="info-employee-form-two--dateofbirth-sex">
                  <div class="datetime form-group">
                    <label class="textfield__label">Ngày sinh </label>
                    <input
                      type="date"
                      id="textfield__dateOfBirth"
                      name="dateOfBirth"
                      v-model="this.employee.DateOfBirth"
                      :tabindex="this.$TabIndex.formEmployeeInfo.dateOfBirth"
                      ref="input5"
                    />
                    <!-- <small class="form-message--error"></small> -->
                  </div>

                  <div class="info-employee-form-two-sex form-group">
                    <label class="textfield__label">Giới tính </label>
                    <div class="info-employee-form-two-sex--list">
                      <!-- <label class="">
                                  <input
                                    id="radio-male"
                                    type="radio"
                                    name="genre"
                                    value="male"
                                  />
                                  Nam
                                  <span class="checkmark"></span>
                                </label> -->

                      <label class="radio">
                        <input
                          type="radio"
                          name="genre"
                          value="0"
                          checked
                          v-model="this.employee.Gender"
                          ref="input6"
                        />
                        <p>Nam</p>
                        <span
                          class="checkmark"
                          :tabindex="this.$TabIndex.formEmployeeInfo.genderMale"
                        ></span>
                      </label>

                      <label class="radio">
                        <input
                          type="radio"
                          name="genre"
                          value="1"
                          v-model="this.employee.Gender"
                          ref="input7"
                        />
                        <p>Nữ</p>
                        <span
                          class="checkmark"
                          :tabindex="
                            this.$TabIndex.formEmployeeInfo.genderFemale
                          "
                        ></span>
                      </label>

                      <label class="radio">
                        <input
                          type="radio"
                          name="genre"
                          value="Khác"
                          v-model="this.employee.Gender"
                          ref="input8"
                        />
                        <p>Khác</p>
                        <span
                          class="checkmark"
                          :tabindex="
                            this.$TabIndex.formEmployeeInfo.genderOther
                          "
                        ></span>
                      </label>
                    </div>
                    <small class="form-message--error"></small>
                  </div>
                </div>

                <div class="info-employee-form-two-identification">
                  <div
                    class="info-employee-form-two-identification--number form-group"
                  >
                    <label
                      class="textfield__label"
                      title="Chứng minh thư nhân dân"
                      >Số CMND</label
                    >
                    <input
                      id="textfield__peopleId"
                      class="textfield__input input-hover input-focus min-width-300"
                      type="text"
                      name="peopleId"
                      placeholder="001202009382"
                      :tabindex="this.$TabIndex.formEmployeeInfo.identification"
                      ref="input9"
                    />
                    <small class="form-message--error"></small>
                  </div>
                  <!-- <div
                              class="info-employee-form-two-identification--created form-group"
                            >
                              <label class="textfield__label">Ngày cấp</label>
                              <input
                                type="date"
                                id="textfield__dateRange"
                                name="dateRange"
                              />
                              <small class="form-message--error"></small>
                            </div> -->

                  <div class="datetime form-group">
                    <label class="textfield__label">Ngày cấp </label>
                    <input
                      class="width-full min-width-200"
                      type="date"
                      id="textfield__dateOfBirth"
                      name="dateOfBirth"
                      :tabindex="this.$TabIndex.formEmployeeInfo.datetime"
                      ref="input10"
                    />
                    <!-- <small class="form-message--error"></small> -->
                  </div>
                </div>

                <div class="info-employee-form-two-issued form-group">
                  <label class="textfield__label">Nơi cấp</label>
                  <input
                    id="textfield__issuedBy"
                    class="textfield__input width-full input-hover input-focus"
                    type="text"
                    name="issuedBy"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.issuedBy"
                    ref="input11"
                  />
                  <small class="form-message--error"></small>
                </div>
              </div>
            </div>

            <div class="info-employee-form-three form-group">
              <label class="textfield__label">Địa chỉ</label>
              <input
                id="textfield__address"
                class="textfield__input width-full input-hover input-focus"
                type="text"
                name="address"
                placeholder=""
                :tabindex="this.$TabIndex.formEmployeeInfo.address"
                ref="input12"
              />
              <small class="form-message--error"></small>
            </div>

            <div class="info-employee-form-four">
              <div class="info-employee-form-four--contact">
                <div
                  class="info-employee-form-four-telephone--contact form-group"
                >
                  <label class="textfield__label" title="Điện thoại di động"
                    >ĐT di động</label
                  >
                  <input
                    id="textfield__mobilePhone"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="mobilePhone"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.mobilePhone"
                    ref="input13"
                  />
                  <small class="form-message--error"></small>
                </div>
                <div
                  class="info-employee-form-four-telephoneDefault--contact form-group"
                >
                  <label class="textfield__label" title="Điện thoại cố định"
                    >ĐT cố định</label
                  >
                  <input
                    id="textfield__landlinePhone"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="landlinePhone"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.landlinePhone"
                    ref="input14"
                  />
                  <small class="form-message--error"></small>
                </div>
                <div class="info-employee-form-four-email--contact form-group">
                  <label class="textfield__label">Email</label>
                  <input
                    id="textfield__email"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="email"
                    v-model="this.employee.Email"
                    placeholder="procuon856@example.com"
                    :tabindex="this.$TabIndex.formEmployeeInfo.email"
                    ref="input15"
                  />
                  <small class="form-message--error"></small>
                </div>
              </div>

              <div class="info-employee-form-four--bank">
                <div class="info-employee-form-four-telephone--bank form-group">
                  <label class="textfield__label">Tài khoản ngân hàng</label>
                  <input
                    id="textfield__bankAccount"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="bankAccount"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.bank"
                    ref="input16"
                  />
                  <small class="form-message--error"></small>
                </div>
                <div
                  class="info-employee-form-four-telephoneDefault--bank form-group"
                >
                  <label class="textfield__label">Tên ngân hàng</label>
                  <input
                    id="textfield__bankName"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="bankName"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.bankName"
                    ref="input17"
                  />
                  <small class="form-message--error"></small>
                </div>
                <div class="info-employee-form-four-email--bank form-group">
                  <label class="textfield__label">Chi nhánh</label>
                  <input
                    id="textfield__branch"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="branch"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.branch"
                    ref="input18"
                  />
                  <small class="form-message--error"></small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="info-employee-footer">
          <button
            class="info-employee-footer-btnCancel"
            @click="handleCloseFormEmployeeInfo"
            :tabindex="this.$TabIndex.formEmployeeInfo.btnCancel"
            ref="input21"
          >
            Hủy
          </button>
          <div class="info-employee-footer-btn">
            <button
              class="info-employee-footer-btn-keep"
              @click="handleBtnSave"
              :tabindex="this.$TabIndex.formEmployeeInfo.btnSave"
              ref="input19"
            >
              Cất
            </button>
            <button
              id="btnSaveAndAdd"
              class="info-employee-footer-btnKeepAdd btn-hover btn-pressed"
              :tabindex="this.$TabIndex.formEmployeeInfo.saveAndAdd"
              ref="input20"
            >
              Cất và Thêm
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
