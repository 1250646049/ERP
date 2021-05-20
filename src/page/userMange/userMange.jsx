import React, { Component } from 'react'

import { Button, Collapse, Tag, Tooltip, Modal, Tree, message,Popover,Form,Input,Select } from "antd"
import { getAllUserDepart, getAllDepartUser, getAllCaidan ,getAllAuthor,setAllOauthor,deleteOauthor,addUserDepart} from "../../axios/index"
import { UserAddOutlined } from "@ant-design/icons"

import "./css/userMange.less"
const {Option}=Select
const { Panel } = Collapse


export default class UserMange extends Component {
  state = {
    list: [],
    user: [],
    caidan: [],
    selected: [],
    sqVisible:false,
    currentDepart:"",
 
    selectedKeys:[]

  }
  // 初始化数据
  initData = async () => {
    let { list } = await getAllUserDepart()
    let data = await getAllCaidan()
    this.setState({
      list,
      caidan: data['list']
    }, () => {
      
    })
  }
  componentDidMount() {
    this.initData()
  }
  // 改变手风琴
  PanelChange = (async (value) => {
    if (!value) return;
    const departName = this.state.list[value]['depart']
    let { list } = await getAllDepartUser(departName)
    this.setState({
      user: list,
      currentDepart:departName
    })
  })
  // 选择权限列表
  onCheck = (v) => {
    
    this.setState({
      selectedKeys: [...v]
    })
  }
  // 用户授权
  onAuthor = async() => {
    if(!this.state.selectedKeys.length) {
      await deleteOauthor(this.state.currentDepart)
      return message.success("部门权限重设置成功！")
      
    
    }
    // 设置用户权限
    // 清空用户现有的权限
     await deleteOauthor(this.state.currentDepart)
    this.state.selectedKeys.forEach(async(item)=>{
       await setAllOauthor(this.state.currentDepart,item)

    })
    this.setState({
      sqVisible:false
    },()=>{
      message.success("更新部门权限成功！")
    })

  } 
  // 设置部门默认权限
  onSettingUser=async(item)=>{
    let {list}=await getAllAuthor(item['depart'])  
    let reduce= list.reduce((reduce,item)=>{
       reduce.push(item['key'])
       return reduce;
     },[])
     // 异步延时设置内容
        setTimeout(()=>{
         
          this.setState({
            currentDepart:item['depart'],
            cueerntSelected:list,
            selectedKeys:reduce,
            sqVisible:true
          },()=>{
              console.log(this.state.selectedKeys);
          })
        },500)
     
  }
  // 添加指定的用户到部门

  addDepartUser=async()=>{

    try{
      let result=  await this.formPost.validateFields()
      if(!result['sex']) result['sex']='1'
      result['depart']=this.state.currentDepart
    let {status}=  await  addUserDepart(result)
      
        if(status){
          message.success("恭喜你添加记录成功！")
          

        }else {
          throw new Error("错误！")
        }
      
    }catch{
      message.error("抱歉，请将表单填写完整！") 
    }
 

  }

 
  render() {

    const { list, user, caidan,sqVisible,selectedKeys } = this.state
    return (
      <div className="user">

        <div className="depart">

          <Collapse
            accordion={true}
            onChange={this.PanelChange}
          >
            {list&&list.map((item, index) => {

              return (
                <Panel
                  key={index}
                  header={<div>
                    <span>{item['depart']}</span>

                    {item['depart'] === 'ERP' ? <Tag style={{ marginLeft: 20 }} color="red">管理权限</Tag> : <Tag style={{ marginLeft: 20 }} color="orange" onClick={()=>{
                      this.onSettingUser(item)
                    }}>设置部门权限</Tag>}
                  </div>}

                >

                  {user.map((item, index) => {
                    return (<Tooltip
                      key={index}
                      placement="topLeft"
                      title={
                        <div>
                          <div>工号:{item['username']}</div>
                          <div>性别:{item['sex'] ? '男' : '女'}</div>
                          <div>权限:{!item['auth'] ? '普通' : '管理员'}</div>
                        </div>
                      }
                    >
                      <Tag style={{ margin: 8, cursor: "pointer" }} color="green" >{item['name']}</Tag>
                    </Tooltip>
                    )
                  })}
                  <Popover
                  title={`添加一条 [${item['depart']}] 部门的员工`}
                  content={
                    <Form
                    name="formPost"
                    ref={node=>this.formPost=node}
                    >
                      <Form.Item
                      label="员工工号"
                      name="username"
                      rules={[
                        {required:true,message:"抱歉，员工编号必填！",trigger:"blur"}
                      ]}
                      >
                        <Input></Input>
                      </Form.Item>

                      <Form.Item
                      label="员工性别"
                      name="sex"

                      >
                        <Select
                        defaultValue="1"
                        name="sex"
                        >
                           <Option value="1">男</Option>
                           <Option value="0">女</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                      label="员工电话"
                      name="phone"
                      >
                        <Input ></Input>
                      </Form.Item>

                      <Form.Item
                      label="员工姓名"
                      name="name"
                      rules={
                        [
                          {required:true,message:"抱歉，请务必输入员工姓名！",trigger:"blur"}
                        ]
                      }
                      >
                        <Input ></Input>
                      </Form.Item>

                      <Form.Item
                      label="备注职位"
                      name="qxlbr"
                      >
                        <Input ></Input>
                      </Form.Item>
                      {/* 提交内容 */}
                      <Form.Item>
                        <Button type="primary" onClick={this.addDepartUser}>添加记录</Button>
                      </Form.Item>
                    </Form>

                  }
                  >
                   <Button size="small" type="primary" icon={<UserAddOutlined />} onClick={this.addDepartUser}></Button>

                  </Popover>
             
                </Panel>
              )
            })}
          </Collapse>
        </div>

        {/* UTILE */}
        <div className="utils">
          <Modal
            visible={sqVisible}
            cancelText="取消"
            okText="授权"
            onCancel={()=>{
              this.setState({
                sqVisible:false
              })
            }}
            title={`设置部门的权限`}
            onOk={this.onAuthor}
          >
            <Tree
              treeData={caidan}
              checkable={TextTrackCue}
              onCheck={this.onCheck}
              checkedKeys={selectedKeys}
            >
            </Tree>
          </Modal>
        </div>
      </div>
    )
  }
}