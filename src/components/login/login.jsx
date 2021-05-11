
import React, { Component } from 'react'
import Loading from "../../page/loading/loading"
import { Button, Form, Input, Card, message} from "antd"
import { connect } from "react-redux"
import { operationUser } from "../../redux/action/login"
import "./css/login.css"
class Login extends Component {

    // 用户登录
    onLogin = async () => {
        // 判断输入是否正确
        try {
            let result = await this.formRef.validateFields()
            /**
             * 服务器校验逻辑
             */
            this.props.operationUser(result)
        } catch {
            message.error("抱歉，请将内容填写规范！")
        }



    }

    render() {

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
                                <Input></Input>
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
                                <Input style={{width:140}}></Input> <span className="code">验证码</span>
                               
                            </Form.Item>
                              
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
