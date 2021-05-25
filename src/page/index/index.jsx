import React, { Component } from "react"
import { Card, Col, Row, Calendar, Tabs, Tag, Badge, Input, Button, message, Tooltip, Modal, Form, Select,TimePicker } from "antd"
import {WindowsOutlined,CommentOutlined,UserOutlined} from "@ant-design/icons"
import "./css/index.css"
import { connect } from "react-redux"
import Man from "../../assert/img/man_wev8.png"
import Wman from "../../assert/img/women_wev8.png"
import socket from "../../config/socketConfig"
import {addTixing,selectTixing} from "../../axios/index"
// 配置 socketIo
const { TabPane } = Tabs
const {Option}=Select
class Index extends Component {
  
    state = {
        user: {},

        userList: {},
        messageList: [],
        year:"",
        month:"",
        date:"",
        tixingShow:false,
        start:"",
        tixingList:[]
    }

    componentDidMount() {
        this.flag = true
        this.initUser()

    }

    initUser = () => {
        // 设置用户
        setTimeout(() => {
            this.flag && this.setState({
                user: this.props.user
            }, async() => {
                this.initSocket()
                // 查询提醒并且设置
              let data=  await selectTixing(this.state.user['username'])
              this.setState({
                  tixingList:data['list']
              })
            })
        }, 500)


    }
    // 初始化 socketIo
    initSocket = () => {
        socket.emit("login", this.state.user)
        socket.on("userList", data => {
            this.flag && this.setState({
                userList: data

            })
        })

        // 监听公告消息队列
        socket.on("message", (list) => {
            this.flag && this.setState({
                messageList: list
            })

        })

    }
    // 发送内容
    onPublish = () => {
        const { value } = this.MessageInput.state
        if (!value) return message.error("请先补充要发送的公告内容！")
        socket.emit("publish", value)
        this.MessageInput.state.value = ""
    }
    // 添加提醒
    onAddTixin=(v)=>{
        
        this.setState({
            year:v.year(),
            month:v.month()+1,
            date:v.date(),
            tixingShow:true
        })

    }
    componentWillUnmount() {
        this.flag = false
    }
    // 添加提醒内容
    addTixing=async()=>{
     
        try{
            let result=  await this.tixingForm.validateFields()
            if(!result['status']){
                result['status']="warning"
            }
            result['year']=this.state.year
            result['month']=this.state.month
            result['date']=this.state.date
            result['start']=this.state.start
            result['uid']=this.state.user['username']
            // console.log(result);
           let data=await addTixing(result)
           console.log(data);
           if(data['status']){
               message.success("添加日程提醒成功！")
               this.initUser()
               this.setState({
                tixingShow:false,
               },()=>{
                this.tixingForm.setFieldsValue({
                    content:"",
                    status:""
                   
                }) 

               })
           }
        }catch{
            message.error("抱歉，请先告知需要完成的内容！")
        }



    }
    render() {
        const { user, userList, messageList,tixingShow,tixingList } = this.state
        // 设置日期内容


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
                                        <TabPane tab={<Badge count={messageList.length} size="small"><span><WindowsOutlined /> 系统通知</span></Badge>} key="1"
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
                                            <div className="public" style={{ display: user['auth'] ? 'block' : 'none' }}>
                                                <Input placeholder="请输入要发表的系统公告:" style={{ width: '85%' }} ref={input => this.MessageInput = input}></Input> <Button onClick={this.onPublish} type="primary">发布</Button>
                                            </div>
                                        </TabPane>
                                        <TabPane tab={<span><CommentOutlined /> @与我相关</span>} key="2"></TabPane>
                                        <TabPane tab={
                                            <Badge size="small" count={userList ? Object.values(userList).length : 0} >
                                                <span><UserOutlined />在线人员</span>
                                            </Badge>

                                        } key="3">

                                            {userList && Object.keys(userList).map((item, index) => {

                                                return (
                                                    <div key={index} style={{ display: "flex", marginBottom: 20 }}>
                                                        <Badge count={1} dot={true} color="green">

                                                            <img src={userList[item]['sex'] && userList[item]['sex'] ? Man : Wman} alt="" style={{ width: 50, height: 50, borderRadius: '100%' }} />
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
                        <Calendar dateCellRender={(v)=>{
                           let date=v.date()
                           let month=v.month()
                            if(tixingList.length){
                                // 判断是否含有日期
                               let d= tixingList.findIndex((item=>item['date']===date))
                               let dm=tixingList.filter((item)=>item['date']===date)
                               if(d>=0){
                             
                                //    判断月份是否对应
                                    if(tixingList[d].month===(month+1)){
                                       
                                    return <span>
                                       {dm.map(item=>{
                                           return  <Badge key={item['id']} status={item['status']} text={item['start']+"\t"+item['content']}></Badge>
                                       })}
                                    </span>
                                  
                                 }
                                  
                               }

                            }


                        }} onSelect={(v) => {
                            this.onAddTixin(v)
                        }}></Calendar>
                    </Col>
                </Row>

            <div className="bottom">
                <Modal
                visible={tixingShow}
                title="添加提醒日程"
                okText="添加提醒"
                onOk={this.addTixing}
                onCancel={()=>{
                    this.setState({
                        tixingShow:false
                    })
                }}
                cancelText="取消"
                >
                    <Form
                    name="tixingForm"
                    ref={node=>this.tixingForm=node}
                    >
                        <Form.Item
                        label="日程内容"
                        rules={[
                            {required:true,message:"请完善提醒内容",trigger:"blur"}
                        ]}
                        name="content"
                        >
                            <Input></Input>
                        </Form.Item>

                        <Form.Item
                        label="日程状态"
                        name="status"
                        >
                            <Select
                            defaultValue="warning"
                           
                            >
                                <Option value="warning">待办</Option>
                                <Option value="success">完成</Option>
                                <Option value="error">失败</Option>

                            </Select>
                        </Form.Item>

                        <Form.Item
                        label="开始时间"
                        name="start"
                        >
                            <TimePicker
                            onChange={(v)=>{

                                if(v){
                                    this.setState({
                                        start:`${v.hour()}:${v.minute()<10?'0'+v.minute():v.minute()}:${v.second()<10?'0'+v.second():v.second()}`
                                    })
                                }
                            }}
                            ></TimePicker>
                        </Form.Item>

                    </Form>


                </Modal>
            </div>
            </div>
        )
    }




}


export default connect(state => ({
    user: state.user

}))(Index)