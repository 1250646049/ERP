import React, { Component } from 'react'
import { Button, Input, Form } from 'antd';
import { getEmail } from "../../axios/index"





export default class Wuliu extends Component {
    state = {
        email: {},
        active:true
    }
    componentDidMount() {
        this.initData()
    }
    initData = async () => {
        let result = await getEmail()
        this.setState({
            email: result['data']
        },async()=>{
           console.log(this.formSub)
            this.formSub.setFieldsValue({
                username:result['data']['username'],
                password:result['data']['password'],
                sendEmail:result['data']['sendEmail'],
                shouEmail:result['data']['shouEmail'],
                subject:result['data']['subject']
            })

        })
    }

    render() {
        const { email,active} = this.state

        return (
            <div className="wuliu">
                <div className="top">
                    <Form ref={react=>this.formSub=react}
                    labelCol={{span:5}}
                    >

                        <Form.Item
                            label="邮箱登录用户名(必须为163邮箱)"
                            name="username"
                        >
                            <Input value={email['username']} disabled={active} />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="邮箱授权秘钥，不是登录密码(必须为163邮箱)"
                        >
                            <Input.Password value={email['password']} disabled={active}/>
                        </Form.Item>

                        <Form.Item
                            label="发送者邮箱（有且只有一个，必须和登录名相同）"
                            name="sendEmail"
                        >
                            <Input value={email['sendEmail']}  disabled={active}/>
                        </Form.Item>
                        <Form.Item
                            label="接收者邮箱（多个之间用‘;’分割）"
                            name="shouEmail"
                        >
                            <Input value={email['shouEmail']} disabled={active}/>
                        </Form.Item>
                        <Form.Item
                            label="邮箱主题信息："
                            name="subject"
                        >
                            <Input value={email['subject']} disabled={active}/>
                        </Form.Item>
                        <Form.Item
                        style={{textAlign:"center"}}
                        >
                            <Button type="primary" size="large">修改</Button>
                            <Button type="danger" size="large" style={{ marginLeft: 20 }} 
                            onClick={()=>{
                                this.setState({
                                    active:!this.state.active
                                })

                            }}
                            >{this.state.active?'打开激活':'关闭激活'}</Button>
                        </Form.Item>

                    </Form>
                </div>
            </div>
        )
    }
}