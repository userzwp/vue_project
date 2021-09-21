<template>
<el-container class="home_container">
  <el-header>
    <div>
       <img src="../assets/heima.png">
        <span> 电商后台管理系统</span>
    </div>
    <el-button type="info" @click="loginout">退出</el-button> 
  </el-header>

  <el-container>
    <el-aside :width="isCollapse?'64px':'200px'">
      <div class="toggle_bbutton" @click="toggles">|||</div>
       <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff"
       unique-opened :collapse="isCollapse"  :collapse-transition="false" 
       :default-active="isActive"
      >
     
      <el-submenu :index="item.id + '' " v-for="item in menulist" :key="item.id" >
        <template slot="title">
          <i :class="icons[item.id]"></i>
          <span class="icon">{{item.authName}}</span>
        </template>
        <el-menu-item :index="'/'+subItem.path " v-for="subItem in item.children" :key="subItem.id"
        @click="pathClick(subItem.path)">
           <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>

    </el-menu>

    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
   
</template>

<script>

export default {
  name:"Home",
  data(){
    return {
      menulist:[],
      icons:{
        "125":"iconfont icon-users",
        "103":"iconfont icon-tijikongjian",
        "101":"iconfont icon-shangpin",
        "102":"iconfont icon-danju",
        "145":"iconfont icon-baobiao"
      },
      isCollapse:false,
      isActive:""
    }
  },
  methods:{
    loginout(){
      sessionStorage.clear()
      this.$router.push("/login")
    },
   async getMenuList(){
    const {data:res} =  await this.$http.get("menus")
    if(res.meta.status !==200) return this.$message.error(res.meta.msg)
    this.menulist = res.data
    },
    toggles(){
         this.isCollapse = !this.isCollapse
    },
    pathClick(data){
      if(this.$route.path !== ("/"+data)){
        this.$router.push("/"+data)
      }
      sessionStorage.setItem("isActive","/"+data)
    }
  },
  created(){
    this.getMenuList()
    this.isActive = sessionStorage.getItem("isActive")
  }
}
</script>

<style lang = "less"  scoped>
   .home_container{
     height: 100%;
   }
   .el-header{
     background-color: #373d41;
     display: flex;
     justify-content: space-between;
     padding-left: 0;
     align-items: center;
     color: white;
     font-size: 20px;
     > div{
          display: flex;
          align-items: center;
          cursor: pointer;
          span{
              margin-left: 15px;
          }
     }
   }
   .el-aside{
     background-color: #333744;
     .el-menu{
       border-right:none;
     }
     .el-submenu{
       .icon{
         margin-left: 10px;
       }
     }
     .toggle_bbutton{
       background-color: #4A5064;
       font-size: 10px;
       color: white;
       text-align: center;
       cursor: pointer;
       letter-spacing: 2px;
     }
   }
   .el-main{
        background-color: #eaedf1;
   }
 
</style>
