<script>
export default {
  name: "MISAInput",
  props: {
    value: {
      type: String,
    },
    employeeCode: {
      type: String,
    },
    modelValue: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    focus: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:employeeCode"],
  data() {
    return {};
  },
  computed: {
    // bankName: {
    //   get() {
    //     return this.value ? this.value.BankName : "";
    //   },
    //   set(newValue) {
    //     this.$emit("update:value", { ...this.value, bankName: newValue });
    //   },
    // },
  },
  methods: {
    /**
     * - Cập nhật tên ngân hàng
     * - Author: DDKhang (4/6/2023)
     */
    // updateBankName(event) {
    //   this.modelValue = event.target.value;
    // },
    /**
     * Params:
     * Des: Thực hiện focus vào thẻ input nào có thuộc tính 'focus="true"'
     * Author: DDKhang
     * CreateAt: 13/5/2023
     * ModifierAt: 13/5/2023
     */
    focusInput() {
      if (this.focus) {
        this.$refs.refInput.focus();
      }
    },

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
      const tagParent = tagCurrent?.closest(".form-group");
      tagParent.classList.remove("invalid");
      tagCurrent.setAttribute("title", "");
    },

    /**
     * Params:
     * Des: Thực hiện xử lí input khi blur ra ngoài
     * Author: DDKhang
     * CreateAt: 11/5/2023
     * ModifierAt: 11/5/2023
     */
    handleInputRequired() {
      // Kiểm tra input có yêu cầu "required"
      if (this.required) {
        const tagCurrent = this.$refs.refInput;
        const value = tagCurrent.value;
        if (!value) {
          // Tham chieu len thẻ cha (".formGroup")
          const tagParent = tagCurrent.closest(".form-group");
          tagParent.classList.add("invalid");
          tagCurrent.setAttribute(
            "title",
            this.$MISAResource.textError.textErrorRequired
          );

          // Tham chiếu đến thẻ con (small hiển thị lỗi)
          // const smallMessageError = tagParent.querySelector(
          //   ".form-message--error small"
          // );
          // if (smallMessageError) {
          //   // smallMessageError.style.display = "block";
          //   smallMessageError.innerHTML =
          //     this.$MISAResource.textError.textErrorRequired;
          // }
        } else {
          // Tham chieu len thẻ cha (".formGroup")
          const tagParent = tagCurrent.closest(".form-group");
          tagParent.classList.remove("invalid");
          tagCurrent.setAttribute("title", "");

          // const smallMessageError = tagParent.querySelector(
          //   ".form-message--error small"
          // );
          // if (smallMessageError) {
          //   smallMessageError.innerHTML = "";
          // }
        }
      }
    },

    handleAutoValue(value) {
      console.log("Value: ", value);
      // this.modelValue = value;
    },
  },
  mounted() {
    this.focusInput();
  },
  beforeUpdate() {
    // Thực hiện xóa class "invalid" khỏi thẻ input khi thay đổi giá trị trên input
    if (this.modelValue) {
      const tagCurrent = this.$refs.refInput;
      this.removeInvalidInputForm(tagCurrent);
    }
  },
};
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    ref="refInput"
    class="textfield__input input-hover input-focus"
    type="text"
    :required="this.required"
    placeholder=""
    @blur="this.handleInputRequired"
  />
</template>

<style lang="scss" scoped></style>
