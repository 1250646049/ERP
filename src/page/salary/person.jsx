import React, { Component } from "react"
import {Row,Col, Tag, Divider, Input, message} from "antd"

export default class Person extends Component {
    state={
        label:[],
        process:{},
        person:[],
        personObj:{}
        
    }

    componentDidMount(){
       
        this.initContains()
       

    }



    initContains=()=>{
        if(window.localStorage.getItem("_item_")){
            this.setState({
                process:window.localStorage.getItem("_item_")
            })


        }

    }
    static getDerivedStateFromProps(props){
        const {label,person}=props

        return {
            label,
            person
        }
    }

    // 输入内容

    onInputPerson=(e,type,item)=>{
        // 根据id获取用户信息
        const {value}=e.target
        if(this.state.person.length===0){

            return message.error("请耐心等待数据渲染！")
        }
       
        try{
           let obj= this.state.person.find((item)=>Number(item['PersonCode'])===Number(value.trim()))
           this.setState({
               personObj:obj
           })

        }catch{
            message.error("抱歉，员工工号只能是数字！")
        }
      
    }

  

  


    render() {
        const {label,personObj}=this.state
 
        return (
            <div>
                <Row >

                    {label.map((item, index) => {
                        return (
                            <Col span={4} key={index} style={{display:"flex",margin:"8px 0"}} >
                                <Tag color="green" style={{margin:"5px 5px"}}>{item+":"}</Tag>
                                {(item==='工号')&& <Input onInput={(e)=>{
                                    this.onInputPerson(e,'PersonCode',index)

                                }}></Input>}
                                {(item==='姓名')&& <Input disabled={true} placeholder={personObj?.PersonName}></Input>}
                                {(item==='出勤情况')&& <Input ></Input>}
                                {(item==='部门')&& <Input disabled={true} placeholder={personObj?.cdutycode}></Input>}
                            </Col>
                          
                        )
                    })}
                </Row>
                <Divider></Divider>
            </div>
        )


    }




}