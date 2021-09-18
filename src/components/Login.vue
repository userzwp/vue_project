<template>
 <div class="login">

   <div class="login_box">
     <div class="avatar_box">
     <img src="../assets/logo.png">
     </div>

     <div class="form">
     <el-form  label-width="0px" :model="loginForm" :rules="loginFormRules" 
     ref="loginFormRef">

     <el-form-item prop="username">
     <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
    </el-form-item>

     <el-form-item prop ="password">
     <el-input  prefix-icon="el-icon-s-goods" v-model="loginForm.password" 
     type="password"></el-input>
    </el-form-item>
    
     <el-form-item class="btns">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="resetLoginForm">重置</el-button>
    </el-form-item>


    </el-form>
     </div>
   </div>

 </div>
</template>

<script>
  export default {
       data(){
         return{
           loginForm:{
             username:"",
             password:""
           },
           loginFormRules:{
             username:[
               {required:true,message:"请输入登录名称",trigger:"blur"},
               {min:3,max:10,message:"长度在3到10个字符",trigger:"blur"}
             ],
             password:[
               {required:true,message:"请输入登录名称",trigger:"blur"},
               {min:6,max:15,message:"长度在6到15个字符",trigger:"blur"}
             ]
           },
          
         }
       },
       methods:{
         resetLoginForm(){
           this.$refs.loginFormRef.resetFields()
         },
         login(){
           this.$refs.loginFormRef.validate(async valid => {
             if(!valid) return
           const {data:res} = await this.$http.post("login",this.loginForm)
            if(res.meta.status !==200) return this.$message.error("登录失败！")
             this.$message.success("登录成功")
             sessionStorage.setItem("token",res.data.token)
                    console.log(res)
                    this.$router.push("/home")
           })
         }
       }
  }

</script>

<style  lang="less"   scoped >
   .login{
     background-color:#2b4b6b;
     height:100%;
     .login_box{
        width:450px;
        height:300px;
        background-color:#fff;
        border-radius:3px;
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        .avatar_box{
          height:130px;
          width:130px;
          border:1px solid #ccc;
          border-radius:50%;
          padding: 10px;
          box-shadow: 0 0 10px #ddd;
          position: absolute;
          left: 50%;
          transform: translate(-50%,-50%);
          background-color: #fff;
          img{
            width:100%;
            height:100%;
            border-radius:50%;
            background-color: #eee;
          }
        }
     }
     .form{
       position: absolute;
       bottom: 0;
       width: 100%;
       padding: 0 20px;
       box-sizing: border-box;
       .btns{
         display: flex;
         justify-content: flex-end;
       }
     }
    
   }
</style>