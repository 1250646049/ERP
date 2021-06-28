import Modal from "antd/lib/modal/Modal"
import React, { Component } from "react"
import Pubsub from "pubsub-js"
import { Input, Pagination, Tag } from "antd";


export default class Work extends Component {
    state = {
        show: true,
        work: [],
        team: [],
        number: 9,
        current: 1,
        selected: 0, finalTeam: [],item:{}
    }

    shouldComponentUpdate() {

        return true;
    }

    static getDerivedStateFromProps(d) {
        let { show, team, work } = d;
        // team.map((item) => {
        //     let d = work.find((items) => items.WorkshopCode === item.WorkshopCode[0])
        //     item['work'] = d
        //     return item;
        // })

        return {
            show, team, work, finalTeam: team
        };
    }
    // 取消显示
    onCancel = () => {
        Pubsub.publish("cancel")
    }
    // 选中work
    onSelected = (index,item) => {
       
        this.setState({
            selected: index,
            item
        })
    }
    render() {
        const { show, team, number, current, selected,item } = this.state
        return (
            <div className="work">
                <Modal
                    visible={show}
                    title="请选择车间信息"
                    cancelText="取消"
                    okText="选中"
                    onOk={()=>{
                        Pubsub.publish("setItemData",item)
                        this.onCancel()
                        
                     
                    }}
                    onCancel={() => {
                        this.onCancel()
                    }}
                >
                    <div>
                        <div>
                            <Input.Search placeholder="输入车间名称进行检索" style={{ width: 200, margin: "4px 12px" }} onSearch={(v) => {
                            
                                if (!v) {
                                    Pubsub.publish("setTeam", {
                                        type: "all",
                                    })
                                } else {
                                    Pubsub.publish("setTeam", {
                                        type: "one",
                                        value: v
                                    })
                                }
                            }}>

                            </Input.Search>
                        </div>
                        <ul style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", listStyleType: "none" }}>
                            {team && team.map((item, index) => {
                                return (
                                    <li onClick={() => {
                                        this.onSelected(index,item)

                                    }} style={{ width: 120, textAlign: "center", display: (index < number && index >= number - 9) ? '' : 'none', padding: 4, cursor: "pointer", border: selected === index ? '1px solid red' : "1px solid #eee", margin: "3px 0" }} key={index}>
                                        <div >
                                            <Tag color="cyan">车间编码</Tag> <span style={{ fontSize: 12 }}>{item['WorkshopCode'][0]} </span>
                                        </div>
                                        <div >
                                            <Tag color="cyan">车间名称</Tag> <br></br><span style={{ fontSize: 12 }}>{item['WorkshopName']}</span>
                                        </div>
                                        <div >
                                            <Tag color="green">班组编码</Tag> <span style={{ fontSize: 12 }}>{item['TeamCode']}</span>
                                        </div>
                                        <div >
                                            <Tag color="green">班组名称</Tag> <br /><span style={{ fontSize: 12 }}>{item['TeamName']}</span>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                        <Pagination total={team.length} current={current} pageSize={9} onChange={(d) => {
                            this.setState({
                                current: d,
                                number: d * 9
                            }, () => {
                                console.log(this.state.number);
                            })
                        }}></Pagination>
                    </div>
                </Modal>


            </div>
        )


    }




}