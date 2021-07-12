import { Button, Drawer, Table, Tag, Progress, Tooltip, Card, Row, Col, notification, Popover, message } from "antd"
import Modal from "antd/lib/modal/Modal"
import React, { Component } from "react"
import {
    selectSalary_Main, selectSalary_code, search_content, select_qingjia, select_salary_total, select_depart_salary,
    select_problem, select_caiwu_kaoqing
} from "../../axios/index"
import Utils from "../../sortComponents/utils/utils"
import JsExcel from "js-export-excel"
import PubSub from "pubsub-js"
import Selects from "./select"
import { select_kaoqing } from "../../axios/index"
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
        erbu: false,
        tableType: "salary",
        spinShow: true,
        sortTypes: ""


    }
    componentDidMount() {
        this.initData()
        this.onSearch()

    }

    initData = async (number) => {

        if (this.state.page >= number) return;
        this.setState({
            spinShow: true
        })
        let { list, total } = await selectSalary_Main(number)

        this.setState({
            list, total, page: number, spinShow: false
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
    // 导出全部信息明细excel
    ExportExcel = (type) => {
        if (this.state.sortTypes && type === 'one') {
            return message.error("抱歉,当前的筛选的数据源不是薪资信息,请进行薪资筛选后重试！")
        }
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
            if (type === 'all') {
                await this.initData(this.state.total)
            }

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
                        if (type === 'all') {
                            this.initData()
                        }
                    })

                })
            })
        })
    }

    // ExporcjzExcel
    // 导出车间产量汇总表excel
    ExporcjzExcel = (type) => {
        if (this.state.sortTypes !== 'chanliang' && type === 'one') {
            return message.error("抱歉,当前的筛选的数据源不是产量明细表,请进行筛选后重试！")
        }
        let date = new Date()
        let option = {
            fileName: `车间产量明细表${(date.getMonth()) + 1 + "月" + date.getDate() + "日"}`,
            datas: [
                {
                    sheetData: [],
                    sheetName: 'sheet',
                    sheetFilter: ["车间", "工序编码", "工序名称", "工序产量", "金额"],
                    sheetHeader: ["车间", "工序编码", "工序名称", "工序产量", "金额"],
                }
            ]
        }
        this.setState({
            exportShow: true,
            exportLabel: "正在获取所有数据！",
            page: 0,
            percent: 30
        }, async () => {
            let list = this.state.list
            if (type === 'all') {
                let result = await select_depart_salary()
                list = result['list']
            }

            this.setState({
                exportLabel: "正在处理数据！",
                percent: 65
            }, () => {
                //    处理数据

                this.setState({
                    exportLabel: "正在导出数据，请等待！",
                    percent: 95
                }, () => {
                    this.setState({
                        exportLabel: "",
                        exportShow: false
                    }, () => {
                        option['datas'][0]['sheetData'] = list
                        let Excels = new JsExcel(option)
                        Excels.saveExcel()

                    })

                })
            })
        })
    }
    // 导出筛选的考勤信息
    ExportKqExcel = (type) => {
        if (this.state.sortTypes !== 'kaoqmingxi' && type === 'one') {
            return message.error("抱歉,当前的筛选的数据源不是考勤明细,请进行筛选后重试！")
        }
        let date = new Date()
        let option = {
            fileName: `考勤信息(前一万条)${(date.getMonth()) + 1 + "月" + date.getDate() + "日"}`,
            datas: [
                {
                    sheetData: [],
                    sheetName: 'sheet',
                    sheetFilter: ["日期", "工号", "姓名", "班组", "部门", "职位", "当日薪资", "工作时间", "工作日", "确认时间"],
                    sheetHeader: ["日期", "工号", "姓名", "班组", "部门", "职位", "当日薪资", "工作时间", "工作日", "确认时间"]
                }
            ]
        }
        this.setState({
            exportShow: true,
            exportLabel: "正在获取所有数据！",
            page: 0,
            percent: 30
        }, async () => {
            let list = this.state.list
            if (type === 'all') {
                let result = await select_kaoqing()
                list = result['list']
            }

            this.setState({
                exportLabel: "正在处理数据！",
                percent: 65
            }, () => {
                //    处理数据
                let finalData = list.map((item, index) => {
                    item['日期'] = item['Data']
                    item['工号'] = item['PersonCode']
                    item['姓名'] = item['PersonName']
                    item['班组'] = item['TeamName']
                    item['部门'] = item['cdepname']
                    item['职位'] = item['cdutycode']
                    item['当日薪资'] = item['Wages']
                    item['工作时间'] = item['AttendanceRecord']
                    item['工作日'] = item['bs']
                    item['确认时间'] = item['Entry_Person']
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

                    })

                })
            })
        })
    }

    // 导出请假明细
    ExportqjExcel = (type) => {
        if (this.state.sortTypes !== 'qjia' && type === 'one') {
            return message.error("抱歉,当前的筛选的数据源不是请假明细,请进行筛选后重试！")
        }
        let date = new Date()
        let option = {
            fileName: `请假信息(前一万条)${(date.getMonth()) + 1 + "月" + date.getDate() + "日"}`,
            datas: [
                {
                    sheetData: [],
                    sheetName: 'sheet',
                    sheetFilter: ["日期", "工号", "姓名", "车间", "班组", "请假类别", "请假时间"],
                    sheetHeader: ["日期", "工号", "姓名", "车间", "班组", "请假类别", "请假时间"],
                }
            ]
        }
        this.setState({
            exportShow: true,
            exportLabel: "正在获取所有数据！",
            page: 0,
            percent: 30
        }, async () => {
            let list = this.state.list
            if (type === 'all') {
                let result = await select_qingjia()
                list = result['list']
            }

            this.setState({
                exportLabel: "正在处理数据！",
                percent: 65
            }, () => {
                //    处理数据
                let finalData = list.map((item, index) => {
                    item['日期'] = item['Data']
                    item['工号'] = item['PersonCode']
                    item['姓名'] = item['PersonName']
                    item['班组'] = item['TeamName']
                    item['车间'] = item['WorkshopName']
                    item['请假类别'] = item['qjlb']
                    item['请假时间'] = item['qjsj']
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

                    })

                })
            })
        })
    }
    // 导出汇总请假表
    ExporthzExcel = (type) => {
        if (this.state.sortTypes !== 'huizon' && type === 'one') {
            return message.error("抱歉,当前的筛选的数据源不是汇总明细表,请进行筛选后重试！")
        }
        let date = new Date()
        let option = {
            fileName: `请假汇总信息表${(date.getMonth()) + 1 + "月" + date.getDate() + "日"}`,
            datas: [
                {
                    sheetData: [],
                    sheetName: 'sheet',
                    sheetFilter: ["工号", "姓名", "部门", "职务", "总计", "工作日"],
                    sheetHeader: ["工号", "姓名", "部门", "职务", "总计", "工作日"],
                }
            ]
        }
        this.setState({
            exportShow: true,
            exportLabel: "正在获取所有数据！",
            page: 0,
            percent: 30
        }, async () => {
            let list = this.state.list
            if (type === 'all') {
                let result = await select_salary_total()
                list = result['list']
            }

            this.setState({
                exportLabel: "正在处理数据！",
                percent: 65
            }, () => {
                //    处理数据

                this.setState({
                    exportLabel: "正在导出数据，请等待！",
                    percent: 95
                }, () => {
                    this.setState({
                        exportLabel: "",
                        exportShow: false
                    }, () => {
                        option['datas'][0]['sheetData'] = list
                        let Excels = new JsExcel(option)
                        Excels.saveExcel()

                    })

                })
            })
        })

    }

    // 导出问题处理单
    ExportwtExcel = (type) => {
        if (this.state.sortTypes !== 'wenti' && type === 'one') {
            return message.error("抱歉,当前的筛选的数据源不是问题处理明细,请进行筛选后重试！")
        }
        let date = new Date()
        let option = {
            fileName: `问题处理明细表${(date.getMonth()) + 1 + "月" + date.getDate() + "日"}`,
            datas: [
                {
                    sheetData: [],
                    sheetName: 'sheet',
                    sheetFilter: ["日期", "供应商", "不良原因", "金额"],
                    sheetHeader: ["日期", "供应商", "不良原因", "金额"],
                }
            ]
        }
        this.setState({
            exportShow: true,
            exportLabel: "正在获取所有数据！",
            page: 0,
            percent: 30
        }, async () => {
            let list = this.state.list
            if (type === 'all') {
                let result = await select_problem()
                list = result['list']
            }

            this.setState({
                exportLabel: "正在处理数据！",
                percent: 65
            }, () => {
                //    处理数据

                this.setState({
                    exportLabel: "正在导出数据，请等待！",
                    percent: 95
                }, () => {
                    this.setState({
                        exportLabel: "",
                        exportShow: false
                    }, () => {
                        option['datas'][0]['sheetData'] = list
                        let Excels = new JsExcel(option)
                        Excels.saveExcel()

                    })

                })
            })
        })
    }
    // 导出财务考勤表
    ExportcwExcel = (type) => {
        if (this.state.sortTypes !== 'cwkq' && type === 'one') {
            return message.error("抱歉,当前的筛选的数据源不是财务考勤表,请进行筛选后重试！")
        }
        let date = new Date()
        let option = {
            fileName: `财务考勤表${(date.getMonth()) + 1 + "月" + date.getDate() + "日"}`,
            datas: [
                {
                    sheetData: [],
                    sheetName: 'sheet',
                    sheetFilter: ["员工姓名", "备注", "实到人数", "工号", '倍数', '倍数明细', '其它倍数', '出勤情况', '是否请假', '班别', '班组', '考勤编号',
                        '补贴薪资', '请假时间', '请假类型'],
                    sheetHeader: ["员工姓名", "备注", "实到人数", "工号", '倍数', '倍数明细', '其它倍数', '出勤情况', '是否请假', '班别', '班组', '考勤编号',
                        '补贴薪资', '请假时间', '请假类型'],
                }
            ]
        }
        this.setState({
            exportShow: true,
            exportLabel: "正在获取所有数据！",
            page: 0,
            percent: 30
        }, async () => {
            let list = this.state.list
            if (type === 'all') {
                let result = await select_caiwu_kaoqing()
                list = result['list']
            }

            this.setState({
                exportLabel: "正在处理数据！",
                percent: 65
            }, () => {
                //    处理数据

                this.setState({
                    exportLabel: "正在导出数据，请等待！",
                    percent: 95
                }, () => {
                    this.setState({
                        exportLabel: "",
                        exportShow: false
                    }, () => {
                        option['datas'][0]['sheetData'] = list
                        let Excels = new JsExcel(option)
                        Excels.saveExcel()

                    })

                })
            })
        })
    }
    // 搜索内容
    onSearch = async () => {
        PubSub.subscribe("selectData", async (_, d) => {
            this.setState({
                spinShow: true
            })
            let { data, type } = d
            if (type === 'salary') {
                notification.open({
                    key: "message",
                    message: "操作提醒:",
                    description: "您当前正在操作薪资信息查询,请耐心等待数据渲染......",
                    duration: 0
                })
                if (data['type'] === '') {
                    data['type'] = "Kqcode"
                }
                let result = await search_content(data)

                this.setState({
                    list: result['list'],
                    total: result['list'].length,
                    tableType: type,
                    spinShow: false,
                    sortTypes: ""
                })
            } else {
                let { sortType } = d;

                // 人事报表查询
                if (sortType === '') {
                    sortType = "kaoqmingxi"
                }

                switch (sortType) {
                    // 考勤编号

                    case "kaoqmingxi": {
                        notification.open({
                            key: "message",
                            message: "操作提醒:",
                            description: `您当前正在操作[人事信息查询]-[考勤明细列表] | 由于此类别数据量足够庞大，故在所有查询中根据日期排序降序查询,仅展示前一万条,导出亦如此！
                            建议根据条件进行筛选查询！请耐心等待数据渲染......
                            `,
                            duration: 0
                        })
                        let { list } = await select_kaoqing(data)
                        this.setState({
                            tableType: type,
                            list,
                            total: list?.length,
                            spinShow: false,
                            sortTypes: sortType

                        }, () => {
                            console.log(this.state.sortTypes);
                        })
                        break;
                    }

                    // 请假类别
                    case "qjia": {

                        notification.open({
                            key: "message",
                            message: "操作提醒:",
                            description: `您当前正在操作[人事信息查询]-[请假类别查询] | 由于此类别数据量足够庞大，故在所有查询中根据日期排序降序查询,仅展示前一万条,导出亦如此！
                        建议根据条件进行筛选查询！请耐心等待数据渲染......
                        `,
                            duration: 0
                        })
                        let result = await select_qingjia(data)
                        this.setState({
                            tableType: type,
                            list: result['list'],
                            total: result['list'].length,

                            spinShow: false,
                            sortTypes: sortType

                        }, () => {
                            console.log(this.state.sortTypes);
                        })
                        break;
                    }
                    // 工资汇总
                    case "huizon": {
                        data['personCode'] = data['content']


                        notification.open({
                            key: "message",
                            message: "操作提醒:",
                            description: `您当前正在操作[人事信息查询]-[工资汇总类别查询]| 建议根据条件进行筛选查询！请耐心等待数据渲染......
                            `,
                            duration: 0
                        })
                        let result = await select_salary_total(data)
                        this.setState({
                            tableType: type,
                            list: result['list'],
                            total: result['list']?.length,

                            spinShow: false,
                            sortTypes: sortType

                        }, () => {
                            console.log(this.state.sortTypes);
                        })
                        break;
                    }
                    // 车间产量
                    case "chanliang": {
                        data['WorkshopName'] = data['work']

                        notification.open({
                            key: "message",
                            message: "操作提醒:",
                            description: `您当前正在操作[人事信息查询]-[车间总产量查询]| 因为计算量足够复杂，故需要较多的执行时间！请耐心等待数据渲染......
                                `,
                            duration: 0
                        })
                        let result = await select_depart_salary(data)
                        this.setState({
                            tableType: type,
                            list: result['list'],
                            total: result['list']?.length,

                            spinShow: false,
                            sortTypes: sortType

                        }, () => {
                            console.log(this.state.sortTypes);
                        })
                        break;
                    }
                    // 问题处理单
                    case "wenti": {
                        notification.open({
                            key: "message",
                            message: "操作提醒:",
                            description: `您当前正在操作[人事信息查询]-[问题处理单查询]| ！请耐心等待数据渲染......
                                `,
                            duration: 0
                        })
                        let result = await select_problem(data)
                        this.setState({
                            tableType: type,
                            list: result['list'],
                            total: result['list']?.length,

                            spinShow: false,
                            sortTypes: sortType

                        }, () => {
                            console.log(this.state.sortTypes);
                        })
                        break;
                    }
                    // 财务考勤表
                    case "cwkq": {
                        notification.open({
                            key: "message",
                            message: "操作提醒:",
                            description: `您当前正在操作[人事信息查询]-[财务考勤表查询]| 由于此类别数据量足够庞大，故在所有查询中根据日期排序降序查询,仅展示前一万条,导出亦如此！
                            建议根据条件进行筛选查询！请耐心等待数据渲染......
                            `,
                            duration: 0
                        })
                        let result = await select_caiwu_kaoqing(data)
                        console.log(result);
                        this.setState({
                            tableType: type,
                            list: result['list'],
                            total: result['list']?.length,

                            spinShow: false,
                            sortTypes: sortType

                        }, () => {
                            console.log(this.state.sortTypes);
                        })
                        break;
                    }
                    default: {
                        return;
                    }
                }
            }

        })

    }
    componentWillUnmount() {
        PubSub.unsubscribe("selectData")
    }
    // 筛选时间

    render() {
        const { list, total, drawerShow, sortData, exportLabel, exportShow, percent, tableType, spinShow, sortTypes } = this.state

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
        // 薪资信息查询
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
        // 考勤明细
        const kqcolums = [
            {
                title: "日期",

                index: "Data",
                render: (date) => {
                    const { Data } = date;
                    let d = new Date(Data)

                    return <span>{d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()}</span>
                }
            }, {
                title: "工号",
                dataIndex: "PersonCode",
                key: "PersonCode"
            }, {
                title: "姓名",
                dataIndex: "PersonName",
                key: "PersonName"
            }, {
                title: "班组",
                dataIndex: "TeamName",
                key: "TeamName"
            }, {
                title: "部门",
                dataIndex: "cdepname",
                key: "cdepname"
            }, {
                title: "职位",
                dataIndex: "cdutycode",
                key: "cdutycode"
            }, {
                title: "当日薪资",
                dataIndex: "Wages",
                key: "Wages"
            }, {
                title: "工作时间",
                dataIndex: "AttendanceRecord",
                key: "AttendanceRecord"
            }, {
                title: "工作日",
                dataIndex: "bs",
                key: "bs"
            }, {
                title: "确认人员",
                dataIndex: "Entry_Person",
                key: "Entry_Person"
            }
        ]

        // 请假明细
        const qjcolums = [
            {
                title: "日期",

                key: "Data",
                render: (date) => {
                    const { Data } = date;
                    let d = new Date(Data)

                    return <span>{d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()}</span>
                }
            },
            { title: "工号", dataIndex: "PersonCode", key: "PersonCode" },
            { title: "姓名", dataIndex: "PersonName", key: "PersonName" },
            { title: "车间", dataIndex: "WorkshopName", key: "WorkshopName" },
            { title: "班组", dataIndex: "TeamName", key: "TeamName" },
            { title: "请假类别", dataIndex: 'qjlb', key: "qjlb" },
            { title: "请假时间", dataIndex: 'qjsj', key: "qjsj" }
        ]
        // 工资汇总
        const salarycolums = [
            {
                title: "工号",
                dataIndex: "工号",
                key: "Personid"
            }, {
                title: "姓名",
                dataIndex: "姓名",
                key: "name"
            }, {
                title: "部门",
                dataIndex: "部门",
                key: "depart"
            }, {
                title: "职务",
                dataIndex: "职务",
                key: "zhiwu"
            }, {
                title: "总计",
                dataIndex: "总计",
                key: "zonji"
            }, {
                title: "工作日",
                dataIndex: "工作日",
                key: "work"
            }
        ]
        // 车间产量明细表
        const canliangcolums = [
            {
                title: "车间",
                dataIndex: "车间",
                key: "chejian"
            }, {
                title: "工序编码",
                dataIndex: "工序编码",
                key: "gonxu"
            }, {
                title: "工序名称",
                dataIndex: "工序名称",
                key: "name"
            }, {
                title: "工序产量",
                dataIndex: "工序产量",
                key: "chanliang"
            }, {
                title: "金额",
                key: "jine",
                render: (d) => {
                    const { 金额 } = d;

                    return <span>{金额.toFixed(4)}</span>
                }
            }
        ]
        // 问题处理单
        const problemcolums = [
            {
                title: "日期", key: "date", render: (date) => {
                    const { 日期 } = date;
                    let d = new Date(日期)

                    return <span>{d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()}</span>
                }
            },
            { title: "供应商", dataIndex: "供应商", key: "gys" },
            { title: "不良原因", dataIndex: "不良原因", key: "buliang" },
            {
                title: "金额", key: "jine", render: (d) => {
                    const { 金额 } = d
                    return <span>{金额.toFixed(4)}</span>
                }
            }
        ]
        // 财务汇总表
        const caiwucolums = [
            {
                title: "员工姓名",
                dataIndex: "员工姓名",
                key: "name",
                fixed: 'left',
                width: 80
            },
            {
                title: "备注",
                dataIndex: "备注",
                key: "beizhu",
                width: 100,
            },
            {
                title: "实到人数",
                dataIndex: "实到人数",
                key: "number",
                width: 80,
            },
            {
                title: "工号",
                dataIndex: "工号",
                key: "card",
                width: 80,
            }, {
                title: "倍数",
                dataIndex: "倍数",
                key: "beishu",
                width: 80,
            }, {
                title: "倍数明细",
                dataIndex: "倍数明细",
                key: "beishumingxi",
                width: 100,
            }, {
                title: "其它倍数",
                dataIndex: "其它倍数",
                key: "other",
                width: 80,

            },
            {
                title: "出勤情况",
                dataIndex: "出勤情况",
                key: "chuqing",
                width: 100,
            }, {
                title: "单价(1-15)",
                key: "danjia", width: 200,
                render: (d) => {
                    let content = ""

                    for (const item in d) {
                        if (item.indexOf("单价") !== -1) {
                            if (d[item]) {
                                content += (`<span style='color:green;'>${d[item]}</span> | `)
                            }



                        }
                    }

                    return <div dangerouslySetInnerHTML={{ __html: content }} ></div>
                }
            }
            , {
                title: "工序名称(1-15)",
                key: "gxname", width: 200,
                render: (d) => {
                    let content = ""

                    for (const item in d) {
                        if (item.indexOf("工序名称") !== -1) {
                            if (d[item]) {
                                content += (`<span style='color:green;'>${d[item]}</span> | `)
                            }



                        }
                    }

                    return <div dangerouslySetInnerHTML={{ __html: content }} ></div>
                }
            }, {
                title: "工序编码(1-15)",
                key: "gxcode", width: 200,
                render: (d) => {
                    let content = ""

                    for (const item in d) {
                        if (item.indexOf("工序编码") !== -1) {
                            if (d[item]) {
                                content += (`<span style='color:green;'>${d[item]}</span> | `)
                            }



                        }
                    }

                    return <div dangerouslySetInnerHTML={{ __html: content }} ></div>
                }
            },
            {
                title: "产量(1-15)",
                key: "chanliang", width: 200,
                render: (d) => {
                    let content = ""

                    for (const item in d) {
                        if (item.indexOf("产量") !== -1) {
                            if (d[item]) {
                                content += (`<span style='color:green;'>${d[item]}</span> | `)
                            }



                        }
                    }

                    return <div dangerouslySetInnerHTML={{ __html: content }} ></div>
                }
            }, {
                title: "日期",
                key: "date", width: 100,
                render: (de) => {
                    const { 日期 } = de
                    let d = new Date(日期)
                    return <span>{d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()}</span>
                }
            }, {
                title: "是否请假",
                dataIndex: "是否请假",
                key: "qingjia",
                width: 100,
            }, {
                title: "班别",
                dataIndex: "班别",
                key: "class",
                width: 100,
            }, {
                title: "班组",
                dataIndex: "班组",
                key: "banzu",
                width: 100,
            }, {
                title: "编制人数",
                key: "bianzhinumber",
                dataIndex: "编制人数",
                width: 100,
            }, {
                title: "考勤编号",
                dataIndex: "考勤编号",
                key: "kqcode",
                width: 150,

            }, {
                title: "补贴薪资",
                dataIndex: "补贴薪资",
                key: "butie",
                width: 80
            }, {
                title: "补贴金额(1-3)",
                key: "butiejine", width: 150,
                render: (d) => {
                    let content = ""

                    for (const item in d) {
                        if (item.indexOf("补贴金额") !== -1) {
                            if (d[item]) {
                                content += (`<span style='color:green;'>${d[item]}</span> | `)
                            }



                        }
                    }

                    return <div dangerouslySetInnerHTML={{ __html: content }} ></div>
                }
            }
            , {
                title: "补贴项目(1-3)",
                key: "butieItem", width: 150,
                render: (d) => {
                    let content = ""

                    for (const item in d) {
                        if (item.indexOf("补贴项目") !== -1) {
                            if (d[item]) {
                                content += (`<span style='color:green;'>${d[item]}</span> | `)
                            }



                        }
                    }

                    return <div dangerouslySetInnerHTML={{ __html: content }} ></div>
                }
            }, {
                title: "计件薪资(1-15)",
                key: "jssalarys", width: 150,
                render: (d) => {
                    let content = ""

                    for (const item in d) {
                        if (item.indexOf("计件薪资") !== -1) {
                            if (d[item]) {
                                content += (`<span style='color:green;'>${d[item]}</span> | `)
                            }



                        }
                    }

                    return <div dangerouslySetInnerHTML={{ __html: content }} ></div>
                }
            }, {
                title: "计时小时数(1-3)",
                key: "jshours", width: 150,
                render: (d) => {
                    let content = ""

                    for (const item in d) {
                        if (item.indexOf("计时小时数") !== -1) {
                            if (d[item]) {
                                content += (`<span style='color:green;'>${d[item]}</span> | `)
                            }



                        }
                    }

                    return <div dangerouslySetInnerHTML={{ __html: content }} ></div>
                }
            }, {
                title: "计时薪资(1-3)",
                key: "jsxinsalary", width: 150,
                render: (d) => {
                    let content = ""

                    for (const item in d) {
                        if (item.indexOf("计时薪资") !== -1) {
                            if (d[item]) {
                                content += (`<span style='color:green;'>${d[item]}</span> | `)
                            }



                        }
                    }

                    return <div dangerouslySetInnerHTML={{ __html: content }} ></div>
                }
            }, {
                title: "计时项目(1-3)",
                key: "jsitems", fixed: "right", width: 200,
                render: (d) => {
                    let content = ""

                    for (const item in d) {
                        if (item.indexOf("计时项目") !== -1) {
                            if (d[item]) {
                                content += (`<span style='color:green;'>${d[item]}</span> | `)
                            }



                        }
                    }

                    return <div dangerouslySetInnerHTML={{ __html: content }} ></div>
                }
            }, {
                title: "请假时间",
                key: "qjtime",
                dataIndex: "请假时间",
                fixed: "right",
                width: 100

            }, {
                title: "请假类别",
                key: "qjtype",
                dataIndex: "请假类别",
                fixed: "right",
                width: 100

            }, {
                title: "车间名称",
                key: "workName",
                dataIndex: "车间名称",
                fixed: "right",
                width: 200
            }


        ]
        return (
            <div className="query">
                <Row>

                    <Col
                        span={12}
                    >
                        <Card
                            title="薪资信息查询"
                        >
                            <Selects
                                selectValue={
                                    {
                                        "Kqcode": "考勤单号",
                                        "WorkshopName": "车间名称",
                                        "TeamName": "班组",
                                        "glyn": "管理中心审核状态",
                                        "rsyn": "人事部审核状态",
                                        "cwyn": "财务部审核状态"
                                    }
                                }
                                type="salary"

                            ></Selects>
                        </Card>
                    </Col>

                    <Col
                        span={12}
                    >
                        {/*人事信息查询  */}
                        <Card
                            title="人事信息查询"

                        >
                            <Selects
                                selectValue={
                                    {
                                        "kaoqmingxi": "考勤明细",
                                        "qjia": "请假明细",
                                        "huizon": "汇总工资表",
                                        "chanliang": "车间产量汇总表",

                                        "wenti": "问题处理单",
                                        "cwkq": "财务考勤表",
                                    }
                                }
                                type="person"
                            ></Selects>

                        </Card>

                    </Col>
                </Row>

                <div className="table">
                    <Table
                        scroll={{ x: 1300 }}
                        columns={tableType === 'salary' ? colums : (

                            (sortTypes === 'kaoqmingxi' && kqcolums) ||
                            (sortTypes === 'qjia' && qjcolums)
                            || (sortTypes === 'huizon' && salarycolums) ||
                            (sortTypes === 'chanliang' && canliangcolums) ||
                            (sortTypes === 'wenti' && problemcolums) ||
                            (sortTypes === 'cwkq' && caiwucolums)
                        )}
                        dataSource={list}
                        loading={spinShow}
                        pagination={{
                            total, pageSize: 10, onChange: (v) => {
                                if (tableType === 'salary') {
                                    this.initData(v * 10)
                                }

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
                            <Popover
                                title="请选择导出数据源?"
                                zIndex={99999}
                                content={
                                    <div>
                                        <Button type="primary" onClick={() => { this.ExportExcel("all") }} >导出全部薪资</Button>
                                        <Button type="dashed" onClick={() => { this.ExportExcel("one") }} style={{ marginLeft: 4 }}>导出当前筛选</Button>
                                    </div>
                                }
                            >
                                <Button type="primary"  >导出薪资信息</Button>
                            </Popover>

                            <Popover
                                title="请选择导出数据源"
                                zIndex={99999}
                                content={
                                    <div>
                                        <Button type="primary" onClick={() => { this.ExportKqExcel("all") }}>导出全部薪资</Button>
                                        <Button type="dashed" onClick={() => { this.ExportKqExcel("one") }} style={{ marginLeft: 4 }}>导出当前筛选</Button>
                                    </div>
                                }
                            >
                                <Button type="primary"  >导出考勤明细</Button>
                            </Popover>

                            {/* 导出请假明细 */}
                            <Popover
                                title="请选择导出数据源"
                                zIndex={99999}
                                content={
                                    <div>
                                        <Button type="primary" onClick={() => { this.ExportqjExcel("all") }}>导出全部明细</Button>
                                        <Button type="dashed" onClick={() => { this.ExportqjExcel("one") }} style={{ marginLeft: 4 }}>导出当前筛选</Button>
                                    </div>
                                }
                            >
                                <Button type="primary"  >导出请假明细</Button>
                            </Popover>
                            {/* ExporthzExcel */}
                            {/* 导出汇总工资表明细 */}
                            <Popover
                                title="请选择导出数据源"
                                zIndex={99999}
                                content={
                                    <div>
                                        <Button type="primary" onClick={() => { this.ExporthzExcel("all") }}>导出全部明细</Button>
                                        <Button type="dashed" onClick={() => { this.ExporthzExcel("one") }} style={{ marginLeft: 4 }}>导出当前筛选</Button>
                                    </div>
                                }
                            >
                                <Button type="primary"  >导出汇总工资明细</Button>
                            </Popover>
                            {/* 车间产量汇总表 */}
                            <Popover
                                title="请选择导出数据源"
                                zIndex={99999}
                                content={
                                    <div>
                                        <Button type="primary" onClick={() => { this.ExporcjzExcel("all") }}>导出全部明细</Button>
                                        <Button type="dashed" onClick={() => { this.ExporcjzExcel("one") }} style={{ marginLeft: 4 }}>导出当前筛选</Button>
                                    </div>
                                }
                            >
                                <Button type="primary"  >导出车间产量汇总表</Button>
                            </Popover>
                            {/* 导出问题处理单*/}
                            <Popover
                                title="请选择导出数据源"
                                zIndex={99999}
                                content={
                                    <div>
                                        <Button type="primary" onClick={() => { this.ExportwtExcel("all") }}>导出全部明细</Button>
                                        <Button type="dashed" onClick={() => { this.ExportwtExcel("one") }} style={{ marginLeft: 4 }}>导出当前筛选</Button>
                                    </div>
                                }
                            >
                                <Button type="primary"  >导出问题处理单</Button>
                            </Popover>
                            {/* 导出财务考勤表*/}
                            <Popover
                                title="请选择导出数据源"
                                zIndex={99999}
                                content={
                                    <div>
                                        <Button type="primary" onClick={() => { this.ExportcwExcel("all") }}>导出全部明细</Button>
                                        <Button type="dashed" onClick={() => { this.ExportcwExcel("one") }} style={{ marginLeft: 4 }}>导出当前筛选</Button>
                                    </div>
                                }
                            >
                                <Button type="primary"  >导出财务考勤表</Button>
                            </Popover>
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