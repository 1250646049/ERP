
import { Table } from 'antd'
import React, { Component } from 'react'
import {selectAllWuliu} from "../../axios/index"

export default class WuliuDaohuo extends Component{
    state={
        list:[]
    }
    componentDidMount(){
        this.initData()

    }
    initData=async()=>{
        let result=await selectAllWuliu()
        this.setState({
            list:result['list']
        })

    }

    render(){
        const {list}=this.state
        const columns=[
            {
                title:"流水号",
                dataIndex:"Item_ID",
                key:"Item_ID"
            },{
                title:"部门",
                dataIndex:"bm",
                key:"bm",
                filters: [
                    {
                      text: '一部',
                      value: '一部',
                    },
                    {
                      text: '四部',
                      value: '四部',
                    },{
                        text: '六部',
                        value: '六部',
                      },
                  ],
                  onFilter:(v,record)=>{
                    return record['bm'].indexOf(v)===0
                  } 
            }
            ,{
                title:"物料种类",
                dataIndex:"wlzl",
                key:"wlzl"
            },{
                title:"卸货地点",
                dataIndex:"xhdd",
                key:"xhdd"
            },{
                title:"需要时间(分钟)",
                dataIndex:"dwsc",
                key:"dwsc"
            }
        ]
        return (
            
            <div className="wuliao">

                <Table
                columns={columns}
                dataSource={list}
                bordered={true}
                expandable={{
                    expandedRowRender:redoc=>{

                        return <div>
                            <Table></Table>
                        </div>
                    }
                }}
                >


                </Table>

            </div>
        )

    }



}