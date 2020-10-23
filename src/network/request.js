import  axios from 'axios'
import store from "../store";
import router from "../router/index"
export default function request(config) {


    const instance=axios.create({
      baseURL: 'http://192.168.43.2:8181',
      timeout: 3000,
    })

      return instance(config)



}
