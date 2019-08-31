<template>
  <div>
    <el-card>
      <!-- 头部 -->
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <!-- 按钮 -->
      <div class="btn-box">
        <el-radio-group @change="toggleClick" v-model="reqParams.collect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button type="success" size="small" style="float:right" @click="openDialog">添加素材</el-button>
      </div>
      <!-- 列表 -->
      <div class="img-list">
        <div class="img-item" v-for="item in images" :key="item.id">
          <img :src="item.url" alt />
          <div class="footer" v-if="!reqParams.collect">
            <span
              class="el-icon-star-off"
              :class="{red:item.is_collected}"
              @click="toggleStatus(item)"
            ></span>
            <span class="el-icon-delete" @click="delImage(item.id)"></span>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="changePager"
        hide-on-single-page
      ></el-pagination>
    </el-card>
    <!-- 对话框结构 -->
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
      <!-- 上传组件 -->
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="headers"
        :show-file-list="false"
        :on-success="handleSuccess"
        name="image"
      >
      <!--action 上传图片的接口地址 和axios没有关系，要使用完整地址，
      因为没有关系，所以要配置请求头，携带token
      name 指定提交文件数据的字段名称，和接口保持一致
      -->
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
// import style from '@/style'
export default {
  // 页面加载完成获取图上列表
  created () {
    this.getImages()
  },
  data () {
    return {
      reqParams: {
        collect: false, // 决定是收藏还是全部的
        page: 1,
        per_page: 10
      },
      images: [], // 声明数据，获取成功后赋值
      // 分页总条数
      total: 0,
      // 对话框显示与隐藏
      dialogVisible: false,
      // 请求头值是对象
      headers: {
        Authorization: `Bearer ${store.getUser().token}`
      },
      // 预览图地址。为null就是有+号的图
      imageUrl: null
    }
  },
  methods: {
    // 上传图片成功钩子
    handleSuccess (res) {
      this.$message.success('上传素材成功')
      // 获取后台给的地址，给imageUrl赋值，就是预览
      //   res就是响应主体内容，所以直接res.data.url就好
      this.imageUrl = res.data.url
      window.setTimeout(() => {
        this.dialogVisible = false
        this.reqParams.page = 1
        this.getImages()
      }, 2000)
    },
    openDialog () {
      this.dialogVisible = true
      this.imageUrl = null
    },
    delImage (id) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        // 点击确定，发送请求，并更新列表
        .then(async () => {
          await this.$http.delete(`user/images/${id}`)
          this.$message.success('删除素材成功')
          this.getImages()
        })
        // 点击取消，不做任何操作
        .catch(() => {})
    },
    // item既包含状态，也包含id
    async toggleStatus (item) {
      // 发送异步请求，接收后端的数据
      const {
        data: { data }
      } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      this.$message.success(data.collect ? '添加收藏成功' : '取消收藏成功')
      // 提示完，更新列表，只更新图片的状态即可，因为会按照后台的排序更新图片的顺序
      item.is_collected = data.collect
    },
    toggleClick () {
      // 更换了筛选的条件后，应该回到第一页
      this.reqParams.page = 1
      // 当触发这个条件的时候，条件已经发生修改了
      this.getImages()
    },
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 获取图片列表数据
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      // 拿列表数据时同时拿到总条数
      this.total = data.total_count
    }
  }
}
</script>

<style lang="less" scoped>
.img-list {
  margin-top: 20px;
  .img-item {
    width: 160px;
    height: 160px;
    border: 1px solid #dddddd;
    position: relative;
    display: inline-block;
    margin-right: 30px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    .footer {
      position: absolute;
      left: 0;
      bottom: 0;
      line-height: 30px;
      height: 30px;
      color: #fff;
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      text-align: center;
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
