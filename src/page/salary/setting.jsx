import { Button, Card, Table,  Tabs,Popconfirm, message, Modal, Input, Select } from 'antd'
import Form from 'antd/lib/form/Form'
import FormItem from 'antd/lib/form/FormItem'
import React, { Component } from 'react'
import {selectAllNews,deleteContent,updateWorkshop, insertWorkshop} from "../../axios/index"
const {Option}=Select
const {TabPane}=Tabs
export default class Setting extends Component{
    state={
        work:[],
        workFinal:[],
        team:[],
        subsidyProject:[],
        project:[],
        process:[],
        person:[],
        HY_Department:[],
        workShow:false,
        workBm:"一部",
        type:"alter"
    }
    componentDidMount(){

        this.initData()

    }

    // 初始化数据
    initData=async()=>{
        let {data}=await selectAllNews()
        console.log(data);
        this.setState({
            work:data['work'],
            workFinal:data['work'],
            team:data['team'],
            subsidyProject:data['subsidyProject'],
            project:data['project'],
            process:data['process'],
            person:data['person'],
            HY_Department:data['HY_Department']
        })


    }
    // 删除指定内容
    onDelete=async(name,code)=>{
        let data=""
        let type=""
        switch(name){
            case "work":
                data="Workshop"
                type="WorkshopCode"
                break;
            case "team":
                data="Team"
                type="TeamCode"
                break;
            case "person":
                data="Person"
                type="PersonCode"
                break;
            case "process":
                data="Process"
                type="Code"
                break;
            case "project":
                data="Project"
                type="ProjectCode"
                break;
            case "subsidyProject":
                 data="SubsidyProject"
                 type="Id"
                 break;
            case "hY_Department":
                data="HY_Department"
                type="d_ID"
                break;
            default:
               return message.error("抱歉，服务器异常啦...")
                
        }
    
        // 调用api删除内容
        let {status}=await deleteContent(data,type,code)
        if (status) {
            this.initData()
            message.success("恭喜你，删除数据成功！")
        }else {
            message.error("抱歉，删除数据失败！")
        }


    }
    // 修改车间信息
    updateWorkshop=async()=>{
       
            
        try{
            let validate= await this.WorkRef.validateFields()
         if(this.state.type==='alter'){
            let {status}=await updateWorkshop(validate)
            if(status){
                this.setState({
                    workShow:false
                },()=>{
                    message.success("恭喜你，更新车间信息成功！")
                    this.initData()
                })
            }else {
                throw new Error("抱歉，更新车间信息失败！")
            }
        }else {
            let {status}=await insertWorkshop(validate['WorkshopName'],this.state.workBm)
            if(status){
                this.setState({
                    workShow:false
                },()=>{
                    message.success("恭喜你，添加一条车间信息成功！")
                    this.initData()
                })
            }else {
                throw new Error("抱歉，添加一条车间信息失败！")
            }

        }
          }catch{
            message.error("车间名称不能为空！或者服务器出现故障....")
          }
       


    }
    resetWorkshop=async()=>{
        this.WorkRef&&await this.WorkRef.resetFields();


    }
    render(){
        const {work,team,person,process,project,subsidyProject,HY_Department,workShow,workBm,type}=this.state
    //    车间信息
        const WorkColumns=[
            {
                title:"车间编码",
                dataIndex:"WorkshopCode",
                key:"WorkshopCode"
            },{
                title:"车间名称",
                dataIndex:"WorkshopName",
                key:"WorkshopName"
            },{
                title:"所属部门",
                dataIndex:"bm",
                key:"bm",
                filters:[
                    {
                        text:"一部",
                        value:"一部"
                    },{
                        text:"二部",
                        value:"二部"
                    }
                ],
                onFilter:(value,record)=>{
                    
                    return record.bm===value
                }
            },{
                title:"操作",
                key:"caozuo",
                render:(d)=>{
                    const {WorkshopName,WorkshopCode}=d
                    return <div>
                        <Button type="primary" onClick={()=>{
                            this.setState({
                                workShow:true,
                                type:"alter"
                            },()=>{
                                this.WorkRef.setFieldsValue({
                                    WorkshopCode,
                                    WorkshopName
                                })


                            })

                        }}>修改</Button>
                        <span style={{marginLeft:15}}></span>
                        <Popconfirm placement="topRight" title={'您确定要删除['+WorkshopName+']车间吗?'} onConfirm={()=>{
                            this.onDelete('work',WorkshopCode)
                        }}  okText="确定" cancelText="取消">
                             <Button type="default" >删除</Button>
                     </Popconfirm>
                        
                    </div>
                }
            }


        ]
    //班组信息
        const TeamColumns=[
            {
                title:"车间编码",
                key:"WorkshopCode",
                render:(d)=>{
                    const {WorkshopCode}=d
                    return <span>{WorkshopCode[0]}</span>
                }
            },
            {
                title:"车间名称",
                key:"WorkshopCode",
                dataIndex:"WorkshopName"
            },{
                title:"班组编码",
                dataIndex:"TeamCode",
                key:"TeamCode"
            },{
                title:"班组名称",
                dataIndex:"TeamName",
                key:"TeamName"
            },{
                title:"编制人数",
                dataIndex:"number",
                key:"number"
            },{
                title:"部门",
              
                key:"bm",
                render:(d)=>{
                    const {bm}=d
                    return <span>{bm[0]}</span>

                },
                filters:[
                    {
                        text:"一部",
                        value:"一部"
                    },{
                        text:"二部",
                        value:"二部"
                    }
                ],
                onFilter:(value,record)=>{
                    
                    return record.bm[0]===value
                }
            },{
                title:"操作",
                key:"caozuo",
                render:(d)=>{
                    const {TeamName,TeamCode}=d
                    return <div>
                        <Button type="primary">修改</Button>
                        <span style={{marginLeft:15}}></span>
                        <Popconfirm placement="topRight" title={'您确定要删除['+TeamName+']班组吗?'} onConfirm={()=>{
                            this.onDelete('team',TeamCode)
                        }}  okText="确定" cancelText="取消">
                             <Button type="default" >删除</Button>
                     </Popconfirm>
                        
                    </div>
                }
            }
        ] 
    // 员工信息
    // TeamCode: null

       const PersonColumns=[
           {
               title:"员工编号",
               dataIndex:"PersonCode",
               key:"PersonCode"
           },{
               title:"员工姓名",
               dataIndex:"PersonName"
           },{
               title:"所属车间",
               dataIndex:"WorkshopName",
               key:"WorkshopName"
           },{
               title:"所属班组",
               dataIndex:"TeamName",
               key:"TeamName"
           },{
               title:"车间编码",
               dataIndex:"WorkshopCode",
               key:"WorkshopCode"
           },{
               title:"班组编码",
               dataIndex:"Teamcode",
               key:"Teamcode"
           },{
            title:"操作",
            key:"caozuo",
            render:(d)=>{
                const {PersonName,PersonCode}=d
                return <div>
                    <Button type="primary">修改</Button>
                    <span style={{marginLeft:15}}></span>
                    <Popconfirm placement="topRight" title={'您确定要删除['+PersonName+']吗?'} onConfirm={()=>{
                        this.onDelete('person',PersonCode)
                    }}  okText="确定" cancelText="取消">
                         <Button type="default" >删除</Button>
                 </Popconfirm>
                    
                </div>
            }
        }
       ]
    //    工序工价
       const ProcessColumns=[
           {
               title:"车间名称",
               dataIndex:"cj",
               key:"cj"
           },{
               title:"工序编码",
               dataIndex:"Code",
               key:"Code"
           },{
               title:"工序名称",
               dataIndex:"Name",
               key:"Name"
           },{
               title:"单价",
               dataIndex:"UnitPrice",
               key:"UnitPrice"
           },{
               title:"部门",
               dataIndex:"bm",
               key:"bm",
               filters:[
                {
                    text:"一部",
                    value:"一部"
                },{
                    text:"二部",
                    value:"二部"
                }
            ],
            onFilter:(value,record)=>{
                
                return record.bm===value
            }
           },{
            title:"操作",
            key:"caozuo",
            render:(d)=>{
                const {Name,Code}=d
                return <div>
                    <Button type="primary">修改</Button>
                    <span style={{marginLeft:15}}></span>
                    <Popconfirm placement="topRight" title={'您确定要删除['+Name+']工序吗?'} onConfirm={()=>{
                        this.onDelete('process',Code)
                    }}  okText="确定" cancelText="取消">
                         <Button type="default" >删除</Button>
                 </Popconfirm>
                    
                </div>
            }
        }
       ]
    //    计时项目
       const ProjectColumns=[
           {
               title:"项目大类",
               dataIndex:"ParentCode",
               key:"ParentCode"
           },
           {
            title:"项目小类",
            dataIndex:"ProjectName",
            key:"ProjectName"
        },
        {
            title:"工资",
            dataIndex:"Money",
            key:"Money"
        },{
            title:"部门",
            dataIndex:"bm",
            key:"bm",
            filters:[
             {
                 text:"一部",
                 value:"一部"
             },{
                 text:"二部",
                 value:"二部"
             }
         ],
         onFilter:(value,record)=>{
             
             return record.bm===value
         }
        },{
            title:"操作",
            key:"caozuo",
            render:(d)=>{
                const {ProjectCode,ProjectName}=d
                return <div>
                    <Button type="primary">修改</Button>
                    <span style={{marginLeft:15}}></span>
                    <Popconfirm placement="topRight" title={'您确定要删除['+ProjectName+']项目吗?'} onConfirm={()=>{
                        this.onDelete('project',ProjectCode)
                    }}  okText="确定" cancelText="取消">
                         <Button type="default" >删除</Button>
                 </Popconfirm>
                    
                </div>
            }
        }
       ]
    // 补贴项目
       const SubsidyProjectColumns=[
           {
               title:"编号",
               dataIndex:"Id",
               key:"Id"
           },{
               title:"补贴名称",
               dataIndex:"SubsidyName",
               key:"SubsidyName"
           },{
               title:"金额",
               dataIndex:"Price",
               key:"Price"
           },{
            title:"部门",
            dataIndex:"bm",
            key:"bm",
            filters:[
             {
                 text:"一部",
                 value:"一部"
             },{
                 text:"二部",
                 value:"二部"
             }
         ],
         onFilter:(value,record)=>{
             
             return record.bm===value
         }
        },{
            title:"操作",
            key:"caozuo",
            render:(d)=>{
                const {SubsidyName,Id}=d
                return <div>
                    <Button type="primary">修改</Button>
                    <span style={{marginLeft:15}}></span>
                    <Popconfirm placement="topRight" title={'您确定要删除['+SubsidyName+']项目吗?'} onConfirm={()=>{
                        this.onDelete('subsidyProject',Id)
                    }}  okText="确定" cancelText="取消">
                         <Button type="default" >删除</Button>
                 </Popconfirm>
                    
                </div>
            }
        }
       ]   
    //    请假类别
      const HY_DepartmentColumns=[
          {
              title:"编号",
              dataIndex:"d_ID",
              key:"d_ID"
          },{
              title:"类别名称",
              dataIndex:"d_Name",
              key:"d_Name"
          },{
            title:"部门",
            dataIndex:"bm",
            key:"bm",
            filters:[
             {
                 text:"一部",
                 value:"一部"
             },{
                 text:"二部",
                 value:"二部"
             }
         ],
         onFilter:(value,record)=>{
             
             return record.bm===value
         }
        },{
            title:"操作",
            key:"caozuo",
            render:(d)=>{
                const {d_Name,d_ID}=d
                return <div>
                    <Button type="primary">修改</Button>
                    <span style={{marginLeft:15}}></span>
                    <Popconfirm placement="topRight" title={'您确定要删除['+d_Name+']类别吗?'} onConfirm={()=>{
                        this.onDelete('hY_Department',d_ID)
                    }}  okText="确定" cancelText="取消">
                         <Button type="default" >删除</Button>
                 </Popconfirm>
                    
                </div>
            }
        }
      ]
        return (
            <div className="setting">
                <div className="top">
                
                </div>
                <div className="center">
                  <Card
                  >
                  <Tabs type="line"  >
                        <TabPane tab="车间信息" key="车间信息">
                         <div className="utils" style={{margin:10}}>
                                <Button type="primary" onClick={

                                    ()=>{
                                        this.resetWorkshop()
                                        this.setState({
                                            workShow:true,
                                            type:"add"
                                        })
                                    }
                                }>添加车间</Button>
                                <Input placeholder="输入车间信息进行检索" style={{width:400,marginLeft:15}} onInput={(e)=>{
                                    let {value}=e.target
                                    let time=null;
                                    if(value.trim()){
                                     
                                      let data=this.state.workFinal.filter((item)=>{
                                        return item['WorkshopName'].includes(value)
                                    })
                                      time&&(time=null)
                                      time=window.setTimeout(()=>{
                                        this.setState({
                                            work:[...data]
                                        })
                                      
                                      },500)


                                    }else {
                                       this.initData()
                                    }


                                }}></Input>
                         </div>
                        <Table
                                columns={WorkColumns}
                                dataSource={work}
                                bordered={true}
                                ></Table>
                        </TabPane>
                        <TabPane tab="班组信息" key="班组信息">
                        <Table
                                columns={TeamColumns}
                                dataSource={team}
                                bordered={true}
                                ></Table>
                        </TabPane>
                        <TabPane tab="员工信息" key="员工信息">
                        <Table
                                columns={PersonColumns}
                                dataSource={person}
                                bordered={true}
                                ></Table>


                        </TabPane>
                        <TabPane tab="工序工价" key="工序工价">
                        <Table
                                columns={ProcessColumns}
                                dataSource={process}
                                bordered={true}
                          ></Table>

                        </TabPane>
                        <TabPane tab="计时项目" key="计时项目">
                        <Table
                                columns={ProjectColumns}
                                dataSource={project}
                                bordered={true}
                          ></Table>

                        </TabPane>
                        <TabPane tab="补贴项目" key="补贴项目">
                        <Table
                                columns={SubsidyProjectColumns}
                                dataSource={subsidyProject}
                                bordered={true}
                          ></Table>

                        </TabPane>
                        <TabPane tab="请假类别" key="请假类别">

                        <Table
                                columns={HY_DepartmentColumns}
                                dataSource={HY_Department}
                                bordered={true}
                          ></Table>
                        </TabPane>
                    </Tabs>
                  </Card>
                </div>
                <div className="utils">
                    {/* 修改modul */}
                    <Modal
                    title="修改车间信息"
                    visible={workShow}
                    okText={type==='alter'?"修改":'添加'}
                    cancelText="取消"
                    onOk={this.updateWorkshop}
                    onCancel={()=>{
                        this.setState({
                            workShow:false

                        })
                    }}
                    >
                        <Form
                        ref={node=>this.WorkRef=node}
                        >
                          <FormItem
                          label="车间编码"
                          name="WorkshopCode"
                          style={{display:type==="alter"?'':"none"}}
                          >
                              <Input disabled={true}/>
                          </FormItem>

                          <FormItem
                          label="车间名称"
                          name="WorkshopName"
                          rules={[{
                              required:true,message:"请务必填写车间名称",trigger:"blur"
                          }]}
                          >
                              <Input/>

                          </FormItem>

                          <FormItem
                          label="部门"
                          name="bm"
                          style={{display:type==="add"?'':"none"}}
                          >
                              <Select defaultValue={workBm} onChange={(v)=>{
                                  this.setState({
                                      workBm:v
                                  })


                              }}>
                                  <Option value="一部">一部</Option>
                                  <Option value="二部">二部</Option>
                              </Select>

                          </FormItem>
                        </Form>
                    </Modal>

                </div>
            </div>
        )


    }




}