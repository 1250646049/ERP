import React, { Component } from 'react'
import animationData from "../../assert/lottie/code.json"
import "animate.css"
import Lottie from "lottie-react" //动画插件库




export default class Loading extends Component {
    state={
        width:400,
        height:400,
        spend:0,
        flag:true
    }
    componentDidMount(){
        const {width,height,spend}=this.props
        if(spend){
           window.setTimeout(()=>{
             this.setState({
                 flag:false
             })

           },spend*1000) 
        }
        this.setState({
            width,
            height
        })
    }
    render() {
        /**
          * 使用lottie动画
          */

        const {width,height,flag}=this.state
        
        return (
                <div className="lottie animate__animated animate__backInUp" style={{display:flag?'block':'none'}}>
                   <Lottie
                     loop={true}
                    animationData={animationData}
                    height={height}
                    width={width}
                ></Lottie>
                </div>
            )
    }
}