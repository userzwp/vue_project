<template>
    <div class="roles">
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
            </el-col>
        </el-row>
         <el-table :data="roleslist" stripe border>
                 <el-table-column type="expand">
                    <template slot-scope="scope">
               <el-row v-for="(item1,index1) in scope.row.children" :key="item1.id" 
               :class="['bdbottom',index1==0?'bdtop':'']" class="vcenter">
                 <el-col :span="5">
                  <el-tag closable @close="romeveRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                 </el-col>
                 <el-col :span="19">
                   <el-row v-for="(item2,index2) in item1.children" :key="item2.id" 
                   :class="[index2 == 0?'':'bdtop']" class="vcenter">
                    <el-col :span="6">
                      <el-tag type="success" closable @close="romeveRightById(scope.row,item2.id)"
                      >{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag v-for="(item3,index3) in item2.children" :key="item3.id" 
                      type="warning" closable @close="romeveRightById(scope.row,item3.id)">
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                   </el-row>
                   
                 </el-col>
               </el-row>

                      
                    </template>
                 </el-table-column>
             <el-table-column type="index" label="#"></el-table-column>
             <el-table-column label="角色名称" prop ="roleName"></el-table-column>
              <el-table-column label="角色描述" prop ="roleDesc"></el-table-column>
               <el-table-column label="操作" width="300">
                   <template slot-scope="scope">
                       <el-button size="mini" type="primary" icon="el-icon-edit" 
                        @click="showEditRoles(scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" 
                        @click="removeRolesById(scope.row.id)">删除</el-button>
                         <el-button size="mini" type="warning" icon="el-icon-setting" 
                         @click="showSetDialog(scope.row)">分配权限</el-button>
                   </template>
               </el-table-column>
              
          </el-table>

    </el-card>

   <el-dialog
  title="添加角色"
  :visible.sync="dialogVisible"
  width="40%" @close="addDialogClosed">

<el-form :model="addRoles" ref="addRolesRef" label-width="70px">
  <el-form-item label="角色名称">
    <el-input v-model="addRoles.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述">
    <el-input v-model="addRoles.roleDesc"></el-input>
  </el-form-item>

</el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
 

<el-dialog
  title="修改描述"
  :visible.sync="editDialog"
  width="40%">
  <el-form :model="editRoles"  label-width="70px">
  <el-form-item label="角色名称">
    <el-input v-model="editRoles.roleName" disabled></el-input>
  </el-form-item>
  <el-form-item label="角色描述">
    <el-input v-model="editRoles.roleDesc"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialog = false">取 消</el-button>
    <el-button type="primary" @click="editRolesInfo">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title="分配权限"
  :visible.sync="setDialogVisible"
  width="40%" @close="setDialogClose">
  <el-tree :data="rightsList" :props="treeProps" showCheckbox 
   default-expand-all node-key="id" :default-checked-keys	="defKeys" 
   ref="treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
      

 
    </div>
</template>
<script>
export default {
 data(){
     return {
         roleslist:[],
         addRoles:{
             roleName:"",
             roleDesc:"",
         },
         editRoles:{
             roleName:"",
             roleDesc:"",
         },
         dialogVisible:false,
         editDialog:false,
         setDialogVisible:false,
         rightsList:[],
         treeProps:{
           label:"authName",
           children:"children"
         },
         defKeys:[],
         rolesId:""
     }
 },
 created(){
     this.getRolesList()
 },
 methods:{
    async getRolesList(){
     const {data:res} = await this.$http.get("roles")
     if(res.meta.status !==200){
         return this.$message.error("获取角色列表失败")
     }
       this.roleslist = res.data
     },
    async showEditRoles(id){
         const {data:res} = await this.$http.get("roles/"+id)
         if(res.meta.status !== 200) return this.$message.error("获取数据失败")
         this.editRoles = res.data
         this.editDialog = true
     },
    async editRolesInfo(){
        const {data:res} = await this.$http.put("roles/"+this.editRoles.roleId,{
            roleName:this.editRoles.roleName,
            roleDesc:this.editRoles.roleDesc
        })
        if(res.meta.status !== 200) return this.$message.error("修改失败")
                 this.editDialog = false
                 this.getRolesList()
                 this.$message.success("修改成功")
     },
     addDialogClosed(){
      const red = this.$refs.addRolesRef.$el
      red[0].value =""
      red[1].value = ""
     },
   async addUser(){
      const {data:res} = await this.$http.post("roles",this.addRoles)
         if(res.meta.status !==201) {
             return this.$message.error("添加失败")
         }
                     this.$message.success("添加成功")
                     this.dialogVisible = false
                     this.getRolesList()
     },
    async removeRolesById(id){
          const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
        }).catch(err => err )
           if(confirmResult !== "confirm") return this.$message.info("已取消删除")
         const {data:res} = await  this.$http.delete("roles/"+id)
              if(res.meta.status !== 200) return this.$message.error("删除用户失败")
               this.$message.success("删除用户成功!")
                this.getRolesList()
             },
              async romeveRightById(roles,rolesId){
       const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
        }).catch(err => err )
           if(confirmResult !== "confirm") return this.$message.info("已取消删除")
         const {data:res} = await  this.$http.delete(`roles/${roles.id}/rights/${rolesId}`)
              if(res.meta.status !== 200) return this.$message.error("删除用户失败")
               this.$message.success("删除用户成功!")
                roles.children = res.data
                console.log(roles)
             },
         async  showSetDialog(roles){
             const {data:res} = await this.$http.get("rights/tree")
             if(res.meta.status !== 200){
               return this.$message.error("获取权限数据失败")
             }
             this.rightsList = res.data
             this.getKeys(roles,this.defKeys)

             this.rolesId = roles.id
             this.setDialogVisible = true
     },
          getKeys(node,arr){
            if(!node.children){
            return  arr.push(node.id)
            }
            node.children.forEach(item => {
              this.getKeys(item,arr)
            })
          },
          setDialogClose(){
            this.defKeys = []
          },
        async  allotRights(){
             
            const keys = [
               ...this.$refs.treeRef.getCheckedKeys(),
               ...this.$refs.treeRef.getHalfCheckedKeys()
             ]

             const idStr = keys.join(",")
             const {data:res} = await this.$http.post(`roles/${this.rolesId}/rights`,{rids:idStr})
             if(res.meta.status !==200){
               console.log(this.rolesId)
              
               return this.$message.error("分配权限失败")
             }
             this.$message.success("分配成功")
             this.getRolesList()
            this.setDialogVisible = false
          }

     } 
}
</script>

<style scoped>
    .el-tag{
     margin: 7px;
    }
    .bdtop{
      border-top: 1px solid #eee;
    }
    .bdbottom{
      border-bottom: 1px solid #eee;
    }
    .vcenter{
      display: flex;
      align-items: center;
    }
</style>