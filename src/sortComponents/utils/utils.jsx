// import { Button } from "antd"
import React,{Component} from "react"
import "./css/utils.css"


export default class Utils extends Component{
    state={
        width:0,
        data:[]
    }

    // 打开按钮
    onLook=()=>{
        this.setState({
            width:this.state.width===0?200:0,
       
        })

    }
    componentDidMount(){
        this.setState({
            data:this.props.children
        })
    }
    render(){
        const {width,data}=this.state
       
      
        return (
            <div className="utilss" style={{width:width,height:350}}>
                <div className="content">
                
                {data}
                   

                </div>
                <div className="title" onClick={this.onLook}>
                   操作面板
                </div>
            </div>
        )


    }



}