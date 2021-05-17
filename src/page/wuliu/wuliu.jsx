import React, { Component } from 'react'
import { Button, Input, Form, message, Upload } from 'antd';
import { getEmail, setEmail } from "../../axios/index"

import { UploadOutlined } from '@ant-design/icons';
export default class Wuliu extends Component {
    state = {
        email: {},
        active: true
    }
    componentDidMount() {
        this.initData()
    }
    initData = async () => {
        let result = await getEmail()
        this.setState({
            email: result['data']
        }, async () => {
            console.log(this.formSub)
            this.formSub.setFieldsValue({
                username: result['data']['username'],
                password: result['data']['password'],
                sendEmail: result['data']['sendEmail'],
                shouEmail: result['data']['shouEmail'],
                subject: result['data']['subject']
            })

        })
    }
    // 修改内容
    onSubmit = async () => {

        try {
            let result = await this.formSub.validateFields()
            let d = await setEmail(result)
            if (d['status']) message.success("恭喜你修改成功！")
            else message.error("抱歉,更新失败,请联系管理员！")
        } catch {
            message.error("抱歉，请按提示填写完整！")
        }


    }
    render() {
        const { email, active } = this.state

        return (
            <div className="wuliu">
                <div className="top">
                    <Form ref={react => this.formSub = react}
                        labelCol={{ span: 5 }}
                    >

                        <Form.Item
                            label="邮箱登录用户名(必须为163邮箱)"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "请补全邮箱登录用户名",
                                    tirgger: "blur"
                                }
                            ]}
                        >
                            <Input value={email['username']} disabled={active} />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="邮箱授权秘钥，不是登录密码(必须为163邮箱)"
                            rules={[
                                {
                                    required: true,
                                    message: "请补全邮箱验证秘钥",
                                    tirgger: "blur"
                                }
                            ]}
                        >
                            <Input.Password value={email['password']} disabled={active} />
                        </Form.Item>

                        <Form.Item
                            label="发送者邮箱（有且只有一个，必须和登录名相同）"
                            name="sendEmail"
                            rules={[
                                {
                                    required: true,
                                    message: "请补全发送者邮箱",
                                    tirgger: "blur"
                                }
                            ]}
                        >
                            <Input value={email['sendEmail']} disabled={active} />
                        </Form.Item>
                        <Form.Item
                            label="接收者邮箱（多个之间用‘;’分割）"
                            name="shouEmail"
                        >
                            <Input value={email['shouEmail']} disabled={active} />
                        </Form.Item>
                        <Form.Item
                            label="邮箱主题信息："
                            name="subject"
                        >
                            <Input value={email['subject']} disabled={active} />
                        </Form.Item>
                        <Form.Item
                            style={{ textAlign: "center" }}
                        >
                            <Button type="primary" size="large" onClick={this.onSubmit} disabled={this.state.active}>修改</Button>
                            <Button type="danger" size="large" style={{ marginLeft: 20,marginRight:20 }}
                                onClick={() => {
                                    this.setState({
                                        active: !this.state.active
                                    })
                                }}  
                            // 文件上传


                            >{this.state.active ? '打开激活' : '关闭激活'}</Button>
                            <Upload 
                            action="/wuliu/upload"
                            style={{marginLeft:20}} 
                            onChange={(file)=>{
                                const {response}=file['file']
                                
                                if(response&&response['status']){
                                    message.success("更新物流到货预测模板成功！")
                                }
                            }}
                            
                            >
                                <Button icon={<UploadOutlined />}>点击上传模板</Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}