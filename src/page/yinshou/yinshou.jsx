import React, { Component } from "react"
import { Table, Button, Spin, Drawer, Form, Input, Switch, DatePicker, Divider, message, Tag, Tooltip, Badge, Select } from "antd"

import { connect } from "react-redux"

//  导入请求

import "./css/yinshou.css"
import { selectYsk, addYinshou, alterYinshou, searchYsk,deleteOrder, alterJiean } from "../../axios/index"

const { Option } = Select

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
        mysqlId: "",
        mysql_type: "预付款",
        quyu: "华南区域",
        search: 'cbdlcode',
        searchValue: "",
        mysql: []


    }
    initData = async (count = 10) => {
        if (this.state.searchValue) return;
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
        }, () => {
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
            result['type'] = this.state.mysql_type
            result['name'] = this.props.user['name']
            result['username'] = this.props.user['username']
            result['quyu'] = this.state.quyu
            if (this.state.type) {
                let data = await addYinshou(result)
                if (data.status) {
                    this.setState({
                        visable: false,
                        count: 0,
                        shoukuanTime: "",
                        fajianTime: "",
                        status: true,
                        quyu: "华南区域",
                        mysql_type: "预收款"

                    }, () => {
                        if(this.state.searchValue) window.location.reload()
                        message.success(data['message'])

                        this.initData(this.state.page * 10)
                    })
                } else {
                    throw new Error("抱歉，请将内容填写完整！")
                }
            } else {
                result['id'] = this.state.mysqlId;
                let data = await alterYinshou(result)
                if (data['status']) {
                    message.success("恭喜你，修改记录成功！")

                    this.setState({
                        visable: false,
                        count: 0,

                        quyu: "华南区域",
                        mysql_type: "预收款"
                    }, () => {
                            if(this.state.searchValue) window.location.reload()
                            this.initData(this.state.page * 10)
                        
                    })
                }



            }
        }
        catch (err) {
            message.error(err)

        }

    }

    // 搜索功能
    onSearch = async (types,values) => {
        const { value } = this.refSearch.state
     
        if (!value) return window.location.reload();
        console.log(this.state.search, value)
        let data = await searchYsk(this.state.search, value)
        console.log(data)
        this.setState({
            data: data['list'],
            total: data['total'],
            searchValue: value
        }, () => {
            console.log(this.state.data)

        })
    }
    // 修改状态
    onAlterJiean=async(type,id)=>{
    
            let result=await alterJiean(type,id)
            
            if(result['status']){
                this.setState({
                    count:0,
                },()=>{
                    if(this.state.searchValue){
                        window.location.reload()
                    }else {
                        this.initData(this.state.page*10)
                 
                    }
                    message.success(`更改成为${!type?'未结案':'结案'}！`)
                }
                )
            }else {
                message.error("抱歉，修改状态失败！")
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
                title: "收款金额(元)",
    
                 width:"200px",   
                key: "price",
                render:  (d) => {

                        const { price} = d;
                        //  let mysql=this.state.data[keys]?this.state.data[keys]['mysql']:[]
                      
                        // return <table style={{listStyleType:"none"}} border="1px solid #000">
                        //     {mysql.map((item,index)=>{
                        //         return key>index&&<tr style={{marginBottom:4}} key={index}> <td style={{padding:2}}><Tag color="gray">{`${item['riqi']}`}</Tag></td> <td style={{padding:2}}><span>{item['price']}元</span></td></tr>
                        //     })}
                        //     <tr><td style={{padding:2}}><Tag color="red">当前收款：</Tag></td><td style={{padding:2}}>{price}元</td></tr>
                        // </table>
               
                    return <span>{price}</span>

                }
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
                    const { AutoId, id } = d;
                    return <div>

                        <Button
                        type="primary"
                        style={{marginBottom:3}}
                        onClick={() => {
                            this.setState({

                                visable: true,
                                currentId: AutoId,
                                type: false,
                                mysqlId: id,
                                mysql_type: d['type'],
                                quyu: d['quyu']
                            }, () => {
                                this.huixianForm(d);
                            })

                        }}
                    >
                        修改
                    </Button>
                    <Button type="ghost" onClick={async()=>{
                        let result= await deleteOrder(id)
                        if(result['status']){
                            
                            this.setState({
                                count:0,
                            },()=>{
                                if(this.state.searchValue){
                                    window.location.reload()
                                }else {
                                    this.initData(this.state.page*10)
                                }
                                message.success("恭喜你，删除成功！")
                            })
                        }else {
                            message.err("抱歉，删除失败！")
                        }


                    }}>删除</Button>
                    </div>
                }
            }
        ]
        const { data, total, flag, status, visable, currentId, type, mysql_type, quyu, search } = this.state
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
                render: ({ mysql }) => {
               
                    return (mysql.length && (Number(mysql[mysql.length - 1]['jiean']) === 1 ? <Tag color="red" style={{cursor:"pointer"}} onClick={()=>{
                        this.onAlterJiean(0,mysql[mysql.length - 1]['id'])
                    }}> 结案</Tag> : <Tag color="green" style={{cursor:"pointer"}} onClick={()=>{
                        this.onAlterJiean(1,mysql[mysql.length - 1]['id'])
                    }}> 未结案</Tag>)) || <Tag color="green" onClick={()=>{
                        message.error("抱歉，无记录条数无法修改！")
                    }} > 未结案</Tag>
                },
                key: "jiean"
            }, {
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
                <div className="top" style={{ marginBottom: 20 }}>
                    <Select defaultValue={search} onChange={(d) => this.setState({
                        search: d
                    })}>
                        <Option value="cbdlcode" key="cbdlcode">订单号</Option>
                        <Option value="cPersonName" key="cPersonName">业务员</Option>
                        <Option value="cCusName" key="cCusName">客户</Option>

                    </Select>
                    <Input.Search ref={node => this.refSearch = node} placeholder={`请输入订单号进行订单的筛选`} style={{ width: 400 }} onSearch={this.onSearch}></Input.Search>
                </div>
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
                                <Select defaultValue={mysql_type} onChange={(d) => {
                                    this.setState({
                                        mysql_type: d
                                    })
                                }} >
                                    <Option value="预付款">预付款</Option>
                                    <Option value="中期款">中期款</Option>
                                    <Option value="尾款">尾款</Option>
                                    <Option value="质保金">质保金</Option>
                                    <Option value="款到发货">款到发货</Option>

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
                                <Select defaultValue={quyu} onChange={(d) => this.setState({
                                    quyu: d
                                })} >
                                    <Option value="华南区域">华南区域</Option>
                                    <Option value="北方区域">北方区域</Option>
                                    <Option value="华东区域">华东区域</Option>
                                    <Option value="西南区域">西南区域</Option>
                                    <Option value="工程中心">工程中心</Option>
                                    <Option value="经销商">经销商</Option>
                                    <Option value="零售">零售</Option>
                                    <Option value="设计">设计</Option>
                                    <Option value="直营">直营</Option>

                                </Select>
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

export default connect(state => ({
    user: state.user


}))(Yinshou)