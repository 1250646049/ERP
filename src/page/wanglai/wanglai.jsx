import React, { Component } from "react"
import { Modal, DatePicker, Form, Tabs, Table, message } from "antd"
import { getWanglai } from "../../axios/index"
const { TabPane } = Tabs

export default class Wanglai extends Component {

    state = {
        time: "",
        modalShow: true,
        yushou: [],
        yinshou: [],
        month: "",
        yufu: [],
        yinfu: []
    }

    toSelect = async () => {
        if (!this.state.time) return message.error("抱歉，您还未选择日期！")

        try {
            let result = await getWanglai("select", this.state.time)
            console.log(result);
            this.setState({
                modalShow: false,
                yushou: result['yushou'],
                yinshou: result['yinshou'],
                yufu: result['GYSYINFU'],
                yinfu: result['GYSYF']
            })

        } catch {
            message.error("抱歉，服务器出现故障，请联络负责人！")
        }

    }
    render() {
        const { modalShow, yushou, yinshou, yufu, yinfu } = this.state
        // 预收表项
        const yushouColoum = [
            {
                title: "编号",
                dataIndex: "i_id",
                key: "i_id"
            },
            {
                title: "年",
                dataIndex: "iyear",
                key: "iyear"
            },
            {
                title: '月',
                render: () => {
                    return <span>{this.state.month}</span>
                },
                key: "month"
            },
            {
                title: "客户名",
                dataIndex: "cCusName",
                key: "cCusName"
            }, {
                title: "期末金额",

                key: "mb",
                render: (data) => {

                    return <span>{data['mb']}元</span>
                }

            }

        ]
        // 应收
        const yinshouColoum = [
            {
                title: "编号",
                dataIndex: "i_id",
                key: "i_id"
            },
            {
                title: "年",
                dataIndex: "iyear",
                key: "iyear"
            },
            {
                title: '月',
                render: () => {
                    return <span>{this.state.month}</span>
                },
                key: "month"
            },
            {
                title: "客户名",
                dataIndex: "cCusName",
                key: "cCusName"
            }, {
                title: "期末金额",

                key: "mb",

                render: (data) => {

                    return <span>{data['mb']}元</span>
                }

            }

        ]

        // 预付
        const yufuColoum = [
            {
                title: "编号",
                dataIndex: "i_id",
                key: "i_id"
            },
            {
                title: "年",
                dataIndex: "iyear",
                key: "iyear"
            },
            {
                title: '月',
                render: () => {
                    return <span>{this.state.month}</span>
                },
                key: "month"
            },
            {
                title: "供应商",
                dataIndex: "cVenName",
                key: "cVenName"
            }, {
                title: "期末金额",

                key: "mb"
                ,
                render: (data) => {

                    return <span>{data['mb']}元</span>
                }

            }

        ]

        // 应付
        const yinfuColoum = [
            {
                title: "编号",
                dataIndex: "i_id",
                key: "i_id"
            },
            {
                title: "年",
                dataIndex: "iyear",
                key: "iyear"
            },
            {
                title: '月',
                render: () => {
                    return <span>{this.state.month}</span>
                },
                key: "month"
            },
            {
                title: "供应商",
                dataIndex: "cVenName",
                key: "cVenName"
            }, {
                title: "期末金额",

                key: "mb",

                render: (data) => {

                    return <span>{data['mb']}元</span>
                }

            }

        ]

        return (
            <div className="wanglai">
                <div className="startMessage">
                    <Modal
                        title="请选择操作时间区域"
                        visible={modalShow}
                        okText="确定"
                        cancelText="取消"
                        onOk={
                            this.toSelect
                        }
                    >
                        <Form>
                            {/* 筛选时间 */}
                            <Form.Item
                                label="请输入筛选时间"
                            >
                                <DatePicker picker="month"
                                    renderExtraFooter={() => '请选择筛选日期'}
                                    locale="zh-cn"
                                    onChange={(v) => {
                                        // 设置time
                                        this.setState({
                                            time: v.year() + `${v.month() + 1 < 10 ? '0' + (v.month() + 1) : (v.month() + 1)}`,
                                            month: v.month() + 1
                                        }, () => console.log(this.state.time))
                                    }}
                                ></DatePicker>

                            </Form.Item>

                        </Form>

                    </Modal>


                </div>

                {/* 搜索区域  */}
                <div className="content">

                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="预收账套" key="1">
                            <Table
                                columns={yushouColoum}
                                dataSource={yushou}
                            >

                            </Table>
                        </TabPane>
                        <TabPane tab="应收账套" key="2">
                            <Table
                                columns={yinshouColoum}
                                dataSource={yinshou}
                            >

                            </Table>
                        </TabPane>
                        <TabPane tab="预付账套" key="3">
                            <Table
                                dataSource={yufu}
                                columns={yufuColoum}
                            >

                            </Table>
                        </TabPane>
                        <TabPane tab="应付账套" key="4">
                            <Table
                                dataSource={yinfu}
                                columns={yinfuColoum}
                            >

                            </Table>
                        </TabPane>
                        <TabPane tab="其他应收账套" key="5">
                            <Table>

                            </Table>
                        </TabPane>
                    </Tabs>

                </div>
            </div>
        )

    }



}

