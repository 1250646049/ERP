import React, { Component } from "react"
import { Modal, DatePicker, Form, Tabs, Table, message, Button } from "antd"
import { getWanglai, exportWanglai } from "../../axios/index"
import { serverUrl } from "../../config/config"
// 导入功能案板组件
import Utils from "../../sortComponents/utils/utils"
const { TabPane } = Tabs

export default class Wanglai extends Component {

    state = {
        time: "",
        modalShow: true,
        yushou: [],
        yinshou: [],
        month: "",
        yufu: [],
        yinfu: [],
        other: []
    }
    // 查询数据
    toSelect = async () => {
        if (!this.state.time) return message.error("抱歉，您还未选择日期！")

        try {
            let result = await getWanglai("select", this.state.time)
            console.log(result);
            this.setState({
                modalShow: false,
                yushou: result['yushou'],
                yinshou: result['yinshou'],
                yufu: result['GYSYF'],
                yinfu: result['GYSYINFU'],
                other: result['other']
            })

        } catch {
            message.error("抱歉，服务器出现故障，请联络负责人！")
        }

    }
    // 导出数据
    exportData = async () => {
        try {
            let result = await exportWanglai("down", this.state.time)
            if (result['status']) {
                message.success("恭喜你，导出数据成功！")
                window.location.href = serverUrl + result['url']
            }
            else {
                throw new Error("抱歉，导出失败！")
            }
        } catch {
            message.error("抱歉，导出失败！")
        }
    }
    render() {
        const { modalShow, yushou, yinshou, yufu, yinfu, other } = this.state
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

                key: "me",
                render: (data) => {

                    return <span>{data['me']}元</span>
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

                key: "me",

                render: (data) => {

                    return <span>{data['me']}元</span>
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

                key: "me"
                ,
                render: (data) => {

                    return <span>{data['me']}元</span>
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

                key: "me",

                render: (data) => {

                    return <span>{data['me']}元</span>
                }

            }

        ]
        // 其他应收
        const otherColoum = [
            {
                title: "编号",
                dataIndex: "i_id",
                key: "i_id"
            },
            {
                title: "年",
                dataIndex: "iyear",
                key: "iyear"
            }, {
                title: "月",
                dataIndex: "iperiod",
                key: "iperiod"
            }, {
                title: "客户",
                key: "kehu",
                render: (data) => {
                    const { ccode } = data
                    let content = ""
                    if (ccode === '113301') {
                        content = data['cDepName']
                    } else if (ccode === '11330301') {
                        content = data['cVenName']
                    } else {
                        content = data["cPersonName"]
                    }

                    return <span>{content}</span>
                }
            }, {
                title: "期末金额",
                key: "qimo",
                render: (d) => {

                    return <span>{d['qimo']}元</span>
                }
            }
        ]
        return (
            <div className="wanglai">
                <div className="utils">
                    {/* <Button size="large" type="primary" onClick={this.exportData}>导出</Button> */}
                    {/* <Button size="large" style={{marginLeft:15}} type="default" onClick={()=>{
                        this.setState({
                            modalShow:true
                        })
                    }}>重置时间</Button> */}

                </div>
                <div className="startMessage">
                    <Modal
                        title="请选择操作时间区域"
                        visible={modalShow}
                        okText="确定"
                        cancelText="取消"
                        onCancel={()=>{
                            this.setState({
                                modalShow:false
                            })
                        }}
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
                                            time: v && v.year() + `${v && v.month() + 1 < 10 ? '0' + (v && v.month() + 1) : (v && v.month() + 1)}`,
                                            month: v && v.month() + 1
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
                                bordered={true}
                            >

                            </Table>
                        </TabPane>
                        <TabPane tab="应收账套" key="2">
                            <Table
                                columns={yinshouColoum}
                                dataSource={yinshou}
                                bordered={true}
                            >

                            </Table>
                        </TabPane>
                        <TabPane tab="预付账套" key="3">
                            <Table
                                dataSource={yufu}
                                columns={yufuColoum}
                                bordered={true}
                            >

                            </Table>
                        </TabPane>
                        <TabPane tab="应付账套" key="4">
                            <Table
                                dataSource={yinfu}
                                columns={yinfuColoum}
                                bordered={true}
                            >

                            </Table>
                        </TabPane>
                        <TabPane tab="其他应收账套" key="5">
                            <Table
                                columns={otherColoum}
                                dataSource={other}
                                bordered={true}
                            >

                            </Table>
                        </TabPane>
                    </Tabs>

                </div>
                {/* 功能案板 */}
                <div className="utilss">
                    <Utils>
                        <Button type="primary" style={{width:"90%"}} onClick={this.exportData}>导出Excel</Button>
                        <Button type="primary" style={{width:"90%"}} onClick={()=>{
                        this.setState({
                            modalShow:true
                        })
                    }}>重置月份</Button>
                    </Utils>
                </div>
            </div>
        )

    }



}

