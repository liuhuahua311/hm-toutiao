<template>
  <el-container class="my-container">
    <el-aside :width="ifCollapse?'64px':'200px'">
      <div class="logo" :class="{minlogo:ifCollapse}"></div>
      <!-- 因为default-active是写死的，所以无法改变 -->
      <!-- 应该处于什么页面，就激活什么菜单，怎么获取动态获取了 -->
      <!-- :default-active:'当前路径' -->
      <!-- $route 调用数据的 this.$route.query|params-->
      <!-- query 获取地址栏 ？后面的key=value的传参  this.$route.query.key -->
      <!-- params 获取地址栏 user/:id==user/100 的传参 获取100 this.$route.params.id-->
      <!-- path  获取当前路径  $route.path  记得得在前面加逗号，因为是动态绑定 -->

      <!-- $router 调用函数的  this.$router.push()    -->
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="ifCollapse"
        :collapse-transition='false'
        router
      >

        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>

        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>

        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>

        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>

        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>

        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>

        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>

      </el-menu>

    </el-aside>
    <el-container>
      <el-header>
        <span class="el-icon-s-fold icon" @click="toggleAside()"></span>
        <span class="text">江苏传智播客科技教育有限公司</span>

        <el-dropdown class="my-dropdown" @command='clickItem'>
          <span class="el-dropdown-link">
            <img :src="photo" alt class="avatar" />
            <span class="name">{{name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-setting" command="setting">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock" command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import store from '@/store'
export default {
  created () {
    const user = store.getUser()
    this.name = user.name
    this.photo = user.photo
  },
  data () {
    return {
      ifCollapse: false,
      name: '',
      photo: ''
    }
  },
  methods: {
    toggleAside () {
      this.ifCollapse = !this.ifCollapse
    },
    clickItem (command) {
      this[command]()
    },
    setting () {
      this.$router.push('/setting')
    },
    logout () {
      store.delUser()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.my-container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .el-aside {
    background: #002033;
    .logo {
      width: 100%;
      height: 60px;
      background: #002244 url(../../assets/images/logo_admin.png) no-repeat
        center/140px auto;
    }
    .minlogo{
        background-image: url(../../assets/images/logo_admin_01.png);
         background-size: 36px auto;
    }
    .el-menu {
        border-right:none;
    }
  }

  .el-header {
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    .icon {
      font-size: 24px;
      margin-right: 5px;
      vertical-align: middle;
    }
    .text {
      vertical-align: middle;
    }
    .my-dropdown {
      float: right;
    }
    .avatar {
      width: 30px;
      height: 30px;
      vertical-align: middle;
      margin-right: 5px;
      display: inline-block;
    }
    .name {
      color: #333;
      font-weight: bold;
      vertical-align: middle;
    }
  }
}
</style>
