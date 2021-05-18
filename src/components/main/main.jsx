import React, { Component } from 'react'
import { Layout, Menu, message, Drawer, Card, Button } from 'antd';
import Category from "../../page/Sider/category"
import Bjprice from "../../page/price/bjprice/bjprice"
import { Switch, Route} from "react-router-dom"
import User from "../../page/user/user"
import PubSub from "pubsub-js"
import "./css/main.css"
import { toAutoLogin, getAllWords } from "../../axios/index"
import WuliuDaohuo from "../../page/wuliu/wuliu"
// 导入服务器URL
import UserMange from "../../page/userMange/userMange"
import {serverUrl} from "../../config/config"
const { Header, Content, Footer, Sider } = Layout;




 export default class Main extends Component {
    state = {
        collapsed: false,
        currentObj: {},
        user: {},
        drawerShow: false,
        words: []
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
                //    设置用户
                this.setState({
                    user: data
                })
            }
        } catch {
            message.error("授权错误，请重新登录！")
            this.props.history.replace("/login")
            
        }
        //  路由跳转
        PubSub.subscribe("tiaozhuan", (_, data) => {
            this.props.history.replace(data)
           
             this.setState({
                 currentObj:{...this.props.location}
             })
            
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
    }
    // downWords 下载指定的word
    downWords=(url)=>{
        window.location.href=serverUrl+'/'+url
    }
    render() {

        const { collapsed, user, drawerShow, words } = this.state;
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
                                <div className="logo">CFL ERP综合功能管理系统</div>
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
            </div>
        )
    }
}


