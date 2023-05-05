<script>
import { getData } from "../../config/FetchData";
import { CatchError, ShowValidate } from "../../functions/CatchError";
import {
  checkBlank,
  checkDuplicateEmployeeCode,
} from "../../functions/ValidateForm";
import { showCombobox } from "../../functions/Combobox";

export default {
  name: "EmployeeForm",
  props: ["id"],
  components: {},
  data() {
    return {
      employeeId: "",
      employee: {},
      employees: [],
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
      }
      // Thực hiện hiển thị thông báo trạng thái put
    }

    const res = await getData("https://cukcuk.manhnv.net/api/v1/Employees");
    this.employees = res.data;
  },
  mounted() {},
  watch: {
    "employee.name": function (newValue, oldValue) {
      if (newValue.trim() != "") {
        const fullName = this.employee.FullName.toUpperCase();
        this.employee.FullName = fullName;
      }
    },
  },
  methods: {
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
      if (isCheckDuplicateEmployeeCode.status) {
        return ShowValidate(isCheckDuplicateEmployeeCode.msg);
      }

      if (this.isAdd) {
        // Thuc hien goi api post
        this.$axios
          .post(`https://cukcuk.manhnv.net/api/v1/Employees`, this.employee)
          .then((res) => {
            console.log(res);
            console.log("Add Success");
          })
          .catch((err) => {
            CatchError(err);
          });
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
    },

    handleChangeInput() {},

    validateInput(inputValue, inputId, inputType) {
      // let formEmployee = document.getElementById("form-employee");
      // let textInput = formEmployee.querySelector(`#${inputId}`);
      // let formGroup = textInput.closest(".form-group");
      // let showErrorElement = formGroup.querySelector(".form-message--error");
      // if (!inputValue || inputValue?.trim() === "") {
      //   formGroup.classList.add("invalid");
      //   showErrorElement.innerText = "Vui long nhap thong tin";
      // }
    },

    handlePressCombobox() {
      showCombobox();
    },
  },
  computed: {
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
                  ? "Thêm thông tin nhân viên"
                  : "Sửa thông tin nhân viên"
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
                    <input
                      ref="textCodeEmployee"
                      id="textfield_codeEmployee"
                      class="textfield__input input-hover input-focus firstElement"
                      type="text"
                      field-label="Mã nhân viên"
                      name="employeeCode"
                      v-model="employee.EmployeeCode"
                      placeholder="Placeholder"
                      tabindex="1"
                      required=""
                    />
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
                      name="fullname"
                      v-model="employee.FullName"
                      v-on:blur="
                        validateInput(
                          employee.FullName,
                          'textfield_EmployeeName',
                          'text'
                        )
                      "
                      placeholder="Nguyễn Ánh Bằng"
                      tabindex="2"
                      required=""
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
                  <label class="textfield__label">Đơn vị</label>
                  <div class="dropdown width-full" @click="handlePressCombobox">
                    <div class="combobox-input">
                      <input
                        type="text"
                        placeholder="Phòng nhân sự"
                        :tabindex="this.$TabIndex.formEmployeeInfo.comboboxUnit"
                        name="unit"
                      />
                      <div class="combobox-input__icon border-left-none">
                        <div class="icon-combobox--arrow"></div>
                      </div>
                    </div>
                    <ul
                      id="contentUnitCombobox"
                      class="options combobox-options--below"
                    >
                      <li class="option">10</li>
                      <li class="option">25</li>
                      <li class="option">30</li>
                      <li class="option">50</li>
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
                    placeholder="Lễ tân chính"
                    :tabindex="this.$TabIndex.formEmployeeInfo.title"
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
                      :tabindex="this.$TabIndex.formEmployeeInfo.dateOfBirth"
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
                          value="male"
                          v-model="employee.GenderName"
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
                          value="female"
                          v-model="employee.GenderName"
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
                          value="other"
                          v-model="employee.GenderName"
                        />
                        <p>Other</p>
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
                      class="textfield__input min-width-300 input-hover input-focus"
                      type="text"
                      name="peopleId"
                      placeholder="001202009382"
                      :tabindex="this.$TabIndex.formEmployeeInfo.identification"
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
                      tabindex="10"
                      :tabindex="this.$TabIndex.formEmployeeInfo.datetime"
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
                    placeholder="Hải Phòng"
                    :tabindex="this.$TabIndex.formEmployeeInfo.issuedBy"
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
                placeholder="146 Phạm Văn Chiêu"
                :tabindex="this.$TabIndex.formEmployeeInfo.address"
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
                    placeholder="0963579744"
                    :tabindex="this.$TabIndex.formEmployeeInfo.mobilePhone"
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
                    placeholder="(764) 749-6478"
                    :tabindex="this.$TabIndex.formEmployeeInfo.landlinePhone"
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
                    placeholder="procuon856@example.com"
                    tabindex="15"
                    :tabindex="this.$TabIndex.formEmployeeInfo.email"
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
                    placeholder="944147"
                    :tabindex="this.$TabIndex.formEmployeeInfo.bank"
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
                    placeholder="Ngân hàng Vietcombank"
                    tabindex="17"
                    :tabindex="this.$TabIndex.formEmployeeInfo.bankName"
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
                    placeholder="Chi nhánh 6"
                    :tabindex="this.$TabIndex.formEmployeeInfo.branch"
                  />
                  <small class="form-message--error"></small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="info-employee-footer">
          <div
            class="info-employee-footer-btnCancel"
            @click="handleCloseFormEmployeeInfo"
            :tabindex="this.$TabIndex.formEmployeeInfo.btnCancel"
          >
            Hủy
          </div>
          <div class="info-employee-footer-btn">
            <div
              class="info-employee-footer-btn-keep"
              @click="handleBtnSave"
              :tabindex="this.$TabIndex.formEmployeeInfo.btnSave"
            >
              Cất
            </div>
            <div
              id="btnSaveAndAdd"
              class="info-employee-footer-btnKeepAdd btn-hover btn-pressed"
              :tabindex="this.$TabIndex.formEmployeeInfo.saveAndAdd"
            >
              Cất và Thêm
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
