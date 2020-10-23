<template>
    <div>
        <textarea v-model="user" style="height: 300px;width: 300px"></textarea>
        <textarea v-model="common" style="height: 300px;width: 300px"></textarea>
        <el-button type="primary" @click="sumbit()">发送</el-button>
    </div>
</template>

<script>


    export default {
        name:"index",
        data(){
            return {
                user:'',
                common:''
            }
        },
        created() {
            socket.onmessage =this.getMessage
            socket.onopen=this.open
            socket.onclose=this.close
        },
        methods:{
            sumbit()
            {
                if(socket.readyState==WebSocket.OPEN)
                {
                    socket.send(this.user);
                    this.$message.success("发送成功"+this.user)
                }
            },
            getMessage(ev)
            {
                this.$message.success("接受消息"+ev.data)
                this.common+=ev.data+"\n"
            },
            open()
            {
                this.common="连接开启"
            },
            close()
            {
                this.common="连接关闭"
            }



        }

    }

</script>

<style scoped>

</style>