import React, { Component } from 'react'
import { Menu } from "antd"
import { UserOutlined, DribbbleSquareOutlined, GithubOutlined, BankOutlined, AntCloudOutlined,RedditOutlined } from '@ant-design/icons';
import PubSub from "pubsub-js"
const { SubMenu } = Menu;




export default class Category extends Component {
    state={
        type:"work"

    }
    componentDidMount(){
        PubSub.subscribe("alterSid",(message,key)=>{
            let type="work"
            if(Number(key)===1){
                type="work"
            }else if(Number(key)===2){
                type="fuzhu"
            }else if(Number(key)===3){
                type="sale"
            }
            this.setState({
                type
            })

        })

        
    }

    render() {
        const {type}=this.state
        return (
         <div>   
             {/* work */}
            <Menu theme="dark" mode="inline" style={{display:type==='work'?'block':'none'}}  >
                {/* 首页 */}
                <Menu.Item
                    onClick={
                        () => {
                            PubSub.publish("tiaozhuan", {
                                path: "/main/index",
                                author: "index"
                            })

                        }

                    }
                    key="index"
                    icon={<BankOutlined />}
                >首页</Menu.Item>

                {/* 用户结构 */}
                <SubMenu key="ptguanli" icon={<GithubOutlined />} title="平台管理">

                    <Menu.Item key="setting" onClick={() => {
                        PubSub.publish("tiaozhuan", {
                            path: "/main/setting",
                            author: "setting"
                        })

                    }}>系统设置</Menu.Item>


                    <Menu.Item key="userMange" onClick={() => {
                        PubSub.publish("tiaozhuan", {
                            path: "/main/userMange",
                            author: "userMange"
                        })

                    }}>用户管理</Menu.Item>

                    <Menu.Item key="luyou" onClick={() => {
                        PubSub.publish("tiaozhuan", {
                            path: "/main/luyou",
                            author: "luyou"
                        })

                    }}>路由授权管理</Menu.Item>

                </SubMenu>

                <SubMenu key="gonzuo" icon={<UserOutlined />} title="比价节控">
                    <Menu.Item key="bjprice" onClick={() => {
                        PubSub.publish("tiaozhuan", {
                            path: "/main/bjprice",
                            author: 'bjprice'
                        })

                    }}>比价节控检索</Menu.Item>

                </SubMenu>

                <SubMenu key="wuliudaohuo" icon={<DribbbleSquareOutlined />} title="物流到货">
                    <Menu.Item key="3" onClick={() => {
                        PubSub.publish("tiaozhuan", {
                            path: "/main/wuliudaohuo",
                            author: 'wuliudaohuo'
                        })

                    }}>  物流到货发送</Menu.Item>

                </SubMenu>

                {/* 乐迈往来表 */}
                <SubMenu key="wanglai" icon={<AntCloudOutlined />} title="乐迈往来表">
                    <Menu.Item key="wanglai" onClick={() => {
                        PubSub.publish("tiaozhuan", {
                            path: "/main/wanglai",
                            author: 'wanglai'
                        })

                    }}>  往来表</Menu.Item>

                </SubMenu>


                {/* 应收账款自动提醒*/}
                <SubMenu key="yinshou" icon={<RedditOutlined />} title="应收账款提醒">
                    <Menu.Item key="yinshou" onClick={() => {
                        PubSub.publish("tiaozhuan", {
                            path: "/main/yinshou",
                            author: 'yinshou'
                        })

                    }}>(U)应收账款自动提醒</Menu.Item>
                                        <Menu.Item key="cainayinshou" onClick={() => {
                        PubSub.publish("tiaozhuan", {
                            path: "/main/cainaYinshou",
                            author: 'cainayinshou'
                        })

                    }}>(财纳)应收账款自动提醒</Menu.Item>
                </SubMenu>
            </Menu>


            {/* 辅助 */}
            <Menu theme="dark" mode="inline" style={{display:type==='fuzhu'?'block':'none'}} >
               
                {/* sop试题库*/}
                <SubMenu key="exam" icon={<RedditOutlined />} title="试题库检索">
                    <Menu.Item key="exam" onClick={() => {
                        PubSub.publish("tiaozhuan", {
                            path: "/main/exam",
                            author: 'exam'
                        })

                    }}>SOP试题库</Menu.Item>
                </SubMenu>
            </Menu>

            {/* 薪资系统 */}
                        {/* 辅助 */}
           <Menu theme="dark" mode="inline" style={{display:type==='sale'?'block':'none'}} >
               
               {/* sop试题库*/}
               <SubMenu key="setting" icon={<RedditOutlined />} title="基础设置">
                   <Menu.Item key="setting" onClick={() => {
                       PubSub.publish("tiaozhuan", {
                           path: "/main/sz_salary",
                           author: 'sz_salary'
                       })

                   }}>信息维护</Menu.Item>
               </SubMenu>
           </Menu>
          </div>          
        )
    }
}