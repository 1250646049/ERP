import React, { Component } from "react"
import { Table, Button, Spin, Drawer, Form, Input, Switch, DatePicker, Divider, message, Tag, Tooltip, Badge, Select } from "antd"

import {connect} from "react-redux"

//  导入请求

import "./css/yinshou.css"
import { selectYsk, addYinshou,alterYinshou} from "../../axios/index"

const {Option}=Select

 class Yinshou extends Component {
    state = {
        data: [],
        total: 0,
        flag: true,
        count: 0,
        currentId: "",
 
        shoukuanTime: "",
        status: false,
        fajianTime: "",
        visable: false,
        page: 1,
        type: true,
        mysqlId:"",
        mysql_type:"预收款"


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
        },()=>{
            console.log(this.state.data)

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
          
            shoukuanTime: mysql['riqi'],
            fajianTime: mysql['jiedian']
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
           
            result['riqi'] = this.state.shoukuanTime
            result['jiedian'] = this.state.fajianTime
            result['status'] = Number(this.state.status)
            result['AutoId'] = this.state.currentId
            result['type']=this.state.mysql_type
            result['name']=this.props.user['name']
            result['username']=this.props.user['username']
            if (this.state.type) {
                let data = await addYinshou(result)
                if (data.status) {
                    this.setState({
                        visable: false,
                        count: 0,
                        shoukuanTime: "",
                        fajianTime: "",
                        status: true,
                   
                    }, () => {

                        message.success(data['message'])

                        this.initData(this.state.page * 10)
                    })
                } else {
                    throw new Error("抱歉，请将内容填写完整！")
                }
            } else {
                result['id']=this.state.mysqlId;
                let data= await alterYinshou(result)
                if(data['status']){
                    message.success("恭喜你，修改记录成功！")
                    
                    this.setState({
                        visable:false,
                        count:0,
                    },()=>{
                        this.initData(this.state.page*10)
                    })
                }



            }
        }
        catch (err) {
            message.error(err)

        }
 
    }




    render() {
        const expendColumns = [
            {
                title: "付款方式",
                dataIndex: "type",
                key: "type"
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

                dataIndex: "shoujianren",
                key: "shoujianren"
            }, {
                title: "到期日期",

                dataIndex: "jiedian",
                key: "jiedian"
            }, {
                title: "信用额度",

                dataIndex: "edu",
                key: "额度"
            }, {
                title: "区域",

                dataIndex: "quyu",
                key: "quyu"
            },
            {
                title: "更新",
                key: "number",
                render: (d) => {
                    return <span>第{d['number']}添加</span>
                }
            },
            {
                title: "录入时间",
                key: "uptime",
                dataIndex: "uptime"
            },
            {
                title: "操作",
                key: "caozuo",
                render: (d) => {
                    const { AutoId,id } = d;
                    return <Button
                        type="dashed"
                        onClick={() => {
                            this.setState({
                              
                                visable: true,
                                currentId: AutoId,
                                type: false,
                                mysqlId:id
                            }, () => {
                                this.huixianForm(d);
                            })

                        }}
                    >
                        修改
                    </Button>
                }
            }
        ]
        const { data, total, flag,  status, visable, currentId, type,mysql_type } = this.state
        const columns = [
            {
                title: "订单号",
                dataIndex: "cbdlcode",
                key: "cbdlcode",
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
                fixed: "right", 
                key: "dDate",
                render: ({ dDate }) => {
                    let d = new Date(dDate)

                    return <span>{d.getFullYear() + '-' + (d.getMonth() + 1) + "-" + d.getDate()}</span>
                }
            }, {
                title: "订单数量",
                dataIndex: "iQuantity",
                key: "iQuantity",
                fixed: "right",
            }, {
                title: "订单金额(含税)",
                dataIndex: "iSum",
                key: "iSum",
                fixed: "right"
            }, {
                title: "是否结案",
                render: ({mysql}) => {

                    return (mysql.length&&(Number(mysql[mysql.length-1]['jiean'])===1 ? <Tag color="red"> 结案</Tag> : <Tag color="green"> 未结案</Tag>))|| <Tag color="green"> 未结案</Tag>
                },
                key: "jiean"
            } ,{
                title: "操作",
                render: (d) => {

                    return <div>
                        <Badge
                            count={d.mysql.length}
                        >
                            <Button type="primary" onClick={() => {
                                this.setState({
                                    currentId: d['AutoID'],
                                    type: true,
                                    visable: true,
                                    fajianTime: "",
                                    shoukuanTime: ""
                                }, () => {
                                    this.resetForm()

                                })

                            }} >添加</Button>
                        </Badge>
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
                                    dataSource={data.mysql}
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

                ></Table>

                <div className="utils">
                    <Drawer
                        title={type ? `添加[${currentId}]的内容` : `修改[${currentId}]的内容`}
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


                            {/* 付款方式 */}
                            <Form.Item
                                label="付款方式"
                                name="type"
                            >
                               <Select defaultValue={mysql_type} onChange={(d)=>{
                                   this.setState({
                                        mysql_type:d
                                   })
                               }} >
                                   <Option  value="预收款">预收款</Option>
                                   <Option  value="中期款">中期款</Option>
                                   <Option  value="尾款">尾款</Option>
                                   <Option  value="质保金">质保金</Option>
                               </Select>
                            </Form.Item>

                          

                            {/* 收款记录 */}
                          

                            {/* 收款日期 */}
                            <Form.Item
                                label={'收款日期'}
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
                                <label style={{ color: "red", marginLeft: 4, display: type ? 'none' : 'block' }}>无需修改则不录入</label>
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
                                label="到期日期"
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

                                }}>

                                </DatePicker>
                                <label style={{ color: "red", marginLeft: 4, display: type ? 'none' : 'block' }}>无需修改则不录入</label>

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

export default connect(state=>({
 user:state.user


}))(Yinshou)