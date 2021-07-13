import React, { Component } from 'react'
import { Layout, Menu, message, Drawer, Card, Button } from 'antd';
import Category from "../../page/Sider/category"
import Bjprice from "../../page/price/bjprice/bjprice"
import { Switch, Route, Redirect } from "react-router-dom"
import User from "../../page/user/user"
import PubSub from "pubsub-js"
import "./css/main.css"
import { toAutoLogin, getAllWords, getAllOuthor, selectNoneUrl, selectBobao } from "../../axios/index"
import WuliuDaohuo from "../../page/wuliu/wuliu"
// 导入服务器URL
import UserMange from "../../page/userMange/userMange"
import { serverUrl } from "../../config/config"
import { connect } from "react-redux"
// 导入首页组件
import { operationUser } from "../../redux/action/login"
import Index from "../../page/index/index"
import Logo from "../../assert/img/logo.png"
// 导入路由设置插件
import Router from "../../page/router/router"
// 导入今日播报
// import Bobao from "../../page/bobao/bobao"

// 导入往来表
import Wanglai from "../../page/wanglai/wanglai"

// 导入财纳应收账款
import CainaYinshou from "../../page/yinshou/cainayinshou"

// 导入应收账款
import Yinshou from "../../page/yinshou/yinshou"

// 导入薪资系统
import Setting from "../../page/salary/setting"
import Query from "../../page/salary/query"
// 导入物流收货维护
import WuliuDaohuoInput from "../../page/wuliu/wuliuinput"
// 导入试题库
import Din_Fukuan from "../../page/exam/din_fukuan"
import Exam from "../../page/exam/exam"
import Yusuan from '../../page/salary/yusuan';
import Kaoqin from '../../page/salary/kaoqin';
const { Header, Content, Footer, Sider } = Layout;

class Main extends Component {
    state = {
        collapsed: false,
        currentObj: {},
        user: {},
        drawerShow: false,
        words: [],
        bobaoShow: false,
        headers: ['1']
    };

    componentDidMount() {
        this.initData()
        this.urlAlter()

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

                // console.log(h)
                //    设置用户
                this.setState({
                    user: data,

                }, async () => {
                    // 监听浏览器地址变化         
                    // console.log(this.state.user)
                    let d = await selectBobao(this.state.user['username'])
                    if (JSON.stringify(d['list']) === "{}") {
                        this.setState({
                            bobaoShow: true,

                        })

                    }
                })
            }
        } catch {
            message.error("授权错误，请重新登录！")
            return this.props.history.replace("/login")

        }
        //  路由跳转
        PubSub.subscribe("tiaozhuan", async (_, data) => {
            const { path, author } = data
            const { depart, auth } = this.state.user

            // 判断是否为超级管理员
            let { list } = await selectNoneUrl()
            let content = list.find((item) => item.biaoshi === author)

            if (content) {
                return this.props.history.replace(path)
            }

            if (depart === 'ERP' || auth === 1) {

                return this.props.history.replace(path)
            } else {

                try {
                    let { list } = await getAllOuthor(depart, author)
                    if (JSON.stringify(list) === '{}') {
                        this.props.history.replace("/main/index")
                        return message.error("抱歉，您无权限访问此模块，请联系管理员授权！")
                    }
                    this.props.history.replace(path)

                } catch {
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

    // 监听地址栏改变事件
    urlAlter = () => {
        window.onload = (e) => {
            // 获取URL地址
            const { pathname } = this.props.location
            // 获取路径标识
            const biaoshi = pathname.split("/")[2]
            // console.log(biaoshi,pathname);
            window.setTimeout(() => {
                PubSub.publish("tiaozhuan", {
                    path: pathname,
                    author: biaoshi
                })
            }, 200)

        }


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
    downWords = (url) => {
        window.location.href = serverUrl + '/' + url
    }
    // 已阅读播报
    onReadBobao = async () => {
        let d = await this.BobaoRef.Ok2Bobao(this.state.user['username'])
        if (d['status']) {
            this.setState({
                bobaoShow: false
            })
        }
    }
    // 头部切换菜单栏
    onAlterCaidan = (key) => {
        PubSub.publish("alterSid", key)


    }
    render() {

        const { collapsed, user, drawerShow, words, headers } = this.state;
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
                                <img src={Logo} style={{ height: 64, background: "white", marginTop: -8 }} alt="" />
                            </div>
                            {/* 头部导航 */}
                            <div className="topCategory" >
                                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={headers} className="topCategory">
                                    <Menu.Item key="1" onClick={() => {
                                        this.onAlterCaidan(1)
                                    }}>工作</Menu.Item>
                                    <Menu.Item key="3" style={{ marginLeft: 15 }}
                                        onClick={() => {
                                            this.onAlterCaidan(3)
                                        }}

                                    >薪资系统</Menu.Item>
                                    <Menu.Item key="2" style={{ marginLeft: 15 }}
                                        onClick={() => {
                                            this.onAlterCaidan(2)
                                        }}

                                    >辅助</Menu.Item>


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
                                    <Route path="/main/luyou" component={Router}></Route>
                                    <Route path="/main/wanglai" component={Wanglai}></Route>
                                    <Route path="/main/yinshou" component={Yinshou}></Route>
                                    <Route path="/main/cainaYinshou" component={CainaYinshou}></Route>
                                    <Route path="/main/exam" component={Exam}></Route>
                                    <Route path="/main/sz_salary" component={Setting}></Route>
                                     <Route path="/main/salary_query" component={Query}></Route>   
                                     <Route path="/main/din_Fukuan" component={Din_Fukuan}></Route> 
                                     <Route path="/main/wuliuInput" component={WuliuDaohuoInput}></Route>  
                                     <Route path="/main/salary_yusuan" component={Yusuan}></Route>
                                     <Route path="/main/salary_kaoqin" component={Kaoqin}></Route>
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
                            <Button type="link" onClick={() => { this.downWords(item['urls']) }}>
                                {item['file_name']}
                            </Button>

                        </Card>))}

                    </Drawer>
                </div>

                {/* 咨询提醒 */}
                {/* <div className="zixun">
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
                </div> */}
            </div>
        )
    }
}


export default connect(state => ({
    user: state.user
}), {
    operationUser
})(Main)