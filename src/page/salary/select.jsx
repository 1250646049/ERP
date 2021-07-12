import React, { Component } from "react"
import {Select, Input, DatePicker,Tag,Button,message} from "antd"
import Checkbox from "antd/lib/checkbox/Checkbox"
import PubSub from "pubsub-js"
import {selectAllNews} from "../../axios/index"
import {connect} from "react-redux"
import {OpSalary} from "../../redux/action/salary"
const { Option } = Select
class Selects extends Component {
    state={
        yibu:false,
        erbu:false,
        selectValue:"",
        startTime:"",
        endTime:"",
        selects:[],
        type:"",
        optionArr:[],
        cjoptionValue:""
  
    }
    componentDidMount(){
        this.initData()

    }
    initData=async()=>{
       let result= await selectAllNews()
     //保存至redux里面
       this.props.OpSalary(result['data'])

    }
    // 获取内容
    static getDerivedStateFromProps(props){
        const {selectValue,type}=props
        let selects=Object.keys(selectValue).reduce((reduce,item,index)=>{
            reduce.push({
                label:selectValue[item],
                value:item
            })
            return reduce;
        },[])
        return {
            selects,
            
            type
        };
    }
    // 
    onChange=(v)=>{
        let optionArr=[]
        let cjoptionValue=""
        if(v==='chanliang' || v==='feiyon' ){
            let {work}=this.props.salary
            if(this.state.yibu && !this.state.erbu){
             
                optionArr=work.filter((item)=>item['bm']==='一部')
                cjoptionValue=optionArr[0]['WorkshopName']
            }else if (!this.state.yibu && this.state.erbu){
                optionArr=work.filter((item)=>item['bm']==='二部')
                cjoptionValue=optionArr[0]['WorkshopName']
            }else {
                optionArr=work
                cjoptionValue=optionArr[0]['WorkshopName']
            }
        }
        this.setState({
            selectValue: v,
            optionArr,
            cjoptionValue
        },()=>{
            console.log(this.state.cjoptionValue);
        })
    }
    // 搜索内容
    onSearch=()=>{

        const { value} = this.searchRef.state

        // if (!value?.trim()) {
        //     return this.initData()
        // }
        if (this.state.startTime && this.state.endTime) {
            let end = new Date(this.state.endTime).getTime()
            let start = new Date(this.state.startTime).getTime()
            if (start > end) {
                return message.error("抱歉，开始时间不能大于结束时间！")
            }
        }
        // 发送请求进行查询 yibu, erbu, type, content, startTime, endTime
        let data = {
            type: this.state.selectValue,
            content: value ? value.trim() : "",
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            yibu: this.state.yibu ? 1 : 0,
            erbu: this.state.erbu ? 1 : 0,
            work:this.state.cjoptionValue
        }
        PubSub.publish("selectData",{
            data,
            type:this.state.type,
            sortType:this.state.selectValue
           
        })
    }
    render() {
        const selectArr=['kaoqmingxi','qjia','huizon','']
        const {yibu,erbu,selectValue,selects,type,optionArr,cjoptionValue}=this.state
        return (
            <div>
                <div className="search" style={{ marginBottom: 15 }}>
                    <div>
                        <Checkbox checked={yibu} onChange={(v) => {
                            this.setState({
                                yibu: !this.state.yibu
                            })
                        }}>一部</Checkbox>
                        <Checkbox checked={erbu} onChange={(v) => {
                            this.setState({
                                erbu: !this.state.erbu
                            })
                        }}>二部</Checkbox>
                    </div>
                    <div style={{ margin: "8px 0" }}>
                        <Tag color="orange">检索类型:</Tag>
                        <Select
                            defaultValue={!selectValue?selects[0]?.value:selectValue}
                            onChange={(v) => {
                                
                                this.onChange(v)
                            }}
                        >
                            {selects?.map((item,index)=>{
                                return <Option key={index} value={item['value']}>{item['label']}</Option>
                            })}
                        </Select>
                        <Input  style={{ width: 400,display:selectArr.indexOf(selectValue)!==-1?'':'none' }} ref={node => this.searchRef = node} allowClear={true} placeholder={type==='person'?'请输入员工工号进行检索':''}></Input>

                         <Select
                         style={{display:(type==='person'&&selectValue!=='wenti'&&selectValue!=='cwkq') &&selectArr.indexOf(selectValue)===-1?'':'none'}}
                         value={cjoptionValue}
                         >
                            
                            {optionArr.length&&optionArr.map((item,index)=>{
                               return <Option
                                    key={index}
                                    value={item['WorkshopName']}
                                >
                                 {item['WorkshopName']}
                              </Option> 
                            })}  
                        </Select>   

                    </div>
                    <div>
                        <Tag color="green">开始日期:</Tag> <DatePicker
                            onChange={(date) => {

                                this.setState({
                                    startTime: date ? date?.year() + "-" + (date?.month() + 1) + "-" + date?.date() : ""
                                }, () => {
                                    console.log(this.state.startTime);
                                })
                            }}
                        ></DatePicker>
                        <Tag color="green" style={{ marginLeft: 10 }} >结束日期:</Tag> <DatePicker onChange={(date) => {

                            this.setState({
                                endTime: date ? date?.year() + "-" + (date?.month() + 1) + "-" + date?.date() : ""
                            }, () => {
                                console.log(this.state.endTime);
                            })
                        }}></DatePicker>
                        <Button style={{ marginLeft: 20 }} type="primary" onClick={this.onSearch}>查询</Button>
                        </div>
            </div>

            
            </div>

        )



    }









}

export default connect(
    state=>(
        {
            salary:state.salary
        }
    ),{
        OpSalary

    }

)(Selects)