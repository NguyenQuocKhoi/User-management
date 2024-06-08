// import axios from "axios";
import axios from "./customize-axios"

export const fetchAllUser = (page) => {
  return axios.get(`/api/users?page=${page}`);
};
