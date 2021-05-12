import React, { Component } from 'react'
import { Layout, Menu, message} from 'antd';
import Category from "../../page/Sider/category"
import Bjprice from "../../page/price/bjprice/bjprice"
import {BrowserRouter as Router,Switch,Route} from "react-router-dom"
import User from "../../page/user/user"
import PubSub from "pubsub-js"
import "./css/main.css"
import {toAutoLogin} from "../../axios/index"
import WuliuDaohuo from "../../page/wuliu/wuliu"
const { Header, Content, Footer, Sider } = Layout;




export default class Main extends Component {
    state = {
        collapsed: false,
        currentPath:"",
        user:{}
    };

    componentDidMount(){
        this.initData()
    }
    // 跳转内容区
    initData=async()=>{
        
        // 判断是否登录
        if(!localStorage.getItem("_token")){
            message.error("授权到期，请重新登录！")
            this.props.history.replace("/login")
        }
        // 自动登录
        try{
            let data=await toAutoLogin(localStorage.getItem("_token"))
            if(data['error']){
                throw new Error("error")
            }else {
            //    设置用户
            this.setState({
                user:data
            })
            }
        }catch{
            message.error("授权错误，请重新登录！")
            this.props.history.replace("/login")
        }
         
        PubSub.subscribe("tiaozhuan",(_,data)=>{
            this.props.history.replace(data)
            window.location.reload()
        })

    }

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };
    render() {

        const { collapsed,user } = this.state;
        return (
            <div className="main">
                {/* 总布局 */}
                <Router>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse} style={{ height: "calc(100vh - 64px)", marginTop: 64 }}>
                        
                        <Category></Category>
                    </Sider>
                    <Layout className="site-layout">
                        <Header className="site-layout-background header" style={{ padding: 0, width: "100vw", position: "fixed", left: 0, right: 0,overflow:"hidden" }} >
                            {/* logo */}
                            <div className="logo">CFL ERP综合报表功能管理系统</div>
                            {/* 头部导航 */}
                            <div className="topCategory">
                            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} className="topCategory">
                                <Menu.Item key="1">工作</Menu.Item>
                             </Menu>
                            </div>
                            {/* 用户区 */}
                            <div className="user">
                                <User user={user}></User>
                            </div>
                        </Header>
                        <Content style={{ margin: '50px 16px 0 16px' }}>
                           
                            <div className="site-layout-background" style={{ padding: 24}}>
                               {/* center */}
                                
                                    <Switch>
                                          <Route path="/main/bjprice" component={Bjprice}></Route> 
                                          <Route path="/main/wuliudaohuo" component={WuliuDaohuo}></Route>
                                    </Switch>
                               
                             </div>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>CFL -ERP报表功能管理系统</Footer>
                    </Layout>
                </Layout>
                </Router>
            </div>
        )
    }
}