<template>
  <el-card>
    <div slot="header">
      <my-bread>粉丝管理</my-bread>
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="粉丝列表" name="first">
        <!-- :key="item.id.toString()" 转成字符串，因为big啥的数据是对象-->
        <div class="list-item" v-for="item in fanList" :key="item.id.toString()">
          <el-avatar :size="80" :src="item.photo"></el-avatar>
          <p>{{item.name}}</p>
          <el-button type="primary" plain size="small">+关注</el-button>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="reqParams.per_page"
          :current-page="reqParams.page"
          @current-change="changePager"
          hide-on-single-page
        ></el-pagination>
      </el-tab-pane>

      <el-tab-pane label="粉丝画像" name="second">
          <div ref="dom" style="width: 600px;height:400px;"></div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      activeName: 'first',
      reqParams: {
        page: 1,
        per_page: 24
      },
      fanList: [],
      total: 0
    }
  },
  created () {
    this.getFansList()
  },
  mounted () {
    // 需要操作DOM
    const dom = this.$refs.dom
    const myChart = echarts.init(dom)
    const option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    }
    myChart.setOption(option)
  },
  methods: {
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getFansList()
    },
    async getFansList () {
      const {
        data: { data }
      } = await this.$http.get('followers', { params: this.reqParams })
      this.fanList = data.results
      this.total = data.total_count
    }
  }
}
</script>

<style lang="less" scoped>
.list-item {
  border: 1px solid #ddd;
  width: 120px;
  height: 170px;
  text-align: center;
  display: inline-block;
  margin-right: 50px;
  margin-bottom: 30px;
  padding-top: 10px;
}
p {
  font-size: 14px;
}
</style>
