<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">

        <el-row :gutter="20">
            <el-col :span="8">
    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable 
    @clear="getUserList">
    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
     </el-input>
     </el-col>
     <el-col :span="4">
   <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>

     </el-col>
        </el-row>

         <el-table :data="userlist" border stripe>
       <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态">
         <template slot-scope="scope">
                 <el-switch v-model="scope.row.mg_state" @change="userChange(scope.row)">
           </el-switch>
         </template>
      </el-table-column>
      <el-table-column label="操作" width ="180">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" 
               @click="showEditDialog(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" 
               @click="removeUserById(scope.row.id)"></el-button>

              <el-tooltip placement="top" content="分配角色" :enterable="false">
                  <el-button type="warning" icon="el-icon-setting" size="mini" 
                  @click="setRole(scope.row)"></el-button>
              </el-tooltip>
              
          </template>
      </el-table-column>
       </el-table>

       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="queryInfo.pagenum"
      :page-sizes="[1, 3, 5, 7]"
      :page-size="queryInfo.pagesize"
      layout="sizes, prev, pager, next,jumper,total"
      :total="total">
    </el-pagination>
            
    </el-card>

    <el-dialog
  title="添加用户"
  :visible.sync="dialogVisible"
  width="40%" @close = "addDialogClosed">

<el-form :model="addForm" :rules="addFormRules" 
 ref="addFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
</el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title="修改用户"
  :visible.sync="editDialog"
  width="40%" @close = "editDialogClosed">
  <el-form :model="editForm" :rules="editFormRules" 
 ref="editFormRef" label-width="70px">
  <el-form-item label="用户名">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
   <el-form-item label="手机" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialog = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>


<el-dialog
  title="分配角色"
  :visible.sync="setRoleDialog"
  width="40%" @close = "setRolesClose">
  <div>
    <p>当前的用户：{{userInfo.username}}</p>
    <p>当前的角色：{{userInfo.role_name}}</p>
    <p>分配新角色:
       <el-select v-model="rolesValue" placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
    </p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialog = false">取 消</el-button>
    <el-button type="primary" @click="saveRoles">确 定</el-button>
  </span>
</el-dialog>

    </div>
</template>
<script>
export default {
    data(){

        var checkEmail = (rule,value,callback) =>{
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if(regEmail.test(value)){
                return callback()
            }
            callback(new Error("请输入合法邮箱"))
        }
        var checkMobile = (rule,value,callback) =>{
              const regMoible = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if(regMoible.test(value)){
                return callback()
            }
            callback(new Error("请输入合法手机号"))
        }
        return {
            queryInfo:{
                query:"",
                pagenum:1,
                pagesize:2
            },
            userlist:[],
            total:null,
            dialogVisible:false,
            addForm:{
                 username:"",
                 password:"",
                  email:"",
                 mobile:"",
            },
            addFormRules:{
                username:[
                    {required:true,message:"请输入用户名",trigger:"blur"},
                    {min:3,max:10,message:"用户名的长度在3-10个字符之间",trigger:"blur"}
                ],
                password:[
                    {required:true,message:"请输入用密码",trigger:"blur"},
                    {min:6,max:15,message:"用户名的长度在3-10个字符之间",trigger:"blur"}
                ],
                email:[
                    {required:true,message:"请输入邮箱",trigger:"blur"},
                    {validator:checkEmail,trigger:"blur"}
                ],
                mobile:[
                    {required:true,message:"请输入用手机号",trigger:"blur"},
                    {validator:checkMobile,trigger:"blur"}
                ],
            },
            //控制修改对话框显示
            editDialog:false,
            editForm:{},
            editFormRules:{
                email:[
                    {required:true,message:"请输入邮箱",trigger:"blur"},
                    {validator:checkEmail,trigger:"blur"}
                ],
                 mobile:[
                    {required:true,message:"请输入用手机号",trigger:"blur"},
                    {validator:checkMobile,trigger:"blur"}
                ],
            },
            setRoleDialog:false,
            userInfo:{},
            rolesList:[],
            rolesValue:"",
        }
    },
    created(){
        this.getUserList()
    },
    methods:{
              async getUserList(){
              const {data:res} =  await  this.$http.get("users",{params:this.queryInfo})
               if(res.meta.status !== 200){
                   return this.$message.error("用户获取失败")
               }
                 this.userlist = res.data.users
                 this.total = res.data.total
               },
               handleSizeChange(newSize){
                  this.queryInfo.pagesize = newSize
                  this.getUserList()
               },
               handleCurrentChange(newsPage){
                    this.queryInfo.pagenum = newsPage
                    this.getUserList()
               },
              async userChange(info){
                 const {data:res} = await this.$http.put(`users/${info.id}/state/${info.mg_state}`)
                 if(res.meta.status !==200){
                     info.mg_state = !info.mg_state
                     return this.$message.error("更新用户状态失败")
                 }
                 this.$message.success("成功")
               },
             addDialogClosed(){
                this.$refs.addFormRef.resetFields()
             },
             addUser(){
                 this.$refs.addFormRef.validate(async valid => {
                     if(!valid) return
                 const {data:res} = await  this.$http.post("users",this.addForm)
                 if(res.meta.status !== 201){
                     this.$message.error("添加失败")
                 }else{
                     this.$message.success("添加成功")
                     this.dialogVisible = false
                     this.getUserList()
                 }
                 })
             },
           async  showEditDialog(id){
                  
                  const {data:res} = await this.$http.get("users/"+id)
                  if(res.meta.status !==200){
                    return this.$message.error("查询用户信息失败")
                  }
                  this.editForm = res.data
                  console.log(this.editForm)
                  this.editDialog = true
             },
             editDialogClosed(){
                 this.$refs.editFormRef.resetFields()
             },
             editUserInfo(){
                 this.$refs.editFormRef.validate(async valid => {
                    if(!valid) return 
              const {data:res}  = await  this.$http.put("users/"+this.editForm.id,{
                        email:this.editForm.email,
                        mobile:this.editForm.mobile
                    })
                    if(res.meta.status !==200){
                        return this.$message.error("更新用户失败")
                    }
                 })
                 this.editDialog = false
                 this.getUserList()
                 this.$message.success("修改成功")
             },
             async removeUserById(id){
           const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
        }).catch(err => err )
           if(confirmResult !== "confirm") return this.$message.info("已取消删除")
         const {data:res} = await  this.$http.delete("users/"+id)
              if(res.meta.status !== 200) return this.$message.error("删除用户失败")
               this.$message.success("删除用户成功!")
                this.getUserList()
             },
            async setRole(userInfo){
               this.userInfo = userInfo
                const {data:res} = await this.$http.get("roles")
                if(res.meta.status !== 200) return this.$message.error("获取角色列表失败")
                this.rolesList = res.data
                console.log(res)
               this.setRoleDialog = true
               console.log(this.userInfo)
             },
           async saveRoles(){
               if(!this.rolesValue) return this.$message.error("请选择要分配的角色")
             const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
               rid:this.rolesValue
             })
              if(res.meta.status !== 200) return this.$message.error("更新角色失败")
              this.$message.success("更新角色成功")
              this.getUserList()
               this.setRoleDialog = false
             },
             setRolesClose(){
               this.rolesValue = "",
               this.userInfo = {}
             }
    }
}
</script>

<style scoped>

</style>
