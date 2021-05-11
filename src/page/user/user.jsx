import React, { Component } from 'react'
import {Menu,Dropdown,Avatar } from "antd"
import { UserOutlined } from '@ant-design/icons';




export default class User extends Component {



    render() {
        // 用户功能
        const menu = (
            <Menu>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                  退出
                </a>
              </Menu.Item>
            </Menu>
          );

        return (
            <>
                <Dropdown overlay={menu}>
                    <Avatar style={{cursor:"pointer"}} icon={<UserOutlined/>} size="large"></Avatar>
                    
                </Dropdown>
                </>
            )
    }
}