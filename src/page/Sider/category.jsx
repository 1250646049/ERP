import React, { Component } from 'react'
import { Menu } from "antd"
import { UserOutlined,DribbbleSquareOutlined,GithubOutlined,BankOutlined} from '@ant-design/icons';
import PubSub from "pubsub-js"
const { SubMenu } = Menu;




export default class Category extends Component {



    render() {
        return (
            <Menu theme="dark"  mode="inline"  >
                {/* 首页 */}
                <Menu.Item
                 onClick={
                    ()=>{
                        PubSub.publish("tiaozhuan",{
                            path:"/main/index",
                            author:"index"
                        })

                    }

                 }
                key="index"
                icon={<BankOutlined />}
                >首页</Menu.Item>

                {/* 用户结构 */}
                <SubMenu key="ptguanli" icon={<GithubOutlined />}  title="平台管理">
                    
                <Menu.Item key="setting" onClick={()=>{
                        PubSub.publish("tiaozhuan",{
                            path:"/main/setting",
                            author:"setting"
                        })

                    }}>系统设置</Menu.Item>


                    <Menu.Item key="userMange" onClick={()=>{
                        PubSub.publish("tiaozhuan",{
                            path:"/main/userMange",
                            author:"userMange"
                        })

                    }}>用户管理</Menu.Item>

                <Menu.Item key="luyou" onClick={()=>{
                        PubSub.publish("tiaozhuan",{
                            path:"/main/luyou",
                            author:"luyou"
                        })

                    }}>路由授权管理</Menu.Item>

                </SubMenu>           

                <SubMenu key="gonzuo" icon={<UserOutlined />}  title="比价节控">
                    <Menu.Item key="bjprice" onClick={()=>{
                        PubSub.publish("tiaozhuan",{
                            path:"/main/bjprice",
                            author:'bjprice'
                        })

                    }}>比价节控检索</Menu.Item>
 
                </SubMenu>

                <SubMenu key="wuliudaohuo" icon={<DribbbleSquareOutlined />}  title="物流到货">
                    <Menu.Item key="3" onClick={()=>{
                        PubSub.publish("tiaozhuan",{
                            path:"/main/wuliudaohuo",
                            author:'wuliudaohuo'
                        })
                        
                    }}>  物流到货发送</Menu.Item>

                </SubMenu>
            </Menu>

        )
    }
}