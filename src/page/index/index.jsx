import React, { Component } from "react"
import { Card, Col, Row, Calendar, Tabs, Tag, Badge, Input, Button, message, Tooltip } from "antd"

import "./css/index.css"
import { connect } from "react-redux"
import Man from "../../assert/img/man_wev8.png"
import Wman from "../../assert/img/women_wev8.png"
import Io from "socket.io-client"
// 配置 socketIo
const { TabPane } = Tabs

class Index extends Component {
    socket = Io("/")
    state = {
        user: {},

        userList: {},
        messageList: []
    }

    componentDidMount() {
        this.flag=true
        this.initUser()

    }

    initUser = () => {
        // 设置用户
        setTimeout(() => {
            this.flag&&this.setState({

                user: this.props.user
            }, () => {
                this.initSocket()
            })

        }, 500)


    } 
    // 初始化 socketIo
    initSocket = () => {
        this.socket.emit("login", this.state.user)
        this.socket.on("userList", data => {

            this.flag&&this.setState({
                userList: data

            })
        })

        // 监听公告消息队列
        this.socket.on("message", (list) => {
            this.flag&&this.setState({
                messageList: list
            })

        })

    }
    // 发送内容
    onPublish = () => {
        const { value } = this.MessageInput.state
        if (!value) return message.error("请先补充要发送的公告内容！")
        this.socket.emit("publish", value)
    }

    componentWillUnmount(){
        this.flag=false
    }
    render() {
        const { user, userList, messageList } = this.state

        return (
            <div className="index">
                {/* 用户信息 */}
                <Row

                >
                    <Col span={8}>
                        <Card
                            className="user"
                            hoverable={true}
                        >
                            <div className="body">
                                <div className="avater">
                                    <img style={{ width: 120, height: 120, borderRadius: '100%' }} src={(user && user['sex']) ? Man : Wman} alt="666" />

                                </div>
                                <div className="userDetail">
                                    <h3>{user && user['name']}</h3>
                                    <h5>{user && user['depart']}</h5>

                                </div>
                            </div>

                            <div className="other">
                                <div>所属部门: <span>{user && user['depart']}</span> </div>
                                <div>用户工号： <span>{user && user['username']}</span></div>
                            </div>
                        </Card>
                        <div className="message" style={{ marginTop: 20 }}>
                            <Card

                            >
                                <div className="top">
                                    <Tabs

                                    >
                                        <TabPane tab={<Badge count={messageList.length} size="small"><span> 系统通知</span></Badge>} key="1"
                                            style={{ maxHeight: 428, overflowY: "scroll" }}

                                        >
                                            <ul>
                                                {messageList && messageList.map((item, index) => {

                                                    return (
                                                        <li key={index} className="animate__animated animate__backInLeft">
                                                            <Tag key={index} color="red">系统通知:</Tag> <Tooltip title={item}><div className="content" style={{ display: "inline-block", height: 40, width: 350, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", boxSizing: "border-box", paddingTop: 22 }}>{item}</div></Tooltip>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                            <div className="public" style={{display:user['auth']?'block':'none'}}>
                                                <Input placeholder="请输入要发表的系统公告:" style={{ width: '85%' }} ref={input => this.MessageInput = input}></Input> <Button onClick={this.onPublish} type="primary">发布</Button>
                                            </div>
                                        </TabPane>
                                        <TabPane tab="@ 与我相关" key="2">@ 与我相关</TabPane>
                                        <TabPane tab={
                                            <Badge size="small" count={userList ? Object.values(userList).length : 0} >
                                                <span>在线人员</span>
                                            </Badge>

                                        } key="3">

                                            {userList && Object.keys(userList).map((item, index) => {

                                                return (
                                                    <div key={index} style={{ display: "flex", marginBottom: 20 }}>
                                                        <Badge count={1} dot={true} color="green">
                                                            <img src={item['sex']?Man:Wman} alt="" style={{ width: 50, height: 50, borderRadius: '100%' }} />
                                                        </Badge>
                                                        <div className="detail" style={{ margin: "-12px 15px" }}>
                                                            <h3>{userList[item]['name']}</h3>
                                                            <h5><Tag color="cyan">部门:</Tag> <span>{userList[item]['depart']}</span> <span style={{ margin: "0 8px" }}></span> <Tag color="cyan">电话:</Tag><span>{userList[item]['phone']}</span></h5>
                                                        </div>
                                                    </div>
                                                )

                                            })}
                                        </TabPane>
                                    </Tabs>
                                </div>

                            </Card>

                        </div>

                    </Col>
                    {/* 日历 待办提醒 */}
                    <Col span={15} offset={1}>
                        <Calendar onSelect={() => {
                            console.log(666);
                        }}></Calendar>
                    </Col>
                </Row>

            </div>
        )
    }




}


export default connect(state => ({
    user: state.user

}))(Index)