import React, { Component } from 'react'

import { Button, Collapse, Tag,Tooltip,Modal,Tree } from "antd"
import { getAllUserDepart,getAllDepartUser} from "../../axios/index"
import {UserAddOutlined} from "@ant-design/icons"
import "./css/userMange.less"
const { Panel } = Collapse


export default class UserMange extends Component {
    state = {
        list: [],
        user:[],
       
    }
    // 初始化数据
    initData = async () => {
        let { list } = await getAllUserDepart()
        this.setState({
            list
        })
    }
    componentDidMount() {
        this.initData()
    }
// 改变手风琴
PanelChange=(async(value)=>{
    if(!value)return;
    const departName=this.state.list[value]['depart']
   let {list}= await getAllDepartUser(departName)
    this.setState({
        user:list
    })
})
    render() {
        const treeData = [
            {
              title: '0-0',
              key: '0-0',
              children: [
                {
                  title: '0-0-0',
                  key: '0-0-0',
                  children: [
                    { title: '0-0-0-0', key: '0-0-0-0' },
                    { title: '0-0-0-1', key: '0-0-0-1' },
                    { title: '0-0-0-2', key: '0-0-0-2' },
                  ],
                },
                {
                  title: '0-0-1',
                  key: '0-0-1',
                  children: [
                    { title: '0-0-1-0', key: '0-0-1-0' },
                    { title: '0-0-1-1', key: '0-0-1-1' },
                    { title: '0-0-1-2', key: '0-0-1-2' },
                  ],
                },
                {
                  title: '0-0-2',
                  key: '0-0-2',
                },
              ],
            },
            {
              title: '0-1',
              key: '0-1',
              children: [
                { title: '0-1-0-0', key: '0-1-0-0' },
                { title: '0-1-0-1', key: '0-1-0-1' },
                { title: '0-1-0-2', key: '0-1-0-2' },
              ],
            },
            {
              title: '0-2',
              key: '0-2',
            },
          ];
        const { list,user } = this.state
        return (
            <div className="user">

                <div className="depart">

                <Collapse
                accordion={true}
                onChange={this.PanelChange}
                >
                    {list.map((item, index) => {

                        return (
                            <Panel
                            key={index}
                            header={<div>
                                <span>{item['depart']}</span>
                                 <Tag style={{marginLeft:20}} color="orange">设置部门权限</Tag>
                            </div>}
                            
                            >
                          
                           {user.map((item,index)=>{
                               return (<Tooltip
                                key={index}
                                placement="topLeft"
                                title={
                                    <div>
                                        <div>工号:{item['username']}</div>
                                        <div>性别:{item['sex']?'男':'女'}</div>
                                        <div>权限:{!item['auth']?'普通':'管理员'}</div>
                                    </div>
                                }
                               >
                               <Tag style={{margin:8,cursor:"pointer"}}  color="green" >{item['name']}</Tag>
                               </Tooltip>
                               )
                           })}
                           <Button size="small" type="primary" icon={<UserAddOutlined />}></Button>
                            </Panel>
                        )
                    })}
                 </Collapse>
                </div>

                {/* UTILE */}
                {/* <div className="utils">
                    <Modal
                    visible={true}
                    cancelText="取消"
                    okText="确定"
                    title={`设置部门的权限`}
                    >
                        <Tree
                        treeData={treeData}
                        checkable={TextTrackCue}
                        >
                            
                        </Tree>
                    </Modal>
                </div> */}
            </div>
        )
    }
}