import { Button, Card, Table, Tabs, Popconfirm, message, Modal, Input, Select, Tag, Spin } from 'antd'
import Form from 'antd/lib/form/Form'
import FormItem from 'antd/lib/form/FormItem'
import { subscribe, unsubscribe } from 'pubsub-js'
import React, { Component } from 'react'
import { selectAllNews, deleteContent, updateWorkshop, insertWorkshop, insertTeam, alterTeam, insertPerson, updatePerson, selectPerson,insertProcess } from "../../axios/index"
import Work from "./workDetail"
import Utils from "../../sortComponents/utils/utils"
// 导出插件
import JsExcel from "js-export-excel"
const { Option } = Select
const { TabPane } = Tabs
// 引入工具栏

export default class Setting extends Component {
    state = {
        work: [],
        workFinal: [],
        team: [],
        teamFinal: [],
        teamWorkFinal: [],
        subsidyProject: [],
        project: [],
        process: [],
        person: [],
        HY_Department: [],
        workShow: false,
        workBm: "一部",
        type: "alter",
        teamWorkValue: "CJ0001",
        teamBm: "一部",
        teamShow: false,
        teamType: "add",
        workDetailShow: false,
        personShow: false,
        personType: "add",
        spinShow: true,
        processFinal:[],
        processShow:false,
        processType:"add",
        processWork:"",
        processBm:"一部"

    }
    componentDidMount() {

        this.initData()
        this.jianshi()
    }

    // 初始化数据
    initData = async () => {
        this.setState({
            spinShow: true
        })

        let { data } = await selectAllNews()

        this.setState({
            work: data['work'],
            workFinal: data['work'],
            team: data['team'],
            teamFinal: data['team'],
            teamWorkFinal: data['team'],
            subsidyProject: data['subsidyProject'],
            project: data['project'],
            process: data['process'],
            processFinal:data['process'],
            HY_Department: data['HY_Department'],
            spinShow: false
        })


    }
    // 删除指定内容
    onDelete = async (name, code) => {
        let data = ""
        let type = ""
        switch (name) {
            case "work":
                data = "Workshop"
                type = "WorkshopCode"
                break;
            case "team":
                data = "Team"
                type = "TeamCode"
                break;
            case "person":
                
                data = "Person"
                type = "PersonCode"
                break;
            case "process":
                data = "Process"
                type = "Code"
                break;
            case "project":
                data = "Project"
                type = "ProjectCode"
                break;
            case "subsidyProject":
                data = "SubsidyProject"
                type = "Id"
                break;
            case "hY_Department":
                data = "HY_Department"
                type = "d_ID"
                break;
            default:
                return message.error("抱歉，服务器异常啦...")

        }

        // 调用api删除内容
       
        let { status } = await deleteContent(data, type, code)
        if (status) {
            
            message.success("恭喜你，删除数据成功！")
            if(data==='Person'){
                this.onSelectPerson("员工信息")
            }else {
                this.initData()
            }
        } else {
            message.error("抱歉，删除数据失败！")
        }


    }
    // 修改车间信息
    updateWorkshop = async () => {


        try {
            let validate = await this.WorkRef.validateFields()
            if (this.state.type === 'alter') {
                let { status } = await updateWorkshop(validate)
                if (status) {
                    this.setState({
                        workShow: false
                    }, () => {
                        message.success("恭喜你，更新车间信息成功！")
                        this.initData()
                    })
                } else {
                    throw new Error("抱歉，更新车间信息失败！")
                }
            } else {
                let { status } = await insertWorkshop(validate['WorkshopName'], this.state.workBm)
                if (status) {
                    this.setState({
                        workShow: false
                    }, () => {
                        message.success("恭喜你，添加一条车间信息成功！")
                        this.initData()
                    })
                } else {
                    throw new Error("抱歉，添加一条车间信息失败！")
                }

            }
        } catch {
            message.error("车间名称不能为空！或者服务器出现故障....")
        }



    }
    resetWorkshop = async () => {
        this.WorkRef && await this.WorkRef.resetFields();


    }
    resetTeam = async () => {
        this.refTeam && await this.refTeam.resetFields();


    }
    // 添加一条班组信息
    insertOneTeam = async () => {

        try {
            let result = await this.refTeam.validateFields()
            result['WorkshopCode'] = this.state.teamWorkValue
            result['bm'] = this.state.teamBm
            if (this.state.teamType === 'add') {
                let { status } = await insertTeam(result)
                if (status) {
                    this.setState({
                        teamShow: false,
                    }, () => {
                        message.success("添加班组信息成功！")
                        this.initData()
                    })
                } else throw new Error("添加班组信息失败！")
            } else {
                let { status } = await alterTeam(result)
                if (status) {
                    this.setState({
                        teamShow: false,
                    }, () => {
                        message.success("修改班组信息成功！")
                        this.initData()
                    })
                } else throw new Error("修改班组信息失败！")
            }
        } catch {
            message.error("请将表单项填写完整，或者服务器请求出现故障....")
        }

    }
    // 班组修改
    alterTeam = async (TeamName, TeamCode, number, bm, WorkshopCode) => {



        this.setState({
            teamBm: bm[0],
            teamWorkValue: WorkshopCode[0],
            teamShow: true,
            teamType: "edit",
        }, () => {
            this.resetTeam()
            this.refTeam.setFieldsValue({
                TeamCode,
                TeamName,
                number,

            })
        })

    }
    // 取消内容
    jianshi = () => {
        // 取消按钮
        subscribe("cancel", () => {
            this.setState({
                workDetailShow: false
            })
        })
        // 搜索事件
        subscribe("setTeam", (_, d) => {

            const { type } = d
            let data = []
            if (type === 'all') {
                data = this.state.team
            } else {
                console.log(data);
                data = this.state.team.filter((item) => {

                    return item['WorkshopName'] && item['WorkshopName'].includes(d.value);
                })
            }
            window.setTimeout(() => {

                this.setState({
                    teamWorkFinal: data
                })
            }, 300)
        })

        // li选中事件
        subscribe("setItemData", (_, d) => {
            const { WorkshopCode, TeamCode } = d

            this.personRef.setFieldsValue({
                WorkshopCode: WorkshopCode[0],
                Teamcode: TeamCode

            })
        })
    }
    // 员工清空
    resetPerson = () => {
        this.personRef && this.personRef.resetFields()
    }
    componentWillUnmount() {
        unsubscribe("cancel")
        unsubscribe("setTeam")
        unsubscribe("setItemData")
    }
    // 查询所有员工信息
    onSelectPerson = async (v) => {
        if (v === '员工信息') {
            this.setState({
                spinShow: true
            })
            let data = await selectPerson()
            this.setState({
                person: data['Person'],
                personFinal: data['Person'],
                spinShow: false
            })
        }
    }
    // 添加和修改员工信息
    addPerson = async () => {
        try {
            let result = await this.personRef.validateFields()
            if (this.state.personType === 'add') {
                //添加内容
                let { status } = await insertPerson(result)
                if (status) {
                    this.setState({
                        personShow: false
                    }, () => {
                        message.success("恭喜你，插入一条员工信息成功！")
                        this.onSelectPerson("员工信息")

                    })
                } else throw new Error("抱歉，添加失败！")
            } else {
                let { status } = await updatePerson(result)
                if (status) {
                    this.setState({
                        personShow: false
                    }, () => {
                        message.success("恭喜你，修改员工信息成功！")
                        this.onSelectPerson("员工信息")

                    })
                } else throw new Error("抱歉，修改失败！")
            }
        } catch {
            message.error("请完善表单内容,或者服务器开小差......")
        }


    }
    // 导出工序
    export2process=()=>{
        const {process}=this.state
        let date=new Date()
        let data=process.map((item)=>{
            item['车间']=item['cj']
            item['工序编码']=item['Code']
            item['工序名称']=item['Name']
            item['单价']=item['UnitPrice']
            return item;
        })


      let option={
        fileName:`工序工价${(date.getMonth())+1+"月"+date.getDate()+"日"}`,
        datas:[
           {
            sheetData:data,
            sheetName:'sheet',
            sheetFilter: ["车间", "工序编码", "工序名称", "单价"],
            sheetHeader: ["车间", "工序编码", "工序名称", "单价"], 
           }
        ]
      }  
     let Excel=new JsExcel(option)
     Excel.saveExcel()
    }
    // 修改和添加工序
    insertProcess=async()=>{

        try{
            let result=await this.processRef.validateFields()
            result['cj']=this.state.processWork
            result['bm']=this.state.processBm
            let {status}=await insertProcess(result)
            if(status){
                this.setState({
                    processShow:false,
                    processWork:this.state.work[0]['WorkshopName']
                },()=>{
                    message.success("恭喜你，添加一条工序成功！")
                    this.initData()

                })
            }else throw new Error("message")
        }catch{
            message.error("请将表单内容填写完整！")
        }

    }
    render() {
        const { work, team, person, process, project, subsidyProject, HY_Department, workShow, workBm, type, teamWorkValue, teamBm
            , teamShow, teamType, workDetailShow, personShow, spinShow,processShow,processWork,processBm
        } = this.state
        //    车间信息
        const WorkColumns = [
            {
                title: "车间编码",
                dataIndex: "WorkshopCode",
                key: "WorkshopCode"
            }, {
                title: "车间名称",
                dataIndex: "WorkshopName",
                key: "WorkshopName"
            }, {
                title: "所属部门",
                dataIndex: "bm",
                key: "bm",
                filters: [
                    {
                        text: "一部",
                        value: "一部"
                    }, {
                        text: "二部",
                        value: "二部"
                    }
                ],
                onFilter: (value, record) => {

                    return record.bm === value
                }
            }, {
                title: "操作",
                key: "caozuo",
                render: (d) => {
                    const { WorkshopName, WorkshopCode } = d
                    return <div>
                        <Button type="primary" onClick={() => {
                            this.setState({
                                workShow: true,
                                type: "alter"
                            }, () => {
                                this.WorkRef.setFieldsValue({
                                    WorkshopCode,
                                    WorkshopName
                                })


                            })

                        }}>修改</Button>
                        <span style={{ marginLeft: 15 }}></span>
                        <Popconfirm placement="topRight" title={'您确定要删除[' + WorkshopName + ']车间吗?'} onConfirm={() => {
                            this.onDelete('work', WorkshopCode)
                        }} okText="确定" cancelText="取消">
                            <Button type="default" >删除</Button>
                        </Popconfirm>

                    </div>
                }
            }


        ]
        //班组信息
        const TeamColumns = [
            {
                title: "车间编码",
                key: "WorkshopCode",
                render: (d) => {
                    const { WorkshopCode } = d
                    return <span>{WorkshopCode[0]}</span>
                }
            },
            {
                title: "车间名称",
                key: "WorkshopCode",
                dataIndex: "WorkshopName"
            }, {
                title: "班组编码",
                dataIndex: "TeamCode",
                key: "TeamCode"
            }, {
                title: "班组名称",
                dataIndex: "TeamName",
                key: "TeamName"
            }, {
                title: "编制人数",
                dataIndex: "number",
                key: "number"
            }, {
                title: "部门",

                key: "bm",
                render: (d) => {
                    const { bm } = d
                    return <span>{bm[0]}</span>

                },
                filters: [
                    {
                        text: "一部",
                        value: "一部"
                    }, {
                        text: "二部",
                        value: "二部"
                    }
                ],
                onFilter: (value, record) => {

                    return record.bm[0] === value
                }
            }, {
                title: "操作",
                key: "caozuo",
                render: (d) => {
                    let { TeamName, TeamCode, number, bm, WorkshopCode } = d

                    return <div>
                        <Button type="primary" onClick={() => {
                            this.alterTeam(TeamName, TeamCode, number, bm, WorkshopCode)
                        }}>修改</Button>
                        <span style={{ marginLeft: 15 }}></span>
                        <Popconfirm placement="topRight" title={'您确定要删除[' + TeamName + ']班组吗?'} onConfirm={() => {
                            this.onDelete('team', TeamCode)
                        }} okText="确定" cancelText="取消">
                            <Button type="default" >删除</Button>
                        </Popconfirm>

                    </div>
                }
            }
        ]
        // 员工信息
        // TeamCode: null

        const PersonColumns = [
            {
                title: "员工编号",
                dataIndex: "PersonCode",
                key: "PersonCode"
            }, {
                title: "员工姓名",
                dataIndex: "PersonName"
            }, {
                title: "所属车间",
                dataIndex: "WorkshopName",
                key: "WorkshopName"
            }, {
                title: "所属班组",
                dataIndex: "TeamName",
                key: "TeamName"
            }, {
                title: "车间编码",

                key: "WorkshopCode",
                render: (d) => {
                
                    return <span>{d['WorkshopCode']}</span>
                }
            }, {
                title: "班组编码",
                dataIndex: "TeamCode",
                key: "TeamCode"
            }, {
                title: "操作",
                key: "caozuo",
                render: (d) => {
                    const { PersonName, PersonCode, TeamCode, WorkshopCode } = d
                    return <div>
                        <Button type="primary" onClick={() => {
                            this.setState({
                                personType: "edit",
                                personShow: true
                            }, () => {
                                this.personRef.setFieldsValue({
                                    Teamcode: TeamCode,
                                    WorkshopCode: WorkshopCode,
                                    PersonCode,
                                    PersonName
                                })
                            })
                        }}>修改</Button>
                        <span style={{ marginLeft: 15 }}></span>
                        <Popconfirm placement="topRight" title={'您确定要删除[' + PersonName + ']吗?'} onConfirm={() => {
                            this.onDelete('person', PersonCode)
                        }} okText="确定" cancelText="取消">
                            <Button type="default" >删除</Button>
                        </Popconfirm>

                    </div>
                }
            }
        ]
        //    工序工价
        const ProcessColumns = [
            {
                title: "车间名称",
                dataIndex: "cj",
                key: "cj"
            }, {
                title: "工序编码",
                dataIndex: "Code",
                key: "Code"
            }, {
                title: "工序名称",
                dataIndex: "Name",
                key: "Name"
            }, {
                title: "单价",
                dataIndex: "UnitPrice",
                key: "UnitPrice"
            }, {
                title: "部门",
                dataIndex: "bm",
                key: "bm",
                filters: [
                    {
                        text: "一部",
                        value: "一部"
                    }, {
                        text: "二部",
                        value: "二部"
                    }
                ],
                onFilter: (value, record) => {

                    return record.bm === value
                }
            }, {
                title: "操作",
                key: "caozuo",
                render: (d) => {
                    const { Name, Code } = d
                    return <div>
                        <Button type="primary">修改</Button>
                        <span style={{ marginLeft: 15 }}></span>
                        <Popconfirm placement="topRight" title={'您确定要删除[' + Name + ']工序吗?'} onConfirm={() => {
                            this.onDelete('process', Code)
                        }} okText="确定" cancelText="取消">
                            <Button type="default" >删除</Button>
                        </Popconfirm>

                    </div>
                }
            }
        ]
        //    计时项目
        const ProjectColumns = [
            {
                title: "项目大类",
                dataIndex: "ParentCode",
                key: "ParentCode"
            },
            {
                title: "项目小类",
                dataIndex: "ProjectName",
                key: "ProjectName"
            },
            {
                title: "工资",
                dataIndex: "Money",
                key: "Money"
            }, {
                title: "部门",
                dataIndex: "bm",
                key: "bm",
                filters: [
                    {
                        text: "一部",
                        value: "一部"
                    }, {
                        text: "二部",
                        value: "二部"
                    }
                ],
                onFilter: (value, record) => {

                    return record.bm === value
                }
            }, {
                title: "操作",
                key: "caozuo",
                render: (d) => {
                    const { ProjectCode, ProjectName } = d
                    return <div>
                        <Button type="primary">修改</Button>
                        <span style={{ marginLeft: 15 }}></span>
                        <Popconfirm placement="topRight" title={'您确定要删除[' + ProjectName + ']项目吗?'} onConfirm={() => {
                            this.onDelete('project', ProjectCode)
                        }} okText="确定" cancelText="取消">
                            <Button type="default" >删除</Button>
                        </Popconfirm>

                    </div>
                }
            }
        ]
        // 补贴项目
        const SubsidyProjectColumns = [
            {
                title: "编号",
                dataIndex: "Id",
                key: "Id"
            }, {
                title: "补贴名称",
                dataIndex: "SubsidyName",
                key: "SubsidyName"
            }, {
                title: "金额",
                dataIndex: "Price",
                key: "Price"
            }, {
                title: "部门",
                dataIndex: "bm",
                key: "bm",
                filters: [
                    {
                        text: "一部",
                        value: "一部"
                    }, {
                        text: "二部",
                        value: "二部"
                    }
                ],
                onFilter: (value, record) => {

                    return record.bm === value
                }
            }, {
                title: "操作",
                key: "caozuo",
                render: (d) => {
                    const { SubsidyName, Id } = d
                    return <div>
                        <Button type="primary">修改</Button>
                        <span style={{ marginLeft: 15 }}></span>
                        <Popconfirm placement="topRight" title={'您确定要删除[' + SubsidyName + ']项目吗?'} onConfirm={() => {
                            this.onDelete('subsidyProject', Id)
                        }} okText="确定" cancelText="取消">
                            <Button type="default" >删除</Button>
                        </Popconfirm>

                    </div>
                }
            }
        ]
        //    请假类别
        const HY_DepartmentColumns = [
            {
                title: "编号",
                dataIndex: "d_ID",
                key: "d_ID"
            }, {
                title: "类别名称",
                dataIndex: "d_Name",
                key: "d_Name"
            }, {
                title: "部门",
                dataIndex: "bm",
                key: "bm",
                filters: [
                    {
                        text: "一部",
                        value: "一部"
                    }, {
                        text: "二部",
                        value: "二部"
                    }
                ],
                onFilter: (value, record) => {

                    return record.bm === value
                }
            }, {
                title: "操作",
                key: "caozuo",
                render: (d) => {
                    const { d_Name, d_ID } = d
                    return <div>
                        <Button type="primary">修改</Button>
                        <span style={{ marginLeft: 15 }}></span>
                        <Popconfirm placement="topRight" title={'您确定要删除[' + d_Name + ']类别吗?'} onConfirm={() => {
                            this.onDelete('hY_Department', d_ID)
                        }} okText="确定" cancelText="取消">
                            <Button type="default" >删除</Button>
                        </Popconfirm>

                    </div>
                }
            }
        ]
        return (
            <div className="setting">
                <div className="top" style={{ position: "fixed", left: "50%", top: "35%", zIndex: 99999, display: spinShow ? '' : 'none' }}>
                    <Spin size="large" tip="正在拼命获取数据中...."></Spin>
                </div>
                <div className="center" style={{ display: !spinShow ? '' : 'none' }}>
                    <Card
                    >
                        <Tabs type="line" onChange={(v) => {
                            this.onSelectPerson(v)
                        }} >
                            <TabPane tab="车间信息" key="车间信息">
                                <div className="utils" style={{ margin: 10 }}>
                                    <Button type="primary" onClick={

                                        () => {
                                            this.resetWorkshop()
                                            this.setState({
                                                workShow: true,
                                                type: "add"
                                            })
                                        }
                                    }>添加车间</Button>
                                    <Input placeholder="输入车间名称进行检索" style={{ width: 400, marginLeft: 15 }} onInput={(e) => {
                                        let { value } = e.target
                                        let time = null;
                                        if (value.trim()) {

                                            let data = this.state.workFinal.filter((item) => {
                                                return item['WorkshopName'].includes(value)
                                            })
                                            time && (time = null)
                                            time = window.setTimeout(() => {
                                                this.setState({
                                                    work: [...data]
                                                })

                                            }, 500)


                                        } else {
                                            this.initData()
                                        }


                                    }}></Input>
                                </div>
                                <Table
                                    columns={WorkColumns}
                                    dataSource={work}
                                    bordered={true}

                                ></Table>
                            </TabPane>
                            <TabPane tab="班组信息" key="班组信息">
                                <div className="utils" style={{ margin: 10 }}>
                                    <Button type="primary" onClick={

                                        () => {
                                            this.resetWorkshop()
                                            this.setState({
                                                teamShow: true,
                                                teamType: "add"
                                            })
                                        }
                                    }>添加车间</Button>
                                    <Input placeholder="输入班组名称进行检索" style={{ width: 400, marginLeft: 15 }} onInput={(e) => {
                                        let { value } = e.target
                                        let time = null;
                                        if (value.trim()) {

                                            let data = this.state.teamFinal.filter((item) => {
                                                return item['TeamName'].includes(value)
                                            })
                                            time && (time = null)
                                            time = window.setTimeout(() => {
                                                this.setState({
                                                    team: [...data]
                                                })

                                            }, 500)


                                        } else {
                                            this.initData()
                                        }


                                    }}></Input>
                                </div>
                                <Table
                                    columns={TeamColumns}
                                    dataSource={team}
                                    bordered={true}
                                ></Table>

                            </TabPane>
                            <TabPane tab="员工信息" key="员工信息">
                                <div className="utils" style={{ margin: 10 }}>
                                    <Button type="primary" onClick={

                                        () => {
                                            this.resetPerson()
                                            this.setState({
                                                personShow: true,
                                                personType: "add"
                                            })
                                        }
                                    }>添加员工</Button>
                                    <Input placeholder="输入员工名称进行检索" style={{ width: 400, marginLeft: 15 }} onInput={(e) => {
                                        let { value } = e.target
                                        let time = null;
                                        if (value.trim()) {

                                            let data = this.state.personFinal.filter((item) => {
                                                return item['PersonName'].includes(value)
                                            })
                                            time && (time = null)
                                            time = window.setTimeout(() => {
                                                this.setState({
                                                    person: [...data]
                                                })

                                            }, 500)


                                        } else {
                                            this.initData()
                                        }


                                    }}></Input>
                                </div>
                                <Table
                                    columns={PersonColumns}
                                    dataSource={person}
                                    bordered={true}
                                ></Table>


                            </TabPane>
                            <TabPane tab="工序工价" key="工序工价">
                            <div className="utils" style={{ margin: 10 }}>
                                    <Button type="primary" onClick={

                                        () => {
                                            
                                            this.setState({
                                                processShow: true,
                                                processType: "add",
                                                processWork:work[0]&&work[0]['WorkshopName']
                                            })
                                        }
                                    }>添加工序</Button>
                                    <Input placeholder="输入工序名称进行检索" style={{ width: 400, marginLeft: 15 }} onInput={(e) => {
                                        let { value } = e.target
                                        let time = null;
                                        if (value.trim()) {

                                            let data = this.state.processFinal.filter((item) => {
                                                return item['Name'].includes(value)
                                            })
                                            time && (time = null)
                                            time = window.setTimeout(() => {
                                                this.setState({
                                                    process: [...data]
                                                })

                                            }, 500)


                                        } else {
                                            this.initData()
                                        }


                                    }}></Input>
                                </div>
                                <div><Utils>
                                    <div><Button size="large" type="primary" onClick={this.export2process}>导出Excel</Button></div>
                                </Utils></div>
                                <Table
                                    columns={ProcessColumns}
                                    dataSource={process}
                                    bordered={true}
                                ></Table>

                            </TabPane>
                            <TabPane tab="计时项目" key="计时项目">
                                <Table
                                    columns={ProjectColumns}
                                    dataSource={project}
                                    bordered={true}
                                ></Table>

                            </TabPane>
                            <TabPane tab="补贴项目" key="补贴项目">
                                <Table
                                    columns={SubsidyProjectColumns}
                                    dataSource={subsidyProject}
                                    bordered={true}
                                ></Table>

                            </TabPane>
                            <TabPane tab="请假类别" key="请假类别">

                                <Table
                                    columns={HY_DepartmentColumns}
                                    dataSource={HY_Department}
                                    bordered={true}
                                ></Table>
                            </TabPane>
                        </Tabs>
                    </Card>
                </div>
                <div className="utils">
                    {/* 修改modul  workmodul*/}
                    <Modal
                        title="修改车间信息"
                        visible={workShow}
                        okText={type === 'alter' ? "修改" : '添加'}
                        cancelText="取消"
                        onOk={this.updateWorkshop}
                        onCancel={() => {
                            this.setState({
                                workShow: false

                            })
                        }}
                    >
                        <Form
                            ref={node => this.WorkRef = node}
                        >
                            <FormItem
                                label="车间编码"
                                name="WorkshopCode"
                                style={{ display: type === "alter" ? '' : "none" }}
                            >
                                <Input disabled={true} />
                            </FormItem>

                            <FormItem
                                label="车间名称"
                                name="WorkshopName"
                                rules={[{
                                    required: true, message: "请务必填写车间名称", trigger: "blur"
                                }]}
                            >
                                <Input />

                            </FormItem>

                            <FormItem
                                label="部门"
                                name="bm"
                                style={{ display: type === "add" ? '' : "none" }}
                            >
                                <Select defaultValue={workBm} onChange={(v) => {
                                    this.setState({
                                        workBm: v
                                    })


                                }}>
                                    <Option value="一部">一部</Option>
                                    <Option value="二部">二部</Option>
                                </Select>

                            </FormItem>
                        </Form>
                    </Modal>

                    {/*班组modul  */}
                    <Modal
                        visible={teamShow}
                        title={teamType === 'add' ? "添加一条班组信息" : '修改此条班组信息'}
                        okText="确定"
                        cancelText="取消"
                        onCancel={() => {
                            this.setState({
                                teamShow: false
                            })
                        }}
                        onOk={this.insertOneTeam}
                    >
                        <Form
                            ref={node => this.refTeam = node}

                        >
                            <FormItem
                                label="关联车间"
                                name="WorkShopName"
                            >
                                <Select

                                    name="WorkShopName"
                                    defaultValue={teamWorkValue}
                                    onChange={(v) => {
                                        this.setState({
                                            teamWorkValue: v
                                        })

                                    }}
                                >
                                    {work.map((item, index) => {

                                        return <Option key={index} value={item['WorkshopCode']} ><Tag color={item['bm'] === '一部' ? 'green' : 'blue'}>{item['bm']}</Tag> {item['WorkshopName']}</Option>
                                    })}
                                </Select>
                            </FormItem>

                            <FormItem
                                label="编制人数"
                                name="number"

                            >
                                <Input type="number"></Input>
                            </FormItem>

                            <FormItem
                                label="班组名称"
                                name="TeamName"
                                rules={
                                    [
                                        { "required": true, message: "班组名称不能为空！", trigger: "blur" }
                                    ]
                                }
                            >
                                <Input />
                            </FormItem>

                            <FormItem
                                label="班组编号"
                                name="TeamCode"
                                style={{ display: teamType === 'add' ? 'none' : '' }}
                            >
                                <Input disabled={true} />
                            </FormItem>
                            <FormItem
                                label="班组编号"
                            >
                                <Select

                                    value={teamBm}
                                    onChange={(v) => {
                                        this.setState({
                                            teamBm: v
                                        })
                                    }}
                                >
                                    <Option value="一部" >一部</Option>
                                    <Option value="二部" selected>二部</Option>
                                </Select>
                            </FormItem>
                        </Form>

                    </Modal>
                    {/*员工modul  */}
                    <Modal
                        visible={personShow}
                        title={this.state.personType === 'add' ? "添加一条员工记录" : "修改一条员工记录"}
                        okText={this.state.personType === 'add' ? "添加" : "修改"}
                        cancelText="取消"
                        onOk={this.addPerson}
                        onCancel={() => {
                            this.setState({
                                personShow: false
                            })
                        }}
                    >
                        <Form
                            ref={node => this.personRef = node}
                            labelCol={{ span: 4 }}
                        >
                            {/* 员工编号 */}
                            <FormItem
                                label="员工编号"
                                name="PersonCode"
                                rules={
                                    [
                                        { required: true, message: "请输入员工编号", trigger: "blur" }
                                    ]
                                }
                            >
                                <Input  disabled={this.state.personType==='add'?false:true}/>
                            </FormItem>
                            {/* 员工姓名 */}
                            <FormItem
                                label="员工姓名"
                                name="PersonName"
                                rules={
                                    [
                                        { required: true, message: "请输入员工姓名", trigger: "blur" }
                                    ]
                                }
                            >
                                <Input />
                            </FormItem>

                            <FormItem
                                label="车间编码"
                                name="WorkshopCode"

                            >
                                <Input readOnly={true} onClick={
                                    () => {

                                        this.setState({
                                            workDetailShow: true
                                        })
                                    }
                                }></Input>
                            </FormItem>

                            <FormItem
                                label="班组编码"
                                name="Teamcode"

                            >
                                <Input readOnly={true} onClick={
                                    () => {

                                        this.setState({
                                            workDetailShow: true
                                        })
                                    }
                                }></Input>
                            </FormItem>

                        </Form>

                    </Modal>
                    {/* 选择车间信息 */}
                    <Work show={workDetailShow} team={this.state.teamWorkFinal} work={this.state.workFinal} />

                   {/*工序名称  */}
                   <Modal
                   visible={processShow}
                   title="添加一条工序信息"
                   okText="添加"
                   cancelText="取消"
                   onOk={()=>{
                       this.insertProcess()
                   }}
                   onCancel={()=>{
                       this.setState({
                           processShow:false
                       })
                   }}
                   >
                       <Form
                       ref={node=>this.processRef=node}
                       >
                           <FormItem
                           label="车间名称"
                           >
                               <Select
                                value={processWork}
                                onChange={(v)=>{
                                    this.setState({
                                        processWork:v
                                    })
                                }}
                               >
                                    {work.map((item,index)=>{

                                        return <Option value={item['WorkshopName']} key={index}>{item['WorkshopName']}</Option>

                                    })}

                               </Select>
                           </FormItem>
                            
                            <FormItem
                            label="工序名称"
                            name="Name"
                            rules={
                                [
                                    {required:true,message:"请输入工序名称",trigger:"blur"}
                                ]
                            }
                            >
                                <Input/>
                            </FormItem>

                            <FormItem
                            label="工序编码"
                            name="Code"
                            rules={
                                [
                                    {required:true,message:"请输入工序编码",trigger:"blur"}
                                ]
                            }
                            >
                                <Input/>

                            </FormItem>

                            <FormItem
                            name="UnitPrice"
                            label="工序单价"
                            rules={
                                [
                                    {required:true,message:"请输入工序单价",trigger:"blur"}
                                ]
                            }
                            >
                                <Input/>
                            </FormItem>

                            <FormItem
                            name="bm"
                            label="所属部门"

                            >
                                <Select
                                name="bm"
                                 defaultValue={processBm}
                                 onChange={(v)=>{
                                     this.setState({processBm:v})
                                 }}
                                >
                                    <Option value="一部">一部</Option>
                                    <Option value="二部">二部</Option>
                                </Select>
                            </FormItem>
                       </Form>
                   </Modal>
                </div>
            </div>
        )


    }




}