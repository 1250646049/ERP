import moment from "moment"
import { Button, Card, Divider, Input, Modal, Radio, Steps, Form, DatePicker, Select, message } from "antd"
import FormItem from "antd/lib/form/FormItem"
import React, { Component } from "react"
import { selectAllNews } from "../../axios/index"
const { Step } = Steps
const { Option } = Select
export default class Kaoqin extends Component {

    state = {
        bm: "yibu",
        visible: false,
        current: 0,
        jijian: "1", //计件方式 1集体 2个人,
        classs: "baiban", //白班/晚班,
        work: [], //车间
        team: [], //班组
        finalTeam: [],
        teamContent: "",
        teamNumber: 0,
        date: `${new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + (new Date().getDate())}`,  //日期
        txdate: "", //调休日期
        addType: false,
        dateValue: new moment(`${new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + (new Date().getDate())}`, 'YYYY-MM-DD')

    }
    componentDidMount() {
        this.initData()

    }
    initData = async () => {
        let result = await selectAllNews()
        console.log(result);
        let work = []
        if (this.state.bm === 'yibu') {
            work = result['data']['work'].filter((item) => item['bm'] === '一部')
        } else {
            work = result['data']['work'].filter((item) => item['bm'] === '二部')
        }

        console.log(work);
        this.setState({
            work, finalTeam: result['data']['team']

        })


    }
    render() {
        const { bm, visible, current, jijian, classs, work, team, teamContent, addType, dateValue } = this.state
        return (
            <div className="kaoqin">
                <div className="utils">
                    <Modal
                        title="请选择需要维护的部门?"
                        visible={visible}
                        okText="选中"
                        cancelText="取消"
                        onOk={() => {
                            this.setState({
                                visible: false
                            })
                        }}

                    >

                        <div style={{ textAlign: "center" }}>

                            <Radio.Group onChange={(e) => {
                                this.setState({
                                    bm: e.target.value
                                })
                            }} value={bm}>
                                <Radio value="yibu">录入一部</Radio>
                                <Radio value="erbu">录入二部</Radio>
                            </Radio.Group>

                        </div>

                    </Modal>
                </div>

                <Steps current={current}>
                    <Step title="维护计件信息">
                    </Step>

                    <Step title="维护工序信息"></Step>

                    <Step title="关联员工信息"></Step>
                </Steps>

                {/* 维护计件信息 */}
                <div className="steps-content" style={{ marginTop: 10, display: current === 0 ? '' : 'none' }}>
                    <Card bordered={true} >
                        <div>
                            <Radio.Group value={jijian} style={{ display: bm === 'erbu' ? '' : 'none' }} onChange={(e) => {
                                const { value } = e.target
                                this.setState({
                                    jijian: value
                                })
                            }}>
                                <Radio value="1">集体计件</Radio>
                                <Radio value="2">个人计件</Radio>
                            </Radio.Group>
                            <Divider style={{ display: bm === 'erbu' ? '' : 'none' }} />
                            <div className="add">
                                <Form style={{ display: "flex", flexWrap: "wrap" }} ref={node => this.FormRef = node}>
                                    <FormItem
                                        label="考勤单号"
                                        name="kqcode"
                                        rules={
                                            [
                                                { required: true, message: "考勤单号不能为空！" }
                                            ]
                                        }
                                    >
                                        <Input style={{ width: 200 }} disabled={true}></Input>
                                    </FormItem>
                                    <FormItem
                                        label="日期"
                                        name="date"
                                        style={{ marginLeft: 15 }}
                                    >
                                        <DatePicker defaultValue={dateValue} onChange={d => {
                                            let content = ""
                                            if (!d) {
                                                content = ""
                                            } else {
                                                content = `${d.year() + "-" + (d.month() + 1) + "-" + d.date()}`

                                            }
                                            console.log(content);
                                            this.setState({
                                                date: content
                                            })
                                        }}></DatePicker>
                                    </FormItem>
                                    <FormItem
                                        label="车间名称"
                                        name="workName"
                                        style={{ marginLeft: 15 }}
                                    >
                                        <Select placeholder="请下拉选择车间名称！" onSelect={(v) => {
                                            let team = this.state.finalTeam.filter((item) => item['WorkshopCode'][0] === v)
                                            this.setState(
                                                {
                                                    team
                                                }
                                            )

                                        }}>
                                            {work?.map((item, index) => {

                                                return (<Option key={index} value={item['WorkshopCode']}>{item['WorkshopName']}</Option>)
                                            })}
                                        </Select>
                                    </FormItem>

                                    <FormItem
                                        label="班组"
                                        name="teamName"
                                        style={{ marginLeft: 15 }}

                                    >
                                        <Select
                                            placeholder={team?.length ? '请下拉多选班组信息' : '请先选择对应车间信息！'}
                                            onSelect={code => {

                                                let data = this.state.finalTeam?.find((item) => item['TeamCode'] === code)

                                                let v = data['TeamName']
                                                let number = data['number']

                                                let content = ""
                                                let num = 0
                                                console.log(number);
                                                if (this.state.bm === 'yibu') {
                                                    content = this.state.teamContent ? (this.state.teamContent + "," + v) : v
                                                    num = (this.state.teamNumber + Number(number))

                                                } else {
                                                    content = v
                                                    num = Number(number)
                                                }
                                                this.setState({
                                                    teamContent: content,
                                                    teamNumber: num
                                                }, () => {
                                                    this.FormRef.setFieldsValue({
                                                        number: num,
                                                        sdnumber: num

                                                    })
                                                })
                                            }}
                                        >
                                            {team?.map((item, index) => {

                                                return (<Option value={item['TeamCode']} key={index}>{item['TeamName']}</Option>)
                                            })}
                                        </Select>
                                        <Input disabled={true} value={teamContent}></Input>
                                    </FormItem>

                                    <FormItem
                                        label="编制人数"
                                        name="number"
                                        style={{ marginLeft: 15 }}
                                        rules={
                                            [
                                                { required: true, message: "编制人数不能为空！" }
                                            ]
                                        }
                                    >
                                        <Input disabled={true} ></Input>
                                    </FormItem>

                                    <FormItem
                                        label="实到人数"
                                        name="sdnumber"
                                        style={{ marginLeft: 15 }}
                                        rules={
                                            [
                                                { required: true, message: "实到人数不能为空！" }
                                            ]
                                        }
                                    >
                                        <Input ></Input>
                                    </FormItem>

                                    <FormItem
                                        label="是否调休"
                                        name="tiaoxiu"
                                        style={{ marginLeft: 15 }}

                                    >
                                        <DatePicker onChange={d => {
                                            let content = ""
                                            if (!d) {
                                                content = ""
                                            } else {
                                                content = `${d.year() + "-" + (d.month() + 1) + "-" + d.date()}`

                                            }
                                            console.log(content);
                                            this.setState({
                                                txdate: content
                                            })
                                        }}></DatePicker>
                                        <Radio.Group value={classs} style={{ marginLeft: 15 }} onChange={(e) => {
                                            const { value } = e.target
                                            this.setState({
                                                classs: value
                                            })
                                        }}>
                                            <Radio value="baiban">白班</Radio>
                                            <Radio value="wanban">晚班</Radio>
                                        </Radio.Group>
                                    </FormItem>

                                    {/* 新增 */}
                                    <FormItem

                                    >
                                        <Button type="primary" disabled={addType} onClick={() => {
                                            let kqcode = `kq-${new Date().getTime()}`



                                            this.setState({
                                                addType: true,


                                            }, () => {
                                                this.FormRef.setFieldsValue({
                                                    kqcode
                                                })
                                            })
                                        }}>新增 Add</Button>
                                    </FormItem>
                                </Form>

                            </div>
                        </div>
                    </Card>

                    <Button style={{ marginTop: 15 }} className="next" type="primary" onClick={async() => {
                        try{
                            await this.FormRef.validateFields()
                            this.setState({
                                current: 1
                            })
                        }catch{
                            message.error("请先完善输入框内容后执行下一步操作！",3)
                        }
                       
                         
                    }}>保存 下一步</Button>
                </div>

                {/* 维护工序信息 */}
                <div className="steps-content" style={{ marginTop: 10, display: current === 1 ? '' : 'none' }}>
                    <Card bordered={true} >

                    </Card>
                    <Button style={{ marginTop: 15, color: "white", background: "red" }} className="next" type="primary" onClick={() => {

                        this.setState({
                            current: 0
                        })
                    }}>回退 上一步</Button>
                    <Button style={{ marginTop: 15, marginLeft: 15 }} className="next" type="primary" onClick={() => {

                        this.setState({
                            current: 2
                        })
                    }}>保存 下一步</Button>
                </div>
                {/* 维护工序信息 */}
                <div className="steps-content" style={{ marginTop: 10, display: current === 2 ? '' : 'none' }}>
                    <Card bordered={true} >

                    </Card>
                    <Button style={{ marginTop: 15, color: "white", background: "red" }} className="next" type="primary" onClick={() => {

                        this.setState({
                            current: 1
                        })
                    }}>回退 上一步</Button>
                    <Button style={{ marginTop: 15, marginLeft: 15 }} className="next" type="primary">保存 提交数据</Button>
                </div>
            </div>
        )
    }





}