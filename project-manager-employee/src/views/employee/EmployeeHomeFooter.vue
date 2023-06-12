<script>
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
          value: 10,
        },
        {
          id: 2,
          value: 15,
        },
        {
          id: 3,
          value: 20,
        },
        {
          id: 4,
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
      // defaultValue: this.optionsNumberRecord[2],
      defaultValue: {
        id: 3,
        value: 20,
      },
    };
  },
  created() {
    /**
     * - Lấy thông tin phản hồi từ EmployeeList.vue
     * - Thực hiện lấy thông tin phản hồi từ filter số bản ghi theo page, limit
     */
    this.$msemitter.on("recordsResInfo", this.getRecordsResInfo);
    // Lắng nghe tín hiệu từ EmployeeHome.vue
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

    "$route.query": {
      async handler() {
        if (this.$route.query.limit) {
          this.defaultValueCombobox();
        }
      },
    },

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
      let { page, search } = this.$route.query;
      this.defaultValue = { ...this.defaultValue, ...option };

      this.$refs.comboboxRef.handleSetValueInput(option);
      if (search) {
        if (page) {
          console.log({
            page,
            totalRecord: this.recordData.TotalPageByCondition,
          });

          // Nếu tổng số bản ghi nhỏ hơn số bản ghi trên trang thì quay về trang 1
          if (this.recordData.TotalRecordsResult < option.value) {
            page = 1;
          }

          this.$router.push(
            `/employee?page=${parseInt(page)}&limit=${parseInt(
              option.value
            )}&search=${search}`
          );
        } else {
          page = 1;
          this.$router.push(
            `/employee?page=${parseInt(page)}&limit=${parseInt(
              option.value
            )}&search=${search}`
          );
        }
      } else {
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
      }

      // Phát đến EmployeeHome.vue
      this.$msemitter.emit("emptyTextSearch");
    },

    /**
     * - Tổng số bản ghi tìm kiếm được
     * - Author: DDKhang (30/4/2023)
     */
    totalRecord(data) {
      console.log("Data Search: ", data);
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
      let { page, limit, search } = this.$route.query;
      // Chuỗi truy vấn khi thực hiện tìm kiếm
      let querySearch = "";
      if (search) {
        querySearch = `&search=${search}`;
      }

      if (page && parseInt(page) > 1) {
        this.$router.push(
          `/employee?page=${parseInt(page) - 1}&limit=${limit}${querySearch}`
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
      let { page, limit, search } = this.$route.query;
      if (search) {
        // Xử lí khi có query search
        if (page) {
          // Kiểm tra page hiện tại có vượt qua số tổng số page
          if (page < this.recordData.TotalPageByCondition) {
            this.$router.push(
              `/employee?page=${
                parseInt(page) + 1
              }&limit=${limit}&search=${search}`
            );
          }
        } else {
          page = 1;
          if (page < this.recordData.TotalPageByCondition) {
            this.$router.push(
              `/employee?page=${parseInt(page) + 1}&limit=${
                this.selectValueOption
              }&search=${search}`
            );
          }
        }
      } else {
        if (page) {
          if (page < this.recordData.TotalPage) {
            this.$router.push(
              `/employee?page=${parseInt(page) + 1}&limit=${limit}`
            );
          }
        } else {
          page = 1;
          this.$router.push(
            `/employee?page=${parseInt(page) + 1}&limit=${
              this.selectValueOption
            }`
          );
        }
      }
    },

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
      this.comboboxValue = newVal;
    },

    defaultValueCombobox() {
      let value = this.optionsNumberRecord[2];
      const { limit } = this.$route.query;
      console.log("Limit: ", limit);
      if (limit) {
        switch (int.parseInt(limit)) {
          case 10:
            value = { ...this.defaultValue, id: 1, value: 10 };
            break;
          case 15:
            value = { ...this.defaultValue, id: 2, value: 15 };
            break;
          case 20:
            value = { ...this.defaultValue, id: 3, value: 20 };
            break;
          case 30:
            value = { ...this.defaultValue, id: 4, value: 30 };
            break;
        }
      }
      console.log("Value default: ", this.defaultValue);
      this.defaultValue = value;
      this.handleComboboxValueUpdate(value.value);
      // this.$refs.comboboxRef.handleSetValueInput(value);
      // return value;
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
        this.$route.query.search
          ? this.totalRecordsSearch || this.recordData.TotalRecordsResult // this.totalRecordsSearch
          : this.handleFormatNumber(this.recordData.TotalRecord)
      }}
      bản ghi
    </div>
    <div class="main__footer-paging">
      <div class="main__footer-paging-total-record-on-page">
        <p class="number-records-text">Số bản ghi/trang:</p>

        <MISACombobox
          ref="comboboxRef"
          :customClass="this.handleCustomClassCombobox()"
          placeholderInput="20"
          v-model="this.comboboxValue"
          :listItemValue="this.optionsNumberRecord"
          :defaultValueInput="this.optionsNumberRecord[2]"
          :handleChooseRecord="this.handleChooseQualityRecord"
        ></MISACombobox>
        <span class="main__footer-quality-record">
          {{ this.$route.query.page ? this.recordData.CurrentPage : 1 }}/{{
            this.$route.query.search // Khi có giá trị search thì thực hiện lấy tổng số page theo điều kiện tìm ngược lại lấy toàn bộ page
              ? this.recordData.TotalPageByCondition
              : this.recordData.TotalPage
          }}
          bản ghi
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
