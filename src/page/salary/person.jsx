import React, { Component } from "react"
import { Row, Col, Divider, Input, message, Select, Badge } from "antd"
import Checkbox from "antd/lib/checkbox/Checkbox"
import Form from "antd/lib/form/Form"
import FormItem from "antd/lib/form/FormItem"
import PubSub from "pubsub-js"
import "./css/person.css"
const { Option } = Select
export default class Person extends Component {

    state = {
        label: [],
        process: {},
        person: [],
        personObj: {},
        key: 0,
        result: {},
        project: [],
        subsidyProject: [],
        formData: {},
        HY_Department: [], //请假类别,
        is_qjia: false, //是否请假
        otherbs_show: false,
        ProjectName: "",//计时项目1
        ProjectName2: "", //计时项目2
        ProjectName3: "" //计时项目3

    }

    componentDidMount() {

        this.initContains()
        this.initData()
    }



    initContains = () => {
        if (window.localStorage.getItem("_item_")) {
            this.setState({
                process: JSON.parse(window.localStorage.getItem("_item_"))
            }, () => {
                // 初始化form表单是部分数据
                this.initForm()
            })
        }

    }
    // 加载数据
    initData = () => {
        PubSub.subscribe("loadProcess", (_) => {
            this.initForm()
        })


    }
    
    static getDerivedStateFromProps(props) {

        const { label, person, index, result } = props
        // 获取考勤信息
        let kq = window.localStorage.getItem("_kq_") && JSON.parse(window.localStorage.getItem("_kq_"))
        if (!kq) {
            return null;
        }
        const { bm } = kq
        let projectArr = []
        let subsidyProjectArr = []
        let HY_Department = []

        if (bm === 'yibu') {
            projectArr = result['data']?.project.filter((item) => {

                return item['bm'] === '一部'
            })
            subsidyProjectArr = result['data']?.subsidyProject.filter((item) => {

                return item['bm'] === '一部'
            })
            HY_Department = result['data']?.HY_Department.filter((item) => {

                return item['bm'] === '一部'
            })
        } else {
            projectArr = result['data']?.project.filter((item) => {

                return item['bm'] !== '一部'
            })
            subsidyProjectArr = result['data']?.subsidyProject.filter((item) => {

                return item['bm'] === '一部'
            })
            HY_Department = result['data']?.HY_Department.filter((item) => {

                return item['bm'] === '一部'
            })
        }

        return {
            label,
            person,
            key: index,
            kq,
            project: projectArr,
            subsidyProject: subsidyProjectArr,
            HY_Department
        }
    }

    // 输入内容

    onInputPerson = (e, type, item) => {
        // 根据id获取用户信息
        const { value } = e.target
        if (this.state.person.length === 0) {
            return message.error("请耐心等待数据渲染！")
        }

        // try{
        let obj = this.state.person.find((item) => Number(item['PersonCode']) === Number(value.trim()))
        this.setState({
            personObj: obj
        }, async () => {

        })

    }
    // 设置计时项目规则
    setJsItem = (e, type, state) => {
        // 判断是否大于出勤时间
        let AttendanceRecord = this.FormRef.getFieldValue("AttendanceRecord")
        AttendanceRecord = Number(AttendanceRecord)

        const { value } = e.target
        let content = Number(value)
        let process = 0

        if (content) {
            process = this.state.project.find((item) => item["ProjectName"] === this.state[state])

            if (!AttendanceRecord || AttendanceRecord < content) {
                message.error("计划时间不能大于出勤时间！")
                return e.target.value = 0
            }
        }

        this.FormRef.setFieldsValue({
            [type]: process ? process['Money'] * content : 0
        })
        this.setJsSalary()
    }

    // 设置计时薪资
    setJsSalary = () => {
        let HourlyWage = 0
        for (let i = 0; i < 3; i++) {
            let content = 0
            if (i === 0) {
                content = this.FormRef.getFieldValue(`HourlyWage`)
            } else {
                content = this.FormRef.getFieldValue(`HourlyWage${i + 1}`)
            }

            if (!content) {
                content = 0
            }
            HourlyWage += content

        }
        // 乘以 倍数
        let bs=1.0
        let bs_input=this.FormRef.getFieldValue("bs")

        if(Number(bs_input)){
            bs=Number(bs_input)
        }
        this.FormRef.setFieldsValue({
            jsxj: HourlyWage*bs
        })
        this.setDayWage()
    }
    // 设置当日金额
    setDayWage = () => {
        let jsxj = this.FormRef.getFieldValue("jsxj") ? this.FormRef.getFieldValue("jsxj") : 0
        let jjxz = this.FormRef.getFieldValue("jjxz") ? this.FormRef.getFieldValue("jjxz") : 0
        let btxz = this.FormRef.getFieldValue("btxz") ? this.FormRef.getFieldValue("btxz") : 0

        this.FormRef.setFieldsValue({
            daywage: (jsxj + jjxz + btxz)
        })


    }
    // 设置倍数
    setBs=(e)=>{
    const {value}=e.target
    let content=Number(value)
    let bs=1.0
    if(content ){
        if(content>8.0){
            bs=((content- 8.0) * 1.5 + 8.0)/content
        }
    }    
    // 
  // 计件乘以 倍数

            let bs_input=this.FormRef.getFieldValue("jjxz")
            let jj=Number(bs_input)

    this.FormRef.setFieldsValue({
        bs,
        jjxz:jj*bs

    })
    this.setJsSalary()


    }
    // 下拉选择设置计时项目规则

    selectJsItem = (type, contentType, state) => {
        let value = this.FormRef.getFieldValue(type)
        let content = Number(value)
        let process = 0
        if (Boolean(content)) {
            process = this.state.project.find((item) => item["ProjectName"] === this.state[state])

        }
        this.FormRef.setFieldsValue({
            [contentType]: process ? process['Money'] * content : 0
        })
        this.setJsSalary()
    }
    // 回显数据
    initForm = () => {
        let values = Object.values(this.state.process)
        // 计时薪资
        let jsxj = 0
        // 计件薪资
        let jjxz = 0
        // 补贴薪资

        let btxz = 0
        // 当日薪资

        let reduce = values.reduce((reduce, item, index) => {
            let cl = item['cl']
            let price = item['UnitPrice']
            reduce[`PieceworkWage${index + 1}`] = 0
            try {
                reduce[`PieceworkWage${index + 1}`] = Number(cl) + Number(price)
                jjxz += (Number(cl) + Number(price))
            } catch { }
            return reduce;
        }, {})



        this.FormRef?.setFieldsValue({
            ...reduce, jsxj, jjxz, btxz, daywage: jjxz,bs:1.0
        })



    }
    // 监听下一步更新数据


    testContet = () => {

        return this.state.key
    }

    render() {
        const { personObj, key, project, subsidyProject, process, HY_Department, is_qjia, otherbs_show, ProjectName } = this.state


        return (
            <div className="persons" style={{ width: "100%" }}>

                <Col style={{ width: 40 }}>


                </Col>

                <Row >

                    <div >

                        <Form ref={node => this.FormRef = node} style={{ display: "flex" }} >
                            <Badge count={key + 1} style={{ verticalAlign: "middle",marginTop:10 }}>

                            </Badge>
                            <FormItem
                                name="userCode"
                                label="工号"
                                rules={
                                    [
                                        { required: true, message: "工号不能为空！", trigger: "blur" }
                                    ]
                                }
                            >
                                <Input onInput={(e) => {
                                    this.onInputPerson(e, 'PersonCode')
                                }}></Input>
                            </FormItem>

                            <FormItem
                                name="PersonName"
                                label="用户姓名"

                            >
                                <Input disabled={true} placeholder={personObj?.PersonName}></Input>
                            </FormItem>

                            <FormItem
                                label='出勤情况'
                                name="AttendanceRecord"
                                rules={
                                    [
                                        { required: true, message: "出勤情况不能为空！", trigger: "blur" }
                                    ]
                                }
                            >
                                <Input onInput={e=>{
                                    this.setBs(e)
                                }}></Input>
                            </FormItem>

                            <FormItem
                                label="部门"
                                name="cdutycode"
                            >
                                <Input disabled={true} placeholder={personObj?.cdutycode}></Input>
                            </FormItem>
                            <FormItem
                                name="ProjectName"
                                label="计时项目1"
                            >
                                <Select
                                    placeholder="计时项目1"
                                    defaultValue={ProjectName}
                                    onSelect={v => {
                                        this.setState({
                                            ProjectName: v
                                        }, () => {
                                            this.selectJsItem("Hours", 'HourlyWage', 'ProjectName')
                                        })
                                    }}
                                >
                                    <Option value=""></Option>
                                    {project?.map((item, index) => {

                                        return (

                                            <Option key={index} value={item['ProjectName']}>{item['ProjectName']}</Option>
                                        )
                                    })}

                                </Select>
                            </FormItem>

                            <FormItem
                                name="Hours"
                                label="计时小时数1"
                            >
                                <Input onInput={e => {
                                    this.setJsItem(e, 'HourlyWage', 'ProjectName')
                                }} />
                            </FormItem>


                            <FormItem
                                name="HourlyWage"
                                label="计时薪资1"
                            >
                                <Input disabled={true} />
                            </FormItem>


                            <FormItem name="ProjectName2"
                                label="计时项目2"
                            >
                                <Select
                                    placeholder="请选择计时项目2"
                                    defaultValue={this.state.ProjectName2}
                                    onSelect={(v) => {
                                        this.setState({
                                            ProjectName2: v
                                        }, () => {
                                            this.selectJsItem("Hours2", 'HourlyWage2', 'ProjectName2')
                                        })
                                    }}
                                >
                                    <Option value=""></Option>
                                    {project?.map((item, index) => {
                                        return (
                                            <Option key={index} value={item['ProjectName']}>{item['ProjectName']}</Option>
                                        )
                                    })}
                                </Select>
                            </FormItem>


                            <FormItem
                                name="Hours2"
                                label="计时小时数2"
                            >
                                <Input onInput={e => {
                                    this.setJsItem(e, 'HourlyWage2', 'ProjectName2')
                                }} />
                            </FormItem>


                            <FormItem
                                name="HourlyWage2"
                                label="计时薪资2"
                            >
                                <Input disabled={true} />
                            </FormItem>
                            <FormItem name="ProjectName3"
                                label="计时项目3"
                            >
                                <Select
                                    placeholder="请选择计时项目3"
                                    onSelect={(v) => {
                                        this.setState({
                                            ProjectName3: v
                                        }, () => {
                                            this.selectJsItem("Hours3", 'HourlyWage3', 'ProjectName3')
                                        })
                                    }}
                                >
                                    <Option value=""></Option>
                                    {project?.map((item, index) => {
                                        return (
                                            <Option key={index} value={item['ProjectName']}>{item['ProjectName']}</Option>
                                        )
                                    })}
                                </Select>
                            </FormItem>


                            <FormItem
                                name="Hours3"

                                label="计时小时数3"
                                onInput={e => {
                                    this.setJsItem(e, 'HourlyWage3', 'ProjectName3')
                                }}
                            >
                                <Input />
                            </FormItem>


                            <FormItem
                                name="HourlyWage3"
                                label="计时薪资3"
                            >
                                <Input disabled={true} />
                            </FormItem>

                            <FormItem
                                label="平均工资"
                            >
                                <Select
                                    style={{ width: 151 }}
                                    placeholder="选择平均工资"
                                >
                                    <Option value="计件工人的平均工资">计件工人的平均工资</Option>
                                    <Option value="次生产线的平均工资">次生产线的平均工资</Option>
                                </Select>
                            </FormItem>

                            <FormItem
                                name="jsxj"
                                label="计时薪资"
                            >
                                <Input disabled={true} />
                            </FormItem>

                            <FormItem
                                name="jjxz"
                                label="计件薪资"
                            >
                                <Input disabled={true} />
                            </FormItem>
                            <FormItem
                                name="btxz"
                                label="补贴薪资"

                            >
                                <Input disabled={true} />
                            </FormItem>
                            <FormItem
                                name="daywage"
                                label="当日薪资"

                            >
                                <Input disabled={true} />
                            </FormItem>
                            <FormItem
                                name="bs"
                                label="倍数"
                            >
                                <Input />
                            </FormItem>
                            <FormItem
                                name="qtbs"
                                label="其他倍数"
                            >
                                <Input onInput={(e) => {
                                    const { value } = e.target
                                    let bs = Number(value)
                                    let flag = false
                                    if (Boolean(bs)) {
                                        flag = true
                                    }
                                    this.setState({
                                        otherbs_show: flag
                                    })
                                }}></Input>
                            </FormItem>


                            <FormItem
                                name="SubsidyProject"
                                label="补贴项目1"
                            >
                                <Select
                                    placeholder="选择补贴项目1"
                                >
                                    {subsidyProject?.map((item, index) => {
                                        return (
                                            <Option key={index} value={item['SubsidyName']}>{item['SubsidyName']}</Option>
                                        )
                                    })}

                                </Select>
                            </FormItem>


                            <FormItem name="Subsidy"
                                label="补贴金额"
                            >
                                <Input />
                            </FormItem>

                            <FormItem
                                name="SubsidyProject2"
                                label="补贴项目2"
                            >
                                <Select
                                    placeholder="选择补贴项目2"
                                >
                                    {subsidyProject?.map((item, index) => {
                                        return (
                                            <Option key={index} value={item['SubsidyName']}>{item['SubsidyName']}</Option>
                                        )
                                    })}

                                </Select>
                            </FormItem>
                            <FormItem
                                name="Subsidy2"
                                label="补贴金额2"
                            >
                                <Input />
                            </FormItem>
                            <FormItem
                                name="SubsidyProject3"
                                label="补贴项目3"
                            >
                                <Select
                                    placeholder="选择补贴项目3"
                                >
                                    {subsidyProject?.map((item, index) => {
                                        return (
                                            <Option key={index} value={item['SubsidyName']}>{item['SubsidyName']}</Option>
                                        )
                                    })}

                                </Select>
                            </FormItem>
                            <FormItem
                                name="Subsidy3"
                                label="补贴金额3"
                            >
                                <Input />
                            </FormItem>
                            <FormItem
                                name="PieceworkWage1"
                                label="计件薪资1"

                            >
                                <Input disabled={true} />
                            </FormItem>
                            <FormItem
                                name="PieceworkWage2"
                                label="计件薪资2"

                            >
                                <Input disabled={true} />
                            </FormItem>
                            <FormItem
                                name="PieceworkWage3"
                                label="计件薪资3"
                            >
                                <Input disabled={true} />
                            </FormItem>
                            <FormItem
                                name="PieceworkWage4"
                                label="计件薪资4"
                            >
                                <Input disabled={true} />
                            </FormItem>
                            <FormItem
                                name="PieceworkWage5"
                                label="计件薪资5"
                            >
                                <Input disabled={true} />
                            </FormItem>
                            <FormItem
                                name="PieceworkWage6"
                                label="计件薪资6"
                            >
                                <Input disabled={true} />
                            </FormItem>
                            <FormItem
                                name="PieceworkWage7"
                                label="计件薪资7"
                            >
                                <Input disabled={true} />
                            </FormItem>
                            <FormItem
                                name="PieceworkWage8"
                                label="计件薪资8"
                            >
                                <Input disabled={true} />
                            </FormItem>
                            <FormItem
                                name="PieceworkWage9"
                                label="计件薪资9"
                            >
                                <Input disabled={true} />
                            </FormItem>
                            <FormItem
                                name="PieceworkWage8"
                                label="计件薪资10"
                            >
                                <Input disabled={true} />
                            </FormItem>
                            <FormItem
                                label="是否请假"
                                className="qjia"
                            >
                                <Checkbox checked={is_qjia} style={{ marginTop: 5 }} onChange={(e) => {
                                    const { checked } = e.target
                                    this.setState({
                                        is_qjia: checked
                                    })
                                }}></Checkbox>
                                <Select
                                    style={{ display: is_qjia ? '' : 'none' }}

                                    placeholder="请假类别"
                                >
                                    {HY_Department?.map((item, index) => {

                                        return <Option key={index}>{item['d_Name']}</Option>
                                    })}

                                </Select>
                            </FormItem>
                            {/* 请假类别 */}


                            {/* 请假时间 */}
                            <FormItem
                                label="请假时间"
                                name="qjsj"
                                style={{ display: is_qjia ? '' : 'none' }}
                            >
                                <Input />
                            </FormItem>
                            <FormItem
                                name="code"
                                label="工序"
                                valuePropName="checked"
                                className="code"
                            >
                                {Object.values(process)?.map((item, index) => {

                                    return <Checkbox defaultChecked={true} key={index}>{item['Code']}</Checkbox>
                                })}
                            </FormItem>
                            {/* 工序选择 */}
                            <FormItem
                                name="bs_x"
                                valuePropName="checked"
                                label="其他倍数"
                                style={{ display: otherbs_show ? '' : 'none' }}
                                className="qjia"
                            >
                                {Object.values(process)?.map((item, index) => {

                                    return <Checkbox key={index}>{item['Code']}倍数</Checkbox>
                                })}

                            </FormItem>


                        </Form>
                    </div>



                </Row>

            </div>
        )


    }




}