<template>
  <div class="img-container">
    <!-- 封面图片按钮 -->
    <div class="img-btn" @click="openDialog">
      <img :src="value || defaultImage" alt />
    </div>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="image">
          <!-- radio按钮 -->
          <el-radio-group v-model="reqParams.collect" size="small" @change="toggleCollect">
            <el-radio-button label="false">全部</el-radio-button>
            <el-radio-button label="true">收藏</el-radio-button>
          </el-radio-group>
          <!-- 图片列表 -->
          <div class="img-list">
            <div
              class="img-item"
              :class="{selected:item.url===selectedImageUrl}"
              @click="selectedImage(item.url)"
              v-for="item in images"
              :key="item.id"
            >
              <img :src="item.url" alt />
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
        </el-tab-pane>

        <el-tab-pane label="上传图片" name="upload">
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
            <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="confirmImage" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
// 如果没有这个，默认图会失去，因为静态地址改为动态地址了，所以没有了，用自己导入需要的图片就好
import defaultImage from '../assets/images/default.png'
export default {
  name: 'my-image',
  // 父文件传进来的地址
  props: ['value'],
  data () {
    return {
      reqParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      images: [],
      total: 0,
      // 控制对话框隐藏
      dialogFormVisible: false,
      activeName: 'image', // 当前激活的选项卡的name属性的值
      // 记录选中的图片的地址
      selectedImageUrl: null,
      headers: {
        Authorization: `Bearer ${store.getUser().token}`
      },
      uploadImageUrl: null,
      // confirmSrc: defaultImage
      // 导入进来的默认图
      defaultImage
    }
  },
  methods: {
    // 确认图片
    confirmImage () {
      let src = null
      if (this.activeName === 'image') {
        //   info灰色的提示
        if (!this.selectedImageUrl) return this.$message.info('请选择素材图片')
        src = this.selectedImageUrl
      } else {
        if (!this.uploadImageUrl) return this.$message.info('请选择上传图片')
        src = this.uploadImageUrl
      }
      // this.confirmSrc = src
      this.$emit('input', src)
      this.dialogFormVisible = false
    },
    handleSuccess (res) {
      this.$message.success('上传图片成功')
      this.uploadImageUrl = res.data.url
    },
    // 选中图片
    selectedImage (url) {
      //   记录当前选中的图片的地址
      this.selectedImageUrl = url
    },
    // 分页
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 切换全部与收藏
    toggleCollect () {
      this.reqParams.page = 1
      this.getImages()
    },
    openDialog () {
      this.dialogFormVisible = true
      this.selectedImageUrl = null
      this.uploadImageUrl = null
      this.activeName = 'image'
      this.getImages()
    },
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
.img-container{
  display: inline-block;
  margin-right: 20px;
}
.img-btn {
  width: 160px;
  height: 160px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.img-list {
  margin-top: 10px;
  .img-item {
    width: 120px;
    height: 120px;
    border: 1px solid #dddddd;
    position: relative;
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
    &.selected {
      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2) url(../assets/images/selected.png)
          no-repeat center/ 50px;
      }
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
