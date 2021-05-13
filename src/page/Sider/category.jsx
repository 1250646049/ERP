import React, { Component } from 'react'
import { Menu } from "antd"
import { UserOutlined } from '@ant-design/icons';
import PubSub from "pubsub-js"
const { SubMenu } = Menu;




export default class Category extends Component {



    render() {
        return (
            <Menu theme="dark" selectedKeys={['sub1']} mode="inline" defaultOpenKeys={['gonzuo']}>
                <SubMenu key="gonzuo" icon={<UserOutlined />} defaultSelectedKeys={['3']} title="工作功能">
                    <Menu.Item key="bjprice" onClick={()=>{
                        PubSub.publish("tiaozhuan","/main/bjprice")

                    }}>比价节控功能</Menu.Item>
 
                </SubMenu>

                <SubMenu key="wuliudaohuo" icon={<UserOutlined />} defaultSelectedKeys={['3']} title="物流到货">
                    <Menu.Item key="3" onClick={()=>{
                        PubSub.publish("tiaozhuan","/main/wuliudaohuo")
                        
                    }}>物流到货发送</Menu.Item>

                </SubMenu>
            </Menu>

        )
    }
}