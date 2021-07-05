import React, { Component } from "react"
import { Table, Button, Spin, Drawer, Form, Input, Switch, DatePicker, Divider, message, Tag, Tooltip, Badge, Select } from "antd"

import { connect } from "react-redux"

//  导入请求

import "./css/yinshou.css"
import { selectYsk003 as selectYsk, addYinshou, alterYinshou, deleteOrder, alterJiean } from "../../axios/index"

const { Option } = Select

class Yinshou extends Component {
    state = {
        data: [],
        total: 0,
        flag: true,
        count: 0,
        currentId: "",
        shoukuanList:{},
        shoukuanTime: "", 
        status: false,
        fajianTime: "",
        visable: false,
        page: 1,
        type: true,
        mysqlId: "",
        mysql_type: "预付款",
        quyu: "华南区域",
        search: 'cCusName',
        searchValue: "",
        mysql: [],
        totalprice:0,
        chae:0,
        cCusName:"",
        shoukuanData:{},
        finalData:[],
        email:"",
        iQuantity:0,
        iSum:0
 

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
            count,
            shoukuanList:data['shoukuan'],
            shoukuanData:data['data'],
            finalData:data['list']
        }, () => {
           

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
            result['cCusName']=this.state.cCusName
            result['totalprice']=this.state.totalprice
            result['chae']=this.state.totalprice-(result['price'].trim()?Number(result['price']):0)
            result['personemail']=this.state.email
            result['iQuantity']=this.state.iQuantity
            result['iSum']=this.state.iSum
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
                        if(this.state.searchValue) {
                            this.onSearch(this.state.searchValue)
                        }else {
                            this.initData(this.state.page * 10)
                        }
                        message.success(data['message'])

                      
                    })
                } else {
                    throw new Error("抱歉，请将内容填写完整！")
                }
                // 修改记录
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
                            if(this.state.searchValue) {

                                this.onSearch(this.state.searchValue)
                            }else {
                                this.initData(this.state.page * 10)
                            }
                          
                        
                    })
                }



            }
        }
        catch (err) {
            message.error(err)

        }

    }

    // 搜索功能
    onSearch = async (content) => {
            content=content.trim()
            if(!content){
                return this.setState({
                    data:[...this.state.finalData]
                })
            }
            let reduce=[]
            if(this.state.search==='cCusName'){
                  reduce=this.state.finalData.reduce((reduce,item)=>{
                        if(item['cCusName']===content){
                            reduce.push(item)
                        }

                    return reduce;
                  },[])  

            }else {
                reduce=this.state.finalData.reduce((reduce,item)=>{
                    if(item['cPersonName']===content){
                        reduce.push(item)
                    }

                return reduce;
              },[])  
            }
            window.setTimeout(()=>{
                this.setState({
                    data:[...reduce]
                })
            },300)


    }
    // 修改状态
    onAlterJiean=async(type,id)=>{
    
            let result=await alterJiean(type,id)
            
            if(result['status']){
                this.setState({
                    count:0,
                },()=>{
                    if(this.state.searchValue){
                        // window.location.reload()
                        this.onSearch(this.state.searchValue)
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
                title: "合同金额(元)",
    
              
                key: "price",
                render:  (d) => {
                        const { price} = d;
                    return <span>{price}</span>

                }
            },{
                title:"到款金额",
                
               
                key:"totalprice",
                render:(d)=>{
                    const {cCusName,number}=d
                    const {mysql}=this.state.shoukuanData[cCusName]
                  
                    let totalPrices=this.state.shoukuanList[cCusName]?this.state.shoukuanList[cCusName]['money']:0
                    //  let count=0;
                 
                    // for(var i=0;i<number;i++){
                    //     let currentPrice=mysql.length?Number(mysql[i]&&mysql[i]['price']):0
                    //     count+=currentPrice
                    // }
                    // if(number!==mysql.length){
                    //     prices=mysql.length?Number(mysql[number-1]?mysql[number-1]['price']:0).toFixed(4):0
                    //     if(Number(totalPrices)<Number(price)){
                    //         prices=0
                    //     }
                        
                       
                       
                    // }else {
                    //     prices=((Number(totalPrices)-count)+Number(price)).toFixed(4)
                    //     if(prices<0){
                    //         prices=0
                    //     }
                    // }
                    let arr=[]
                    if(mysql.length===1){
                        console.log(55555);
                        if(Number(totalPrices)>Number(mysql[0]?mysql[0]['price']:0)){
                            console.log(8888);
                            let prices=Number(totalPrices)-Number(mysql[0]?mysql[0]['price']:0)
                          
                        return <span>{prices.toFixed(4)}</span>
                        }else {
                            return <span>{Number(totalPrices).toFixed(4)}</span>
                        }
                    }else{

                    for(let i=0;i<mysql.length;i++){
                        
                       let mysql_price=Number(mysql[i]['price'])
                        if (Number(totalPrices)-mysql_price>=0){
                            arr.push(mysql_price)
                            totalPrices=Number(totalPrices)-mysql_price
                        }
                        else {
                            arr.push(totalPrices)
                            break;
                        }
 
                            
                        // if(i===0){
                        //    if( Number(totalPrices)>=Number(mysql[i]?mysql[i]['price']:0)){
                        //         p=Number(mysql[i]?mysql[i]['price']:0)
                        //         totalPrices=Number(totalPrices)-Number(mysql[i]?mysql[i]['price']:0)
                               
                        //    }else {
                        //         p=Number(totalPrices)
                               
                        //    }
                        // }else {
                        //     if(Number(totalPrices)>Number(mysql[i]?mysql[i]['price']:0)){
                        //         totalPrices=Number(totalPrices)-Number(mysql[i]?mysql[i]['price']:0)
                        //         p=Number(mysql[i]?mysql[i]['price']:0)
                        //     }else {
                        //         p=Number(totalPrices)
                        //         arr.push(p)
                        //         break;
                        //     }
                          
                           
                        // }
                        // arr.push(p)

                     
                        
                    }
                    if(mysql.length>arr.length){
                        for(var i=0;i<(mysql.length-arr.length);i++){
                            arr.push(0.0)
                        }
                    }
                }
                    return <span>{arr[number-1]?Number(arr[number-1]).toFixed(4):0}</span>

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
                                    this.onSearch(this.state.searchValue)
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
                title: "客户(简称)",
                dataIndex: "cCusAbbName",
                key: "cCusAbbName"
            },
            {
                title:"客户类型",
                dataIndex:"types",
                key:"types"
            },
        {
                title: "业务员",
                dataIndex: "cPersonName",
                key: "cPersonName"
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
            },{
                title:"到款金额",
                
                key:"daokuanjine",
                render:(d)=>{
                   const {cCusName}=d;
                   const {shoukuanList}=this.state
             

                    return <span>{shoukuanList[cCusName]&&shoukuanList[cCusName]['money']}</span>


                }
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
                    const {mysql,cCusName,cPersonEmail,iQuantity,iSum}=d
                    
                    const {shoukuanList}=this.state
                    let totalprice=0
                    if(!mysql.length){
                        totalprice=shoukuanList[cCusName]?shoukuanList[cCusName]['money']:0
                    }else {
        
                        totalprice=mysql[mysql.length-1]?.chae

                    }
                    
                    return <div>
                        <Badge
                            count={mysql.length}
                        >
                            <Button type="primary" onClick={() => {
                                this.setState({
                                    currentId: d['AutoID'],
                                    type: true,
                                    visable: true,
                                    fajianTime: "",
                                    shoukuanTime: "",
                                    totalprice,
                                    cCusName,
                                    email:cPersonEmail,
                                    iQuantity,
                                    iSum
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
                          <Option value="cCusName" key="cCusName">客户</Option>
                        <Option value="cPersonName" key="cPersonName">业务员</Option>
                      

                    </Select>
                    <Input.Search ref={node => this.refSearch = node} placeholder={`请输入${search==='cCusName'?'客户名称':'业务员'}进行的筛选`} style={{ width: 400 }} onSearch={this.onSearch}></Input.Search>
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
                                label="合同金额"
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