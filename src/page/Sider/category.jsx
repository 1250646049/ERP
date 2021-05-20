import React, { Component } from 'react'
import { Menu } from "antd"
import { UserOutlined,DribbbleSquareOutlined,GithubOutlined } from '@ant-design/icons';
import PubSub from "pubsub-js"
const { SubMenu } = Menu;




export default class Category extends Component {



    render() {
        return (
            <Menu theme="dark"  mode="inline" >
                {/* 用户结构 */}
                <SubMenu key="ptguanli" icon={<GithubOutlined />}  title="平台管理">
                    <Menu.Item key="userMange" onClick={()=>{
                        PubSub.publish("tiaozhuan",{
                            path:"/main/userMange",
                            author:"userMange"
                        })

                    }}>用户管理</Menu.Item>
 
                </SubMenu>           

                <SubMenu key="gonzuo" icon={<UserOutlined />}  title="工作功能">
                    <Menu.Item key="bjprice" onClick={()=>{
                        PubSub.publish("tiaozhuan",{
                            path:"/main/bjprice",
                            author:'bjprice'
                        })

                    }}>比价节控功能</Menu.Item>
 
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