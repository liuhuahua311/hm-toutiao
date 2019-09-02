<template>
  <div>
    <el-card>
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <el-table :data="articles">
        <el-table-column prop="title" label="标题" width="400px"></el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.comment_status?'正常':'关闭'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              type="danger"
              v-if="scope.row.comment_status"
              size="small"
              @click="toggleStatus(scope.row)"
            >关闭评论</el-button>
            <el-button type="success" v-else size="small" @click="toggleStatus(scope.row)">打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="changePager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      total: 0,
      articles: [],
      reqParams: {
        response_type: 'comment',
        page: 1,
        per_page: 20
      }
    }
  },
  created () {
    this.getArticles()
  },
  methods: {
    async toggleStatus (row) {
      const {
        data: { data }
      } = await this.$http.put(`comments/status?article_id=${row.id}`, {
        allow_comment: !row.comment_status
      })
      // 成功   提示  更新列表（局部更新  修改当前行数据中的状态）
      this.$message.success(
        data.allow_comment ? '打开评论成功' : '关闭评论成功'
      )
      row.comment_status = data.allow_comment
    },
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getArticles()
    },
    async getArticles () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqParams })
      this.articles = data.results
      this.total = data.total_count
    }
  }
}
</script>

<style lang="less" scoped>
</style>
