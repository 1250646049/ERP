import React, { Component } from 'react'
import { Layout, Menu, message, Drawer, Card, Button, Modal } from 'antd';
import Category from "../../page/Sider/category"
import Bjprice from "../../page/price/bjprice/bjprice"
import { Switch, Route, Redirect} from "react-router-dom"
import User from "../../page/user/user"
import PubSub from "pubsub-js"
import "./css/main.css"
import { toAutoLogin, getAllWords,getAllOuthor,selectNoneUrl,selectBobao } from "../../axios/index"
import WuliuDaohuo from "../../page/wuliu/wuliu"
// 导入服务器URL
import UserMange from "../../page/userMange/userMange"
import {serverUrl} from "../../config/config"
import {connect} from "react-redux"
// 导入首页组件
import {operationUser} from "../../redux/action/login"
import Index from "../../page/index/index"
import Logo from "../../assert/img/logo.png"
// 导入路由设置插件
import Router from "../../page/router/router"
// 导入今日播报
import Bobao from "../../page/bobao/bobao"
const { Header, Content, Footer, Sider } = Layout;

 class Main extends Component {
    state = {
        collapsed: false,
        currentObj: {},
        user: {},
        drawerShow: false,
        words: [],
        bobaoShow:false
    };

    componentDidMount() {
        this.initData()
    }
    // 跳转内容区
    initData = async () => {

        // 判断是否登录
        if (!localStorage.getItem("_token")) {
            message.error("授权到期，请重新登录！")
            this.props.history.replace("/login")
        }
        // 自动登录
        try {
            let data = await toAutoLogin(localStorage.getItem("_token"))
            if (data['error']) {
                throw new Error("error")
            } else {
                // 设置进Redux
                this.props.operationUser(data)
                //    设置用户
                this.setState({ 
                    user: data
                },async()=>{
                    // console.log(this.state.user)
                  let d= await selectBobao(this.state.user['username'])
                  if(JSON.stringify(d['list'])==="{}"){
                   this.setState({
                        bobaoShow:true
                   })

                  }
                })
            }
        } catch {
            message.error("授权错误，请重新登录！")
           return this.props.history.replace("/login")
            
        }
        //  路由跳转
        PubSub.subscribe("tiaozhuan", async(_, data) => {
            const {path,author}=data
            const {depart,auth}=this.state.user
            // 判断是否为超级管理员
            let {list}=await selectNoneUrl()
            let content= list.find((item)=>item.biaoshi===author)
             if(content){
                 return this.props.history.replace(path)
             }
         
            if(depart==='ERP' || auth===1){
               return this.props.history.replace(path)
            }else {
                
              try{ 
                let {list}=  await getAllOuthor(depart,author)
                if(JSON.stringify(list)==='{}'){
                    return message.error("抱歉，您无权限访问此模块，请联系管理员授权！")
                }
                    this.props.history.replace(path)

              }catch{
                  message.error("抱歉访问出错啦！")
              }
            }
        })
        // 操作手册下载
        PubSub.subscribe("downWord", async (_) => {
            let result = await getAllWords()

            this.setState({
                drawerShow: true,
                words: result['list']
            })
        })

    }
// shouldComponentUpdate

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };
    componentWillUnmount() {
        PubSub.unsubscribe("downWord")
        PubSub.unsubscribe('tiaozhuan')
    }
    // downWords 下载指定的word
    downWords=(url)=>{
        window.location.href=serverUrl+'/'+url
    }
    // 已阅读播报
    onReadBobao=async()=>{
        let d=  await this.BobaoRef.Ok2Bobao(this.state.user['username'])
        if(d['status']){
            this.setState({
                bobaoShow:false
            })
        }
    }
    render() {

        const { collapsed, user, drawerShow, words,bobaoShow } = this.state;
        return (
            <div className="main">
                {/* 总布局 */}
           
                    <Layout style={{ minHeight: '100vh' }}>
                        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse} style={{ marginTop: 64, width: 200, position: 'fixed', top: 0, bottom: 0 }}>

                            <Category></Category>
                        </Sider>
                        <Layout className="site-layout">
                            <Header className="site-layout-background header" style={{ padding: 0, width: "100vw", position: "fixed", zIndex: 999, left: 0, right: 0, overflow: "hidden" }} >
                                {/* logo */}
                                <div className="logo">
                                    <img src={Logo} style={{height:64 ,background:"white",marginTop:-8}} alt="" />
                                </div>
                                {/* 头部导航 */}
                                <div className="topCategory" >
                                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} className="topCategory">
                                        <Menu.Item key="1">工作</Menu.Item>
                                    </Menu>
                                </div>
                                {/* 用户区 */}
                                <div className="user">
                                    <User user={user}></User>
                                </div>
                            </Header>
                            <Content style={{ margin: '50px 16px 0 16px', overflowY: 'scroll', paddingLeft: 200 }} >

                                <div className="site-layout-background" style={{ padding: 24 }}>
                                    {/* center */}

                                    <Switch>
                                        <Route path="/main/bjprice" component={Bjprice}></Route>
                                        <Route path="/main/wuliudaohuo" component={WuliuDaohuo}></Route>
                                        <Route path="/main/userMange" component={UserMange}></Route>
                                        <Route path="/main/index" component={Index}></Route>
                                        <Router path="/main/luyou" component={Router}></Router>
                                        <Redirect to="/main/index"></Redirect>
                                    </Switch>

                                </div>
                            </Content>
                            <Footer style={{ textAlign: 'center' }}>CFL -ERP功能管理系统</Footer>
                        </Layout>
                    </Layout>
               

                <div className="utils">
                    <Drawer
                        title="功能操作手册下载"
                        visible={drawerShow}
                        onClose={() => {
                            this.setState({
                                drawerShow: false
                            })
                        }}
                    >
                        {words.map((item, index) => (<Card key={index} 
                            title={item['file_name']}
                        >
                            <Button type="link" onClick={()=>{this.downWords(item['urls'])}}>
                               {item['file_name']}
                        </Button>

                        </Card>))} 

                    </Drawer>
                </div>

                {/* 咨询提醒 */}
                <div className="zixun">
                    <Modal
                    title="今日简报"
                    visible={bobaoShow}
                    okText="已阅"
                    cancelText="取消"
                    onOk={this.onReadBobao}
                    onCancel={this.onReadBobao}
                    >
                       <Bobao ref={node=>this.BobaoRef=node} user={user}></Bobao>
                    </Modal>
                </div>
            </div>
        )
    }
}


export default connect(state=>({
    user:state.user
}),{
    operationUser
})(Main)