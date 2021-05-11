import React, { Component } from 'react'
import { Menu } from "antd"
import { UserOutlined } from '@ant-design/icons';
import PubSub from "pubsub-js"
const { SubMenu } = Menu;




export default class Category extends Component {



    render() {
        return (
            <Menu theme="dark" selectedKeys={['sub1']} mode="inline" defaultOpenKeys={['gonzuo']}>
                <SubMenu key="gonzuo" icon={<UserOutlined />} defaultSelectedKeys={['3']} title="工作报表">
                    <Menu.Item key="bjprice" onClick={()=>{
                        PubSub.publish("tiaozhuan","/main/bjprice")

                    }}>比价节控报表</Menu.Item>

                </SubMenu>
            </Menu>

        )
    }
}