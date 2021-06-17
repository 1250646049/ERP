import { Card,  Checkbox,  Tabs } from 'antd'
import React, { Component } from 'react'

const {TabPane}=Tabs
export default class Setting extends Component{
    state={
        one:true,
        two:true
    }
    // 根据一部 二部进行搜索
 
    render(){
        const {one,two}=this.state
        return (
            <div className="setting">
                <div className="top">
                
                </div>
                <div className="center">
                  <Card
                  title={
                    <div>
                            <span style={{marginRight:15}}>筛选:</span>
                            <Checkbox checked={one} >一部</Checkbox>
                            <Checkbox checked={two}>二部</Checkbox>
                    </div>

                  }
                  >
                  <Tabs type="line"  >
                        <TabPane tab="车间信息" key="车间信息">55555</TabPane>
                        <TabPane tab="班组信息" key="班组信息">555d55</TabPane>
                        <TabPane tab="员工信息" key="员工信息">555d55</TabPane>
                        <TabPane tab="工序工价" key="工序工价">55555</TabPane>
                        <TabPane tab="计时项目" key="计时项目">55d555</TabPane>
                        <TabPane tab="补贴项目" key="补贴项目">55555</TabPane>
                        <TabPane tab="请假类别" key="请假类别">5d5555</TabPane>
                    </Tabs>
                  </Card>
                </div>

            </div>
        )


    }




}