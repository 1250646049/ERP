import React,{Component} from "react"
import {Table} from "antd"
 

export default class Yinshou extends Component{



    render(){
        const columns=[
            {
                title:"订单号",
                dataIndex:"order",
                key:"order",
                fixed:"left"
            },{
                title:"业务员",
                dataIndex:"yewuyuan",
                key:"业务员"
            },{
                title:"客户",
                dataIndex:"kehu",
                key:"kehu"
            },{
                title:"制单日期",
                dataIndex:"times",
                key:"times"
            },{
                title:"订单数量",
                dataIndex:"orderNumbes",
                key:"orderNumbes"
            },{
                title:"订单金额(含税)",
                dataIndex:"orderPrice",
                key:"orderPrice"
            },{
                title:"业务员邮箱",
                dataIndex:"email",
                key:"email"
            },{
                title:"付款方式",
                dataIndex:"type",
                key:"type"
            },{
                title:"是否结案",
                dataIndex:"jiean",
                key:"jiean"
            },{
                title:"收款记录",
                dataIndex:"jilu",
                key:"jilu"
            },{
                title:"收款日期",
                dataIndex:"riqi",
                key:"riqi"
            },{
                title:"收款金额",
                dataIndex:"price",
                key:"price"
            },{
                title:"备注",
                dataIndex:"beizhu",
                key:"beizhu"
            },{
                title:"状态",
                dataIndex:"status",
                key:"status"
            },{
                title:"预警收件人",
                dataIndex:"shoujianren",
                key:"shoujianren"
            },{
                title:"发件时间截点及频率",
                dataIndex:"jiedian",
                key:"jiedian"
            },{
                title:"信用额度",
                dataIndex:"edu",
                key:"额度"
            },{
                title:"区域",
                dataIndex:"quyu",
                key:"quyu"
            },{
                title:"操作",
                dataIndex:"chaozuo",
                key:"caozuo"
            }

        ]
        return (
            <div className="table">
                <Table
                columns={columns}
                scroll={{ x: 1500}}
                ></Table>
            </div>
        )
    }


}

