import { Input, Select, Table } from 'antd'
import React, { Component } from 'react'
import {getAllFukuanData} from "../../axios/index"
const {Option}=Select
export default class Din_Fukuan extends Component{
    state={
        data:[],
        selectValue:"当前审批人",
        finalData:[],type:false
    }

    componentDidMount(){
        this.initData()

    }
    initData=async()=>{
        let result=await getAllFukuanData()
        let list=result['list']
        this.setState({
            data:list.map((item,index)=>{
                item['key']=index
                return item
            }),
            finalData:list.map((item,index)=>{
                item['key']=index
                return item
            }),
            type:true
        })

    }
    // 搜索内容
    onSearch=(value)=>{
        

        if( !value.trim()) {
            return  this.setState({
                data:[...this.state.finalData],
               type:true

            })

        }
        const {finalData,selectValue}=this.state
            this.timer&&clearTimeout(this.timer)
            this.timer=window.setTimeout(()=>{
                let reduce=[]
                if(selectValue==='当前审批人'){
                   reduce=finalData.reduce((reduce,item,indexs)=>{
                        let {currentActioners}=item
                    
                       let index=currentActioners.findIndex((item)=>{
                      
                        return item['displayName']===value.trim()
                       })
                
                        if(index!==-1){
                            item['key']=indexs
                            reduce.push(item)
                        }
                        return reduce;
                    },[])

                }else if(selectValue==='历史审批人') {
                    reduce=finalData.reduce((reduce,item,indexs)=>{
                        let {actioners}=item
                    
                       let index=actioners.findIndex((item)=>{
                      
                        return item['displayName']===value.trim()
                       })
                
                        if(index!==-1){
                            item['key']=indexs
                            reduce.push(item)
                        }
                        return reduce;
                    },[])
                }else {
                    reduce=finalData.reduce((reduce,item,indexs)=>{
                        
                        if( item['title'].includes(value.trim())){
                            item['key']=indexs
                            reduce.push(item)
                        }
                        return reduce;
                    },[])
                }
                window.setTimeout(()=>{
                    this.setState({
                        data:[...reduce],
                        type:true
                    })
              },300)
            },350)


    }
    render(){
        const {data,selectValue,type}=this.state
        const columns=[
            {
                title:"审批编号",
                dataIndex:"businessId",
                key:"businessId"
            },{
                title:"标题",
                dataIndex:"title",
                key:"title"
            },{
                title:"发起时间",
                render:(d)=>{
                    const {createTime}=d
                    if(createTime){
                        let date=new Date(createTime)
                        return <span>{date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()}</span>
                    }
                },
                key:"createTime"
            },{
                title:"完成时间",
             
                key:"finishTime",
                render:(d)=>{
                    const {finishTime}=d
                    if(finishTime){
                        let date=new Date(finishTime)
                        return <span>{date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()}</span>
                    }
                }
            },{
                title:"当前审批人",
                
                key:"currentPerson",
                render:(d)=>{
                    const {currentActioners}=d
                    return <span>{currentActioners[currentActioners.length-1]?.displayName}</span>
                }
            },
            {
                title:"历史审批人",
              
                key:"displayName",
                render:(d)=>{
                    const {actioners}=d
                    return <div>
                        {actioners.map((item,index)=>{

                            return <div>{item['displayName']}</div>
                        })}
                    </div>
                }
            }
        ]
        return (
            <div className="dindin">
                <div className="top" style={{margin:"10px 0"}}>
                    <Select defaultValue={selectValue} onChange={v=>this.setState({
                        selectValue:v
                    })}>
                        <Option value="当前审批人">当前审批人</Option>
                        <Option value="历史审批人">历史审批人</Option>
                        <Option value="申请人">申请人</Option>
                    </Select>
                    <Input.Search  onSearch={this.onSearch} style={{width:300}} disabled={!type}></Input.Search>
                </div>
                <div className="table">
                    <Table
                    loading={!type}
                    
                    columns={columns}
                    dataSource={data}
                    >

                    </Table>

                </div>
            </div>
        )
    }


}