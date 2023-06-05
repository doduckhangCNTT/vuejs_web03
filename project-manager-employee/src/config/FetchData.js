import axios from "axios";
import BaseUrl from "./BaseUrl";
import { CatchError } from "../functions/CatchError";
import MISAEnum from "../js/MISAEnum";

/**
 *
 * @param {*} url - Đường dẫn api
 * @returns dữ liệu phản hồi từ server
 * - Des: Thực hiện lấy dữ liệu phản hồi từ server
 * - CreatedBy: DDKhang (27/5/2023)
 */
export async function getData(url) {
  try {
    const res = await axios.get(url);
    return res;
  } catch (error) {
    CatchError(error);
  }
}

/**
 *
 * @param {*} url - Đường dẫn api
 * @param {*} post  - Dữ liệu muốn thêm
 * @returns Thông tin phản hồi từ server (số bản ghi được thêm)
 * - Des: Thực hiện thêm thông tin
 * - CreatedBy: DDKhang (27/5/2023)
 */
export async function postData(url, post) {
  try {
    const res = await axios.post(url, post);
    return res;
  } catch (error) {
    CatchError(error);
  }
}

/**
 * @param {} entityName - tên thực thể
 * @returns AxiosResponse<any, any>
 * - Des: Thực hiện lấy mã code mới cho thực thể
 * - CreateBy: DDKhang (27/5/2023)
 */
export async function getNewCode(entityName) {
  const res = await getData(`${BaseUrl}/${entityName}/NewCode`);
  return res;
}

/**
 * @param {*} entityName - Tên thực thể
 * @param {*} id - Mã thực thể
 * @returns AxiosResponse<any, any>
 * - Des: Thực hiện lấy thông tin thực thể theo mã thực thể (id)
 */
export async function getDataById(entityName, id) {
  try {
    const res = await getData(`${BaseUrl}/${entityName}/${id}`);
    return res;
  } catch (error) {
    CatchError(err);
  }
}

/**
 * @param {*} entityId - Mã thực thể
 * @param {*} entityName - Tên thực thể
 * @param {*} entity  - Thông tin thực thể mới
 * - Des: Thực hiện cập nhật thông tin entity
 * - Created By: DDKhang (27/5/2023)
 */
export async function updateInfoEntity(entityId, entityName, entity) {
  axios
    .put(`${BaseUrl}/${entityName}/${entityId}`, entity)
    .then((res) => {
      return {
        response: res,
        status: MISAEnum.HttpStatusCode.Success,
      };
    })
    .catch((err) => {
      CatchError(err);
    });
}

/**
 * @param {*} entityName - Tên thực thể
 * @param {*} entity  - Thông tin thực thể mới
 * - Des: Thực hiện thêm thông tin entity
 * - Created By: DDKhang (27/5/2023)
 */
export async function postInfoEntity(entityName, entity) {
  axios
    .post(`${BaseUrl}/${entityName}`, entity)
    .then((res) => {
      return {
        response: res,
        status: this.$MISAEnum.HttpStatusCode.Success,
      };
    })
    .catch((err) => {
      CatchError(err);
    });
}

/**
 *
 * @param {*} entityName - Tên thực thể
 * @param {Object} entityFilter {pageSize, pageNumber, valueFilter} - Thông tin muốn lọc (pageSize, pageNumber, entityName/Code)
 * @returns
 */
export async function filterInfoEntity(entityName, entityFilter = null) {
  // Chuỗi truy vấn
  let query = "";
  if (entityFilter !== null) {
    const { pageSize, pageNumber, valueFilter } = entityFilter;
    if (valueFilter !== null) {
      query = `pageSize=${pageSize}&pageNumber=${pageNumber}&entityFilter=${valueFilter}`;
    } else {
      query = `pageSize=${pageSize}&pageNumber=${pageNumber}`;
    }
  }

  const res = await getData(
    `${BaseUrl}/${entityName}/filter?${query ? query : ""}`
  );
  return res;
}

/**
 *
 * @param {*} entityName - Tên thực thể
 * @param {*} listEntityId - Danh sách các id thực thể muốn xóa theo dạng "string" ngăn cách = ","
 * - Des: Thực hiện xóa các thông tin entity
 * - Created By: DDKhang (27/5/2023)
 */
export async function deleteMultiple(entityName, listEntityId) {
  axios
    .delete(
      `${BaseUrl}/${entityName}/delete-multiple?listEntityId=${listEntityId}`
    )
    .then((res) => {
      return {
        response: res,
        status: MISAEnum.HttpStatusCode.Success,
      };
    })
    .catch((err) => {
      CatchError(err);
    });
}
