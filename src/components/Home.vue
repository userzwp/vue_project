<template>
    <div class="home">
       <el-button type="info" @click="loginout">信息按钮</el-button>
    </div>
</template>

<script>

export default {
  name:"Home",
  methods:{
    loginout(){
      sessionStorage.clear()
      this.$router.push("/login")
    }
  }
}
</script>

<style lang = "less"  scoped>
 
</style>
