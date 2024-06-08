// import axios from "axios";
import axios from "./axios";

export const fetchAllUser = () => {
  return axios.get("api/users?page=1");
};
