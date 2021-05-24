import Io from "socket.io-client"
// 配置 socketIo跨域访问
export default Io("http://localhost:3009",{transports:['websocket','xhr-polling','jsonp-polling']}) 