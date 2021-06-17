import { Input, Select,Table, Tag} from 'antd'
import React, { Component } from 'react'

import {selectExamLike,selectCount} from "../../axios/index"

const {Option}=Select


export default class Exam extends Component {
    state={
        data:[],
        type:"content",
        count:0,
        search:""
    }
// 检索

onInput=async(e)=>{
    let value=e.target.value
    if(value.trim()){
      let data=  await selectExamLike(this.state.type,value)
      
        this.setState({
            data:data.list,
            search:value
          
        })
    }

}

componentDidMount(){
    this.initdata()

}

initdata=async()=>{

 let result=await selectCount()

 this.setState({
     count:result['count']
 })


}
render(){
    const columns=[
        {
            title:"编号",
            dataIndex:"id",
            key:"id"
        },{
            title:"预测路径",
            dataIndex:"url",
            key:"url"
        },{
            title:"预测页码", 
            dataIndex:"page",
            key:"page"
        },
        {
            title:"匹配字段",
            // dataIndex:"content",
            key:"content",
            render:(d)=>{
                let {content}=d;
                if(this.state.search){
                    let tag=`<span style='color:red;font-weight:700'>${this.state.search}</span>`
                    content=content.replace(this.state.search,tag)
                }
                return <span dangerouslySetInnerHTML={{__html:content}}></span>
            }
        }
        

    ]
    const {data,count}=this.state
    return (
        <div className="exam">
            <div className="top" style={{marginBottom:15}}>
                <Select defaultValue="content" onChange={(v)=>{
                   this.setState({
                       type:v
                   })
                }}>
                    <Option value="content">文件内容检索</Option>
                    <Option value="url" >文件路径检索</Option>
                </Select>
                <Input.Search style={{width:600}} onInput={this.onInput}></Input.Search> 
                <span style={{marginLeft:10}}>共找到题库:<Tag color="green">{data.length}</Tag>条,总共有:<Tag color="orange">{count}</Tag>条题库</span>
            </div>
            <div className="table">
                <Table
                columns={columns}
                dataSource={data}
                ></Table>

            </div>


        </div>
    )
}


}