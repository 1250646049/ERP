import { Button, message, Row } from "antd"
import Pubsub from "pubsub-js"
import React, { Component } from "react"
import Person from "./person"
import { selectPerson } from "../../axios/index"
export default class Glyg extends Component {
    state = {
        label: [],
        person: [],
        personObj: {},
        num: [1],
        result:{}
    }


    componentDidMount() {

        Pubsub.subscribe("loadProcess", () => {
            this.initContains()
            this.initPerson()
        })



    }
    // 查询所有员工
    initPerson = async () => {
        let result = await selectPerson()
        this.setState({
            person: result['Person']
        }, () => {

        })
    }
    // 初始化容器
    componentWillUnmount() {

        Pubsub.unsubscribe("toPerson")

    }
    // 设置result
    static getDerivedStateFromProps(props){
        const {result}=props
        return {
            result
        }
    }
    initContains = () => {
        let arr = ['工号', '姓名', '出勤情况', '计时项目1', '计时小时数1', '计时薪资1', '计时项目2','计时小时数2','计时薪资2',
        '计时项目3','计时小时数3','计时薪资3'
            ,  '计件平均工资', '计时薪资', '计件薪资', '补贴薪资', '当日薪资',
            '倍数', '是否请假', '其他倍数', '部门','补贴项目1','补贴金额1','补贴项目2','补贴金额2','补贴项目3'
        ]

        let obj = JSON.parse(window.localStorage.getItem("_item_"))

        for (const item in obj) {
            arr.push(obj[item]['Code']+"|")
            arr.push(obj[item]['Code'] + "|平均工资|")
            arr.push('计件薪资'+item)
        }
        arr.push("操作")
        this.setState({
            label: arr
        })

    }
    render() {
        const { label, person, num,result } = this.state
        return (
            <div className="glyg">
                <div className="utils">
                    <Button type="primary" onClick={() => {
                        let arr = this.state.num
                        arr.push(1)
                        this.setState({
                            num: arr
                        })
                    }}>添加一个员工</Button>

                    <Button style={{color:"white",background:"red",marginLeft:10}} type="primary" onClick={() => {
                        let arr = this.state.num
                        if(arr.length===1){
                            return message.error("必须保留一个员工工位！")
                        }
                        arr.pop()
                        this.setState({
                            num: arr 
                        })
                    }}>减少一个员工</Button>
                </div>
                <div className="person">

                    <Row>

                        {num.map((_, index) => {

                            return (
                                <Person label={label} person={person} key={index} index={index} result={result}/>
                            )
                        })}


                    </Row>

                </div>

            </div>
        )


    }




}