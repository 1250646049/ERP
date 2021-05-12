import React, { Component } from 'react'
import { Menu, Dropdown, Avatar } from "antd"
import { UserOutlined } from '@ant-design/icons';




export default class User extends Component {
  state = {
    user: {}
  }
  componentDidMount() {
    this.flag=true
    setTimeout(() => {
      this.flag&&this.setState({
        user: this.props['user']
      })

    }, 500)

  }
  componentWillUnmount(){
    this.flag=false
  }
  render() {
    const { user } = this.state
    // 用户功能
    const menu = (
      <Menu>
        <Menu.Item>
          <span>{user && user['name']}</span>
        </Menu.Item>
        <Menu.Item>
          <span onClick={()=>{
             localStorage.clear("_token")
              window.location.reload()
          }}>退出</span>
        </Menu.Item>

      </Menu>
    );

    return (
      <>
        <Dropdown overlay={menu}>

          <Avatar style={{ cursor: "pointer" }} icon={<UserOutlined />} size="large"></Avatar>

        </Dropdown>
      </>
    )
  }
}