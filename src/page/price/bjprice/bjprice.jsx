import React, { Component } from 'react'
import {Table,Input, Select, Button,Tag} from "antd"
import {getAllBJPrice,getPriceLike} from "../../../axios/index"
// 导出excel表格数据


const {Option}=Select


export default class Bjprice extends Component {
    state={
        data:[],
        size:0,
        searchType:"cinvcode"

    }
    // 初始化数据

    initData=async(page=1,number=10)=>{
        let result=await getAllBJPrice(page,number)

        this.setState({
            data:result['list'],
            size:result['size']
        })
    }
    componentDidMount(){
        this.initData()
    }
    onSearch=async(value)=>{
        if(value.trim()){
          let result= await getPriceLike(this.state.searchType,value)
          this.setState({
              data:result['list'],
              size:result['size']
          })
          
        }else this.initData()
        


    }
    // 导出excel数据

    exportExcel=()=>{
      
    }
    render() {
        const {data,size}=this.state
      
        const columns=[
                {
                    title:"编号",
                    dataIndex:"number",
                    key:"number"
                },{
                    title:"比价单号",
                    dataIndex:'Item_id',
                    key:'Item_id'
                },{
                    title:'存货编码',
                    dataIndex:'cinvcode',
                    key:'cinvcode'
                },{
                    title:"存货名称",
                    dataIndex:'cinvname',
                    key:"cinvname"
                },{
                    title:"规格型号",
                    dataIndex:'cinvstd',
                    key:"cinvstd"
                },{
                    title:"原价",
                    dataIndex:'yuanjia',
                    key:"yuanjia"
                },{
                    title:"现价",
                    dataIndex:'xianjia',
                    key:'xianjia'
                },{
                    title:"节约金额",
                   
                    key:'jieyue',
                    render:(data)=>{
                        
                        const {jieyue}=data
                        return Number(jieyue)>=0?<Tag color="green">{jieyue}</Tag>:<Tag color="red">{jieyue}</Tag>
                    }
                },{
                    title:'实际采购量',
                    dataIndex:'iQuantity',
                    key:'iQuantity'
                },{
                    title:'生效日期',
                    dataIndex:'sxrq',
                    key:'sxrq'
                },{
                    title:'失效日期',
                    dataIndex:'sxrq2',
                    key:'sxrq2'
                }
    
        ]
    
        return (
            <div className="bjprice">
                {/* 头部操作 */}
                <div className="top" style={{margin:10,marginLeft:0}}>
                    <Select
                    defaultValue="cinvcode"
                    onSelect={(v)=>{
                        this.setState({
                            searchType:v
                        })
                    }}
                    >
                        <Option value="cinvcode">存货编码</Option>
                        <Option value="cinvname">存货名称</Option>
                        <Option value="cinvstd">规格型号</Option>
                        <Option value="yuanjia">原价</Option>
                        <Option value="xianjia">现价</Option>
                        <Option value="jieyue">节约</Option>
                    </Select>
                    <Input.Search
                   style={{width:240}}
                   onSearch={this.onSearch}
                    >
                    
                    </Input.Search>

                    <Button onClick={this.exportExcel}> 点击导出</Button>
                </div>
                <div className="center">
                    <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{total:size,showSizeChanger:false,showTotal:(total)=>{
                        return '总条数：'+total;
                    }}}
                    onChange={(item)=>{
                        const {current}=item
                        this.initData(current,10)
                    }}
                    />
                </div>

            </div>
        )
    }
}