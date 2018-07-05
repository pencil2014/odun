<template>
  <section class="create-rungroup">
    <div class="header">
      <Header active="6"/>
    </div>
    <div class="success-box content">
      <div class="result">
        <div class="qrcode-box">
          <div class="icon">
            <i class="iconfont">&#xe68f;</i>
          </div>
          <div class="code">
            <h3>同城活动{{type | formatType}}成功</h3>
            <p class="sub"><span>{{second}}S</span> 后将自动跳转到 <nuxt-link :to="'/user/activity-info?activityId=' + activityId">活动详情</nuxt-link></p>
            <p class="name">活动名称：{{name}}</p>
            <p class="time">创建时间：刚刚</p>
            <div class="qrcode">
              <qrcode :value="imgUrl" :options="{ size: 200 }"></qrcode>
            </div>
          </div>
          <div class="copylink">
          <div class="copy">
            <el-input placeholder="请输入内容" v-model="imgUrl" :readonly="true">
              <template slot="append">
                <span @click="copylink" class="bar"  :data-clipboard-text="imgUrl">复制</span>
              </template>
            </el-input>
          </div>
          <p class="tips">复制链接或者扫一扫二维码，可分享给你的朋友。</p>
        </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Header from '~/components/header'
import Qrcode from '@xkeshi/vue-qrcode'
import ClipboardJS from 'clipboard'
export default {
  head () {
    return {
      title: '创建跑团成功',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'RunStep,智能跑鞋,跑步,跑团' },
        { hid: 'description', name: 'description', content: 'RunStep官方网站,一站式专业跑团,坚持跑步鞋子免费拿' }
      ]
    }
  },
  layout: 'home',
  components: {
    Header,
    Qrcode
  },
  data () {
    return {
      type: '',
      activityId: '',
      userId: '',
      name: '',
      second: 60, // 自动跳转
      imgUrl: '',
      timer: ''
    }
  },
  filters: {
    formatType (val) {
      return Number(val) === 1 ? '创建' : '编辑'
    }
  },
  methods: {
    // 60s倒计时
    countDown () {
      --this.second
      if (this.second > 0) {
        this.timer = setTimeout(() => {
          this.countDown()
        }, 1000)
      } else {
        this.$router.push({path:'/user/activity-info', query:{activity: this.activityId}})
        this.second = 60
      }
    },
    copylink () {
      var clipboard = new ClipboardJS('.bar')
      clipboard.on('success', (e) => {
        this.$message({
          showClose: true,
          message: '链接复制成功',
          type: 'success',
          center: true
        })
        e.clearSelection()
      })

      clipboard.on('error', (e) =>  {
        this.$message({
          showClose: true,
          message: '链接复制失败',
          type: 'warning',
          center: true
        })
      })

    }
  },
  mounted () {
    let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    this.userId = userInfo.userId || ''
    this.name = this.$route.query.name || ''
    this.type = this.$route.query.type || ''
    this.activityId =  this.$route.query.activityId || ''
    this.imgUrl = process.env.baseUrl + `tc-share-wxactivity.html?userId=${this.userId}&activityId=${this.activityId}`
    this.countDown()
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.create-rungroup{
  background-color: #fafafa;
  .header{
    padding-top: 0.14rem;
  }
  .result{
    background-color: #fff;
    min-height: 4.5rem;
    margin: 0.3rem 0 1rem 0;
    text-align: center;
    font-size: 0.14rem;
    .qrcode-box{
      width: 4.5rem;
      padding: 0.5rem 0;
      margin: auto;
      .icon{
        width: 0.8rem;
        float: left;
        i{
          color: #30c17b;
          font-size: 0.8rem;
        }
      }
      .code{
        margin-left: 1rem;
        text-align: left;
        line-height: 1.4;
        font-weight: 300;
        h3{
          font-size: .3rem;
          color: #000;
          padding-bottom: .1rem;
          font-weight: 300;
        }
        .sub{
          font-size: .18rem;
          color: #000;
          line-height: .29rem;
          padding-bottom: .1rem;
          span{
            color: red;
          }
          a{
            color: #337ab7;
            &:hover{
              color: #23527c;
            }
          }
        }
        .name,.time{
          font-size: .16rem;
          color: #424242;
          padding-bottom: .1rem;
        }
      }
      .copylink{
        .copy{
          cursor: pointer;
        }
        .tips{
          font-size: 0.14rem;
          color: #666;
          text-align: left;
          padding-top: 0.1rem;
        }
      }
    }
  }
}
</style>
