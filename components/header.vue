<template>
  <header :class="['header', colorActive ? 'dark':'white']">
    <div class="content">
      <div class="logo">
        <img src="../assets/images/logo_icon2.png" alt="logo" v-if="logoActive">
        <img src="../assets/images/logo_icon1.png" alt="logo" v-else>
      </div>
      <div class="desciption">
        <b>{{total}}</b> 人在这里养成跑步习惯 <nuxt-link to="/views/run" :class="menuActive">立即报名</nuxt-link>
      </div>
      <div class="nav">
        <ul>
          <li><nuxt-link to="/" :class="[active==='1'? menuActive:'']">首页</nuxt-link></li>
          <li><nuxt-link to="/views/goods" :class="[active==='2'? menuActive:'']">产品</nuxt-link></li>
          <li><nuxt-link to="/views/run" :class="[active==='3'? menuActive:'']">契约跑</nuxt-link></li>
          <li><nuxt-link to="/views/activity" :class="[active==='4'? menuActive:'']">跑团与活动</nuxt-link></li>
          <li><nuxt-link to="/views/about" :class="[active==='5'? menuActive:'']">关于我们</nuxt-link></li>
        </ul>
      </div>
      <div class="login">
        <a href="javascript:;" class="link-btn" v-if="!loginStatus" @click="showLgoinActive">登录</a>
        <div class="account" v-else @mouseover="showMenu=true" @mouseout="showMenu=false">
          <p class="userinfo ellipsis">
            <img :src="userInfo.imageUrl" alt="icon" v-if="userInfo.imageUrl">
            <img src="../assets/images/female.png" alt="icon" v-else-if="!userInfo.imageUrl && userInfo.sex===1">
            <img src="../assets/images/male.png" alt="icon" v-else>
            <span class="name" :title="userInfo.nickName">{{userInfo.nickName}}</span>
          </p>
          <div class="menu" v-show="showMenu">
            <ul>
              <li><nuxt-link to="/user/base">我的账户</nuxt-link></li>
              <li><a href="javascript:;" @click="loginOut">退出登录</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="showLogin"
      :before-close="handleClose"
      title=""
      width="300px"
      :modal-append-to-body="false"
      center>
      <Login ref="loginBox" @loginSuccess="loginSuccess"/>
    </el-dialog>
  </header>
</template>

<script>
import api from '../api/header'
import Login from '~/components/login.vue'
// import { delCookie } from '../tools/index'
export default {
  props:{
    // 验证传入的参数
    active: {
      required: true,
      type: String,
      default: '1'
    }
  },
  components: {
    Login
  },
  data () {
    return {
      total: '', // 总注册用户数
      loginStatus: false,  //当前登录状态
      userInfo: {}, // 当前用户信息
      showLogin: false, // 显示登录框
      showMenu: false // 显示下拉菜单
    }
  },
  computed: {
    // 计算当前导航使用那张logo（白色、黑色）
    logoActive () {
      if (this.active === '2' || this.active === '6') {
        return true
      } else {
        return false
      }
    },
    // 计算当前导航使用哪种颜色字体（白色、黑色）
    colorActive () {
      if (this.active === '2' || this.active === '6') {
        return true
      } else {
        return false
      }
    },
    // 计算当前导航那个菜单高亮（高亮菜单）
    menuActive () {
      if (this.active === '2' || this.active === '4' || this.active === '5') {
        return 'green'
      } else if(this.active === '1') {
        return 'red'
      } else if(this.active === '3') {
        return 'blue'
      } else {
        return 'red'
      }
    }
  },
  methods: {
    // 获取当前注册用户总数
    getTotal () {
      api.getTotal({successMsg: '', errorMsg: ''}).then((res) => {
        let total = res.data.data.total || ''
        this.total = total
        window.sessionStorage.setItem('userTotle', total)
      }).catch((err) => {
        console.log(`获取用户总数失败，${err}`)
      })
    },
    // 获取用户信息
    getUserinfo () {
      api.getUserinfo({}).then((res) => {
        if(res.data.code === 200) {
          let userInfo = res.data.data || {}
          this.userInfo = userInfo
          this.loginStatus = true
          window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
        }
      }).catch((err) => {
        this.loginStatus = false
        console.log(`获取用户信息失败，${err}`)
      })
    },
    // 点击登录按钮
    showLgoinActive  () {
      this.showLogin = true
    },
    // 关闭弹框
    handleClose (done) {
      this.$refs.loginBox.clearEvent()
      done()
    },
    // 登录成功后
    loginSuccess () {
      window.location.reload()
    },
    //  退出登录
    loginOut () {
      api.loginOut({}).then(() => {
        window.localStorage.clear()
        window.sessionStorage.clear()
        if (this.$route.path.indexOf('/user/') > -1) {
          this.$router.push('/')
          window.location.reload()
        } else {
          window.location.reload()
        }
        
      }).catch(() => {})
    }
  },
  mounted () {
    // 获取缓存数据，没有则重新请求
    let userTotle = window.sessionStorage.getItem('userTotle')
    let userInfo = window.sessionStorage.getItem('userInfo')
    if (!!userTotle) {
      this.total = userTotle
    } else {
      this.getTotal() // 获取当前注册用户总数
    }
    if (!!userInfo) {
      this.userInfo = JSON.parse(userInfo)
      this.loginStatus = true
    } else {
      this.getUserinfo() // 获取用户信息
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/var.scss";
.header{
  font-size: 0.12rem;
  min-height: 0.6rem;
  .logo, .desciption, .nav, .login{
    float: left;
    vertical-align: middle;
  }
  .desciption{
    height: 0.6rem;
    padding-left: 0.4rem;
    line-height: 0.6rem;
    b{
      font-weight: normal;
      font-size: 0.14rem;
    }
    a{
      margin-left: 0.1rem;
    }
  }
  .nav{
    height: 0.6rem;
    line-height: 0.6rem;
    padding-left: 0.5rem;
    li{
      float: left;
      margin-left: 0.4rem;
    }
  }
  .login{
    width: 1.5rem;
    height: 0.6rem;
    margin-left: 0.4rem;
    .link-btn{
      text-align: center;
      display: inline-block;
      width: .66rem;
      height: .32rem;
      line-height: .32rem;
      background: rgba(0,0,0,.06);
      border: 1px solid $color-black;
      border-radius: 0.16rem;
      margin-top: 0.14rem;
    }
    .account{
      padding-top: 0.14rem;
      cursor: pointer;
      position: relative;
      .userinfo{
        padding-bottom: 0.2rem;
        img{
          width: 0.32rem;
          height: 0.32rem;
          vertical-align: middle;
          margin-right: 0.1rem;
        }
        .name{
          font-size: 0.14rem;
          height: 0.32rem;
          line-height: 0.32rem;
          vertical-align: middle;
        }
      }
      .menu{
        position: absolute;
        top: 0.5rem;
        left: 0.05rem;
        width: 1.30rem;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 0.06rem;
        text-align: center;
        z-index: 99;
        font-size: 0.14rem;
        color: #3e3e3e;
        overflow: hidden;
        ul{
          li{
            padding: 0,0.1rem;
            height: .57rem;
            line-height: .57rem;
            cursor: pointer;
            &:hover{
              background: #eaeaea;
              // border-radius: 0.06rem;
            }
            a{
              display: block;
              color: #1c1c1c;
            }
          }
        }
      }
    }
  }
  &.dark{
    color: $color-dark;
    a{
      color: $color-dark;
    }
  }
  &.white{
    color: $color-white;
    a{
      color: $color-white;
    }
    .link-btn{
      border-color: $color-white;
      color: $color-white;
      background: rgba(0,0,0,0);
    }
  }
  a{
    &.red{
      color: #ff5488;
    }
    &.green{
      color: #30c17b;
    }
    &.blue{
      color: #58cbe6;
    }
  }
}
</style>

