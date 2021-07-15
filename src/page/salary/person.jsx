import React, { Component } from "react"
import { Row, Col, Tag, Divider, Input, message, Select, Badge, Button } from "antd"
import Checkbox from "antd/lib/checkbox/Checkbox"
import Form from "antd/lib/form/Form"
import FormItem from "antd/lib/form/FormItem"

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
        formData:{}

    }

    componentDidMount() {

        this.initContains()
        this.initData()
       window.setTimeout(()=>{
        this.initForm()
       },1000)
    }



    initContains = () => {
        if (window.localStorage.getItem("_item_")) {
            this.setState({
                process: JSON.parse(window.localStorage.getItem("_item_"))
            }, () => {
                // 初始化form表单是部分数据
               


            })
        }

    }
    // 加载数据
    initData = () => {



    }

    static getDerivedStateFromProps(props) {

        const { label, person, index, result } = props
        // 获取考勤信息
        let kq = JSON.parse(window.localStorage.getItem("_kq_"))
        const { bm } = kq
        let projectArr = []
        let subsidyProjectArr = []
        if (bm === 'yibu') {
            projectArr = result['data']?.project.filter((item) => {

                return item['bm'] === '一部'
            })
            subsidyProjectArr = result['data']?.subsidyProject.filter((item) => {

                return item['bm'] === '一部'
            })
        } else {
            projectArr = result['data']?.project.filter((item) => {

                return item['bm'] !== '一部'
            })
            subsidyProjectArr = result['data']?.subsidyProject.filter((item) => {

                return item['bm'] === '一部'
            })
        }

        return {
            label,
            person,
            key: index,
            kq,
            project: projectArr,
            subsidyProject: subsidyProjectArr
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
        }, () => {

        })
        //    本地缓存

        // }catch{
        //     message.error("抱歉，员工工号只能是数字！")
        // }

    }


    // 设置本地缓存
    setLocalStorage = (value, content) => {
        let user = window.localStorage.getItem("_user_")
        let userArr = []
        if (!user) {
            let obj = {
            }
            obj[value] = content
            userArr.push(obj)
        } else {
            userArr = JSON.parse(user)
            let obj = userArr.find((item) => item[value] === value)
            if (!obj) {
                let obj = {
                }
                obj[value] = content
                userArr.push(obj)
            } else {
                userArr = userArr.filter((item) => item[value] !== value)
                obj[value] = content
                userArr.push(obj)
            }

        }
        userArr = JSON.stringify(userArr)
        window.localStorage.setItem("_user_", userArr)
    }

    // 回显数据
    initForm = () => {
        let arr = Object.values(this.state.process)
        let formData={
            AttendanceRecord:10
         }
        for(var i=0;i<arr.length;i++){
            let item=arr[i]
            let price=Number(item['cl'])*Number(item['UnitPrice'])
            formData[`PieceworkWage${i+1}`]=price
        }
        console.log(formData);
        this.setState({
            formData
        })

 



    }


    render() {
        const { label, personObj, key, project, subsidyProject,formData } = this.state


        return (
            <div>
                <Row>
                    <Col offset={23}>

                        <Badge count={key + 1}>

                        </Badge>
                    </Col>
                </Row>
                <Row >

                    {label.map((item, index) => {
                        return (

                            <Col span={4} key={index} >
                                <Form style={{ display: "flex", margin: "8px 0" }} ref={node=>this.FormRef=node} >
                                    <Tag color="green" style={{ margin: "5px 5px", height: 22 }}>{item.replaceAll("|", "") + ":"}</Tag>
                                    {(item === '工号') &&
                                        <FormItem>
                                            <Input onInput={(e) => {
                                                this.onInputPerson(e, 'PersonCode', index)
                                            }}></Input>
                                        </FormItem>
                                    }
                                    {(item === '姓名') && <Input disabled={true} placeholder={personObj?.PersonName}></Input>}
                                    {(item === '出勤情况') &&
                                        <FormItem
                                            name="AttendanceRecord"
                                            initialValue={formData?.AttendanceRecord}
                                        >
                                            <Input ></Input>
                                        </FormItem>
                                    }
                                    {(item === '部门') && <Input disabled={true} placeholder={personObj?.cdutycode}></Input>}

                                    {(item === '计时项目1') && <FormItem
                                        name="ProjectName"
                                    >
                                        <Select
                                            placeholder="请选择计时项目1"
                                        >
                                            {project.map((item, index) => {

                                                return (
                                                    <Option key={index} value={item['ProjectName']}>{item['ProjectName']}</Option>
                                                )
                                            })}

                                        </Select>
                                    </FormItem>}
                                    {(item === '计时小时数1' &&
                                        <FormItem
                                            name="Hours"
                                        >
                                            <Input></Input>
                                        </FormItem>
                                    )}
                                    {(item === '计时薪资1' &&
                                        <FormItem
                                            name="HourlyWage"
                                        >
                                            <Input></Input>
                                        </FormItem>
                                    )}
                                    {(item === '计时项目2') &&
                                        <FormItem name="ProjectName2">
                                            <Select
                                                placeholder="请选择计时项目2"
                                            >
                                                {project.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item['ProjectName']}>{item['ProjectName']}</Option>
                                                    )
                                                })}
                                            </Select>
                                        </FormItem>
                                    }
                                    {(item === '计时小时数2' &&
                                        <FormItem
                                            name="Hours2"
                                        >
                                            <Input></Input>
                                        </FormItem>
                                    )}
                                    {(item === '计时薪资2' &&
                                        <FormItem
                                            name="HourlyWage2"
                                        >
                                            <Input></Input>
                                        </FormItem>
                                    )}
                                    {(item === '计时项目3') &&
                                        <FormItem name="ProjectName3">
                                            <Select
                                                placeholder="请选择计时项目2"
                                            >
                                                {project.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item['ProjectName']}>{item['ProjectName']}</Option>
                                                    )
                                                })}
                                            </Select>
                                        </FormItem>
                                    }
                                    {(item === '计时小时数3' &&
                                        <FormItem
                                            name="Hours3"
                                        >
                                            <Input></Input>
                                        </FormItem>
                                    )}
                                    {(item === '计时薪资3' &&
                                        <FormItem
                                            name="HourlyWage3"
                                        >
                                            <Input></Input>
                                        </FormItem>
                                    )}

                                    {(item === '计件平均工资') && <Select

                                        placeholder="选择平均工资"
                                    >
                                        <Option value="计件工人的平均工资">计件工人的平均工资</Option>
                                        <Option value="次生产线的平均工资">次生产线的平均工资</Option>
                                    </Select>}
                                    {(item === '计时薪资') &&
                                        <FormItem
                                            name="jsxj"
                                        >
                                            <Input></Input>
                                        </FormItem>
                                    }
                                    {(item === '计件薪资') && <FormItem
                                        name="jjxz"
                                    >
                                        <Input></Input>
                                    </FormItem>}
                                    {(item === '补贴薪资') && <FormItem
                                        name="btxz"
                                    >
                                        <Input></Input>
                                    </FormItem>}
                                    {(item === '当日薪资') && <FormItem
                                        name="daywage"
                                    >
                                        <Input></Input>
                                    </FormItem>}
                                    {(item === '倍数') && <FormItem
                                        name="bs"
                                    >
                                        <Input></Input>
                                    </FormItem>}
                                    {(item === '其他倍数') && <FormItem
                                        name="qtbs"
                                    >
                                        <Input></Input>
                                    </FormItem>}
                                    {(item === '是否请假') && <Checkbox style={{ marginTop: 5 }}></Checkbox>}
                                    {/* 工序 */}
                                    {(item.split("|")?.length === 2) && <Checkbox checked={true} style={{ marginTop: 5 }}></Checkbox>}
                                    {/* 工序平均工资 */}
                                    {(item.split("|")?.length === 3) && <Checkbox style={{ marginTop: 5 }}></Checkbox>}
                                    {(item === '补贴项目1') &&
                                        <FormItem
                                            name="SubsidyProject"
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
                                    }
                                    {(item === '补贴金额1') &&
                                        <FormItem name="Subsidy">
                                            <Input></Input>
                                        </FormItem>
                                    }
                                    {(item === '补贴项目2') && <FormItem
                                        name="SubsidyProject2"
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
                                    </FormItem>}
                                    {(item === '补贴金额2') && <FormItem
                                        name="Subsidy2"
                                    >
                                        <Input></Input>
                                    </FormItem>}
                                    {(item === '补贴项目3') && <FormItem
                                        name="SubsidyProject3"
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
                                    </FormItem>}
                                    {(item === '补贴金额3') && <FormItem
                                        name="Subsidy3"
                                    >
                                        <Input></Input>
                                    </FormItem>}
                                    {(item === '计件薪资1') && <FormItem
                                        name="PieceworkWage1"
                                    
                                    >
                                        <Input placeholder={FormData?.PieceworkWage1}></Input>
                                    </FormItem>}
                                    {(item === '计件薪资2') && <FormItem
                                        name="PieceworkWage2"
                                        initialValue={FormData?.PieceworkWage2}
                                    >
                                        <Input></Input>
                                    </FormItem>}
                                    {(item === '计件薪资3') && <FormItem
                                        name="PieceworkWage3"
                                        initialValue={FormData?.PieceworkWage3}
                                    >
                                        <Input></Input>
                                    </FormItem>}
                                    {(item === '计件薪资4') && <FormItem
                                        name="PieceworkWage4"
                                        initialValue={FormData?.PieceworkWage4}
                                    >
                                        <Input></Input>
                                    </FormItem>}
                                    {(item === '计件薪资5') && <FormItem
                                        name="PieceworkWage5"
                                    >
                                        <Input></Input>
                                    </FormItem>}
                                    {(item === '计件薪资6') && <FormItem
                                        name="PieceworkWage6"
                                    >
                                        <Input></Input>
                                    </FormItem>}
                                    {(item === '计件薪资7') && <FormItem
                                        name="PieceworkWage7"
                                    >
                                        <Input></Input>
                                    </FormItem>}
                                    {(item === '计件薪资8') && <FormItem
                                        name="PieceworkWage8"
                                    >
                                        <Input></Input>
                                    </FormItem>}
                                    {(item === '计件薪资9') && <FormItem
                                        name="PieceworkWage8"
                                    >
                                        <Input></Input>
                                    </FormItem>}
                                    {(item === '计件薪资10') && <FormItem
                                        name="PieceworkWage8"
                                    >
                                        <Input></Input>
                                    </FormItem>}
                                        
                                </Form>
                            </Col>

                        )
                    })}
                </Row>
                <Divider></Divider>
            </div>
        )


    }




}