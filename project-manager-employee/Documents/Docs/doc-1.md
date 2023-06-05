# Tài liệu quản lí employee

## 1.Xử lí nút Delete nhiều employee
- Khi bấm vào nút `Delete` thì thực hiện hiển thị Dialog xử lí trong (**handleDeleteEmployees()**)
- Khi nhấn vào nút "Có" hoặc "Không" trong dialog thì (**MISADialogQuestion.vue**):
    - Thực hiện lấy trạng thái khi bấm (`true || false`)
    - Thực hiện đóng dialog đó 
        -> Thực hiện bằng cách phát ra 1 tín hiệu đóng dialog
        
        `this.$msemitter.emit("closeDialogQuestion", status);`
    - Việc nhận sẽ được thực hiện trong `App.vue` (chỗ hiển thị các dialog)
    - Đồng thời nhận sự kiện `emitter` đó trong cả `EmployeeHome.vue` để lấy trạng thái khi bấm vào nút nào trên dialog đó
        - Việc lắng nghe trong hook `Created() { }`
        - Xử lí trong `methods` (**statusDeleteEmployee()**) thực hiện việc xóa các employee trong đây khi `status: true`
        <details>
        <summary>Minh họa</summary>
        
        ![](Images/img_1.png)
        </details>
        
## 2.Xử lí "TabIndex"
- Thực hiện gắn các thẻ `INPUT || BUTTON` các `ref="..."`
- Thực hiện xử lí trong `mounted` hook khi mà toàn bộ DOM đã được render
- Thực hiện tham chiếu đến tất cả các thẻ `INPUT || BUTTON` để có thể bắt các sự kiện trên đó
    <details>
    <summary> -- Minh họa -- </summary>
    
    ```js
        // =================== Handel Tab - Start =======================
        // Lấy toàn bộ những thẻ có thuộc tính "Ref"
        const tagsContainRefAttr = Object.values(this.$refs);
        const inputs = [];
        // Kiểm tra những thẻ khác có phải là thẻ INPUT hoặc BUTTON hay không
        tagsContainRefAttr.forEach((input) => {
          if (input.nodeName === "INPUT" || input.nodeName === "BUTTON") {
            inputs.push(input);
          }
        });
        // Thêm xử lý sự kiện khi nhấn phím Tab
        inputs.forEach((input, index) => {
          input.addEventListener("keydown", (event) => {
            if (
              event.key === "Tab" &&
              !event.shiftKey &&
              index === inputs.length - 1
            ) {
              // Nếu đang ở input cuối cùng và nhấn phím Tab, chuyển về input đầu tiên
              event.preventDefault();
              inputs[0].focus();
            }
          });
        });
        // Thêm xử lý sự kiện khi nhả phím Tab
        inputs.forEach((input, index) => {
          input.addEventListener("keyup", (event) => {
            if (event.key === "Tab" && event.shiftKey && index === 0) {
              // Nếu đang ở input đầu tiên và nhấn Shift + Tab, chuyển về input cuối cùng
              event.preventDefault();
              inputs[inputs.length - 1].focus();
            }
          });
        });
        // =================== Handel Tab - End =======================
    ```
    </details>
    
## 3. Thực hiện "Phân trang"
- Xử lí trong (`EmployeeHomeFooter.vue`, `EmployeeList.vue`)
- Xử lí phân trang thông quan Url bằng cách tăng giá trị `page`, `limit`
- Để dữ liệu có thể thay đổi liên tục khi `Url` thay đổi theo `page`, `limit` thì thực hiện theo dõi `$route.query` trong `watch() {}` hook trong `EmployeeList.vue` và xử lí sự thay đổi để lấy dữ liệu tương ứng qua function `fetchDataByPageAndLimit()`

## Khi thực hiện truyền giá trị cho combobox
- Vấn đề: Khi truyền từ `EmployeeForm.vue` -> `MISACombobox.vue` thì khi hiển thị combobox trên form thì không hiển thị dữ liệu "Phòng ban" từ lấy ra bằng cách gọi api.
- Lí do: Do việc bất đồng bộ do việc gọi dữ liệu qua api
- Cách xử lí:
    + Trong `MISACombobox.vue` thì trong hàm `watch` thì thực hiện theo dõi dữ `listItemValue` (chứa dữ liệu lấy từ api) thì khi dữ liệu được lấy thì cập nhật lại và hiển thị dữ liệu đó lên giao diện
    
    
## Thực hiện "Button Nhân bản"
- **Ý tưởng**: Khi nhấn nút nhân bản thì cần đẩy toàn bộ thông tin bản ghi muốn nhân bản đó lên và thực hiện `thêm` thông tin đó
- **Cách làm**: 
    + B1: Thực hiện giống việc update chỉ khác là gọi đến đường dẫn url kiểu khác
        > + update: "localhost:3000/employee/123-234-abc-a12"  
        > + duplicate: "localhost:3000/employee/123-234-abc-a12?duplicate=true"
    + B2: Thực hiện trong `computed` để tính toán xử lí các hành vi (AddNew, Edit, Duplicate)
    + B3: Do chỉ khác nhau chỗ query giá trị của employeeId đó vẫn sẽ được map vào form như update
        + Thực hiện cập nhật mã nhân viên mới bằng cách gọi api lấy mã nhân viên mới và cập nhật
    + Khi bấm nút `Cất và Thêm` thì cần xử lí các hành vi (AddNew, Edit, Duplicate) thực hiện 
        + Sau đó cập nhật thông tin mã nhân viên mới để cho form sau 
        + Chuyển đường dẫn url sang đường dẫn tương ứng với Add || Duplicate 