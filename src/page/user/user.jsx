import React, { Component } from 'react'
import { Menu, Dropdown, Avatar } from "antd"
import { UserOutlined } from '@ant-design/icons';
import PubSub from 'pubsub-js';




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
  // 下载
  onDownWord=()=>{
    PubSub.publish("downWord")
  }
  render() {
    const { user } = this.state
    // 用户功能
    const menu = (
      <Menu>
        <Menu.Item>
          <div style={{textAlign:'center'}}>{user && user['name']}</div>
        </Menu.Item>
        {/* 操作手册下载 */}
        <Menu.Item>
          <div style={{textAlign:'center'}} onClick={this.onDownWord}>操作手册下载</div>
        </Menu.Item>
        <Menu.Item>
          <div style={{textAlign:'center'}} onClick={()=>{
             localStorage.clear("_token")
              window.location.reload()
          }}>退出登录</div>
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