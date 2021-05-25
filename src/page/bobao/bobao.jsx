import { List,Tag,Typography } from "antd"
import React,{Component} from "react"
import {getBobao,addBobao} from "../../axios/index"



export default class Bobao extends Component{
    state={
        user:{},

        time:"",
        weather:{},
        news:[],
        address:{}
    }
    componentDidMount(){
        this.initData()

    }
    // 初始化数据

    initData=()=>{
        setTimeout(async()=>{
          let result= await  getBobao()
         
           this.setState({
               user:this.props.user,
               news:result['news'],
               time:result['time'],
               weather:result['weather'],
               address:result['address']
           })
        },500)

        

    }

    // 确认阅读到播报

    Ok2Bobao=async(username)=>{
      let result= await addBobao(username)
        
      return result

    }
    
    render(){

        const {user,time,news,weather,address}=this.state
        return (
            <div className="bobao">
                <div className="huanying">
                   <span style={{fontSize:18}}> {user&&user['name']}</span> 您好,今天是农历 <Tag color="red">{time}</Tag> 您目前位于<Tag color="green">{address['province']}{address['city']}{address['district']}{address['township']}{address['detail']}</Tag>
                </div>
                <div className="weather" style={{margin:"10px 0"}}>
                {address['province']} {address['city']} {address['district']}今天的温度是<Tag color="purple"> {weather['degree']}°</Tag>  <Tag color="orange">{weather['weather']}</Tag>  西北风 <Tag color="cyan">2</Tag>级  湿度 <Tag color="blue">{weather['humidity']}% </Tag> 气压 <Tag color="error">{weather['pressure']}hPa</Tag>
                </div>
               <div className="news" style={{height:400,overflowY:"auto"}}>
                   <List
                   header={<div>为您播报今天的热点新闻(同步至百度热榜)：</div>}
                   dataSource={news}
                   renderItem={(item,index) => (
                    <List.Item>
                      <Typography.Text mark>[{index+1}]</Typography.Text> {item}
                    </List.Item>
                  )}
                  
                   >

                   </List>
               </div>
            </div>

        )


    }




}