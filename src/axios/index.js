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


// 查询用户操作手册
export const getAllWords=()=>axios.get("/user/word")


// 查询用户部门 分类管理

export const getAllUserDepart=()=>axios.get("/user/departs")

// 查询部门用户

export const getAllDepartUser=(name)=>axios.get("/depart/user",{params:{name}})


// 权限控制

export const getAllOuthor=(depart,author)=>axios.get("/user/oathor",{params:{depart,author}})

// 获取所有菜单项目

export const getAllCaidan=()=>axios.get('/depart/caidan')

// 查询部门所对应的权限

export const getAllAuthor=(depart)=>axios.get("/user2oathor",{params:{depart}})


// 更新部门权限

export const setAllOauthor=(depart,oauthor)=>axios.get("/updateOathor",{params:{depart,oauthor}})

// 删除部门权限

export const deleteOauthor=(depart)=>axios.get("/deleteOauthor",{params:{depart}})


// 添加用户
export const addUserDepart=(data)=>axios.post("/addUserDepart",data)