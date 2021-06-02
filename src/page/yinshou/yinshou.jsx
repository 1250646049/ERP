import React, { Component } from "react"
import { Table, Button, Spin, Drawer, Form, Input, Switch, DatePicker, Divider, message, Tag, Tooltip } from "antd"
//  导入请求
import "./css/yinshou.css"
import { selectYsk,  addYinshou } from "../../axios/index"

export default class Yinshou extends Component {
    state = {
        data: [],
        total: 0,
        flag: true,
        count: 0,
        currentId: "",
        jieanType: true,
        shoukuanTime: "",
        status: true,
        fajianTime: "",
        visable: false,
        page: 1,
        type: true,

    }
    initData = async (count = 10) => {
        if (this.state.count >= count) return
        this.setState({
            flag: false,
        })
        let data = await selectYsk(count)

        this.setState({
            data: data['list'],
            total: data['total'],
            flag: true,
            count
        })
    }
    componentDidMount() {
        this.initData(10)
    }
    // 重置表单内容
    resetForm = () => {
        this.refForm.resetFields()

    }

    // 数据回显
    huixianForm = (mysql) => {
        if (!mysql) return;
        this.setState({
            status: Boolean(mysql['status']),
            jieanType: Boolean(mysql['jiean'])
        }, () => {
            this.refForm.setFieldsValue({
                beizhu: mysql['beizhu'],
                edu: mysql['edu'],
                email: mysql['email'],

                jilu: mysql['jilu'],
                price: mysql['price'],
                quyu: mysql['quyu'],
                type: mysql['type'],
                shoujianren: mysql['shoujianren'],

            })
        })

    }
    // 提交内容
    onSubmit = async () => {

        try {
            let result = await this.refForm.validateFields()
            result['jiean'] = Number(this.state.jieanType)
            result['riqi'] = this.state.shoukuanTime
            result['jiedian'] = this.state.fajianTime
            result['status'] = Number(this.state.status)
            result['AutoId'] = this.state.currentId
            let data = await addYinshou(result)
            if (data.status) {
                this.setState({
                    visable: false,
                    count: 0
                }, () => {

                    message.success(data['message'])

                    this.initData(this.state.page * 10)
                })
            } else {
                throw new Error("抱歉，错误！")
            }
        } catch {
            message.error("抱歉，请将必填项填写完整！")
        }

    }
    render() {
        const expendColumns = [
            {
                title: "业务员邮箱",
           
                dataIndex: "email",
                key: "email"
            }, {
                title: "付款方式",
  
                dataIndex: "type",
                key: "type"
            }, {
                title: "是否结案",
                render: (data) => {

                    return (data['jiean'] !== undefined) && (data['jiean'] ? <Tag color="red"> 结案</Tag> : <Tag color="green"> 未结案</Tag>)
                },
                key: "jiean"
            }, {
                title: "收款记录",
           
                dataIndex: "jilu",
                key: "jilu"
            }, {
                title: "收款日期",
             
                dataIndex: "riqi",
                key: "riqi"
            }, {
                title: "收款金额",
              
                dataIndex: "price",
                key: "price"
            }, {
                title: "备注",
              
                dataIndex: "beizhu",
                key: "beizhu"
            }, {
                title: "状态",
                render: (data) => {
                    return (data['status'] != null) && (data['status'] ? <Tag color="blue"> 正常</Tag> : <Tag color="red"> 关闭</Tag>)
                },
                key: "status"
            }, {
                title: "预警收件人",
                // render: ({ mysql }) => <span>{mysql['shoujianren']}</span>,
                dataIndex: "shoujianren",
                key: "shoujianren"
            }, {
                title: "发件时间截点及频率",
                // render: ({ mysql }) => <span>{mysql['jiedian']}</span>,
                dataIndex: "jiedian",
                key: "jiedian"
            }, {
                title: "信用额度",
                // render: ({ mysql }) => <span>{mysql['edu']}</span>,
                dataIndex: "edu",
                key: "额度"
            }, {
                title: "区域",
                // render: ({ mysql }) => <span>{mysql['quyu']}</span>,.
                dataIndex: "quyu",
                key: "quyu"
            },
            {
                title:"更新",
                key:"number",
                render:(d)=>{
                    return <span>第{d['number']}次修改</span>
                }
            },
            {
                title:"录入时间",
                key:"uptime",
                dataIndex:"uptime"
            }
        ]
        const { data, total, flag, jieanType, status, visable, currentId, type} = this.state
        const columns = [
            {
                title: "订单号",
                dataIndex: "cSOCode",
                key: "cSOCode",
                fixed: "left"
            }, {
                title: "业务员",
                dataIndex: "cPersonName",
                key: "cPersonName"
            }, {
                title: "客户(简称)",
                dataIndex: "cCusAbbName",
                key: "cCusAbbName"
            }, {
                title: "制单日期",

                key: "dDate",
                render: ({ dDate }) => {
                    let d = new Date(dDate)

                    return <span>{d.getFullYear() + '-' + (d.getMonth() + 1) + "-" + d.getDate()}</span>
                }
            }, {
                title: "订单数量",
                dataIndex: "iQuantity",
                key: "iQuantity"
            }, {
                title: "订单金额(含税)",
                dataIndex: "iSum",
                key: "iSum"
            }, {
                title: "操作",
                render: (d) => {
                    return <div>
                        <Button type="primary" onClick={() => {
                            this.setState({
                                currentId: d['AutoID'],
                                visable: true
                            }, () => {
                                this.resetForm()

                            })

                        }} >添加</Button>
                    </div>
                },
                key: "caozuo",
                fixed: "right"
            }

        ]
        return (
            <div className="table">
                <Spin tip="加载中..." size="large" style={{ position: "fixed", top: "50%", left: "50%", zIndex: 99999, display: flag ? 'none' : "block" }}>
                </Spin>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={data}
                    
                    expandable={{
                        expandedRowRender: (data) => {
                    
                            return <div>
        
                                <Table
                                    columns={expendColumns}
                                    dataSource={ data.mysql}
                                    bordered={true}

                                ></Table>
                            </div>

                        }
              
                    }}
                    pagination={{ total, showSizeChanger: false }}
                    onChange={(v) => {
                        this.setState({
                            page: v.current,
                        }, () => {
                            this.initData(v.current * 10)
                        })
                    }}

                    scroll={{ x: 2000 }}
                ></Table>

                <div className="utils">
                    <Drawer
                        title={`修改[${currentId}]的内容`}
                        visible={visable}
                        width={400}
                        onClose={() => {
                            this.setState({
                                visable: false
                            })
                        }}
                    >
                        <Form
                            ref={node => this.refForm = node}
                            labelCol={{ span: 6 }}

                        >
                            {/* 业务员邮箱 */}
                            <Form.Item
                                label="业务员邮箱"
                                name="email"
                            >
                                <Input></Input>
                            </Form.Item>

                            {/* 付款方式 */}
                            <Form.Item
                                label="付款方式"
                                name="type"
                            >
                                <Input></Input>
                            </Form.Item>

                            {/* 是否结案 */}
                            <Form.Item
                                label="是否结案"
                                name="jiean"
                            >
                                <Tooltip
                                    title="开：结案 \ 关：未结案"
                                >
                                    <Switch
                                        checked={jieanType}
                                        onChange={(d) => {
                                            this.setState({
                                                jieanType: d
                                            })
                                        }}
                                    >

                                    </Switch>
                                </Tooltip>
                            </Form.Item>

                            {/* 收款记录 */}
                            <Form.Item
                                label="收款记录"
                                name="jilu"
                            >
                                <Input></Input>
                            </Form.Item>

                            {/* 收款日期 */}
                            <Form.Item
                                label="收款日期"
                                name="riqi"
                            >
                                <DatePicker
                                    onChange={(d) => {
                                        if (!d) return;
                                        let month = (d.month() + 1) < 10 ? 0 + "" + (d.month() + 1) : (d.month() + 1)
                                        let date = (d.date()) < 10 ? 0 + "" + (d.date()) : (d.date())

                                        this.setState({
                                            shoukuanTime: d.year() + '-' + month + "-" + date
                                        })
                                    }}
                                ></DatePicker>
                            </Form.Item>


                            {/* 收款金额*/}
                            <Form.Item
                                label="收款金额"
                                name="price"
                            >
                                <Input></Input>
                            </Form.Item>
                            {/* 状态*/}
                            <Form.Item
                                label="状态"
                                name="status"
                            >
                                <Tooltip title="开:正常 \ 关：关闭">
                                <Switch
                                    checked={status}
                                    onChange={
                                        (d) => {
                                            this.setState({
                                                status: d
                                            })
                                        }
                                    }
                                >
                                </Switch>
                                </Tooltip>

                            </Form.Item>
                            {/* 备注*/}
                            <Form.Item
                                label="备注"
                                name="beizhu"
                            >
                                <Input></Input>
                            </Form.Item>

                            {/* 收件人*/}
                            <Form.Item
                                label="预警收件人"
                                name="shoujianren"
                            >
                                <Input.TextArea placeholder="多个收件人用';'分号分割！"></Input.TextArea>
                            </Form.Item>

                            {/* 发件时间*/}
                            <Form.Item
                                label="发件时间"
                                name="jiedian"

                            >
                                <DatePicker onChange={(d) => {
                                    if (!d) return;

                                    if (!d) return;
                                    let month = (d.month() + 1) < 10 ? 0 + "" + (d.month() + 1) : (d.month() + 1)
                                    let date = (d.date()) < 10 ? 0 + "" + (d.date()) : (d.date())

                                    this.setState({
                                        fajianTime: d.year() + '-' + month + "-" + date
                                    })

                                }}></DatePicker>
                            </Form.Item>
                            {/* 信用额度*/}
                            <Form.Item
                                label="信用额度"
                                name="edu"
                            >
                                <Input></Input>
                            </Form.Item>
                            {/* 备注*/}
                            <Form.Item
                                label="区域"
                                name="quyu"
                            >
                                <Input></Input>
                            </Form.Item>
                            <Divider></Divider>
                            <Form.Item>
                                <Button type="primary" size="large" onClick={this.onSubmit}>{type ? '添加一条收款记录' : '修改此条记录'}</Button>
                            </Form.Item>
                        </Form>
                    </Drawer>
                </div>
            </div>

        )
    }


}

