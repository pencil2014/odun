<template>
  <div class="login-box">
      <div class="qrcode" v-if="loginStatus">
        <div class="qrcode-img">
          <img :src="qrcode.url" alt="" srcset="">
        </div>
        <div class="qrcode-tips">
          <p class="title">扫码登录RunStep</p>
          <p class="sub">使用RunStep手机App扫码登录</p>
        </div>
        <div class="qrcode-refresh">
          <p class="tips" v-if="refreshBtn">{{second}}S 后过期</p>
          <p class="refresh" v-else @click="refreshQrcode">刷新</p>
        </div>
        <div class="qrcode-btn">
          <p class="link-btn" @click="changeLogin">
            切换登录方式
          </p>
        </div>
      </div>
      <div class="account" v-else>
        <p class="change" @click="changeLogin">
          <img src="../assets/images/qrcode1.png" alt="qrcode">
        </p>
        <p class="title">
          登录
        </p>
        <el-form :model="form" ref="form" class="form">
          <el-form-item
            label="手机号 / 邮箱"
            prop="userName"
            :rules="[
              { required: true, message: '手机号 / 邮箱不能为空'},
              { pattern: /(^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$)|(^1\d{10}$)/, message: '账号只能是手机或者邮箱'}
            ]"
          >
            <el-input type="text" v-model.trim="form.userName" ></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
            :rules="[
              { required: true, message: '密码不能为空'},
              { min:6, message: '密码最小长度为6位'}
            ]"
          >
            <el-input type="password" v-model.trim="form.password" ></el-input>
          </el-form-item>
        </el-form>
        <div class="form-item">
          <button type="button" class="submit" @click.enter="loginAccount">登录</button>
        </div>
        <div class="other">
          <p>其他登录方式</p>
          <p class="icon">
            <a href="https://open.weixin.qq.com/connect/qrconnect?appid=wx5394ed00ad537dcd&redirect_uri=https%3A%2F%2Fwww.odun.com%2FsmartShoes%2Fweb%2Fuser%2Fwxlogin%2Fsuccess.json&response_type=code&scope=snsapi_login&state=8a96504d-0a09-9d16-22a6-e7412502a6cb#wechat_redirect">
              <img src="../assets/images/icon_wechat.png" alt="" srcset="">
            </a>
          </p>
        </div>
      </div>
  </div>
</template>

<script>
import api from '../api/header'
// import { setCookie } from '../tools/index'
export default {
  data () {
    return {
      qrcode: '',  // 登录二维码
      second: 60, // 60s后可再次刷新二维码
      refreshBtn: false, // 刷新按钮状态
      loginStatus: true, // 登录方式切换
      form: { // 登录表单
        userName: '', // 手机号码或邮箱
        password: '' // 登录密码
      },
      timer: null // 轮询是否登录
    }
  },
  computed: {
  },
  watch: {
    loginStatus () {
      if(this.loginStatus) {
        this.checkLogin()
      } else {
        clearTimeout(this.timer)
      }
    }
  },
  methods: {
    // 获取登录二维码
    getQrcode () {
      api.getQrcode({}).then((res) => {
        this.qrcode = res.data.data
        setTimeout(() => {
          this.checkLogin()
        }, 5000)
      }).catch((err) => {
         console.log(`获取登录二维码失败，${err}`)
      })
    },
    // 刷新二维码
    refreshQrcode () {
      // 重新获取二维码
      this.getQrcode()
      this.refreshBtn = true
      this.countDown()
    },
    // 60s倒计时
    countDown () {
      --this.second
      if (this.second > 0) {
        setTimeout(() => {
          this.countDown()
        }, 1000)
      } else {
        this.refreshBtn = false
        this.second = 60
      }
    },
    // 轮训是否登录
    checkLogin () {
      api.checkLogin({code: this.qrcode.code}).then((res) => {
        if(res.data.code === 200) {
          clearTimeout(this.timer)
          // setCookie('token', res.data.data.token, 365)
          window.localStorage.setItem('token', res.data.data.token)
          this.$store.commit('SETTOKEN', res.data.data.token)
          this.$emit('loginSuccess')
        } else {
          this.timer = setTimeout(() => {
            this.checkLogin()
          }, 5000)
        }
      }).catch(() => {})
    },
    // 清除轮询事件
    clearEvent () {
      clearTimeout(this.timer)
    },
    // 切换登录方式
    changeLogin () {
      this.loginStatus = !this.loginStatus
    },
    // 账号登录
    loginAccount () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.login()
        }
      })
    },
    // 登陆方法
    login () {
      api.loginAccount({
        userName: this.form.userName,
        password: this.form.password,
        brandNum: 1
      }).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            showClose: true,
            message: '登录成功!',
            type: 'success',
            center: true
          })
          // setCookie('token', res.data.data.token, 365)
          window.localStorage.setItem('token', res.data.data.token)
          this.$store.commit('SETTOKEN', res.data.data.token)
          this.$emit('loginSuccess')
        } else if(res.data.code === 300) {
          this.$message({
            showClose: true,
            message: '登录失败!',
            type: 'warning',
            center: true
          })
        } else if(res.data.code === 301) {
          this.$message({
            showClose: true,
            message: '用户不存在!',
            type: 'warning',
            center: true
          })
        } else if (res.data.code === 312) {
           this.$message({
            showClose: true,
            message: '密码错误!',
            type: 'warning',
            center: true
          })
        } else {
          this.$message({
            showClose: true,
            message: '登录失败!',
            type: 'warning',
            center: true
          })
        }
      }).catch((err) => {
        this.$message({
          showClose: true,
          message: '登录失败!',
          type: 'warning',
          center: true
        })
      })
    }
  },
  mounted () {
    this.refreshQrcode() // 获取登录二维码
  }
}
</script>

<style lang="scss">
@import "../assets/styles/var.scss";
.login-box{
  font-size: 0.14rem;
  .qrcode{
    text-align: center;
    .qrcode-img{
      padding: 0.2rem 0 0.3rem 0;
      img{
        width: 1.6rem;
        height: 1.6rem;
      }
    }
    .qrcode-tips{
      .title{
        font-size: 0.2rem;
        font-weight: 300;
        line-height: 1.4;
        padding-bottom: 0.05rem;
      }
    }
    .qrcode-refresh{
      padding-top: 0.1rem;
      line-height: 1.4;
      .refresh{
        color: $color-green;
        cursor: pointer;
      }
      .tips{
        color: $color-dark;
      }
    }
    .qrcode-btn{
      padding: 0.5rem 0 0.1rem;
      color: $color-green;
      cursor: pointer;
    }
  }
  .account{
    .change{
      position: absolute;
      left: 0;
      top: 0;
      cursor: pointer;
    }
    .title{
      text-align: center;
      font-size: 0.2rem;
      padding-bottom: 0.3rem;
    }
    .form-item{
      margin-bottom: 0.2rem;
      label{
        font-size: 0.12rem;
        display: inline-block;
        padding-bottom: 0.1rem;
      }
      .submit{
        width: 100%;
        height: .42rem;
        background: $color-green;
        border-radius: 0.06rem;
        border: none;
        font-size: 0.14rem;
        color: $color-white;
        cursor: pointer;
      }
    }
    .other{
      font-size: 0.12rem;
      padding-top: 0.2rem;
      .icon{
        padding-top: 0.2rem;
      }
    }
    .el-form-item__label{
       font-size: 0.12rem;
       padding-bottom: 0.1rem;
       line-height: 1;
    }
  }
}
</style>

