
import React, { Component } from 'react'
import Loading from "../../page/loading/loading"
import { Button, Form, Input, Card, message} from "antd"
import { connect } from "react-redux"
import { operationUser } from "../../redux/action/login"

import "./css/login.css"
// 引入请求
import {getYzm,toLogin,toAutoLogin} from "../../axios/index"
class Login extends Component {
    state={
        yzm:""
    }
    componentDidMount(){
        this.initData()
    }
    // 初始化登录状态
    initData=()=>{
        this.isLoging()
        this.initYzm()
        
    }
    // 判断是否登录
    isLoging= async()=>{
        if(localStorage.getItem("_token")){
            try{
                let data=await toAutoLogin(localStorage.getItem("_token"))
                if(!data['error']){
                    this.props.history.replace("/main")
                }
            }catch{
                console.log("授权错误！")
            }
        }


    }
    // 初始化验证码状态
    initYzm=async ()=>{
        // 发送验证码请求
       try{
        let data= await getYzm()
        this.setState({
            yzm:data['data']
        })
       }catch{
         message.error("验证码请求出错！")
       }
    }
    // 用户登录
    onLogin = async () => {
        // 判断输入是否正确
        try {
            let result = await this.formRef.validateFields()
            /**
             * 服务器校验逻辑
             */
             let loginResult= await toLogin(result)
             
             if(loginResult['status']){
                 let token=loginResult['data']['token']
                //  设置本地缓存
                 localStorage.setItem("_token",token)
                 delete loginResult['token']
                this.props.operationUser(loginResult)
                message.success(`${loginResult['data']['name']} 恭喜您登录成功！`)
                // 初始化验证码
                this.initYzm()
                this.props.history.replace("/main")
             }else {
                 this.initYzm()
                 message.error(loginResult['message'])
             }
            
        } catch {
            message.error("抱歉，请将内容填写规范！")
        }



    }

    render() {
        const {yzm}=this.state
        return (
            <div className="login">
                {/* 表单验证 */}
                <div className="yanzheng">
                    <header>CFL ERP报表系统</header>
                    {/* 动画 */}
                    <Loading width={50} height={50} spend={2} />
                    {/* form登录表单 */}
                    <div className="form">
                        <Form
                            ref={react => this.formRef = react}
                            labelCol={{ span: 4 }}
                        >
                            {/* 工号 */}
                            <Form.Item
                                label="工号:"
                                name="username"
                                rules={
                                    [
                                        {
                                            required: true, message: "请务必输入您的OA报表系统的工号"
                                        }
                                    ]
                                }
                            >
                                <Input  ></Input>
                            </Form.Item>

                            {/* 密码 */}
                            <Form.Item
                                label="密码:"
                                name="password"
                                rules={[
                                    {
                                        required: true, message: "请输入您的密码,第一次登录为：1234", trigger: "blur"
                                    }, {
                                        max: 16, min: 4, message: '密码区间在4-16位之间', trigger: "blur"
                                    }
                                ]}
                            >
                                <Input.Password></Input.Password>
                            </Form.Item>

                            {/* 验证码 */}
                            <Form.Item
                                label="验证码:"
                                name="yzm"
                                rules={[
                                    {
                                        required: true, message: "请输入验证码", trigger: "blur"
                                    }, {
                                        max: 4, min: 4, message: '验证码为4位', trigger: "blur"
                                    }
                                ]}
                            
                            >
                                <Input style={{width:140}}></Input> 
                      
                            </Form.Item>
                            <span onClick={
                                    ()=>{
                                        this.initYzm()
                                    }
                                } className="code" dangerouslySetInnerHTML={{__html:yzm}}></span>
                               
                            {/* 提交按钮 */}
                            <Form.Item
                                style={{ textAlign: "center" }}
                            >

                                <Button type="primary" onClick={this.onLogin} size="large" style={{ marginRight: 10 }}>登录</Button>
                                <Button type="default" size="large">重置</Button>

                            </Form.Item>
                        </Form>
                    </div>
                    {/* 公告 */}
                    <Card title={"公告栏"}>

                        <div className="gongao">
                            <p>  666666</p>
                            <p>  666666</p>
                            <p>  666666</p>
                            <p>  666666</p>
                            <p>  666666</p>
                            <p>  666666</p>
                            <p>  666666</p>
                        </div>
                    </Card>

                </div>
            </div>
        )
    }
}


// 暴露 容器组件

export default connect(
    state => ({
        user: state.user
    }),
    {
        operationUser
    }
)(Login)
