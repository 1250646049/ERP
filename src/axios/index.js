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

// 查询不需要授权的地址

export const selectNoneUrl=()=>axios.get("/selectNoneOauth")


// 查询所有授权菜单

export const selectAllOath=()=>axios.get("/selectAllOath")

// 更新菜单授权

export const updateOath=(id,contro)=>axios.get("/alterOath",{params:{id,contro}})

// 添加一条路由授权

export const addOnePath=(data)=>axios.post("/addOnePath",data)

// 添加一条提醒内容
export const addTixing=(data)=>axios.post("/addTixing",data)
// 根据用户username查询数据


export const selectTixing=(username)=>axios.get("/selectTixing",{params:{username}})


// 获取今日播报内容

export const getBobao=()=>axios.get("/getZixun")


//查询是否要显示每日播报

// 
// 
// 
export const selectBobao=(username)=>axios.get("/selectBobao",{params:{username}})


// 添加阅读播报信息

export const addBobao=(username)=>axios.post("/addBobao",{username})


// 获取乐迈往来信息

export const getWanglai=(type,time)=>axios.get("/getWanglai",{params:{type,time}})

// 导出乐迈往来表信息

export const exportWanglai=(type,time)=>axios.get("/getWanglai",{params:{type,time}})

// 查询应收货款到货

export const selectYsk=(number)=>axios.get("/selectYsk",{params:{number}})

// 更新收货款

// export const alterYinshou=(data)=>axios.post("/alterYinshou",data)


// 添加收款记录

export const addYinshou=(data)=>axios.post("/addYinshou",data)

// 查询一些记录

export const selectAllYinshou=(AutoId)=>axios.get("/selectShoukuan2AutoId",{params:{AutoId}})

// 修改一条记录

export const alterYinshou=(data)=>axios.post("/alterYinshou",data) 