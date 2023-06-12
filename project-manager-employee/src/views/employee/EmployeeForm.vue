<script>
import { updateInfoEntity, postInfoEntity } from "../../config/FetchData";
import {
  CatchError,
  ShowQuestion,
  ShowValidate,
  ShowQuestionChangeValue,
} from "../../functions/CatchError";
import {
  checkBlank,
  checkDuplicateEmployeeCode,
  checkEmail,
  checkDateOfBirth,
} from "../../functions/ValidateForm";
import MISAInput from "../../components/MISAInput.vue";
import {
  getNewCode,
  getDataById,
  filterInfoEntity,
} from "../../config/FetchData";
import MISAButton from "../../components/MISAButton.vue";
import MISACombobox from "../../components/MISACombobox.vue";
import MISAEnum from "../../js/MISAEnum";

export default {
  name: "EmployeeForm",
  props: ["id"],
  components: { MISAInput, MISAButton, MISACombobox },
  data() {
    return {
      employeeId: "",
      employee: {
        Gender: 0,
      },
      department: {},
      bank: {},
      employees: [], // Danh sách tất cả dữ liệu của Nhân viên
      departments: [], // Danh sách tất cả dữ liệu của Phòng ban
      banks: [], // Danh sách tất cả dữ liệu ngân hàng
      inputs: [],
      currentIndex: 0, // index của thẻ input hiện tại được chọn
      isFirstFocusInput: false, // Trạng thái focus lần input
      formattedDate: "",
      cbListDepartment: [], // Danh sách dữ liệu phòng ban cho combobox
      cbListBank: [], // Danh sách dữ liệu ngân hàng cho combobox
      queryUrl: {},
      employeeBeforeUpdate: {}, // Gía trị nhân viên trước khi cập nhật

      isCloseDialogEventRegistered: false, // Biến cờ để kiểm tra sự kiện đã được đăng ký hay chưa
      inputsRequired: [],
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

    this.$msemitter.on("closeDialogQuestion", this.closeDialogOnForm);
    this.$msemitter.on("closeDialogNotice", this.closeDialogNoticeOnForm);
    // Thực hiện trên dialog thay đổi dữ liệu trên form
    this.$msemitter.on(
      "closeDialogQuestionChangeValue",
      this.statusChangeValueDialogEmployee
    );
    // if (!this.isCloseDialogEventRegistered) {
    //   // Chỉ đăng ký sự kiện khi chưa được đăng ký trước đó
    //   this.isCloseDialogEventRegistered = true;
    // }

    // this.$msemitter.on(
    //   "closeDialogQuestionChangeValue",
    //   this.statusChangeValueDialogEmployee
    // );
    await this.handleCustomValueDepartmentCombobox();
    await this.handleCustomValueBankCombobox();
    // Sử dụng tabIndex khi vào form info employee
    // useTabIndex();

    // Thực hiện lấy id nhân viên trên url
    this.employeeId = this.$route.params.id;
    this.queryUrl = this.$route.query;

    if (this.behaviorHandle === this.$BehaviorHandleEnum.AddNew) {
      // Thực hiện post employee
      try {
        // Tạo mã employee mới
        // Kiểm tra xem DOM đã được render ra chưa
        this.$nextTick(async function () {
          // const res = await getData(`${BaseUrl}/Employees/NewCode`);
          const res = await getNewCode(this.$EntityEnum.Employees);
          this.employee.EmployeeCode = res.data;
          // this.$refs.textCodeEmployee.focus();
        });
        // Thực hiện hiển thị thông báo trạng thái post
      } catch (error) {
        console.log(error.message);
      }
    } else if (
      this.behaviorHandle === this.$BehaviorHandleEnum.Edit ||
      this.behaviorHandle === this.$BehaviorHandleEnum.Duplicate
    ) {
      /**
       * - Thực hiện mở form cập nhật thông tin nhân viên
       * - Lấy thông tin nhân viên theo id -> truyền thông tin nhân viên đó lên form
       */
      if (this.employeeId) {
        try {
          // 1. Kiểm tra nhân viên có tồn tại -> Lấy thông tin nhân viên -> Hiển thị lên form
          const res = await getDataById(
            this.$EntityEnum.Employees,
            this.employeeId
          );

          // Khai báo biến tạm cho nhân viên
          let tempEmployee;
          // 2. Thực hiện cấu trúc lại dateOfBirth|identityDate theo yyyy-mm-dd
          const dateOfBirthFormat = this.convertAndSetDate(
            `${res.data.DateOfBirth}`
          );
          const identityDateFormat = this.convertAndSetDate(
            `${res.data.IdentityDate}`
          );

          tempEmployee = {
            ...res.data,
            DateOfBirth:
              dateOfBirthFormat === "NaN-NaN-NaN" ? null : dateOfBirthFormat,
            IdentityDate:
              identityDateFormat === "NaN-NaN-NaN" ? null : identityDateFormat,
          };

          // 3. Đẩy thông tin lên form
          if (res.data.BankId) {
            // Thực hiện kiểm tra bankId có tồn tại -> Lấy thông tin bank -> ghép vào dữ liệu employee
            const resBank = await getDataById(
              this.$EntityEnum.Banks,
              res.data.BankId
            );
            tempEmployee = {
              ...res.data,
              DateOfBirth:
                dateOfBirthFormat === "NaN-NaN-NaN" ? null : dateOfBirthFormat,
              IdentityDate:
                identityDateFormat === "NaN-NaN-NaN"
                  ? null
                  : identityDateFormat,
              BankInfo: resBank.data,
            };
          } else {
            tempEmployee = {
              ...res.data,
              DateOfBirth:
                dateOfBirthFormat === "NaN-NaN-NaN" ? null : dateOfBirthFormat,
              IdentityDate:
                identityDateFormat === "NaN-NaN-NaN"
                  ? null
                  : identityDateFormat,
              BankInfo: {},
            };
          }
          // Thực hiện cập nhật EmployeeCode mới cho việc nhân bản
          if (this.behaviorHandle === this.$BehaviorHandleEnum.Duplicate) {
            // Lấy mã code mới cho nhân viên
            const res = await getNewCode(this.$EntityEnum.Employees);
            // Cập nhật mã code mới
            const employeeNew = { ...tempEmployee, EmployeeCode: res.data };
            this.employee = employeeNew;
            // Lưu giữ giá trị ban đầu -> close Form
            this.employeeBeforeUpdate = JSON.stringify(employeeNew);
          } else {
            // Giữ nguyên giá trị muốn cập nhật -> đẩy lên form
            this.employee = tempEmployee;
            // Lưu giữ giá trị ban đầu -> close Form
            this.employeeBeforeUpdate = JSON.stringify(tempEmployee);
          }
        } catch (error) {
          CatchError(error);
        }
        // Thực hiện lấy thông tin phòng ban theo id
        if (this.employee?.DepartmentId) {
          try {
            // Thực hiện lấy thông tin phòng ban theo mã phòng
            // const res = await getData(
            //   `${BaseUrl}/Departments/${this.employee?.DepartmentId}`
            // );
            const res = await getDataById(
              this.$EntityEnum.Departments,
              this.employee?.DepartmentId
            );
            this.department = res.data;
            // this.employee.DepartmentName = res.data.DepartmentName;
          } catch (error) {
            CatchError(error);
          }
        }
        // Thực hiện lấy thông tin ngân hàng theo id
        if (this.employee?.BankId) {
          try {
            const res = await getDataById(
              this.$EntityEnum.Banks,
              this.employee?.BankId
            );
            this.bank = res.data;
          } catch (error) {
            CatchError(error);
          }
        }
      }
      // Thực hiện hiển thị thông báo trạng thái put
    }
    // else if (this.behaviorHandle === this.$BehaviorHandleEnum.Duplicate) {
    // }

    // Thực hiện lấy toàn bộ các phòng ban
    try {
      // const res = await getData(`${BaseUrl}/Departments`);
      const res = await filterInfoEntity(this.$EntityEnum.Departments);
      this.departments = res.data.Data;
    } catch (error) {
      CatchError(error);
    }

    // Thực hiện lấy toàn bộ employees để check mã trùng lặp
    // try {
    //   const res = await filterInfoEntity(this.$EntityEnum.Employees);
    //   this.employees = res.data.Data;
    // } catch (error) {
    //   console.log(error.message);
    // }
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keydown", this.handleTabKey);

    this.handleReferenceInput();

    // this.handleShowValidateInputError();

    // // =================== Handel Tab - Start =======================
    // // Lấy toàn bộ những thẻ có thuộc tính "Ref"
    // const tagsContainRefAttr = Object.values(this.$refs);
    // console.log("Tags: ", tagsContainRefAttr);
    // const inputs = [];
    // // Kiểm tra những thẻ khác có phải là thẻ INPUT hoặc BUTTON hay không
    // tagsContainRefAttr.forEach((input) => {
    //   if (input.nodeName === "INPUT" || input.nodeName === "BUTTON") {
    //     inputs.push(input);
    //   }
    // });
    // // Thêm xử lý sự kiện khi nhấn phím Tab
    // inputs.forEach((input, index) => {
    //   input.addEventListener("keydown", (event) => {
    //     if (
    //       event.key === "Tab" &&
    //       !event.shiftKey &&
    //       index === inputs.length - 1
    //     ) {
    //       // Nếu đang ở input cuối cùng và nhấn phím Tab, chuyển về input đầu tiên
    //       event.preventDefault();
    //       const inputFirst = document.querySelector("#textfield_codeEmployee");
    //       // inputs[0].focus();
    //       inputFirst.focus();
    //     }
    //   });
    // });
    // // Thêm xử lý sự kiện khi nhả phím Tab
    // inputs.forEach((input, index) => {
    //   input.addEventListener("keyup", (event) => {
    //     if (event.key === "Tab" && event.shiftKey && index === 0) {
    //       // Nếu đang ở input đầu tiên và nhấn Shift + Tab, chuyển về input cuối cùng
    //       event.preventDefault();
    //       inputs[inputs.length - 1].focus();
    //     }
    //   });
    // });
    // // =================== Handel Tab - End =======================
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keydown", this.handleTabKey);

    this.$msemitter.off("closeDialogQuestion", this.closeDialogOnForm);
    this.$msemitter.off("closeDialogNotice", this.closeDialogNoticeOnForm);
    this.$msemitter.off(
      "closeDialogQuestionChangeValue",
      this.statusChangeValueDialogEmployee
    );
  },
  watch: {
    /**
     * @param {*} newValue - giá trị mới
     * @param {*} oldValue - giá trị cũ
     * - Des: Thực hiện theo dõi "employee.name"
     * - Author: DDKhang
     * - CreateAt: 11/5/2023
     * - ModifierAt: 11/5/2023
     */
    "employee.name": function (newValue, oldValue) {
      if (newValue.trim() != "") {
        const fullName = this.employee.FullName.toUpperCase();
        this.employee.FullName = fullName;
      }
    },

    /**
     * - Des: Thực hiện theo dõi giá trị DepartmentId, để khi chọn sang phòng ban mới thì cập nhật thông tin đối tượng Department
     * Mục đích là để tránh việc khi thực hiện thay đổi giá trị trên input khác trong form thì giá trị department combobox không trở lại gt cũ
     * Bởi vì mình khởi tạo giá trị ban đầu của combobox là giá trị trên đối tượng Department, chứ không phải giá trị theo thay đổi trong DepartmentId trong employee
     */
    "employee.DepartmentId": async function (newValue, oldValue) {
      // Lấy thông tin phòng ban theo id đã chọn trên form
      if (this.employee.DepartmentId) {
        const res = await getDataById(this.$EntityEnum.Departments, newValue);
        this.department = res.data;
      }
    },
    /**
     * - Des: Thực hiện theo dõi giá trị BankId, để khi chọn sang phòng ban mới thì cập nhật thông tin đối tượng Bank
     * Mục đích là để tránh việc khi thực hiện thay đổi giá trị trên input khác trong form thì giá trị Bank combobox không trở lại gt cũ
     * Bởi vì mình khởi tạo giá trị ban đầu của combobox là giá trị trên đối tượng Bank, chứ không phải giá trị theo thay đổi trong DepartmentId trong employee
     */
    "employee.BankId": async function (newValue, oldValue) {
      // Lấy thông tin phòng ban theo id đã chọn trên form
      if (this.employee.BankId) {
        const res = await getDataById(this.$EntityEnum.Banks, newValue);
        this.bank = res.data;
      }
    },

    "employee.BranchInfo.Branch": function (newValue) {},
  },

  computed: {
    /**
     * - Xử lí sự thay đổi về dữ liệu của các đối tượng, mục đích để so sánh 2 đối tượng có bằng nhau hay không
     * - Author: DDKhang (3/5/2023)
     */
    handleChange() {
      const keysEmployeeOld = Object.keys(this.employeeBeforeUpdate);
      for (let key = 0; key < keysEmployeeOld.length; key++) {
        const keyEntity = keysEmployeeOld[key];
        if (
          JSON.stringify(this.employee[keyEntity]) !==
          JSON.stringify(this.employeeBeforeUpdate[keyEntity])
        ) {
          return true;
        }
      }
    },
    /**
     * Params:
     * Des:  Tính toán thêm hoặc cập nhật
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    behaviorHandle() {
      if (this.employeeId && this.queryUrl.duplicate === "true") {
        return this.$BehaviorHandleEnum.Duplicate;
      } else if (this.employeeId) {
        return this.$BehaviorHandleEnum.Edit; // Thực hiện Edit
      } else {
        return this.$BehaviorHandleEnum.AddNew; // Thực hiện Create
      }
    },

    /**
     * - Xử lí hiển thị tiêu đề cho form
     * - Author: DDKhang (3/6/2023)
     */
    title() {
      switch (this.behaviorHandle) {
        case this.$BehaviorHandleEnum.AddNew:
          return this.$MISAResource.textCRUD.textAddEmployee;
        case this.$BehaviorHandleEnum.Edit:
          return this.$MISAResource.textCRUD.textEditEmployee;
        case this.$BehaviorHandleEnum.Duplicate:
          return this.$MISAResource.textCRUD.textAddEmployee;
        default:
          return "";
      }
    },

    /**
     * - Des: Khởi tạo giá trị mặc định cho combobox để hiển thị ngay khi ban đầu (dùng cho update mà muốn hiển thi)
     * - Author: DDKhang (1/6/2023)
     */
    handleDefaultValueDepartmentCombobox() {
      return {
        id: this.department.DepartmentId,
        value: this.department.DepartmentName,
      };
    },

    /**
     * - Des: Khởi tạo giá trị mặc định cho combobox để hiển thị ngay khi ban đầu (dùng cho update mà muốn hiển thi)
     * - Author: DDKhang (1/6/2023)
     */
    handleDefaultValueBankCombobox() {
      return {
        id: this.bank.BankId,
        value: this.bank.BankName,
      };
    },
  },

  methods: {
    /**
     *
     * @param {*} event - Sự kiện khi gọi hàm
     * Author: DDKhang (11/5/2023)
     */
    handleTabKey(event) {
      if (event.keyCode === 9 && event.target === document.activeElement) {
        // Kiểm tra xem phần tử đang focus có phải là phần tử cuối cùng hay không
        const lastTabIndex = 19; // Thay thế N bằng tabIndex của phần tử cuối cùng
        if (event.target.tabIndex === lastTabIndex) {
          event.preventDefault(); // Ngăn chặn hành vi mặc định của tab
          this.focusFirstInput(); // Set focus vào phần tử input đầu tiên
        }
      }
    },

    /**
     * - Thực forcus vào thẻ input employeeCode
     * - Author: DDKhang (11/5/2023)
     */
    focusFirstInput() {
      this.$refs.textCodeEmployee?.focusInput(); // Set focus vào phần tử input đầu tiên
    },

    /**
     * @param {*} event - Sự kiên
     * - Des: Thực hiện nhấn phím tắt
     * - Author: DDKhang
     * - CreateAt: 11/5/2023
     * - ModifierAt: 11/5/2023
     */
    handleKeyDown(event) {
      if (event.key === this.$ShortCutResource.CloseForm.char) {
        // Thực hiện nhấn phím đóng Form
        event.preventDefault(); // Ngăn chặn hành động mặc định của trình duyệt
        this.handleShortcut();
      } else if (
        event.ctrlKey &&
        event.altKey &&
        event.key === this.$ShortCutResource.BtnSaveAdd.char
      ) {
        event.preventDefault();
        // Không bắt sự kiến key trên form Edit
        if (this.behaviorHandle !== this.$BehaviorHandleEnum.Edit) {
          this.handleBtnSaveAndAdd();
        }
      } else if (
        event.ctrlKey &&
        event.key === this.$ShortCutResource.BtnSave.char
      ) {
        // Thực hiện nhấn phím tắt nút Save
        event.preventDefault();
        this.handleBtnSave();
      }
    },

    /**
     * - Des: Thực hiện xử lí khi nhấn phím tắt
     * - Author: DDKhang
     * - CreateAt: 11/5/2023
     * - ModifierAt: 11/5/2023
     */
    handleShortcut() {
      this.$router.push("/employee");
    },

    /**
     * Params:
     *  + tagCurrent: thẻ input hiện tại
     * Des: Thực hiện xóa class "invalid" từ thẻ cha của input đó
     * Author: DDKhang
     * CreateAt: 11/5/2023
     * ModifierAt: 11/5/2023
     */
    // removeInvalidInputForm(tagCurrent) {
    //   // Tham chieu len thẻ cha (".formGroup")
    //   const tagParent = tagCurrent.closest(".form-group");
    //   tagParent.classList.remove("invalid");
    //   tagCurrent.setAttribute("title", "");
    // },

    /**
     * - Des: Thực hiện đóng form thông tin
     * - Author: DDKhang (24/5/2023)
     */
    closeDialogOnForm(infoStatus) {
      if (infoStatus.status) {
        this.$router.push("/employee");
      }
    },

    /**
     * - Thực hiện đóng dialog notice
     * - Author: DDKhang (10/6/2023)
     */
    closeDialogNoticeOnForm() {
      // Thực hiện focus vào thẻ input lỗi đầu tiên
      this.handleShowValidateInputError();
    },

    /**
     * - Thực hiện đóng dialog thay đổi dữ liệu trên form
     * - Author: DDKhang (10/6/2023)
     */
    async statusChangeValueDialogEmployee(data) {
      const { status, btnType } = data;
      switch (btnType) {
        case this.$DialogTypeEnum.ChangeValue.btnSaveChange:
          if (status) {
            // console.log("2");
            await this.handleBtnSave();
          }
          break;
        case this.$DialogTypeEnum.ChangeValue.btnNotSaveChange:
          if (status) {
            // console.log("Hi Not Save");
            this.$router.push("/employee");
          }
          break;
      }
    },

    /**
     * Params:
     * Des: Thực hiện chuyển sang trang table employee khi nhấn đóng form info
     * Author: DDKhang
     * CreateAt: 11/5/2023
     * ModifierAt: 11/5/2023
     */
    handleCloseFormEmployeeInfo() {
      let flagEmpty = false;

      switch (this.behaviorHandle) {
        case this.$BehaviorHandleEnum.Edit:
          // Kiểm tra sự thay đổi trên form sửa
          // 1. Lấy toàn bộ key của đối tượng  cập nhật trước đó
          const keysEmployeeOld = Object.keys(
            JSON.parse(this.employeeBeforeUpdate)
          );
          // 2. Thực hiện kiểm tra đối tượng trước và sau khi thay đổi
          for (let key = 0; key < keysEmployeeOld.length; key++) {
            const keyEntity = keysEmployeeOld[key];
            if (
              JSON.stringify(this.employee[keyEntity]) !==
              JSON.stringify(JSON.parse(this.employeeBeforeUpdate)[keyEntity])
            ) {
              flagEmpty = true;
              break;
            }
          }
          if (flagEmpty) {
            flagEmpty = true;
          }
          break;
        case this.$BehaviorHandleEnum.AddNew:
          const noCheckEmpty = ["Gender", "EmployeeCode"];
          const keysEmployee = Object.keys(this.employee);
          // Kiểm tra có sự thay đổi trên form create
          keysEmployee.forEach((key) => {
            if (!noCheckEmpty.includes(key)) {
              if ((this.employee[key] !== "") | null | undefined) {
                flagEmpty = true;
                return;
              }
            }
          });
          break;
      }

      if (flagEmpty) {
        // ShowQuestion("Lưu lại những thay đổi?");
        ShowQuestionChangeValue("Lưu lại những thay đổi?");
      } else {
        this.$router.push("/employee");
      }
    },

    /**
     * - Thực hiện tham chiếu đến các input có ref, hàm được gọi tại thời điểm component được mount
     * - Author: DDKhang (11/6/2023)
     */
    handleReferenceInput() {
      const formInput = this.$refs.formEmployeeRef;
      // 1. Thực hiện truy vấn tất cả những thẻ input[required] trong formInput tương ứng
      // const inputsRequired = formInput.querySelectorAll("input[required]");
      const inputEmployeeCode = this.$refs.textCodeEmployee;
      const inputFullName = this.$refs.inputFullName;
      const cbUnit = this.$refs.comboboxDepartment;

      const inputsRequired = [
        {
          inputElement: inputEmployeeCode,
          name: "EmployeeCode",
        },
        {
          inputElement: inputFullName,
          name: "FullName",
        },
        {
          inputElement: cbUnit,
          name: "DepartmentId",
        },
      ];

      this.inputsRequired = inputsRequired;
    },

    /**
     * - Thực hiện hiển thị lỗi xác thực trên input
     * - Author: DDKhang (10/6/2023)
     */
    handleShowValidateInputError() {
      let flagErrorInput = false;

      this.isFirstFocusInput = true;
      this.inputsRequired.forEach((input) => {
        if (!this.employee[input.name] || !this.employee[input.name]) {
          flagErrorInput = true;
          // Tham chieu len thẻ cha (".formGroup")
          const tagParent = input.inputElement.$el.closest(".form-group");
          tagParent.classList.add("invalid");
          input.inputElement.$el.setAttribute(
            "title",
            this?.$MISAResource?.textError?.textErrorRequired
          );
          if (this.isFirstFocusInput) {
            input.inputElement.$el.focus();
            // Thực hiện không focus vào các thẻ input lỗi khác
            this.isFirstFocusInput = false;
          }
        } else {
          flagErrorInput = false;
        }
      });
      return flagErrorInput;
    },

    /**
     * Params: null
     * Des: Thực hiện cất thông tin nhân viên
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    async handleBtnSave() {
      // console.log("3");
      try {
        // Cờ bắt lỗi, nếu có lỗi thì -> true
        let flagErrorInput = false;

        // Thực validate form
        let validateErrors = [];
        // 1. Kiểm tra rỗng
        // 1.1 Kiểm tra tên đầy đủ có rỗng
        const checkFullName = checkBlank({
          title: this.$MISAResource.EmployeeForm.titleInputRequired.fullName,
          value: this.employee?.FullName,
        });
        if (checkFullName.status) {
          validateErrors.push(checkFullName.msg);
        }

        // 1.2 Kiểm tra mã nhân viên có rỗng
        const checkCodeEmployee = checkBlank({
          title:
            this.$MISAResource.EmployeeForm.titleInputRequired.employeeCode,
          value: this.employee?.EmployeeCode,
        });
        if (checkCodeEmployee.status) {
          validateErrors.push(checkCodeEmployee.msg);
        }
        // 1.3 Kiểm tra phòng ban có rỗng
        const checkDepartment = checkBlank({
          title: this.$MISAResource.EmployeeForm.titleInputRequired.unit,
          value: this.employee?.DepartmentId,
        });
        if (checkDepartment.status) {
          validateErrors.push(checkDepartment.msg);
        }
        // 2. Kiểm tra mã nhân viên có bị trùng lặp
        let { page, limit } = this.$route.query;
        if (!limit) limit = 20; // giới hạn bản ghi trên trang
        page = 1; // số trang
        const entityFilter = {
          pageSize: null,
          pageNumber: null,
          valueFilter: this.employee.EmployeeCode,
        };
        // const isCheckDuplicateEmployeeCode = await checkDuplicateEmployeeCode(
        //   this.$EntityEnum.Employees,
        //   entityFilter
        // );
        // 3. Kiểm tra email
        if (this.employee?.Email) {
          const res = checkEmail(this.employee?.Email);
          if (!res.status) {
            validateErrors.push(res.msg);
            // return ShowValidate(res.msg);
          }
        }
        // 4. Kiểm tra ngày sinh nhỏ hơn ngày hiện tại
        if (this.employee?.DateOfBirth) {
          const res = checkDateOfBirth(this.employee?.DateOfBirth);
          if (!res.status) {
            validateErrors.push(res.msg);
            // return ShowValidate(res.msg);
          }
        }
        if (validateErrors.length > 0) {
          flagErrorInput = false;
          return ShowValidate(validateErrors);
        }
        // Nếu không xảy ra lỗi trên những thẻ input
        if (!flagErrorInput && validateErrors.length === 0) {
          if (
            this.behaviorHandle === this.$BehaviorHandleEnum.AddNew ||
            this.behaviorHandle === this.$BehaviorHandleEnum.Duplicate
          ) {
            // Thực hiện thêm
            //  Kiểm tra trùng lặp mã nhân viên - khi thêm
            const isCheckDuplicateEmployeeCode =
              await checkDuplicateEmployeeCode(
                this.$EntityEnum.Employees,
                entityFilter
              );
            if (isCheckDuplicateEmployeeCode.status) {
              return ShowValidate([isCheckDuplicateEmployeeCode.msg]);
            }
            // 1. Thực hiện gọi api thêm nhân viên
            const res = await postInfoEntity(
              this.$EntityEnum.Employees,
              this.employee
            );
            if (
              res.response.status ===
              this.$MISAEnum.HttpStatusCode.CreatedSuccess
            ) {
              // Thực hiện thông báo
              // 1. Thông tin thông báo
              const toastInfo = {
                status: this.$MISAResource.Toast.AddEntity.AddSuccess.status,
                msg: this.$MISAResource.Toast.AddEntity.AddSuccess.msg,
              };
              // 2. Phát lên App.vue -> để hiển thị Toast
              this.$msemitter.emit("showToast", toastInfo, 5000);
              this.$router.push("/employee");
            }
          } else if (this.behaviorHandle === this.$BehaviorHandleEnum.Edit) {
            // Kiểm tra trùng lặp mã code khi có ý định thay đổi mã code hiện tại
            const resData = await getDataById(
              this.$EntityEnum.Employees,
              this.employee.EmployeeId
            );
            const employeeNow = resData.data;
            if (employeeNow.EmployeeCode !== this.employee.EmployeeCode) {
              return ShowValidate([
                this.$MISAResource.Validate.textCheckDuplicateEmployeeCode,
              ]);
            }

            // Thực hiện gọi api sửa nhân viên
            const res = await updateInfoEntity(
              this.employee.EmployeeId,
              this.$EntityEnum.Employees,
              this.employee
            );

            // Thực hiện thông báo
            if (res.status !== this.$MISAEnum.HttpStatusCode.ServerError) {
              // 1. Thông tin thông báo
              const toastInfo = {
                status:
                  this.$MISAResource.Toast.UpdateEntity.UpdateSuccess.status,
                msg: this.$MISAResource.Toast.UpdateEntity.UpdateSuccess.msg,
              };
              // 2. Phát lên App.vue -> để hiển thị Toast
              this.$msemitter.emit("showToast", toastInfo);
            }
            this.$router.push("/employee");
          } else if (
            this.behaviorHandle === this.$BehaviorHandleEnum.Duplicate
          ) {
          }
          // Thực hiện đóng form
          // this.handleCloseFormEmployeeInfo();
          this.$msemitter.emit("textSearchEmpty");
          this.$msemitter.emit("refresh");
        }
      } catch (error) {
        CatchError(error);
      }
    },

    /**
     * - Des: Thực hiện cất và thêm thông tin
     * Author: DDKhang (4/6/2023)
     */
    async handleBtnSaveAndAdd() {
      // Thực hiện xử lí việc thêm thông tin
      await this.handleBtnSave();
      // Lấy mã code mới
      const res = await getNewCode(this.$EntityEnum.Employees);
      this.employee.EmployeeCode = res.data;

      // Mở lại form thêm thông tin
      if (
        this.behaviorHandle === this.$BehaviorHandleEnum.AddNew ||
        this.behaviorHandle === this.$BehaviorHandleEnum.Edit
      ) {
        this.$router.push("/employee/create");
      } else if (this.behaviorHandle === this.$BehaviorHandleEnum.Duplicate) {
        // this.$router.push(`/employee/${this.employeeId}?duplicate=true`);
        this.$router.push(`/employee/create?duplicate=true`);
      }
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
     *  + departmentId:(string) - Id của department
     * Des: Thực hiện xử lí khi trên comboboxDepartment
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    async handleComboboxDepartment(departmentId) {
      this.employee.DepartmentId = departmentId;
    },

    /**
     * Thực hiện chuyển đổi đúng định dạng khi chuyền vào thẻ input type="date" (yyyy-mm-dd)
     * (phải truyền đúng định dạng thì mới hiển thị trên thẻ input)
     * @param {} dateTime  string - Ngày muốn chuyển đổi
     * Author: DDKhang
     * CreateAt: 26/5/2023
     * ModifierAt: 26/5/2023
     */
    convertAndSetDate(dateTime) {
      if (!dateTime) {
        return null;
      }
      // Chuyển đổi thành dạng Date
      const date = new Date(dateTime);

      // Lấy dữ liệu ngày, tháng, năm
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      // Đặt đúng cấu trúc yyyy-mm-dd
      var formattedDate =
        year +
        "-" +
        (month < 10 ? "0" : "") +
        month +
        "-" +
        (day < 10 ? "0" : "") +
        day;

      // Cập nhật thông tin cấu trúc ngày
      // this.formattedDate = formattedDate;
      return formattedDate;
    },

    /**
     * Des: Xử lí việc cung cấp class cho combobox
     * Author: DDKhang (1/6/2023)
     */
    handleCustomClassDepartmentCombobox() {
      return {
        borderLeftNone: "border-left--none",
        backgroundWhite: "backgroundColor--white",
        widthInput: "width-full",
      };
    },

    /**
     * Des: Xử lí việc cung cấp class cho combobox
     * Author: DDKhang (1/6/2023)
     */
    handleCustomClassBankCombobox() {
      return {
        borderLeftNone: "border-left--none",
        listItemTop: "list-item--top",
        borderRight: "border-right",
        hiddenArrow: "hidden-arrow",
        backgroundWhite: "backgroundColor--white",
        widthInput: "width-250",
      };
    },

    /**
     * - Des: Thực hiện khởi tạo giá trị đầu vào cho combobox trong form chi tiết theo dạng {id: ?, value: ?}
     * - Author: DDKhang (1/6/2023)
     */
    async handleCustomValueDepartmentCombobox() {
      try {
        // const res = await getData(`${BaseUrl}/Departments`);
        const res = await filterInfoEntity(this.$EntityEnum.Departments);
        const departments = res.data.Data;
        const result = departments.map((d) => {
          return {
            id: d.DepartmentId,
            value: d.DepartmentName,
          };
        });
        // Cập nhật giá trị cho status
        this.cbListDepartment = result;
      } catch (error) {
        console.log(error.message);
      }
    },

    /**
     * - Des: Thực hiện khởi tạo giá trị đầu vào cho combobox trong form chi tiết theo dạng {id: ?, value: ?}
     * - Author: DDKhang (1/6/2023)
     */
    async handleCustomValueBankCombobox() {
      const res = await filterInfoEntity(this.$EntityEnum.Banks);
      const banks = res.data.Data;
      const result = banks.map((b) => {
        return {
          id: b.BankId,
          value: b.BankName,
        };
      });
      // Cập nhật giá trị cho status
      this.cbListBank = result;
    },

    /**
     * - Des: Xử lí chọn bản ghi trên combobox department
     * - Author: DDKhang (1/6/2023)
     */
    handleChooseDepartmentRecord(option) {
      this.employee.DepartmentId = option.id;
    },

    /**
     *
     * @param {*} option - Xử lí chọn bản ghi trên combobox bank
     * - Author: DDKhang (1/6/2023)
     */
    async handleChooseBankRecord(option) {
      this.employee.BankId = option.id;
      var res = await getDataById(this.$EntityEnum.Banks, option.id);
      // this.$refs.inputBranch.handleAutoValue("abc");
      // Thực hiện cập nhật dữ liệu ngay lập tức cho chi nhánh khi chọn tên ngân hàng
      this.$refs.inputBranch.$refs.refInput.value = res.data.Branch;
      // this.employee = {
      //   ...this.employee,
      //   BrankInfo: { ...this.BrankInfo, Branch: "abc" },
      // };
    },

    /**
     *
     * @param {*} event - Sự kiện mặc định khi gọi sự kiện
     * - Des: Xử lí việc focus vào combobox bằng cách gọi đến hàm forcusInput bên trong component Combobox
     * - Author: DDKhang (1/6/2023)
     */
    handleFocusComboboxDepartment(event) {
      event.preventDefault();
      // Tham chiếu đến combobox department
      var refCombobox = this.$refs.comboboxDepartment;
      // Gọi hàm trong component Combobox
      refCombobox.focusInput();
    },

    /**
     *
     * @param {*} event - Sự kiện mặc định khi gọi sự kiện
     * - Des: Xử lí việc focus vào combobox bằng cách gọi đến hàm forcusInput bên trong component Combobox
     * - Author: DDKhang (1/6/2023)
     */
    handleFocusComboboxBank(event) {
      event.preventDefault();
      // Tham chiếu đến combobox department
      var refCombobox = this.$refs.comboboxBank;
      // Gọi hàm trong component Combobox
      refCombobox.focusInput();
    },

    /**
     * - Ngăn chặn bấm enter trên form
     * - Author: DDKhang (3/6/2023)
     */
    handleKeyDownForm(event) {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    },

    /**
     * Cập nhật chi nhánh
     * - Author: DDKhang (3/6/2023)
     */
    updateBranch() {
      this.employee = {
        ...this.employee,
        BrankInfo: { ...this.BrankInfo, Branch: "abc" },
      };
    },
  },
};
</script>

<template>
  <div
    id="form-employee"
    ref="formEmployeeRef"
    class="form-employee dialog-close"
  >
    <div class="form-employee-wrapper">
      <!-- UI FORM ADD EMPLOYEE -->
      <form @keydown="handleKeyDownForm" class="form-info-employee">
        <div class="info-employee">
          <!-- Info employee header -- Start -->
          <div class="info-employee-header">
            <div class="info-employee-header-title">
              {{ this.title }}
            </div>
            <div
              class="icon-help-close"
              :title="this.$ShortCutResource.CloseForm.tooltip"
              @click="handleCloseFormEmployeeInfo"
            >
              <div class="dialog-btn--close icon-close"></div>
            </div>
          </div>
          <!-- Info employee header -- End -->

          <div class="info-employee-content">
            <div class="info-employee-content-place-first">
              <div class="info-employee-form-one">
                <div class="info-employee-form-one-idName">
                  <div class="info-employee-form-one-id-employee form-group">
                    <label
                      class="textfield__label"
                      :title="
                        this.$MISAResource.EmployeeForm.labelForm.employeeCode
                          .tooltip
                      "
                      >{{
                        this.$MISAResource.EmployeeForm.labelForm.employeeCode
                          .text
                      }}
                      <span class="icon-require">
                        <label for="" title="Bắt buộc nhập.">*</label>
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
                      field-label="Mã"
                      name="employeeCode"
                      v-model="employee.EmployeeCode"
                      :tabindex="this.$TabIndex.formEmployeeInfo.codeEmployee"
                      :required="true"
                      :focus="true"
                    ></MISAInput>
                    <small class="form-message--error"></small>
                  </div>

                  <div class="info-employee-form-one-name-employee form-group">
                    <label
                      class="textfield__label"
                      :title="
                        this.$MISAResource.EmployeeForm.labelForm.employeeName
                          .tooltip
                      "
                      >{{
                        this.$MISAResource.EmployeeForm.labelForm.employeeName
                          .text
                      }}
                      <span class="icon-require">*</span>
                    </label>
                    <!-- <input
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
                    /> -->
                    <MISAInput
                      ref="inputFullName"
                      id="textfield_EmployeeName"
                      class="min-width-input"
                      field-label="Tên nhân viên"
                      name="FullName"
                      v-model="this.employee.FullName"
                      placeholder="Nguyễn Ánh Bằng"
                      :tabindex="this.$TabIndex.formEmployeeInfo.employeeName"
                      :required="true"
                      @keydown.tab.prevent="handleFocusComboboxDepartment"
                    ></MISAInput>
                    <small class="form-message--error"></small>
                  </div>
                </div>

                <div
                  id="info-employee-form-one-unit"
                  class="info-employee-form-one-unit form-group"
                >
                  <!-- Combobox -->
                  <label
                    class="textfield__label"
                    :title="
                      this.$MISAResource.EmployeeForm.labelForm.unit.tooltip
                    "
                    >{{ this.$MISAResource.EmployeeForm.labelForm.unit.text }}
                    <span class="icon-require">*</span>
                  </label>

                  <div class="content-combobox">
                    <MISACombobox
                      :customClass="this.handleCustomClassDepartmentCombobox()"
                      :listItemValue="this.cbListDepartment"
                      :handleChooseRecord="this.handleChooseDepartmentRecord"
                      :required="true"
                      ref="comboboxDepartment"
                      :defaultValueInput="handleDefaultValueDepartmentCombobox"
                      :tabindex="this.$TabIndex.formEmployeeInfo.comboboxUnit"
                    ></MISACombobox>
                  </div>
                  <small class="form-message--error"></small>
                </div>

                <div class="info-employee-form-one-title form-group">
                  <label class="textfield__label">
                    {{ this.$MISAResource.EmployeeForm.labelForm.title.text }}
                  </label>
                  <MISAInput
                    id="textfield__title"
                    class="width-full"
                    type="text"
                    name="title"
                    placeholder=""
                    v-model="this.employee.Title"
                    :tabindex="this.$TabIndex.formEmployeeInfo.title"
                    ref="input4"
                  ></MISAInput>
                  <!-- <input
                    id="textfield__title"
                    class="textfield__input width-full input-hover input-focus"
                    type="text"
                    name="title"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.title"
                    ref="input4"
                  /> -->
                  <small class="form-message--error"></small>
                </div>
              </div>

              <div class="info-employee-form-two">
                <div class="info-employee-form-two--dateofbirth-sex">
                  <div class="datetime form-group">
                    <label class="textfield__label">{{
                      this.$MISAResource.EmployeeForm.labelForm.dateOfBirth.text
                    }}</label>
                    <MISAInput
                      type="date"
                      id="textfield__dateOfBirth"
                      name="dateOfBirth"
                      v-model="this.employee.DateOfBirth"
                      :tabindex="this.$TabIndex.formEmployeeInfo.dateOfBirth"
                      ref="input5"
                    ></MISAInput>
                    <!-- <input
                      type="date"
                      id="textfield__dateOfBirth"
                      name="dateOfBirth"
                      v-model="this.employee.DateOfBirth"
                      :tabindex="this.$TabIndex.formEmployeeInfo.dateOfBirth"
                      ref="input5"
                    /> -->
                    <!-- <small class="form-message--error"></small> -->
                  </div>

                  <div class="info-employee-form-two-sex form-group">
                    <label class="textfield__label">
                      {{
                        this.$MISAResource.EmployeeForm.labelForm.gender.text
                      }}
                    </label>
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
                          v-model="this.employee.Gender"
                          ref="input6"
                          :tabindex="this.$TabIndex.formEmployeeInfo.genderMale"
                        />
                        <p>
                          {{
                            this.$MISAResource.EmployeeForm.labelForm.genderMale
                              .text
                          }}
                        </p>
                        <span class="checkmark"></span>
                      </label>

                      <label class="radio">
                        <input
                          type="radio"
                          name="genre"
                          value="1"
                          v-model="this.employee.Gender"
                          ref="input7"
                          :tabindex="this.$TabIndex.formEmployeeInfo.genderMale"
                        />
                        <p>
                          {{
                            this.$MISAResource.EmployeeForm.labelForm
                              .genderFemale.text
                          }}
                        </p>
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
                          value="2"
                          v-model="this.employee.Gender"
                          ref="input8"
                          :tabindex="this.$TabIndex.formEmployeeInfo.genderMale"
                        />
                        <p>
                          {{
                            this.$MISAResource.EmployeeForm.labelForm
                              .genderOther.text
                          }}
                        </p>
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
                      >{{
                        this.$MISAResource.EmployeeForm.labelForm.identifyNumber
                          .text
                      }}</label
                    >
                    <MISAInput
                      id="textfield__peopleId"
                      class="textfield__input min-width-300"
                      type="text"
                      name="peopleId"
                      placeholder="001202009382"
                      v-model="this.employee.IdentityNumber"
                      :tabindex="this.$TabIndex.formEmployeeInfo.identification"
                      ref="input9"
                    ></MISAInput>
                    <!-- <input
                      id="textfield__peopleId"
                      class="textfield__input input-hover input-focus min-width-300"
                      type="text"
                      name="peopleId"
                      placeholder="001202009382"
                      :tabindex="this.$TabIndex.formEmployeeInfo.identification"
                      ref="input9"
                    /> -->
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
                    <label class="textfield__label">{{
                      this.$MISAResource.EmployeeForm.labelForm.dateRange.text
                    }}</label>
                    <MISAInput
                      class="width-full min-width-200"
                      type="date"
                      id="textfield__dateOfBirth"
                      name="identityDate"
                      v-model="this.employee.IdentityDate"
                      :tabindex="this.$TabIndex.formEmployeeInfo.datetime"
                      ref="input10"
                    ></MISAInput>
                    <!-- <input
                      class="width-full min-width-200"
                      type="date"
                      id="textfield__dateOfBirth"
                      name="dateOfBirth"
                      :tabindex="this.$TabIndex.formEmployeeInfo.datetime"
                      ref="input10"
                    /> -->
                    <!-- <small class="form-message--error"></small> -->
                  </div>
                </div>

                <div class="info-employee-form-two-issued form-group">
                  <label class="textfield__label">{{
                    this.$MISAResource.EmployeeForm.labelForm.issuedBy.text
                  }}</label>
                  <MISAInput
                    id="textfield__issuedBy"
                    class="textfield__input width-full input-hover input-focus"
                    type="text"
                    name="issuedBy"
                    placeholder=""
                    v-model="this.employee.IdentityPlace"
                    :tabindex="this.$TabIndex.formEmployeeInfo.issuedBy"
                    ref="input11"
                  ></MISAInput>
                  <!-- <input
                    id="textfield__issuedBy"
                    class="textfield__input width-full input-hover input-focus"
                    type="text"
                    name="issuedBy"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.issuedBy"
                    ref="input11"
                  /> -->
                  <small class="form-message--error"></small>
                </div>
              </div>
            </div>

            <div class="info-employee-form-three form-group">
              <label class="textfield__label">{{
                this.$MISAResource.EmployeeForm.labelForm.address.text
              }}</label>
              <MISAInput
                id="textfield__address"
                class="textfield__input width-full input-hover input-focus"
                type="text"
                name="address"
                placeholder=""
                v-model="this.employee.Address"
                :tabindex="this.$TabIndex.formEmployeeInfo.address"
                ref="input12"
              ></MISAInput>
              <!-- <input
                id="textfield__address"
                class="textfield__input width-full input-hover input-focus"
                type="text"
                name="address"
                placeholder=""
                :tabindex="this.$TabIndex.formEmployeeInfo.address"
                ref="input12"
              /> -->
              <small class="form-message--error"></small>
            </div>

            <div class="info-employee-form-four">
              <div class="info-employee-form-four--contact">
                <div
                  class="info-employee-form-four-telephone--contact form-group"
                >
                  <label
                    class="textfield__label"
                    :title="
                      this.$MISAResource.EmployeeForm.labelForm.telephoneNumber
                        .tooltip
                    "
                    >{{
                      this.$MISAResource.EmployeeForm.labelForm.telephoneNumber
                        .text
                    }}</label
                  >
                  <MISAInput
                    id="textfield__mobilePhone"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="mobilePhone"
                    placeholder=""
                    v-model="this.employee.PhoneNumber"
                    :tabindex="this.$TabIndex.formEmployeeInfo.mobilePhone"
                    ref="input13"
                  ></MISAInput>
                  <!-- <input
                    id="textfield__mobilePhone"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="mobilePhone"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.mobilePhone"
                    ref="input13"
                  /> -->
                  <small class="form-message--error"></small>
                </div>
                <div
                  class="info-employee-form-four-telephoneDefault--contact form-group"
                >
                  <label
                    class="textfield__label"
                    :title="
                      this.$MISAResource.EmployeeForm.labelForm.landlinePhone
                        .tooltip
                    "
                    >{{
                      this.$MISAResource.EmployeeForm.labelForm.landlinePhone
                        .text
                    }}</label
                  >
                  <MISAInput
                    id="textfield__landlinePhone"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="landlinePhone"
                    placeholder=""
                    v-model="this.employee.LandlinePhone"
                    :tabindex="this.$TabIndex.formEmployeeInfo.landlinePhone"
                    ref="input14"
                  ></MISAInput>
                  <!-- <input
                    id="textfield__landlinePhone"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="landlinePhone"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.landlinePhone"
                    ref="input14"
                  /> -->
                  <small class="form-message--error"></small>
                </div>
                <div class="info-employee-form-four-email--contact form-group">
                  <label class="textfield__label">{{
                    this.$MISAResource.EmployeeForm.labelForm.email.text
                  }}</label>
                  <MISAInput
                    id="textfield__email"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="email"
                    v-model="this.employee.Email"
                    placeholder="procuon856@example.com"
                    :tabindex="this.$TabIndex.formEmployeeInfo.email"
                    ref="input15"
                  ></MISAInput>
                  <!-- <input
                    id="textfield__email"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="email"
                    v-model="this.employee.Email"
                    placeholder="procuon856@example.com"
                    :tabindex="this.$TabIndex.formEmployeeInfo.email"
                    ref="input15"
                  /> -->
                  <small class="form-message--error"></small>
                </div>
              </div>

              <div class="info-employee-form-four--bank">
                <div class="info-employee-form-four-telephone--bank form-group">
                  <label class="textfield__label">
                    {{
                      this.$MISAResource.EmployeeForm.labelForm.bankAccount.text
                    }}
                  </label>
                  <MISAInput
                    id="textfield__bankAccount"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="bankAccount"
                    placeholder=""
                    v-model="this.employee.AccountNumber"
                    :tabindex="this.$TabIndex.formEmployeeInfo.bankAccount"
                    ref="input16"
                  ></MISAInput>
                  <!-- <input
                    id="textfield__bankAccount"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="bankAccount"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.bankAccount"
                    ref="input16"
                  /> -->
                  <small class="form-message--error"></small>
                </div>
                <div
                  class="info-employee-form-four-telephoneDefault--bank form-group"
                >
                  <label class="textfield__label">{{
                    this.$MISAResource.EmployeeForm.labelForm.bankName.text
                  }}</label>
                  <!-- <MISAInput
                    id="textfield__bankName"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="bankName"
                    placeholder=""
                    @update:modelValue="
                      $emit('update:value', $event.target.value)
                    "
                    :modelValue="
                      this.employee.BankInfo && this.employee.BankInfo.BankName
                    "
                    :tabindex="this.$TabIndex.formEmployeeInfo.bankName"
                    ref="input17"
                  ></MISAInput> -->

                  <div class="content-combobox">
                    <MISACombobox
                      :customClass="this.handleCustomClassBankCombobox()"
                      :listItemValue="this.cbListBank"
                      :handleChooseRecord="this.handleChooseBankRecord"
                      ref="comboboxBank"
                      placeholderInput=""
                      :defaultValueInput="handleDefaultValueBankCombobox"
                      :tabindex="this.$TabIndex.formEmployeeInfo.bankName"
                    ></MISACombobox>
                  </div>
                  <!-- <input
                    id="textfield__bankName"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="bankName"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.bankName"
                    ref="input17"
                  /> -->
                  <small class="form-message--error"></small>
                </div>
                <div class="info-employee-form-four-email--bank form-group">
                  <label class="textfield__label">
                    {{ this.$MISAResource.EmployeeForm.labelForm.branch.text }}
                  </label>
                  <MISAInput
                    id="textfield__branch"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="branch"
                    placeholder=""
                    :readonly="true"
                    :modelValue="
                      this.employee.BankInfo && this.employee.BankInfo.Branch
                    "
                    :tabindex="this.$TabIndex.formEmployeeInfo.branch"
                    ref="inputBranch"
                    @update:modelValue="updateBranch"
                  ></MISAInput>
                  <!-- <input
                    id="textfield__branch"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="branch"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.branch"
                    ref="input18"
                  /> -->
                  <small class="form-message--error"></small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="info-employee-footer">
          <div class="info-employee-footer-btn">
            <MISAButton
              class="info-employee-footer-btn-keep"
              @click.prevent="handleBtnSave"
              :tabindex="this.$TabIndex.formEmployeeInfo.btnSave"
              ref="input19"
              :title="this.$ShortCutResource.BtnSave.tooltip"
            >
              {{ this.$MISAResource.ButtonText.formInfoEmployee.btnSave }}
            </MISAButton>
            <!-- <button
              class="info-employee-footer-btn-keep"
              @click.prevent="handleBtnSave"
              :tabindex="this.$TabIndex.formEmployeeInfo.btnSave"
              ref="input19"
              :title="this.$ShortCutResource.save.tooltip"
            >
              {{ this.$MISAResource.ButtonText.formInfoEmployee.btnSave }}
            </button> -->

            <!-- v-if="this.behaviorHandle !== this.$BehaviorHandleEnum.Edit" -->
            <MISAButton
              id="btnSaveAndAdd"
              class="info-employee-footer-btnKeepAdd btn-hover btn-pressed"
              @click.prevent="handleBtnSaveAndAdd"
              :tabindex="this.$TabIndex.formEmployeeInfo.saveAndAdd"
              :title="this.$ShortCutResource.BtnSaveAdd.tooltip"
              ref="btnSaveAdd"
              >{{
                this.$MISAResource.ButtonText.formInfoEmployee.btnSaveAdd
              }}</MISAButton
            >
            <!-- <button
              id="btnSaveAndAdd"
              class="info-employee-footer-btnKeepAdd btn-hover btn-pressed"
              :tabindex="this.$TabIndex.formEmployeeInfo.saveAndAdd"
              ref="input20"
            >
              {{ this.$MISAResource.ButtonText.formInfoEmployee.btnSaveAdd }}
            </button> -->
          </div>

          <MISAButton
            class="info-employee-footer-btnCancel"
            @click="handleCloseFormEmployeeInfo"
            :tabindex="this.$TabIndex.formEmployeeInfo.btnCancel"
            ref="input21"
          >
            {{ this.$MISAResource.ButtonText.formInfoEmployee.btnCancel }}
          </MISAButton>
          <!-- <button
            class="info-employee-footer-btnCancel"
            @click="handleCloseFormEmployeeInfo"
            :tabindex="this.$TabIndex.formEmployeeInfo.btnCancel"
            ref="input21"
          >
            {{ this.$MISAResource.ButtonText.formInfoEmployee.btnCancel }}
          </button> -->
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
