<template>
  <div class="article-container">
    <el-card>
      <!-- 面包屑 -->
      <div slot="header">
        <my-bread>{{articleId?'修改文章':'发布文章'}}</my-bread>
      </div>

      <!-- 表单 -->
      <el-form label-width="100px">
        <!-- 标题 -->
        <el-form-item label="标题：">
          <el-input style="width:400px" v-model="articleForm.title"></el-input>
        </el-form-item>

        <!-- 内容富文本 -->
        <el-form-item label="内容：">
          <quill-editor v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>

        <!-- 封面 -->
        <el-form-item label="封面：">
          <el-radio-group v-model="articleForm.cover.type" @change="changeType">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 使用封面组件 -->
          <!-- 当你的值为1时，使用一个图片 -->
          <div v-if="articleForm.cover.type===1">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
          </div>
          <!-- 当你的值为3时，使用一个图片 -->
          <div v-if="articleForm.cover.type===3">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
            <my-image v-model="articleForm.cover.images[2]"></my-image>
            <my-image v-model="articleForm.cover.images[3]"></my-image>
          </div>
          <div v-if="articleForm.cover.type===0">
            <my-image v-model="articleForm.cover.images[0]" v-for="item in 7" :key="item"></my-image>
            <!-- 这个图要做点击事件，现在还没有做。样式也还没有写 -->
            <img src="../../assets/images/default.png" alt />
          </div>
        </el-form-item>

        <!-- 频道面包屑 -->
        <el-form-item label="频道：">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item v-if="!articleId">
          <el-button type="primary" @click="submit(false)">发表</el-button>
          <el-button @click="submit(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="success" @click="updata(false)">修改</el-button>
          <el-button @click="updata(true)">存入草稿</el-button>
        </el-form-item>
        <!-- 表单 -->
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: { quillEditor },

  data () {
    return {
      // 富文本配置
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        }
      },
      // 表单数据
      articleForm: {
        title: '',
        cover: {
          type: 1,
          images: []
        },
        channel_id: null,
        content: ''
      },
      // 声明一个id
      articleId: ''
    }
  },
  watch: {
    // 监听$route.query.id的值,重置表单数据，清空文章id的数据
    '$route.query.id': function (newVal, oldVal) {
      // console.log(newVal, oldVal)
      this.articleForm = {
        title: '',
        cover: {
          type: 1,
          images: []
        },
        channel_id: null,
        content: ''
      }
      this.articleId = null
    }
  },
  created () {
    // 从地址栏拿到id，如果有id，是编辑，如果没有id就是发表
    this.articleId = this.$route.query.id
    if (this.articleId) {
      this.getArticle()
    }
  },
  methods: {
    async getArticle () {
      const { data: { data } } = await this.$http.get('articles/' + this.articleId)
      this.articleForm = data
    },
    changeType () {
      this.articleForm.cover.images = []
    },
    async submit (draft) {
      // articles?draft+${draft} query传参
      // this.articleForm body传参
      await this.$http.post(`articles?draft+${draft}`, this.articleForm)
      this.$message.success(draft ? '存入草稿成功' : '发表成功')
      this.$router.push('/article')
    },
    async updata (draft) {
      await this.$http.put(`articles/${this.articleId}?draft+${draft}`, this.articleForm)
      this.$message.success(draft ? '草稿成功' : '发表成功')
      this.$router.push('/article')
    }
  }

}
</script>

<style lang="less" scoped>
</style>
