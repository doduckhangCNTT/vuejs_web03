import MISAEnum from "./MISAEnum";

const MISAResource = {
  textError: {
    textErrorRequired: "Vui lòng nhập thông tin!",
  },

  textCRUD: {
    textDeleteEmployee: "Bạn có chắc muốn xóa nhân viên đã chọn không?",
    textAddEmployee: "Thêm thông tin nhân viên",
    textEditEmployee: "Sửa thông tin nhân viên",
  },

  Delete: {
    deleteManyInfo: "Bạn có muốn xóa các nhân viên đó?",
    deleteOneInfo: "Bạn có muốn xóa nhân viên đó?",
  },

  Toast: {
    AddEntity: {
      AddSuccess: {
        status: MISAEnum.HttpStatusCode.Success,
        msg: "Đã thêm!",
      },
    },
    UpdateEntity: {
      UpdateSuccess: {
        status: MISAEnum.HttpStatusCode.Success,
        msg: "Đã cập nhật!",
      },
    },
    DeleteEntity: {
      DeleteSuccess: {
        status: MISAEnum.HttpStatusCode.Success,
        msg: "Đã xóa!",
      },
    },
  },

  ButtonText: {
    dialogQuestion: {
      title: "Thông báo",
      btnCancel: "Không",
      btnAgree: "Có, xóa nhân viên",
    },
    formInfoEmployee: {
      btnCancel: "Hủy",
      btnSave: "Cất",
      btnSaveAdd: "Cất và Thêm",
    },
  },

  Navbar: {
    HomeNav: {
      Overview: {
        title: "Tổng quan",
        tooltip: "Tổng quan",
      },
      Employee: {
        title: "Nhân viên",
        tooltip: "Nhân viên",
      },
      Customer: {
        title: "Khách hàng",
        tooltip: "Khách hàng",
      },
      Appoint: {
        title: "Bổ nhiệm",
        tooltip: "Bổ nhiệm",
      },
      File: {
        title: "Hồ sơ",
        tooltip: "Hồ sơ",
      },
      Bonus: {
        title: "Khen thưởng",
        tooltip: "Khen thưởng",
      },
      Problem: {
        title: "Sự cố",
        tooltip: "Sự cố",
      },
      Zoning: {
        title: "Quy hoạch",
        tooltip: "Quy hoạch",
      },
      Report: {
        title: "Báo cáo",
        tooltip: "Báo cáo",
      },
    },
  },

  EmployeeHome: {
    title: {
      tableName: "Nhân viên",
    },
    qualityRecordText: "Số bản ghi đã chọn:",
    button: {
      btnAddNewEmployee: "Thêm mới nhân viên",
      btnDeleteCheckedEmployee: "Xóa bản ghi đã chọn",
      btnRefresh: {
        tooltip: "Làm mới",
      },
      btnSearch: {
        tooltip: "Tìm kiếm",
      },
      btnExportExcel: {
        tooltip: "Xuất khẩu dữ liệu",
      },
    },
    input: {
      searchPlaceholder: "Tìm theo mã, tên nhân viên",
    },
    listItemCompany: [
      { id: 1, value: "CÔNG TY TNHH SẢN XUẤT - THƯƠNG MẠI - DICH VỤ QUI PHÚC" },
      { id: 2, value: "Công ty TNHH MTV 17" },
      {
        id: 3,
        value: "Công ty Cổ phần Máy tính - Truyền thông - Điều khiển 3C",
      },
      { id: 4, value: "Công ty TNHH MTV 492" },
      { id: 5, value: "Công ty cổ phần Nhựa An Phát Xanh" },
      { id: 6, value: "CÔNG TY CỔ PHẦN ABG HÀ NỘI" },
    ],
  },

  EmployeeForm: {
    labelForm: {
      employeeCode: {
        text: "Mã",
        tooltip: "Mã nhân viên",
      },
      employeeName: {
        text: "Tên",
        tooltip: "Tên nhân viên",
      },
      unit: {
        text: "Đơn vị",
        tooltip: "Đơn vị",
      },
      title: {
        text: "Chức danh",
        tooltip: "",
      },
      dateOfBirth: {
        text: "Ngày sinh",
        tooltip: "",
      },
      gender: {
        text: "Giới tính",
        tooltip: "",
      },
      genderMale: {
        text: "Nam",
        tooltip: "",
      },
      genderFemale: {
        text: "Nữ",
        tooltip: "",
      },
      genderOther: {
        text: "Khác",
        tooltip: "",
      },
      identifyNumber: {
        text: "Số CMND",
        tooltip: "Chứng minh thư nhân dân",
      },
      dateRange: {
        text: "Ngày cấp",
        tooltip: "",
      },
      issuedBy: {
        text: "Nơi cấp",
        tooltip: "",
      },
      address: { text: "Địa chỉ", tooltip: "" },
      telephoneNumber: { text: "ĐT di động", tooltip: "Điện thoại di động" },
      landlinePhone: { text: "ĐT cố định", tooltip: "Điện thoại cố định" },
      email: { text: "Email", tooltip: "" },
      bankAccount: {
        text: "Tài khoản ngân hàng",
        tooltip: "",
      },
      bankName: { text: "Tên ngân hàng", tooltip: "" },
      branch: { text: "Chi nhánh", tooltip: "" },
    },
  },

  EmployeeList: {
    thead: {
      employeeCode: {
        text: "MÃ NHÂN VIÊN",
        tooltip: "",
      },
      employeeName: {
        text: "TÊN NHÂN VIÊN",
        tooltip: "Tên nhân viên",
      },
      dateOfBirth: {
        text: "NGÀY SINH",
        tooltip: "",
      },
      gender: {
        text: "GIỚI TÍNH",
        tooltip: "",
      },
      identifyNumber: {
        text: "Số CMND",
        tooltip: "Chứng minh thư nhân dân",
      },
      unit: {
        text: "ĐƠN VỊ",
        tooltip: "Đơn vị",
      },
      title: {
        text: "CHỨC DANH",
        tooltip: "",
      },
      bankAccount: {
        text: "SỐ TÀI KHOẢN",
        tooltip: "",
      },
      bankName: { text: "TÊN NGÂN HÀNG", tooltip: "" },
      branch: { text: "CHI NHÁNH TÀI KHOẢN NGÂN HÀNG", tooltip: "" },
    },
    btnEdit: {
      tooltip: "Chỉnh sửa",
    },
    btnOption: {
      tooltip: "Lựa chọn",
      btnDuplicate: {
        text: "Nhân bản",
      },
      btnDelete: {
        text: "Xóa",
      },
    },
  },
};

export default MISAResource;
