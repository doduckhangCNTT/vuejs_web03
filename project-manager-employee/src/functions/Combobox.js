export function showCombobox() {
  let dropdown = document.querySelectorAll(".dropdown");
  let listOfOptions = document.querySelectorAll(".option");
  let body = document.body;

  // Event Listeners
  body.addEventListener("click", closeDropdownFromOutside);

  listOfOptions.forEach((option) => {
    option.addEventListener("click", selectOption);
  });

  dropdown.forEach((element) => {
    element.addEventListener("click", handleDropdownClick);
  });
}
