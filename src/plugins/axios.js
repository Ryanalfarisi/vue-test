import axios from "axios";
import Vue from "vue";

const devInstance = createInstance("https://todo.api.devcode.gethired.id/");

function createInstance(baseURL) {
  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });
}
export default {
  install() {
    Vue.prototype.$http = devInstance;
  }
};
