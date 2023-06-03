<script>
import { showCombobox } from "../../functions/Combobox";
import _ from "lodash";
import { FormatNumber } from "../../functions/FormatNumber";
import MISACombobox from "../../components/MISACombobox.vue";

export default {
  name: "EmployeeHomeFooter",
  data() {
    return {
      selectValueOption: 20,
      // optionsNumberRecord: [15, 20, 30],
      optionsNumberRecord: [
        {
          id: 1,
          value: 15,
        },
        {
          id: 2,
          value: 20,
        },
        {
          id: 3,
          value: 30,
        },
      ],
      recordData: {},
      totalRecordsSearch: 0, // Tổng số bản ghi khi tìm kiếm
      customClass: {
        borderLeftNone: "border-left--none",
        listItemTop: "list-item-top",
      },
      comboboxValue: 0,
    };
  },
  created() {
    /**
     * - Lấy thông tin phản hồi từ EmployeeList.vue
     * - Thực hiện lấy thông tin phản hồi từ filter số bản ghi theo page, limit
     */
    this.$msemitter.on("recordsResInfo", this.getRecordsResInfo);
    this.$msemitter.on("listEmployeeSearch", this.totalRecord);
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

    // comboboxValue: function () {
    //   let page = this.$route?.query.page;
    //   // Thực hiện lấy số lượng dữ liệu tương ứng với giá trị được chọn
    //   if (page) {
    //     this.$router?.push(`/employee?page=${page}&limit=${comboboxValue}`);
    //   } else {
    //     this.$router?.push(`/employee?page=1&limit=${comboboxValue}`);
    //   }
    // },
  },
  methods: {
    /**
     * @param {*} options - {id:?, value:?}:
     * Des: Xử lí hiển thị dữ liệu tương ứng khi chọn số lượng bản ghi trên combobox
     * Author: DDKhang
     * CreateAt: 9/5/2023
     * ModifierAt: 9/5/2023
     */
    handleChooseQualityRecord(option) {
      let page = this.$route.query.page;
      if (page) {
        this.$router.push(
          `/employee?page=${parseInt(page)}&limit=${option.value}`
        );
      } else {
        page = 1;
        this.$router.push(
          `/employee?page=${parseInt(page)}&limit=${option.value}`
        );
      }
    },

    totalRecord(data) {
      this.totalRecordsSearch = data.length;
    },
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
     *
     * @param {*} number - Số cần format
     * - Des: Thực hiện cấu trúc lại số (1.000)
     * Author: DDKhang
     * CreateAt: 30/5/2023
     * ModifierAt: 30/5/2023
     */
    handleFormatNumber(number) {
      return FormatNumber(number);
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
      let limit = this.$route.query.limit;
      if (page && parseInt(page) > 1) {
        this.$router.push(
          `/employee?page=${parseInt(page) - 1}&limit=${limit}`
        );
      }
      // else {
      //   this.$router.push(`/employee?page=1&limit=${this.selectValueOption}`);
      // }
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
      let limit = this.$route.query.limit;
      if (page) {
        if (page < this.recordData.TotalPage) {
          this.$router.push(
            `/employee?page=${parseInt(page) + 1}&limit=${limit}`
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
    // handleChooseQualityRecorder(option) {
    // console.log("Option: ", option);
    // if (option) {
    //   let page = this.$route.query.page;
    //   if (page) {
    //     this.$router.push(`/employee?page=${parseInt(page)}&limit=${option}`);
    //   } else {
    //     page = 1;
    //     this.$router.push(`/employee?page=${parseInt(page)}&limit=${option}`);
    //   }
    // }
    // },

    /**
     * Des: Xử lí việc cung cấp class cho combobox
     * Author: DDKhang (1/6/2023)
     */
    handleCustomClassCombobox() {
      return {
        borderLeftNone: "border-left--none",
        listItemTop: "list-item--top",
        backgroundWhite: "backgroundColor--white",
        widthInput: "width-50",
      };
    },

    /**
     * - Xử lí cập nhật dữ liệu trên combobox
     * Author: DDKhang (1/6/2023)
     */
    handleComboboxValueUpdate(newVal) {
      console.log("NewValue: ", newVal);
      this.comboboxValue = newVal;
    },
  },
  components: { MISACombobox },
};
</script>

<template>
  <div class="main__footer">
    <div class="main__footer-total-records">
      Tổng số:
      {{
        totalRecordsSearch > 0
          ? totalRecordsSearch
          : this.handleFormatNumber(this.recordData.TotalRecord)
      }}
      bản ghi
    </div>
    <div class="main__footer-paging">
      <div class="main__footer-paging-total-record-on-page">
        <p class="number-records-text">Số bản ghi/trang:</p>

        <MISACombobox
          :customClass="this.handleCustomClassCombobox()"
          placeholderInput="20"
          v-model="this.comboboxValue"
          :listItemValue="this.optionsNumberRecord"
          :defaultValueInput="this.optionsNumberRecord[1]"
          :handleChooseRecord="this.handleChooseQualityRecord"
        ></MISACombobox>

        <!-- Combobox -->
        <!-- <div class="dropdown width-76" @click="handlePressCombobox">
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
        </div> -->
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
