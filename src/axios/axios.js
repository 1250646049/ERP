import axios from "axios"
import qs from "querystring"

const instance= axios.create({

})


// 请求拦截器
instance.interceptors.request.use(config=>{
    config['data']=qs.stringify(config['data'])

    return config;
})

// 响应拦截器

instance.interceptors.response.use(resp=>{ 
    
    return resp.data;

},error=>{
    return new Promise(()=>{})
})

export default instance;