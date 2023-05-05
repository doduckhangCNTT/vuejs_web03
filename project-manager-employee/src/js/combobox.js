// Variables
let dropdown;
let listOfOptions;
let body;

window.onload = function () {
  initEvents();
};

function initEvents() {
  dropdown = document.querySelectorAll(".dropdown");
  // input = document.querySelectorAll("input");
  listOfOptions = document.querySelectorAll(".option");
  body = document.body;

  // Event Listeners
  body.addEventListener("click", closeDropdownFromOutside);

  listOfOptions.forEach((option) => {
    option.addEventListener("click", selectOption);
  });

  dropdown.forEach((element) => {
    element.addEventListener("click", handleDropdownClick);
  });
}

// Functions
/**
 * Params:
 *  + event: sự kiện hiện tại trên dropdown tương ứng
 * Des: Xử lí trên dropdown tương ứng, sau đó bật tắt options
 * Author: DDKhang
 * CreateAt: 18/4/2023
 * ModifierAt: 18/4/2023
 */
function handleDropdownClick(event) {
  // Lấy dropdown tương ứng với sự kiện click
  const dropdown = event.currentTarget;
  // Gọi hàm toggleDropdown với dropdown tương ứng
  toggleDropdown(event, dropdown);
}

/**
 * Params:
 *  + event: sự kiện hiện tại trên option tương ứng
 *  + dropdown: là thẻ dropdown tương ứng
 * Des: bật tắt options
 * Author: DDKhang
 * CreateAt: 18/4/2023
 * ModifierAt: 18/4/2023
 */
const toggleDropdown = (event, dropdown) => {
  event.stopPropagation(); // Ngăn sự kiện không nổi bột ra ngoài, mà chỉ xảy ra sự kiện chỉ trên thẻ option được bấm
  dropdown.classList.toggle("opened");
};

const selectOption = (event) => {
  // Lấy nội dung của option hiện tại
  const selectedOption = event.currentTarget.textContent;
  // Truy vấn từ option đó ra bên ngoài thẻ cha gần nhất chứa nó mà có class ".dropdown", và truy vấn đến
  // thẻ input, sau đó gán giá trị
  const input = event.currentTarget.closest(".dropdown").querySelector("input");
  input.value = selectedOption;
};

const closeDropdownFromOutside = () => {
  for (let i = 0; i < dropdown.length; i++) {
    if (dropdown[i].classList.contains("opened")) {
      dropdown[i].classList.remove("opened");
    }
  }
};
