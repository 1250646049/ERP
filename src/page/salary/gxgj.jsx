import { Col, Row, AutoComplete, Input } from "antd"

import React, { Component } from "react"



export default class Gxgj extends Component {

    state = {
        num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        process: [],
        options: [],
        obj: {},
        visible: false,
        finaloption: []
    }


    OnInput = (e, index) => {
        console.log(e.target.value);


    }
    componentDidMount() {
        this.initContains()
        // 显示提示
        this.initData()
    }

    initData = () => {
        if (window.localStorage.getItem("_item_")) {
            this.setState({
                visible: true
            })
        }


    }
    //初始化容器
    initContains = () => {
        window.setTimeout(() => {
            const { process, bm } = this.props
            let arr = []
            if (bm === 'yibu') {
                arr = process.reduce((reduce, item) => {
                    if (item['bm'] === '一部') {
                        reduce.push({
                            value: item['Code']
                        })
                    }
                    return reduce;
                }, [])
            } else {
                arr = process.reduce((reduce, item) => {
                    if (item['bm'] === '二部') {
                        reduce.push({
                            value: item['Code']
                        })
                    }
                    return reduce;
                }, [])
            }
            this.setState({
                process: process,
                options: arr,
                finaloption: arr
            })
        }, 1000)

    }

    //选中内容
    selectContent = (index, item) => {
        // 本地缓存
        this.timer && clearTimeout(this.timer)
        this.timer = window.setTimeout(() => {
            let localitem = window.localStorage.getItem("_item_")
            let content = this.state.process.find((items) => items['Code'] === item)
            let obj = {}
            console.log(content,"content")
            if (!content) {
                if(localitem) {
                    obj=JSON.parse(localitem)
                    
                    delete obj[index]
                    window.localStorage.setItem("_item_", JSON.stringify(obj))
                }

            } else {

                if (!localitem) {

                    obj = {
                        [index]: content
                    }
                    window.localStorage.setItem("_item_", JSON.stringify(obj))
                } else {
                    obj = JSON.parse(localitem)
                    obj[index] = content;
                    window.localStorage.setItem("_item_", JSON.stringify(obj))
                    // 保存状态

                }
            }
      

            this.setState({
                obj,
                options: this.state.finaloption
            }, () => {

            })
        }, 300)
    }
    // 写入产量
    onInput = (e, item) => {

        window.setTimeout(() => {
            let obj = window.localStorage.getItem("_item_") ? JSON.parse(window.localStorage.getItem("_item_")) : {}
            obj[item]['cl'] = e.target?.value
            window.localStorage.setItem("_item_", JSON.stringify(obj))
            this.setState({
                obj
            })
        }, 500)


    }
    render() {
        const { num, options, obj } = this.state
        return (
            <div className="Gxgj">

                {/* 工序编码 */}
                <div className="code" >
                    <Row>
                        <Col span={1} style={{ marginTop: 5 }}>
                            <span >工序编码:</span>
                        </Col>
                        {num.map((item) => {

                            return (
                                <Col span={2} key={item}  >
                                    <AutoComplete
                                        placeholder={obj[item]?.Code}

                                        options={options}
                                        style={{ width: "100%" }}
                                        onSearch={(v) => {
                                            let filterArr = this.state.finaloption.filter((item) => item['value']?.indexOf(v) !== -1)
                                            this.setState({
                                                options: filterArr
                                            })

                                        }}
                                        onChange={(v) => {
                                            this.selectContent(item, v)
                                        }}
                                        // onSelect={
                                        //     (v) => {

                                        //         this.selectContent(item, v)
                                        //     }
                                        // }
                                    >

                                    </AutoComplete>

                                </Col>
                            )
                        })}


                    </Row>

                    {/* 工序名称*/}
                    <div className="name" style={{ margin: "10px 0" }} >
                        <Row>
                            <Col span={1} style={{ marginTop: 5 }}>
                                <span >工序名称:</span>
                            </Col>
                            {num.map((item) => {

                                return (
                                    <Col span={2} key={item}  >
                                        <Input value={obj[item]?.['Name']} disabled={true}></Input>

                                    </Col>
                                )
                            })}


                        </Row>

                    </div>
                    {/* 工序单价*/}
                    <div className="UnitPrice" style={{ margin: "10px 0" }} >
                        <Row>
                            <Col span={1} style={{ marginTop: 5 }}>
                                <span >工序单价:</span>
                            </Col>
                            {num.map((item) => {

                                return (
                                    <Col span={2} key={item}  >
                                        <Input  value={obj[item]?.['UnitPrice']} disabled={true}></Input>

                                    </Col>
                                )
                            })}


                        </Row>

                    </div>
                    {/* 产量*/}
                    <div className="cliang" style={{ margin: "10px 0" }} >
                        <Row>
                            <Col span={1} style={{ marginTop: 5 }}>
                                <span >项目产量:</span>
                            </Col>
                            {num.map((item) => {

                                return (
                                    <Col span={2} key={item}  >
                                        <Input placeholder={obj[item]?.['cl']} disabled={!obj[item] ? true : false} onInput={(e) => {
                                            this.onInput(e, item)
                                        }}></Input>

                                    </Col>
                                )
                            })}


                        </Row>

                    </div>

                </div>
                {/* utils */}
                {/* <div className="utils">
                    <Modal
                        title="检测到您还未保存的数据，是否加载上一次的数据？"
                        visible={visible}
                        okText="加载数据"
                        cancelText="清除数据"
                        onCancel={() => {
                            window.localStorage.getItem("_item_") && window.localStorage.removeItem("_item_")
                            this.setState({
                                visible: false
                            })
                        }}
                        onOk={() => {
                            window.localStorage.getItem("_item_") && (
                                this.setState({
                                    obj: JSON.parse(window.localStorage.getItem("_item_")),
                                    visible: false
                                })
                            )
                        }}
                    >
                        <div>
                            <Table
                                columns={
                                    [
                                        { title: "车间", dataIndex: "cj", key: 'cj' },
                                        { title: "工序编码", dataIndex: "Code", key: 'Code' },
                                        { title: "工序名称", dataIndex: "Name", key: "Name" },
                                        { title: "工序单价", dataIndex: "UnitPrice", key: "UnitPrice" }
                                    ]
                                }

                                dataSource={window.localStorage.getItem("_item_") && Object.values(JSON.parse(window.localStorage.getItem("_item_")))}
                            >


                            </Table>
                        </div>
                    </Modal>

                </div> */}
            </div>
        )

    }



}