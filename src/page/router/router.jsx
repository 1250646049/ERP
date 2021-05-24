import React, { Component } from "react"
import { Table, Input, Button, message, Tag, Switch, Form } from "antd"
import { selectAllOath, updateOath,addOnePath} from "../../axios/index"
import "./css/router.css"


export default class Router extends Component {

    state = {
        data: [],
        currentChange:true
    }
    componentDidMount() {
        this.initData()
    }
    // 初始化请求数据
    initData = async () => {

        try {
            let result = await selectAllOath()
            this.setState({
                data: result['list']
            })
        } catch {
            message.error("抱歉，查询数据失败！")
        }
    }
    // 更改控制
    alterOauth = async (v, id) => {

        let result = await updateOath(id, Number(v))
        console.log(result);

    }
    // 添加一条记录
    onAddPath=async()=>{
        
        try{
            let result= await this.form.validateFields()
            result['contro']=Number(this.state.currentChange)
            let {status}= await addOnePath(result)
            if(status){
                this.setState({
                    currentChange:true
                },()=>{
                    message.success("恭喜你，添加路由成功")
                    this.form.setFieldsValue({
                        name:"",
                        path:"",
                        biaoshi:"",
                        sort:""
                    })
                    this.initData()
                })

            }else {
                return message.error("抱歉，添加路由失败！")
            }
        }catch{
            message.error("抱歉,请将内容填写完全！")

        }
    }
    render() {
        const { data,currentChange } = this.state
        const columns = [
            {
                title: "编号",
                dataIndex: "id",
                key: "id"
            }, {
                title: "路径名",
                dataIndex: "name",
                key: "name"
            }, {
                title: "路径",
                render: (data) => {
                    const { path } = data

                    return path ? path : "/"
                },
                key: "path"
            }, {
                title: "标识",
                dataIndex: "biaoshi",
                key: "biaoshi"
            }, {
                title: "层级",
                dataIndex: "sort",
                key: "sort"
            },
            {
                title: "是否受控",
                render: (data) => {
                    const { contro, sort, id } = data

                    return sort >= 1 ? <Switch onChange={(v) => {
                        this.alterOauth(v, id)
                    }} defaultChecked={contro}></Switch> : <Tag color="red">不在授权范围</Tag>
                },
                key: "contro"
            }
        ]
        return (
            <div className="router">
                <div className="top">
                    <Form
                        name="updateForm"
                        ref={node => this.form = node}
                    >
                        <Form.Item
                            name="name"
                            rules={[
                                {
                                    required: true, message: "请务必输入路由名称",trigger:"blur"
                                }
                            ]}
                        >
                            <Input style={{ width: 200 }} placeholder="请输入路由名称"></Input>
                        </Form.Item>

                        <Form.Item
                            rules={[
                                {
                                    required: true, message: "请务必输入路由路径"
                                }
                            ]}
                            name="path"
                        >
                            <Input style={{ width: 200 }} placeholder="请输入路由路径"></Input>
                        </Form.Item>

                        <Form.Item
                            name="biaoshi"
                            rules={[
                                {
                                    required:true,message:"请务必输入路由标识"
                                }
                            ]}
                        >
                            <Input style={{ width: 240 }} placeholder="请输入路由唯一标识"></Input>
                        </Form.Item>

                        <Form.Item
                            name="sort"
                            rules={[
                                {
                                    required:true,message:"请务必输入路由层级"
                                }
                            ]}
                        >
                            <Input style={{ width: 140 }} placeholder="请输入路由层级"></Input>
                        </Form.Item>

                        <Form.Item
                            label="是否受控"
                        >
                            <Switch defaultChecked={currentChange} onChange={(v)=>{
                                this.setState({
                                    currentChange:v
                                })

                            }}></Switch>
                        </Form.Item>

                        <Form.Item>
                            <Button onClick={this.onAddPath} type="primary">添加记录</Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="center">
                    <Table
                        dataSource={data}
                        columns={columns}
                    >


                    </Table>
                </div>

                <div className="bottom"></div>

            </div>
        )
    }



}