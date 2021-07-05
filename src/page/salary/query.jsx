import { Button, Drawer, Table, Tag, Progress, Tooltip, Select, Input, DatePicker, Card, message } from "antd"
import Modal from "antd/lib/modal/Modal"
import React, { Component } from "react"
import { selectSalary_Main, selectSalary_code,search_content } from "../../axios/index"
import Utils from "../../sortComponents/utils/utils"
import JsExcel from "js-export-excel"
import Checkbox from "antd/lib/checkbox/Checkbox"
const { Option } = Select
export default class Query extends Component {
    state = {
        list: [],
        total: 10,
        page: 1,
        drawerShow: false,
        sortData: [],
        exportLabel: "",
        exportShow: false,
        percent: 0,
        selectValue: "Kqcode",
        startTime: "",
        endTime: "",
        yibu: false,
        erbu: false
    }
    componentDidMount() {
        this.initData()


    }

    initData = async (number) => {

        if (this.state.page >= number) return;
        let { list, total } = await selectSalary_Main(number)

        this.setState({
            list, total, page: number
        })
        // Class: "晚班"

    }
    // 根据考勤单号查询数据
    SelctByKqcode = async (Kqcode) => {
        let result = await selectSalary_code(Kqcode)
        this.setState({
            sortData: result['list'],
            drawerShow: true
        })
    }
    // 导出excel
    ExportExcel = () => {
        let date = new Date()
        let option = {
            fileName: `薪资信息${(date.getMonth()) + 1 + "月" + date.getDate() + "日"}`,
            datas: [
                {
                    sheetData: [],
                    sheetName: 'sheet',
                    sheetFilter: ["考勤单号", "日期", "车间名称", "班组", "班别", "人数", "总薪资", "管理中心审核状态", "人事部审核状态", "财务部审核状态"],
                    sheetHeader: ["考勤单号", "日期", "车间名称", "班组", "班别", "人数", "总薪资", "管理中心审核状态", "人事部审核状态", "财务部审核状态"]
                }
            ]
        }
        this.setState({
            exportShow: true,
            exportLabel: "正在获取所有数据！",
            page: 0,
            percent: 30
        }, async () => {
            await this.initData(this.state.total)
            this.setState({
                exportLabel: "正在处理数据！",
                percent: 65
            }, () => {
                //    处理数据
                let finalData = this.state.list.map((item, index) => {
                    item['考勤单号'] = item['Kqcode']
                    item['日期'] = item['Data']
                    item['车间名称'] = item['WorkshopName']
                    item['班组'] = item['TeamName']
                    item['班别'] = item['Class']
                    item['人数'] = item['Number']
                    item['总薪资'] = item['wages']
                    item['管理中心审核状态'] = item['glyn']
                    item['人事部审核状态'] = item['rsyn']
                    item['财务部审核状态'] = item['cwyn']
                    return item;
                })
                this.setState({
                    exportLabel: "正在导出数据，请等待！",
                    percent: 95
                }, () => {
                    this.setState({
                        exportLabel: "",
                        exportShow: false
                    }, () => {
                        option['datas'][0]['sheetData'] = finalData
                        let Excels = new JsExcel(option)
                        Excels.saveExcel()
                        this.initData()
                    })

                })
            })
        })
    }
    // 导出动画
    onSearch = async () => {
        const { value } = this.searchRef.state

        if (!value?.trim()) {
            return this.initData()
        }
      

        if (this.state.startTime && this.state.endTime) {
            let end = new Date(this.state.endTime).getTime()
            let start = new Date(this.state.startTime).getTime()
            if(start>end){
                return message.error("抱歉，开始时间不能大于结束时间！")
            }
        }
        // 发送请求进行查询 yibu, erbu, type, content, startTime, endTime
        let data={
            type:this.state.selectValue,
            content:value,
            startTime:this.state.startTime,
            endTime:this.state.endTime,
            yibu:this.state.yibu,
            erbu:this.state.erbu
        }
       let result=  await search_content(data)
       console.log(result);
 
    }

    // 筛选时间

    render() {
        const { list, total, drawerShow, sortData, exportLabel, exportShow, percent, selectValue, yibu, erbu } = this.state

        const sort_colums = [
            {
                title: "工序编码",
                dataIndex: "code",
                index: "code"
            }, {
                title: "工序名称",
                dataIndex: "name",
                index: "name"
            },
            {
                title: "产量",

                key: "output",
                render: (d) => {
                    const { output, code } = d;

                    return <span>{code ? output : ""}</span>

                }
            }, {
                title: "小组",

                key: "jh",
                render: (d) => {
                    const { jh, code } = d;

                    return <span>{code ? jh : ""}</span>

                }
            }
        ]
        const colums = [
            {
                title: "考勤单号",
                dataIndex: "Kqcode",
                index: "Kqcode"
            }, {
                title: "日期",

                index: "Data",
                render: (date) => {
                    const { Data } = date;
                    let d = new Date(Data)

                    return <span>{d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()}</span>
                }
            }, {
                title: "车间名称",
                dataIndex: "WorkshopName",
                index: "WorkshopName"
            }, {
                title: "班组",
                dataIndex: "TeamName",
                index: 'TeamName'
            }, {
                title: "班组类别",
                dataIndex: "Class",
                key: "Class"
            }, {
                title: "所属部门",
                dataIndex: "bm",
                key: "bm",


            }, {
                title: "人数",
                dataIndex: "Number",
                key: "Number"
            }, {
                title: "总薪资",
                dataIndex: "wages",
                index: "wages"
            }, {
                title: "管理中心",

                key: "glyn",
                render: (d) => {
                    const { glyn } = d

                    return <span>
                        <Tag color="red" style={{ display: glyn === 'N' ? '' : 'none' }}>未审核</Tag>
                        <Tag color="green" style={{ display: glyn === 'N' ? 'none' : '' }}>已审核</Tag>
                    </span>
                }
            }, {
                title: "人事部",

                key: "rsyn",
                render: (d) => {
                    const { rsyn } = d

                    return <span>
                        <Tag color="red" style={{ display: rsyn === 'N' ? '' : 'none' }}>未审核</Tag>
                        <Tag color="green" style={{ display: rsyn === 'N' ? 'none' : '' }}>已审核</Tag>
                    </span>
                }
            }, {
                title: "财务部",

                key: "cwyn",
                render: (d) => {
                    const { cwyn } = d

                    return <span>
                        <Tag color="red" style={{ display: cwyn === 'N' ? '' : 'none' }}>未审核</Tag>
                        <Tag color="green" style={{ display: cwyn === 'N' ? 'none' : '' }}>已审核</Tag>
                    </span>
                }
            }, {
                title: "操作",

                key: "detail",
                render: (d) => {
                    const { Kqcode } = d
                    return <div>
                        <Button type="primary"
                            onClick={() => { this.SelctByKqcode(Kqcode) }}
                        >查看详情</Button>
                    </div>

                }
            }
        ]
        return (
            <div className="query">
                <Card
                    style={{ width: 800 }}
                >
                    <div className="search" style={{ marginBottom: 15 }}>
                        <div>
                            <Checkbox checked={yibu} onChange={(v) => {
                                this.setState({
                                    yibu: !this.state.yibu
                                })
                            }}>一部</Checkbox>
                            <Checkbox checked={erbu} onChange={(v) => {
                                this.setState({
                                    erbu: !this.state.erbu
                                })
                            }}>一部</Checkbox>
                        </div>
                        <div style={{ margin: "8px 0" }}>
                            <Tag color="orange">检索类型:</Tag>
                            <Select
                                defaultValue={selectValue}
                            >
                                <Option value="Kqcode">考勤单号</Option>
                                <Option value="WorkshopName">车间名称</Option>
                                <Option value="TeamName">班组</Option>

                                <Option value="glyn">管理中心未审核</Option>
                                <Option value="rsyn">人事部未审核</Option>
                                <Option value="cwyn">财务部未审核</Option>
                            </Select>
                            <Input style={{ width: 400 }} ref={node => this.searchRef = node}></Input>
                        </div>

                        <div>
                            <Tag color="green">开始日期:</Tag> <DatePicker
                                onChange={(date) => {

                                    this.setState({
                                        startTime: date?.year() + "-" + (date?.month() + 1) + "-" + date?.date()
                                    }, () => {
                                        console.log(this.state.startTime);
                                    })
                                }}
                            ></DatePicker>
                            <Tag color="green" style={{ marginLeft: 10 }} >结束日期:</Tag> <DatePicker onChange={(date) => {

                                this.setState({
                                    endTime: date?.year() + "-" + (date?.month() + 1) + "-" + date?.date()
                                }, () => {
                                    console.log(this.state.endTime);
                                })
                            }}></DatePicker>
                            <Button style={{ marginLeft: 20 }} type="primary" onClick={this.onSearch}>查询</Button>
                        </div>
                    </div>
                </Card>

                <div className="table">
                    <Table
                        columns={colums}
                        dataSource={list}
                        pagination={{
                            total, pageSize: 10, onChange: (v) => {
                                this.initData(v * 10)
                            }
                        }}
                    ></Table>
                </div>
                <div className="utils">
                    <Drawer
                        title="工序详情"
                        visible={drawerShow}
                        placement="right"
                        width={600}
                        onClose={() => {
                            this.setState({
                                drawerShow: false
                            })
                        }}
                    >
                        <Table
                            columns={sort_colums}
                            dataSource={sortData}
                        >

                        </Table>

                    </Drawer>
                </div>
                <div className="sort_utils">
                    <Utils>
                        <div>
                            <Button type="primary" onClick={this.ExportExcel}>导出Excel</Button>
                        </div>

                    </Utils>
                    <Modal
                        visible={exportShow}
                        style={{ textAlign: "center" }}
                        footer={null}
                        closable={false}
                        destroyOnClose={true}

                    >
                        <Tooltip
                            title={exportLabel}
                            visible={exportShow}
                            placement="rightTop"
                        >
                            <Progress percent={percent} type="circle" status={percent === 100 ? '"success"' : 'normal'}></Progress>
                        </Tooltip>
                    </Modal>
                </div>
            </div>
        )


    }



}