<script>
import { showCombobox } from "../functions/Combobox";
import MISACombobox from "../components/MISACombobox.vue";

export default {
  name: "TheHeader",
  methods: {
    handlePressCombobox() {
      showCombobox();
    },
    handleToggleNavbar() {
      document.querySelector(".navbar").classList.toggle("hidden");
    },
  },
  data() {
    return {
      listItemCompany: [...this.$MISAResource.EmployeeHome.listItemCompany],
    };
  },
  methods: {
    /**
     * Des: Xử lí việc cung cấp class cho combobox
     * Author: DDKhang (1/6/2023)
     */
    handleCustomClassCombobox() {
      return {
        widthInput: "width-200",
      };
    },

    /**
     *
     * @param {*} option - Gía trị được chọn trong Combobox
     * - Des: Thực hiện xử lí giá trị được chọn trong Combobox
     * Author: DDKhang (1/6/2023)
     */
    handleChooseCompanyRecord(option) {},
  },
  components: { MISACombobox },
};
</script>

<template>
  <div class="header">
    <div class="header__company">
      <div
        class="header-icon--hamburger"
        @click="this.handleToggleNavbar()"
      ></div>
      <div class="header__company-info">
        <MISACombobox
          :customClass="this.handleCustomClassCombobox()"
          placeholderInput="CÔNG TY TNHH SẢN XUẤT - THƯƠNG MẠI - DICH VỤ QUI PHÚC"
          class="border--none"
          :listItemValue="this.listItemCompany"
          :handleChooseRecord="this.handleChooseCompanyRecord"
          :defaultValueInput="this.listItemCompany[0]"
        ></MISACombobox>

        <!-- Combobox -->
        <!-- <div
          class="dropdown width-300 border-none"
          @click="handlePressCombobox"
        >
          <div class="combobox-input">
            <input
              type="text"
              placeholder="CÔNG TY TNHH SẢN XUẤT - THƯƠNG MẠI - DICH VỤ QUI PHÚC"
            />
            <div class="combobox-input__icon border-left-none">
              <div class="icon-combobox--arrow"></div>
            </div>
          </div>
          <ul class="options combobox-options--below">
            <li class="option">10</li>
            <li class="option">25</li>
            <li class="option">30</li>
            <li class="option">50</li>
          </ul>
        </div> -->
      </div>
    </div>

    <!-- Personal -- Start -- -->
    <div class="header__personal">
      <div class="header__notifications"></div>
      <div class="header__personal-info">
        <div class="header__personal-info-avatar"></div>
        <p class="header__personal-info-username">User Name</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
