<template>
    <div class="frame">
    <div style="width: 80%;height: 90%;left: 15%;top: 5%" class="app-1">
        <div class="siderbar">
            <el-image class="avatar" style="width: 60px; height: 60px; border-radius: 30px" :src="icon"></el-image>
            <div class="onlineStatus">
                <div class="online"></div>
            </div>
        </div>
        <div class="functionBar">
         <div class="container">
             <div class="functionTop">
                 <el-select
                         v-model="search"
                         clearable
                         filterable
                         remote
                         reserve-keyword
                         placeholder="请输入姓名关键字"
                         :remote-method="remoteMethod"
                         @change="searchChange"
                         >
                     <el-option
                             v-for="item in options"
                             :key="item.id"
                             :label="item.name"
                             :value="item.name">
                         <img style="float: left;width: 20%;height: 90%;border-radius: 30px" :src="item.icon">
                         <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>

                     </el-option>
                 </el-select>

                 <el-button icon="el-icon-search" circle style="margin-left: 10px"></el-button>
             </div>
             <div class="linkmanList">
                 <div class="linkman" :class="{activeLink:linkIndex=='all'}" @click="changeLink('all')">
                     <img style="width: 48px; height: 48px; border-radius: 24px" :src="messageList.length==0?'https://liqiqip.oss-cn-beijing.aliyuncs.com/2020-07-07/763c1d53-db04-4b07-8e7d-12a56bcbe679_66eaed2ccf8d7a4f4ec2e433905de386.jpg':messageList[messageList.length-1].icon" >
                     <div class="containerman">
                         <div class="name">
                             <p class="name-item">{{messageList.length==0?'':messageList[messageList.length-1].name}} ：</p>
                             <p class="preview">{{messageList.length==0?'':messageList[messageList.length-1].msg}}</p>
                             <p class="time-item">{{messageList.length==0?'':messageList[messageList.length-1].time}}</p>
                         </div>
                     </div>
                 </div>
                 <div class="linkman" v-for="(item,index) in linkManList" :key="index"  @click="changeLink(item.name)" :class="{activeLink: item.name==linkIndex}">
                     <img style="width: 48px; height: 48px; border-radius: 24px" :src="item.icon">
                     <div class="containerman">
                         <div class="name">
                             <p class="name-item">{{item.name}} ：</p>
                             <p class="preview">{{linkMsg(item.name)}}</p>
                             <p class="time-item">{{linkTime(item.name)}}</p>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
        </div>
        <div class="chat">
            <div class="headerBar">
                <h2>mychat</h2>
                <div v-if="linkIndex!='all'&&getManFlag" style="cursor: pointer" @click="deleteFriend">
                    <i class="el-icon-delete" style="height: 30px;width: 30px;font-size: 30px"></i>
                </div>
                <div v-if="">

                </div>
            </div>
            <div class="messageList" ref="msgList">
                <div class="message" v-for="(item,index) in infoMap.get(linkIndex)" :key="index" :class="{messageRight : id==item.id}">
                    <img :src="item.icon" class="avatar-img" style="width: 44px; height: 44px; border-radius: 22px;min-width: 44px;" v-if="id!=item.id">
                    <div class="right">
                        <div class="nickname">
                             <div class="messageName">{{item.name}}</div>
                             <div class="messageTime">{{item.time}}</div>
                        </div>
                        <div class="contentBlock">
                            <div class="content">
                                <div class="textMessage">
                                    {{item.msg}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <img :src="item.icon" class="avatar-img" style="width: 44px; height: 44px; border-radius: 22px;min-width: 44px;" v-if="id==item.id">
                </div>
            </div>
            <div class="charInput" v-if="id!=''">

<!--                表情-->
                <el-popover
                        placement="top-start"
                        title="表情"
                        width="300"
                        trigger="hover"
                          >
                    <div style="display: flex;flex-wrap: wrap">
                        <div v-for="(item,index) in faceList" style="font-size: 20px;cursor: pointer;" @click="addFace(item)">{{item}}</div>
                    </div>
                    <i class="el-icon-picture-outline-round" style="height: 34px;width: 44px;font-size: 34px" slot="reference"></i>
                </el-popover>
<!--                图片-->
                    <i class="el-icon-picture-outline" style="cursor: pointer;height: 34px;width: 44px;font-size: 34px;margin: 13px"></i>
<!--                聊天框-->
                <el-autocomplete
                        class="inline-input"
                        v-model="msg"
                        :fetch-suggestions="querySearch"
                        placeholder="随便聊聊吧~~"
                        :trigger-on-focus="false"
                        size="large"
                        style="width: 400px"
                ></el-autocomplete>

                <div @click="send" style="cursor: pointer;" >
                        <i class="el-icon-s-promotion" style="height: 34px;width: 44px;font-size: 34px"></i>
                    </div>
            </div>
            <div v-else class="charInput title">
                <h3>游客朋友你好，请先 <el-link @click="showDialog" type="primary">登录</el-link>后再参与聊天</h3>
            </div>
        </div>
        <el-dialog title="登录" :visible.sync="dialogFormVisible" width="30%" center>
            <el-dialog
                    width="30%"
                    title="注册"
                    :visible.sync="innerVisible"
                    append-to-body
                    center
                    >
                <el-form :model="myRegister">
                    <el-form-item label="用户名" :label-width="formLabelWidth" class="formCenter">
                        <el-input v-model="myRegister.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="formLabelWidth">
                        <el-input v-model="myRegister.password" autocomplete="off" show-password></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="register">确 定</el-button>
                </div>
            </el-dialog>
            <el-form :model="myLogin">
                <el-form-item label="用户名" :label-width="formLabelWidth" class="formCenter">
                    <el-input v-model="myLogin.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="myLogin.password" autocomplete="off" show-password></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="login">确 定</el-button>
                <el-button type="success" @click="innerVisible = true">注册</el-button>
            </div>
        </el-dialog>

    </div>

    </div>
</template>

<script>
    import request from "../network/request";
    import Vue from "vue";
    const appData = require("@/assets/emojis.json");
    var socket=''
    export default {
        name: "user",
        data(){
            return {
                faceList: [],
                myRegister: {
                    name: '',
                    password:''
                },
                myLogin:{
                    name: '',
                    password:''
                },
                options:'',
                innerVisible:false,
                formLabelWidth: '120px',
                dialogFormVisible: false,
                search:'',
                remoteId:sessionStorage.getItem("remoteId"),
                msg:'',
                messageList:[],
                id: '',
                time:'',
                name:sessionStorage.getItem("name"),
                icon:sessionStorage.getItem("icon"),
                infoMap:new Map(),
                linkIndex:'all',
                linkManList:[],
                restaurants:[{
                    "value":"嘟嘟噜",
                    "id":1
                },{
                    "value":"等一会，我现在有事",
                    "id":2
                },{
                    "value":"好的",
                    "id":3
                },{
                    "value":"orz tql sto",
                    "id":3
                },]
            }
        },
        //保持界面一直在最顶部
        updated() {
          let list=this.$refs.msgList
            list.scrollTop = list.scrollHeight;
        },
        watch:{

        },
        created() {
            for (let i in appData) {
                this.faceList.push(appData[i].char);
            }
        },
        methods:{
            //获取用户状态
            getManFlag()
            {
                let flag=0
                this.linkManList.forEach(res=>{
                    if(res.name==this.linkIndex)
                    {
                        if(res.flag==1)
                            flag=1;
                    }
                })
                if(flag==1)
                    return true
                else
                    return false
            },
            //添加表情
            addFace(res)
            {
                this.msg=this.msg+res;
            },
            //删除好友
            deleteFriend()
            {
                this.$confirm(`确定删除${this.linkIndex}好友吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //添加好友
                    this.$http("/removeFriend?name="+this.name+"&friendName="+this.linkIndex).then(res=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        //从前获取列表
                        this.$http("/getFriendList?name="+this.name).then(res=>{
                            this.linkManList=res.data.data
                        })
                    })
                    this.linkIndex='all'

                }).catch(() => {

                });
            },
            //添加好友
            searchChange(msg)
            {
                if(msg!='')
                {
                    this.$confirm('确定加Ta为好友吗, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                           //添加好友
                        this.$http("/addFriend?name="+this.name+"&friendName="+msg).then(res=>{
                            this.$message({
                                type: 'success',
                                message: '添加成功!'
                            });
                            //从前获取列表
                            this.$http("/getFriendList?name="+this.name).then(res=>{
                                this.linkManList=res.data.data
                            })
                        })
                        this.search=''

                    }).catch(() => {

                    });

                }

            },
            //输入框提示
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            linkMsg(name)
            {
                return 1;
            },
            linkTime(name)
            {
                return 2;
            },
             //切换界面
            changeLink(res)
            {
                   if(res=='all')
                       this.linkIndex='all'
                    else
                   {
                       this.linkIndex=res
                   }
            },
               //模糊搜索用户
            remoteMethod(query)
            {
                if(query=='')
                    return
              this.$http("/searchByName?searchName="+query+"&name="+this.name).then(res=>{
                  this.options=res.data.data
              })
            },
            //登录
           login()
            {
                socket= new WebSocket("ws://localhost:8002/hello")
                setTimeout(()=>{},1000)
                socket.onmessage =this.getMessage
                socket.onopen=this.open
                socket.onclose=this.close
                this.$http({
                    url: '/login',
                    method: "post",
                    data: this.myLogin
                }).then(res=>{
                    console.log(res.data)
                    if(res.data.code==0)
                    {
                        this.$message.success("登录成功")
                        this.id=res.data.data.id
                        this.icon=res.data.data.icon
                        this.name=res.data.data.name
                        this.remoteId=res.data.data.remoteId
                        this.linkManList=res.data.data.friendList
                        res.data.data.friendList.map(res=>{
                            this.infoMap.set(res.name,[])
                        })
                        sessionStorage.setItem("icon",res.data.data.icon)
                       sessionStorage.setItem("name",res.data.data.name)
                       sessionStorage.setItem("remoteId",res.data.data.remoteId)

                    }
                    else
                    {
                        this.$message.error("登录失败: "+res.data.msg)
                    }
                })
                this.myLogin.name=''
                this.myLogin.password=''
                this.dialogFormVisible=false
            },
            //注册
            register()
            {
                this.$http({
                    url: '/register',
                    method: "post",
                    data: this.myRegister
                }).then(res=>{
                    console.log(res)
                    if(res.data.code==0)
                    {
                        this.$message.success("注册成功")
                        this.myLogin.name=this.myRegister.name
                        this.myLogin.password=this.myRegister.password
                        this.myRegister.password=''
                        this.myRegister.name=''
                        this.innerVisible=false
                    }
                    else
                    {
                        this.$message.error("账号已经被注册")
                    }

                })
            },
            //打开登录界面
            showDialog()
            {
                this.dialogFormVisible=true
            },
            //接收消息队列信息
            getMessage(ev)
            {
                //json字符串转对象
                ev=JSON.parse(ev.data)
                console.log(ev)
                if(ev.acceptId!=this.name||ev.acceptId=='all')
                {
                    let list=this.infoMap.get(ev.acceptId);
                    if(list==null)
                        list=[]
                    list.push(ev)
                    this.infoMap.set(ev.acceptId,list);
                    this.$set(this.infoMap,ev.acceptId,list)
                    console.log( this.infoMap.get(ev.acceptId).length)
                }
                //发给别人
                else
                {
                    let list=this.infoMap.get(ev.name);
                    if(list==null)
                        list=[]
                    list.push(ev)
                    this.infoMap.set(ev.name,list);
                    if(ev.friendFlag==0)
                    {
                        this.linkManList.push(ev)
                    }
                    this.$set(this.infoMap,ev.name,list)
                    console.log( this.infoMap.get(ev.name).length)
                }
               if(ev.acceptId=='all')
               {
                   console.log('all')
                   this.messageList.push(ev)
               }


            },
            open()
            {
               this.$message.success("连接成功")
            },
            close()
            {

            },
            //发送信息
            send()
            {
                if(socket.readyState==WebSocket.OPEN)
                {
                    socket.send(JSON.stringify({
                        id:this.id,
                        name:this.name,
                        icon:this.icon,
                        msg:this.msg,
                        acceptId:this.linkIndex
                    }));
                    this.$message.success("发送成功")
                    this.msg=''
                }
            }



        }
    }
</script>

<style scoped>
    html,body{
        height: 100%;
    }
    div{
        box-sizing: border-box;
    }
    /*整个界面*/
    .frame{
        display: flex;
        justify-content:center;
        align-items: center;
        height: 100%;
        width: 100%;
    }
    /*左边框*/
.siderbar{
    width: 80px;
    height: 100%;
    min-width: -webkit-min-content;
    min-width: min-content;
    background-color: rgba(5, 159, 149, 0.8);
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;

}
    .avatar{
        margin-top: 50px;
        cursor: pointer;
    }
    .onlineStatus{
        position: absolute;
        top: 96px;
        left: 48px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
    }
    .online{
        width: 12px;
        height: 12px;
        margin-top: 2px;
        margin-left: 2px;
        border-radius: 50%;
        background-color: #5ed45c;
    }
    .app-1{
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        border-radius: 10px;
        box-shadow: 0px 0px 60px rgba(0, 0, 0, 0.5);
    }
    .functionBar{
        width: 300px;
        height: 100%;
        position: relative;
        display: -ms-flexbox;
        display: flex;
        background-color: unset;
    }
    .container{
        background-color: rgba(5, 159, 149, 0.5);
        -ms-flex: 1;
        flex: 1;
        max-width: 300px;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: column;
        flex-direction: column;
    }
    .functionTop{
        display: -ms-flexbox;
        display: flex;
        height: 70px;
        -ms-flex-align: center;
        align-items: center;
        padding: 0 12px;
        position: relative;
    }
    .linkmanList
    {
        flex: 1;
        overflow-y: auto;
    }
    .linkman{
        height: 90px;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        padding: 10px 16px;
        cursor: default;
        transition: background-color 0.2s;
        cursor: pointer;
    }
    .activeLink{
        background-color: rgba(5, 159, 149, 0.4);
    }
    .containerman{
        flex: 1;
        margin-left: 12px;
        box-sizing: border-box;
        height: 90%;

    }
    .name{
        height:  100%;
        color: aliceblue;
        display: flex;
        line-height: 18px;
        -ms-flex-pack: justify;
        justify-content: space-between;

    }
    .name-item{
        font-size: 14px;

    }
    .time-item
    {
        font-size: 14px;
    }
    .rowContainer{
        display: flex;
        -ms-flex-pack: justify;
        justify-content: space-between;

    }
    .preview
    {

        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
        width: 110px;
        line-height: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 10px;
    }
    .chat{
        height: 100%;
        -ms-flex: 1;
        flex: 1;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: column;
        flex-direction: column;
        background-color: rgba(241, 241, 241, 0.6);
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        overflow: hidden;
        position: relative;
    }
    .headerBar{
        height: 70px;
        border-bottom: 1px solid rgba(208, 208, 208, 0.6);
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        padding: 0px 18px;
        -ms-flex-pack: justify;
        justify-content: space-between;
        position: relative;
    }
    .messageList
    {
        flex: 1;
        padding: 8px 10px 0 10px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .message{
        display: flex;
        margin-right: 54px;
        margin-bottom: 10px;
        position: relative;
    }
    .messageRight{
        justify-content: flex-end;
    }
    .right{
        margin-left: 12px;
    }
    .nickname{
        height: 20px;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: end;
        align-items: flex-end;
    }
    .messageName{
        color: #333;
        font-size: 13px;
        -webkit-user-select: text;
        -ms-user-select: text;
        user-select: text;
        margin-right: 4px;
    }
    .messageTime{
        color: #666;
        font-size: 12px;
    }
    .contentBlock{
        display: flex;
    }
    .content{
        display: inline-block;
        color: #555;
        font-size: 14px;
        background-color: rgba(255, 255, 255, 0.8);
        padding: 6px 8px;
        border-radius: 8px;
        border-top-left-radius: 8px;
        border-top-left-radius: 0px;
        min-height: 28px;
        margin-top: 3px;
    }
    .textMessage{
        user-select: text;
        word-break: break-word;
    }
    .charInput{
        height: 70px;
        background-color: rgba(255, 255, 255, 0.5);
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        padding: 0px 20px;
        border-bottom-right-radius: 10px;
        justify-content: center;
    }
    .title{
        display: flex;
        justify-content: center;
    }


</style>