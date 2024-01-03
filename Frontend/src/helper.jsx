import axios from "axios";

export const authFetch = axios.create({ baseURL: "http://127.0.0.1:8000/" });

// axios.defaults.baseURL = "http://127.0.0.1:8000/";
const der = localStorage.getItem("authUser") || [];
const token = localStorage.getItem("authUser")
  ? JSON.parse(localStorage.getItem("authUser"))
  : null;
if (token)
  authFetch.defaults.headers.common["Authorization"] = "Bearer " + token;

// intercepting to capture errors
authFetch.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);
