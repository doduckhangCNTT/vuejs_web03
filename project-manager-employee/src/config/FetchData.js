import axios from "axios";

export async function getData(url) {
  const res = await axios.get(url);
  return res;
}

export async function postData(url, post) {
  const res = await axios.post(url, post);
  return res;
}
