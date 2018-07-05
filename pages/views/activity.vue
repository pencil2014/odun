<template>
  <section>
    <div class="activity">
      <div class="header">
        <Header active="4" ref="header"/>
      </div>
      <div class="header-banner">
        <div class="creation-img">
          <img src="~/assets/images/run1.png" alt="">
        </div>
        <div class="creation-btns">
          <a href="javascript:;" @click="craetGroup">创建跑团</a>
          <a href="javascript:;" @click="creatActivity">创建活动</a>
        </div>
      </div>
      <div class="run-group content">
        <h3 class="title">推荐跑团</h3>
        <div class="group-box" v-if="runGroup.length > 0">
          <div class="group-item" v-for="(item, index) in runGroup" :key="index">
            <div class="picture" @click="goRungroup(item)">
              <img :src="item.imageUrl" alt="">
            </div>
            <div class="name ellipsis">
              {{item.name}}
            </div>
            <div class="introduce ellipsis">
              {{item.introduce}}
            </div>
            <div class="num">
              成员：{{item.totalMember}}
            </div>
            <div class="action-btn">
               <a href="javascript:;" @click="joinGroup(item)">申请加入</a>
             </div>
          </div>
        </div>
        <Placeholder v-else />
         <h3 class="title">推荐活动</h3>
         <div class="activity-box" v-if="activityGroup.length > 0">
           <div class="activity-item" v-for="(item,index) in activityGroup" :key="index">
             <div class="picture" @click="goActivity(item)">
              <img :src="item.imageUrl" alt="">
            </div>
             <div class="name ellipsis">
               {{item.title}}
             </div>
             <div class="time">
              时间：{{item.startTime}}~{{item.endTime}}
             </div>
             <div class="address ellipsis">
              地点：{{item.city}}{{item.address}}
             </div>
             <div class="join">
              参与人数：{{item.actualJoin}} / {{item.totalJoin | formatTotal}}
             </div>
             <!--0-报名中，1-活动进行中，2-报名已截止，3-活动已结束-->
             <div class="action-btn">
               <a href="javascript:;" @click="joinActivity(item)">{{item.status | formatStatus}}</a>
             </div>
           </div>
         </div>
         <Placeholder v-else />
      </div>
    </div>
    <el-dialog
      :visible.sync="showDialog"
      title=""
      width="500px"
      center>
      <div class="qrcode-box">
        <div class="title">
          <h3>{{dialogTitle}}</h3>
          <p>请在app上查看结果</p>
        </div>
        <div class="qrcode">
          <img src="~/assets/images/qrcode2.png" alt="">
        </div>
        <div class="description">
          你可以用手机扫描二维码，下载app查看
        </div>
        <div class="link-btn">
          进入<a href="/">我的账户</a>
        </div>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import api from '~/api/activity'
import Header from '~/components/header.vue'
import Placeholder from '~/components/placeholder.vue'
// import { getCookie } from '~/tools/index'
export default {
  head () {
    return {
      title: '跑团与活动',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'RunStep,智能跑鞋,跑步,跑团' },
        { hid: 'description', name: 'description', content: 'RunStep官方网站,一站式专业跑团,坚持跑步鞋子免费拿' }
      ]
    }
  },
  layout: 'home',
  components: {
    Header,
    Placeholder
  },
  // async asyncData () {
  //   // 获取推荐跑团
  //   let runGroup = await api.getRungroup({ type: 0, pageIndex: 1, offset: 4})
  //   // 获取推荐活动
  //   let activityGroup = await api.getActivitygroup({ type: 0, pageIndex: 1, offset: 4})
  //   return {
  //     runGroup: runGroup.data.data.list || [],
  //     activityGroup: activityGroup.data.data.list || []
  //   }
  // },
  data () {
    return {
      runGroup: '', // 推荐跑团
      activityGroup: '', // 推荐活动
      showDialog: false, // 弹框状态
      dialogTitle: '已申请加入' // 弹窗标题
    }
  },
  methods: {
    // 获取登录状态
    getLoginStatus () {
      // let status = getCookie('token')
      let status = window.localStorage.getItem('token')
      return !!status
    },
    // 获取推荐跑团
    getRungroup () {
      api.getRungroup({ type: 0, pageIndex: 1, offset: 4, brandNum: 1}).then((res) => {
        this.runGroup = res.data.data.list || []
      }).catch(() => {})
    },
    // 获取推荐活动
    getActivitygroup () {
      api.getActivitygroup({ type: 0, pageIndex: 1, offset: 4, brandNum: 1}).then((res) => {
        this.activityGroup = res.data.data.list || []
      }).catch(() => {})
    },
    // 创建跑团
    craetGroup () {
      //  验证是否登录
      if (!this.getLoginStatus()) {
        this.$refs.header.showLgoinActive() // 弹出登录
        return false
      }
      this.$router.push('/create/rungroup')
    },
    // 创建活动
    creatActivity () {
      //  验证是否登录
      if (!this.getLoginStatus()) {
        this.$refs.header.showLgoinActive() // 弹出登录
        return false
      }
      this.$router.push('/create/activity')
    },
    // 加入跑团
    joinGroup (item) {
      this.dialogTitle = '已申请加入'
      //  验证是否登录
      if (!this.getLoginStatus()) {
        this.$refs.header.showLgoinActive() // 弹出登录
        return false
      }
      // 是否已经加入
      if(item.isJoin === 1) {
        this.showDialog = true // 弹出对话框
        return false
      } 
      api.joinGroup({groupId: item.groupId, operation: 0}).then((res) => {
        if(res.data.code !== 200) {
          this.$message({
            showClose: true,
            message: '加入跑团失败',
            type: 'warning',
            center: true
          })
        } else {
          this.showDialog = true // 弹出对话框
          this.getRungroup() // 重新获取跑团数据
        }
      }).catch(() => {
        this.$message({
          showClose: true,
          message: '加入跑团失败',
          type: 'warning',
          center: true
        })
      })
    },
    // 加入活动函数
    joinActivityAction (item) {
      api.joinActivity({activityId: item.activityId, operation: 0}).then((res) => {
        if (res.data.code === 200) {
          this.getActivitygroup() // 重新请求活动数据
          this.dialogTitle = '已成功加入'
          this.showDialog = true // 弹出对话框
        } else {
          this.$message({
            showClose: true,
            message: '加入活动失败',
            type: 'warning',
            center: true
          })
        }
      }).catch(() => {
        this.$message({
          showClose: true,
          message: '加入活动失败',
          type: 'warning',
          center: true
        })
      })
    },
    // 加入活动
    joinActivity (item) {
      //  验证是否登录
      if (!this.getLoginStatus()) {
        this.$refs.header.showLgoinActive() // 弹出登录
        return false
      }
      if (item.status === 2 || item.status === 3) {
        this.$message({
          showClose: true,
          message: '活动报名已截至，无法加入',
          type: 'warning',
          center: true
        })
        return false
      }
      if (item.isJoin === 1) {
        this.$message({
          showClose: true,
          message: '已参加该活动',
          type: 'warning',
          center: true
        })
        return false
      }
      // 是否加入该活动
      if(item.isJoin === 0) {
        // 活动是否需要审核
        if (item.needVerify === 0) {
          if (item.creatorType === 2) {
            this.joinActivityAction(item)
          } else if (item.creatorType === 1) {
            //团活动的时候 团活动允许团成员加入
            if (item.open === 1) { // 所有人开放
              this.joinActivityAction(item)
            } else { //团内成员开放
              if(item.ismember === 1) {
                this.joinActivityAction(item)
              } else {
                this.$message({
                  showClose: true,
                  message: '您还不是团成员，无法加入活动',
                  type: 'warning',
                  center: true
                })
              }
            }
          } else {

          }
        } else {
          this.dialogTitle = '申请活动需要审核'
          this.showDialog = true // 弹出对话框
        }
      } else {
        this.dialogTitle = '已加入活动'
        this.showDialog = true // 弹出对话框
      }
    },
    // 进入跑团详情页
    goRungroup (item) {
      //  验证是否登录
      if (!this.getLoginStatus()) {
        this.$refs.header.showLgoinActive() // 弹出登录
        return false
      }
      this.$router.push({path:'/user/rungroup-info', query:{groupId: item.groupId}})
    },
    // 进入活动详情
    goActivity (item) {
      //  验证是否登录
      if (!this.getLoginStatus()) {
        this.$refs.header.showLgoinActive() // 弹出登录
        return false
      }
      this.$router.push({path:'/user/activity-info', query:{activityId: item.activityId}})
    }
  },
  filters: {
    // 格式化总人数
    formatTotal (val) {
      return !val ? '无限制' : val
    },
    // 格式化状态
    formatStatus (val) {
      let status = ['报名中', '活动进行中', '报名已截止', '活动已结束']
      return status[val]
    }
  },
  mounted () {
    this.getRungroup() // 获取推荐跑团
    this.getActivitygroup() // 获取推荐活动
    // console.log(this.activityGroup)
  }
}
</script>

<style lang="scss" scoped>
.activity{
  position: relative;
  .header{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding-top: 0.14rem;
  }
  .header-banner{
    background: url('~/assets/images/activitiecover.jpg');
    background-size: cover;
    background-position: 50%;
    background-repeat: no-repeat;
    height: 6.7rem;
    text-align: center;
    .creation-img{
      padding-top: 1.53rem;
      padding-bottom: .89rem;
    }
    .creation-btns{
      a{
        display: inline-block;
        width: 1.75rem;
        height: .65rem;
        line-height: .65rem;
        background: #40b173;
        border: 2px solid #51e895;
        border-radius: 100px;
        font-family: PingFangSC-Medium;
        font-size: 21px;
        color: #fff;
        &:first-child{
          margin-right: 0.6rem;
        }
      }
    }
  }
  .run-group{
    padding: .1rem .2rem;
    margin-top: .63rem;
    font-size: 0.18rem;
    .title{
      border-left: .06rem solid #40b173;
      padding-left: .23rem;
      font-size: 21px;
      color: #424242;
      font-weight: 300;
    }
    .picture{
      text-align: center;
      border: 1px solid #eee;
      height: 1.9rem;
      line-height: 1.9rem;
      vertical-align: middle;
      overflow: hidden;
      background-color: #fafafa;
      cursor: pointer;
      img{
        max-width: 100%;
        vertical-align: middle;
      }
    }
    .name{
      font-size: .18rem;
      color: #000;
      padding-top: .1rem;
    }
    .introduce{
      padding-top: .06rem;
      font-size: .15rem;
      color: #939394;
      height: .4rem;
      word-wrap: break-word;
      overflow: hidden;
    }
    .action-btn{
      text-align: center;
      padding-top: .13rem;
      margin-bottom: .13rem;
      a{
        text-align: center;
        display: inline-block;
        width: 1.21rem;
        height: .44rem;
        line-height: .44rem;
        background-image: linear-gradient(-180deg,#fff,#f8f8f8);
        border: 1px solid #ccc;
        border-radius: 0.06rem;
        color: #333;
      font-size: 0.14rem;
      }
    }
    .group-box{
      padding-top: .4rem;
      overflow: hidden;
      margin-bottom: 0.6rem;
      margin-left: -0.1rem;
      margin-right: -0.1rem;
      .group-item{
        width: 25%;
        float: left;
        padding: 0 0.1rem;
        font-weight: 300;
        line-height: 1.4;
        .num{
          font-size: .18rem;
          color: #40b173;
        }
      }
    }
    .activity-box{
      padding: 0.4rem 0 1rem 0;
      margin: 0 -0.1rem;
      overflow: hidden;
      .activity-item{
        width: 25%;
        float: left;
        padding: 0 0.1rem;
        line-height: 1.4;
        .time,.address,.join{
          padding-top: .06rem;
          font-size: .15rem;
          color: #939394;
        }
        .join{
          padding-top: 0.1rem;
        }
        .action-btn{
          margin-top: 0.1rem;
        }
      }
    }
  }
}
.qrcode-box{
  text-align: center;
  color: #545454;
  font-weight: 300;
  line-height: 1.4;
  padding-bottom: 0.4rem;
  .title{
    font-size: 0.3rem;
    h3{
      font-weight: 300;
    }
    p{
      font-size: 0.2rem;
      padding-top: 0.05rem;
    }
  }
  .qrcode{
    margin-top: .28rem;
    text-align: center;
    margin-bottom: .29rem;
    img{
      max-width: 3rem;
    }
  }
  .description{
    font-size: 0.2rem;
    color: #4d4d4d;
    padding-bottom: .4rem;
  }
  .link-btn{
    font-size: 0.2rem;
    color: #9f9f9f;
    a{
      color: #40b173;
      margin-left: 0.1rem;
      &:hover{
        text-decoration: underline;
      }
    }
  }
}
</style>
