import React, { Component } from "react"
import { Table, Button, Spin, Drawer, Form, Input, Switch, DatePicker, Divider, message, Tag, Tooltip } from "antd"
//  导入请求
import "./css/yinshou.css"
import { selectYsk, alterYinshou } from "../../axios/index"

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
        page: 1
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
            result['id'] = this.state.currentId
            console.log(result);
            let data = await alterYinshou(result)
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
        const { data, total, flag, jieanType, status, visable, currentId } = this.state
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
                title: "业务员邮箱",
                render: ({ mysql }) => <span>{mysql['email']}</span>,
                key: "email"
            }, {
                title: "付款方式",
                render: ({ mysql }) => <span>{mysql['type']}</span>,
                key: "type"
            }, {
                title: "是否结案",
                render: ({ mysql }) => {
                  
                    return (mysql['jiean'] !== undefined) && (mysql['jiean'] ? <Tag color="red"> 结案</Tag> : <Tag color="green"> 未结案</Tag>)
                },
                key: "jiean"
            }, {
                title: "收款记录",
                render: ({ mysql }) => <span>{mysql['jilu']}</span>,
                key: "jilu"
            }, {
                title: "收款日期",
                render: ({ mysql }) => <span>{mysql['riqi']}</span>,
                key: "riqi"
            }, {
                title: "收款金额",
                render: ({ mysql }) => <span>{mysql['price']}</span>,
                key: "price"
            }, {
                title: "备注",
                render: ({ mysql }) => <span>{mysql['beizhu']}</span>,
                key: "beizhu"
            }, {
                title: "状态",
                render: ({ mysql }) => {
                    return (mysql['status'] != null) && (mysql['status'] ? <Tag color="blue"> 正常</Tag> : <Tag color="red"> 异常</Tag>)
                },
                key: "status"
            }, {
                title: "预警收件人",
                render: ({ mysql }) => <span>{mysql['shoujianren']}</span>,
                key: "shoujianren"
            }, {
                title: "发件时间截点及频率",
                render: ({ mysql }) => <span>{mysql['jiedian']}</span>,
                key: "jiedian"
            }, {
                title: "信用额度",
                render: ({ mysql }) => <span>{mysql['edu']}</span>,
                key: "额度"
            }, {
                title: "区域",
                render: ({ mysql }) => <span>{mysql['quyu']}</span>,
                key: "quyu"
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
                                this.huixianForm(d['mysql'])
                            })

                        }} >修改</Button>
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
                    pagination={{ total,showSizeChanger:false }}
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
                                <Button type="primary" size="large" onClick={this.onSubmit}>修改</Button>
                            </Form.Item>
                        </Form>
                    </Drawer>
                </div>
            </div>

        )
    }


}

