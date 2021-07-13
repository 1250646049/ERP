import {  Input, message, Select, Table, Tag } from "antd"
import Checkbox from "antd/lib/checkbox/Checkbox"
import React, { Component } from "react"

import { selectAllOrders, selectYusuan,insertYusuan } from "../../axios/index"

const { Option } = Select
export default class Yusuan extends Component {

    state = {
        optionValue: [],
        defaultValue: "",
        yibu: false,
        erbu: false,
        finalData: [],
        list: [],
        finalList: [],
        selectBm:"一部"

    }

    componentDidMount() {
        this.initData()
    }

    initData = async () => {
        let result = await selectAllOrders()
        let data = await selectYusuan()
      
        this.setState({
            optionValue: result['list'],
            defaultValue: result['list'][0]['ordercode'],
            finalData: result['list'],
            list: data['list'],
            finalList: data['list']
        })
    }
    onChange = (flag, type) => {
      
        let data = this.state.finalData
        // let list=this.state.finalList
        this.setState({
            [type]: !flag,

        }, () => {
            if (this.state.erbu && !this.state.yibu) {
                data = this.state.finalData.filter((item) => item['bm'] === '二部')

            } else if (!this.state.erbu && this.state.yibu) {
                data = this.state.finalData.filter((item) => item['bm'] === '一部')
            }
            this.setState({
                optionValue: data,
                defaultValue: data[0].ordercode,
                // list
            })
        })


    }
    // 下拉选择框选择
    onChangeSelect = (v) => {
        let { bm } = this.state.finalData.find((item) => item['ordercode'] === v)
        let list = this.state.finalList.filter((item) => (item['部门'] === bm && item['ordercode'] === v))

        this.setState({
            list,
            defaultValue:v
        })



    }
    // onAlterYushou
    onAlterYushou=(v)=>{
        if(!v.trim()) {
           return message.error("工序编码不能为空！")
        }


    }
    // addOneContent
    addOneContent=async()=>{
        // 添加一条内容
       let ordercode= this.state.defaultValue
        let code=this.gxcodeRef.state.value
        let {status}=await insertYusuan(ordercode,code,"")
        if(status){
            message.success("恭喜你，添加一条记录！")
            this.initData()
        }else {
            message.error("抱歉，添加记录失败！")
        }
    }
    // 判断是否为空对象
    isEmptyObject = (object) => {
        let re = new RegExp(/^\[.*([A-Z]{1}.*)\]$/)
        let type = Object.prototype.toString.call(object) + ""
        let leixing = re.exec(type)[1]
        if (leixing !== 'Object') {
            throw new Error("抱歉，您传入的不是对象数据类型！")
        }
        if (JSON.stringify(object) === '{}') {

            return true;
        }
        return false
    }
    render() {
        const coloum = [
            {
                title: "单价", key: "unitprice",
                render: (d) => {
                    const { 单价 } = d
                    let flag = this.isEmptyObject(d)

                    return <div>
                        <span style={{ display: flag ? 'none' : '' }} >{单价}</span>
                        <Input  disabled={true} ref={node=>this.unitpriceRef=node} style={{ display: !flag ? 'none' : '' }} placeholder="请输入单价"></Input>
                    </div>
                }
            },
            {
                title: "工序名称", render: (d) => {
                    const { 工序名称 } = d
                    let flag = this.isEmptyObject(d)

                    return <div>
                        <span style={{ display: flag ? 'none' : '' }} >{工序名称}</span>
                        <Input disabled={true} ref={node=>this.gxnameRef=node} style={{ display: !flag ? 'none' : '' }} placeholder="请输入工序名称"></Input>
                    </div>
                }, key: "gxname"
            },
            {
                title: "工序编码", render: (d) => {
                    const { 工序编码 } = d
                    let flag = this.isEmptyObject(d)
                    return <div>
                        <span style={{ display: flag ? 'none' : '' }} >{工序编码}</span>
                        <Input ref={node=>this.gxcodeRef=node} style={{ display: !flag ? 'none' : '' }} placeholder="请输入工序编码"></Input>
                    </div>
                }, key: "gxbianm"
            },
            {
                title: "车间", render: (d) => {
                    const { 车间 } = d
                    let flag = this.isEmptyObject(d)

                    return <div>
                        <span style={{ display: flag ? 'none' : '' }} >{车间}</span>
                        <Input  disabled={true} ref={node=>this.workRef=node} style={{ display: !flag ? 'none' : '' }} placeholder="请输入车间信息"></Input>
                    </div>
                }, key: "work"
            },
            {
                title: "部门", render: (d) => {
                    const { 部门 } = d
                    let flag = this.isEmptyObject(d)

                    return <div>
                        <span style={{ display: flag ? 'none' : '' }} >{部门}</span>
                        <Select style={{ display: !flag ? 'none' : '' }} value={this.state.selectBm} onChange={(v)=>{
                            this.setState({
                                selectBm:v
                            })
                        }}  disabled={true}>
                            <Option  value="一部">一部</Option>
                            <Option value="二部">二部</Option>
                        </Select>
                    </div>
                }, key: "bm"
            }
            // }, {
            //     title: "操作",
            //     key: "caozuo",
            //     render: (d) => {
            //         let flag = this.isEmptyObject(d)
            //         let content=""
            //         return <div>
            //             <span>
            //                 <Popover
            //                 title={'修改'+d['工序编码']+"的内容"}
            //                 content={
            //                     <Input
            //                      placeholder={d['工序编码']}
            //                      onInput={(e)=>{
            //                          const {value}=e.target
            //                          content=value.trim()
            //                      }}
            //                     >
                                
            //                     </Input>

            //                 }
            //                 >
            //                     <Button type="primary" style={{ display: flag ? 'none' : '' }} onClick={()=>{
            //                         this.onAlterYushou(content)

            //                     }}>修改</Button>
            //                 </Popover>
            //             </span>
            //             <Button type="default" style={{ display: !flag ? 'none' : '',background:"red",color:"white" }} onClick={
            //                 this.addOneContent

            //             }  >添加</Button>
            //         </div>

            //     }
            // }
        ]

        const { optionValue, defaultValue, yibu, erbu, list } = this.state
        return (
            <div className="yusuan">
                <div className="search">
                    <span>
                        <Checkbox checked={yibu} onChange={(v) => {
                            this.onChange(yibu, 'yibu',v)
                        }}>一部</Checkbox>
                        <Checkbox checked={erbu} onChange={(v) => {
                            this.onChange(erbu, 'erbu',v)
                        }}>二部</Checkbox>
                    </span>
                    <span>
                        <span style={{ margin: "0 10px" }}>订单号:</span>
                        <Select value={defaultValue} onSelect={v => {
                            this.onChangeSelect(v)
                        }}>

                            {optionValue.map((item, index) => {

                                return (<Option key={index} value={item['ordercode']} >
                                    <div>
                                        <span>
                                            <Tag color="green">订单号:</Tag>
                                            {item['ordercode']}
                                        </span>
                                        <span style={{ margin: "0 5px" }}>
                                            <Tag color="red">数量:</Tag>
                                            {item['num']}
                                        </span>
                                        <span style={{ margin: "0 5px" }}>
                                            <Tag color="blue">薪资合计:</Tag>
                                            {item['hj']}
                                        </span>
                                        <span>
                                            <Tag>所属部门:</Tag>
                                            {item['bm']}
                                        </span>
                                    </div>

                                </Option>)
                            })}
                        </Select>
                    </span>
                </div>

                <div className="table" style={{ marginTop: 15 }}>
                    <Table
                        columns={coloum}
                        dataSource={list}
                        bordered={true}
                    >

                    </Table>
                </div>
                {/* <div className="utils">
                    <Utils>
                        <Button type="primary" size="large">添加预算工资</Button>
                    </Utils>

                </div> */}
            </div>
        )


    }





}