import axios from "./axios"

// 请求验证码

export const getYzm=()=>axios.get("/yzm")


// 用户登录 

export const toLogin=({yzm,password,username})=>axios.post("/user/login",{yzm,password,username})

// 自动登录

export const toAutoLogin=(token)=>axios.post("/user/auto",{token})

// 物流到货预测
export const getEmail=()=>axios.get("/wuliu/getEmail")


// 修改物流到货预测
export const setEmail=(data)=>axios.post("/wuliu/setEmail",data)


// 比价查询

export const getAllBJPrice=(page,number)=>axios.get("/price/bijia",{params:{page,number}})

// 比价筛选

export const getPriceLike=(type,name)=>axios.get("/price/likeSearch",{params:{type,name}})