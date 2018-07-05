<template>
  <div class="user-nav">
    <div class="user-head">
      <div class="picture" v-if="userInfo">
        <nuxt-link to="/"><img :src="userInfo.imageUrl" alt=""></nuxt-link>
      </div>
      <nuxt-link to="/user/user-info" class="edit"><i class="iconfont">&#xe600;</i> 编辑资料</nuxt-link>
      <div class="user-info">
        <p class="nickname ellipsis">{{userInfo.nickName}}</p>
        <p class="info ellipsis">
          <span>{{userInfo.sex | formatSex}}</span>
          <span>{{userInfo.age}}</span>
          <span>{{userInfo.city | formatCity}}</span>
        </p>
        <p class="talk ellipsis">{{userInfo.talk}}</p>
      </div>
      <div :class="['user-level',getLevel[1]]">
        <p class="levelname">{{userInfo.levelName}}</p>
        <p class="star">
          <i class="iconfont" v-for="(item,index) in getLevel[0]" :key="index">&#xe6b0;</i>
        </p>
      </div>
    </div>
    <div class="user-menu">
      <ul>
        <li @click="setActive('1')"><nuxt-link to="/user/base" :class="[active==='1'? 'highlight':'']">最近基本信息</nuxt-link></li>
        <li @click="setActive('2')"><nuxt-link to="/user/score" :class="[active==='2'? 'highlight':'']">我的跑步成绩</nuxt-link></li>
        <li @click="setActive('3')"><nuxt-link to="/user/walk" :class="[active==='3'? 'highlight':'']">我的走步数据</nuxt-link></li>
        <li @click="setActive('4')"><nuxt-link to="/user/shoes" :class="[active==='4'? 'highlight':'']">我的鞋子</nuxt-link></li>
        <li @click="setActive('5')"><nuxt-link to="/user/activity" :class="[active==='5'? 'highlight':'']">我的活动</nuxt-link></li>
        <li @click="setActive('6')"><nuxt-link to="/user/rungroup" :class="[active==='6'? 'highlight':'']">我的跑团</nuxt-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
// import { getCookie } from '~/tools/index'
import address from 'static/address.json'
export default {
  data () {
    return {
       userInfo: '', // 用户信息
       active: '1' //当前菜单高亮
    }
  },
  filters: {
    formatSex (val) {
      return ['男', '女'][val] || '男'
    },
    formatCity (val) {
      return address[val] || '中国'
    }
  },
  computed: {
    // 获取星级
    getLevel () {
      let total =  Number(this.userInfo.levelId || 0)
      let num = total % 4
      let level = Math.ceil(total / 4)
      return [level, `level${num}`]
    }
  },
  methods: {
    // 设置菜单高亮
    setActive (val) {
      this.active = val
    },
    // 初始化菜单高亮
    getActive () {
      let path = this.$route.path
      if (path.indexOf('/user/base') > -1) {
        this.active = '1'
      } else if (path.indexOf('/user/score') > -1) {
        this.active = '2'
      } else if (path.indexOf('/user/walk') > -1) {
        this.active = '3'
      } else if (path.indexOf('/user/shoes') > -1) {
        this.active = '4'
      } else if (path.indexOf('/user/activity') > -1) {
        this.active = '5'
      } else if (path.indexOf('/user/rungroup') > -1) {
        this.active = '6'
      } else {
        this.active = '1'
      }
    }
  },
  mounted () {
    // 初始化高亮菜单
    this.getActive()
    // let cookie = getCookie('token')
    let cookie = window.localStorage.getItem('token')
    if(!cookie) {
      this.$router.push('/')
    }
    if (window.sessionStorage.getItem('userInfo')) {
      this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    }
  }
}
</script>

<style lang="scss" scoped>
.user-nav{
  .user-head{
    padding: 0.2rem;
    text-align: center;
    background-color: #fff;
    .picture{
      height: 0.64rem;
      line-height: 0.64rem;
      margin-bottom: 0.1rem;
      cursor: pointer;
      img {
        max-height: .64rem;
        border-radius: 50%;
      }
    }
    .edit{
      vertical-align: middle;
      font-size: 0.14rem;
      color: #707070;
      line-height: 1.4;
    }
    .user-info{
      line-height: 1.4;
      font-size: 0.14rem;
      font-weight: 300;
      .nickname{
        font-size: 0.18rem;
        margin: 0.05rem 0;
      }
      .info{
        letter-spacing: 1.5px;
        color: #919191;
        span{
          margin-right: 0.05rem;
        }
      }
      .talk{
        color: #919191;
        padding-top: 0.05rem;
        padding-bottom: .1rem;
      }
    }
    .user-level{
      color: #fff;
      font-size: 0.12rem;
      background: url('~/assets/images/bgleve.png') center no-repeat;
      &.level2{
          background: url('~/assets/images/bgleve2.png') center no-repeat;
      }
      &.level3{
        background: url('~/assets/images/bgleve3.png') center no-repeat;
      }
      .levelname{
        padding-top: 0.02rem;
      }
      .star{
        padding-top: 0.02rem;
        i{
          font-size: 0.1rem;
          transform:scale(0.8, 0.8)
        }
      }
    }
  }
  .user-menu{
    width: 100%;
    margin-top: 0.2rem;
    padding: 0.2rem;
    background: #fff;
    padding-bottom: 1.8rem;
    font-weight: 300;
    li{
      padding: .26rem;
      border-bottom: 2px solid silver;
      border-bottom-color: hsla(0,0%,75%,.14);
      text-align: center;
      a{
        display: block;
        text-decoration: none;
        font-size: .16rem;
        color: #3e3e3e;
        letter-spacing: 1.8px;
        &.highlight{
          color: #30c17b;
        }
      }
    }
  }
}
</style>
