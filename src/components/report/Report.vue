<template>
    <div class="">
        <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>数据统计</el-breadcrumb-item>
  <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div id="main" style="width: 750px;height:400px;" ref="main"></div>
        </el-card>
    </div>
</template>

<script>
import echarts from "echarts"
import _ from "lodash"
export default { 
    data(){
        return{
             option:{
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
        
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }
        }
    },
    created(){

    },
   async mounted(){
      var myChart = echarts.init(this.$refs.main);
      const {data:res} = await this.$http.get("reports/type/1")
      if(res.meta.status !==200) return this.$message.error("获取数据列表失败")
     const result = _.merge(res.data,this.option)
       myChart.setOption(result)
    },
    methods:{

    }
}
</script>