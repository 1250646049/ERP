import { Button, Select,Tag } from "antd"
import Checkbox from "antd/lib/checkbox/Checkbox"
import React, { Component } from "react"
import Utils from "../../sortComponents/utils/utils"
import { selectAllOrders } from "../../axios/index"
const { Option } = Select
export default class Yusuan extends Component {

    state = {
        optionValue: [],
        defaultValue:"",
        yibu:false,
        erbu:false,
        finalData:[]

    }

    componentDidMount() {
        this.initData()
    }

    initData = async () => {
        let result = await selectAllOrders()
        this.setState({
            optionValue: result['list'],
            defaultValue:result['list'][0]['ordercode'],
            finalData: result['list']
        })
    }
    onChange=(flag,type)=>{
        this.setState({
            optionValue:[]
        })
        let data=this.state.finalData

        this.setState({
            [type]:!flag,

        },()=>{
        if(this.state.erbu && !this.state.yibu){
            data=this.state.finalData.filter((item)=>item['bm']==='二部')
        } else if (!this.state.erbu && this.state.yibu){
            data=this.state.finalData.filter((item)=>item['bm']==='一部')
        }
        this.setState({
            optionValue:data,
            defaultValue:data[0]?.ordercode,
        })
        })


    }
    render() {
        const { optionValue,defaultValue,yibu,erbu } = this.state
        return (
            <div className="yusuan">
                <div className="search">
                    <span>
                        <Checkbox checked={yibu} onChange={()=>{
                            this.onChange(yibu,'yibu')
                        }}>一部</Checkbox>
                        <Checkbox checked={erbu} onChange={()=>{
                            this.onChange(erbu,'erbu')
                        }}>二部</Checkbox>
                    </span>
                    <span>
                        <span style={{ margin: "0 10px" }}>订单号:</span>
                        <Select  value={defaultValue}>

                            {optionValue.map((item, index) => {

                                return (<Option key={index} value={item['ordercode']}>
                                    <div>
                                        <span>
                                            <Tag color="green">订单号:</Tag>
                                            {item['ordercode']}
                                        </span>
                                        <span style={{margin:"0 5px"}}>
                                            <Tag color="red">数量:</Tag>
                                            {item['num']}
                                        </span>
                                        <span style={{margin:"0 5px"}}>
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
                <div className="utils">
                    <Utils>
                        <Button type="primary" size="large">添加预算工资</Button>
                    </Utils>

                </div>
            </div>
        )


    }





}