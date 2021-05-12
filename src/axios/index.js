import axios from "./axios"

// 请求验证码

export const getYzm=()=>axios.get("/yzm")


// 用户登录 

export const toLogin=({yzm,password,username})=>axios.post("/user/login",{yzm,password,username})

// 自动登录

export const toAutoLogin=(token)=>axios.post("/user/auto",{token})