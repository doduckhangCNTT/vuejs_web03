<script>
import { showCombobox } from "../../functions/Combobox";
import _ from "lodash";

export default {
  name: "EmployeeHomeFooter",
  data() {
    return {
      selectValueOption: 20,
      optionsNumberRecord: [15, 20, 30],
      recordData: {},
    };
  },
  created() {
    this.$msemitter.on("recordsResInfo", this.getRecordsResInfo);
  },
  watch: {
    selectValueOption: _.debounce(function (newValue, oldValue) {
      let page = this.$route.query.page;
      // Thực hiện lấy số lượng dữ liệu tương ứng với giá trị được chọn
      if (page) {
        this.$router.push(`/employee?page=${page}&limit=${newValue}`);
      } else {
        this.$router.push(`/employee?page=1&limit=${newValue}`);
      }
    }, 1000),
  },
  methods: {
    /**
     * Params:
     *  + _recordData: dữ liệu bản ghi
     * Des: Xử lí lấy thông tin các bản ghi
     * Author: DDKhang
     * CreateAt: 30/4/2023
     * ModifierAt: 30/4/2023
     */
    getRecordsResInfo(_recordData) {
      this.recordData = _recordData;
    },
    /**
     * Params: null
     * Des: Xử lí hiển thị combobox trên trang chủ
     * Author: DDKhang
     * CreateAt: 30/4/2023
     * ModifierAt: 30/4/2023
     */
    handlePressCombobox() {
      showCombobox();
    },

    /**
     * @param(): null
     * Des: Xử lí việc sang trang trước đó => tải dữ liệu tương ứng đó
     * Author: DDKhang
     * CreateAt: 9/5/2023
     * ModifierAt: 9/5/2023
     */
    previousPage() {
      let page = this.$route.query.page;
      if (page && parseInt(page) > 1) {
        this.$router.push(
          `/employee?page=${parseInt(page) - 1}&limit=${this.selectValueOption}`
        );
      } else {
        this.$router.push(`/employee?page=1&limit=${this.selectValueOption}`);
      }
    },

    /**
     * @param(): null
     * Des: Xử lí việc sang trang tiếp theo => tải dữ liệu tương ứng đó
     * Author: DDKhang
     * CreateAt: 9/5/2023
     * ModifierAt: 9/5/2023
     */
    nextPage() {
      let page = this.$route.query.page;
      if (page) {
        if (page < this.recordData.TotalPage) {
          this.$router.push(
            `/employee?page=${parseInt(page) + 1}&limit=${
              this.selectValueOption
            }`
          );
        }
      } else {
        page = 1;
        this.$router.push(
          `/employee?page=${parseInt(page) + 1}&limit=${this.selectValueOption}`
        );
      }
    },

    /**
     * @param():
     *  + option(number) số lượng bản ghi được chọn trên combobox
     * Des: Xử lí hiển thị dữ liệu tương ứng khi chọn số lượng bản ghi trên combobox
     * Author: DDKhang
     * CreateAt: 9/5/2023
     * ModifierAt: 9/5/2023
     */
    handleChooseQualityRecorder(option) {
      if (option) {
        let page = this.$route.query.page;
        if (page) {
          this.$router.push(`/employee?page=${parseInt(page)}&limit=${option}`);
        } else {
          page = 1;
          this.$router.push(`/employee?page=${parseInt(page)}&limit=${option}`);
        }
      }
    },
  },
};
</script>

<template>
  <div class="main__footer">
    <div class="main__footer-total-records">
      Tổng số: {{ this.recordData.TotalRecord }} bản ghi
    </div>
    <div class="main__footer-paging">
      <div class="main__footer-paging-total-record-on-page">
        <p class="number-records-text">Số bản ghi/trang:</p>
        <!-- Combobox -->
        <div class="dropdown width-76" @click="handlePressCombobox">
          <div class="combobox-input">
            <input type="text" placeholder="10" v-model="selectValueOption" />
            <div class="combobox-input__icon border-left-none">
              <div class="icon-combobox--arrow"></div>
            </div>
          </div>
          <ul class="options combobox-options--above">
            <li
              class="option"
              v-for="option in this.optionsNumberRecord"
              :key="option"
              @click="handleChooseQualityRecorder(option)"
            >
              {{ option }}
            </li>
          </ul>
        </div>
        <span class="main__footer-quality-record"
          >{{ this.recordData.CurrentPage }}/{{ this.recordData.TotalPage }} bản
          ghi
        </span>
      </div>
      <div class="main__footer-paging-number">
        <span class="main__footer-paging-previous" @click="previousPage"></span>
        <span class="main__footer-paging-next" @click="nextPage"></span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
