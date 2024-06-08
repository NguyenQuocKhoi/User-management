import axios from "axios";

export const fetchAllUser = () => {
  return axios.get("https://reqres.in/api/users?page=1");
};
