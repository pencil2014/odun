<template>
  <section class="activity">
    <div class="title">
      <span>我的活动</span>
      <nuxt-link to="/create/activity">创建活动</nuxt-link>
    </div>
    <div class="activity-box" v-if="activity.total > 0">
      <div class="item" v-for="(item,index) in activity.list" :key="index">
        <div class="pic"><img :src="item.coverImg" alt=""></div>
        <div class="cnt">
          <p class="name ellipsis">{{item.title}}</p>
          <p class="time">时间：{{item.startTime}} ~ {{item.endTime}}</p>
          <p class="address ellipsis">地点：{{item.address}}</p>
          <p class="num">参与人数：{{item.actualJoin}}/{{item.totalJoin === 0 ? '无限制' : item.totalJoin}}人</p>
          <p class="money">{{item.isFree | formatMoney}}</p>
          <p class="status"><span>{{item.status | formatStatus}}</span> <a href="javascript:;" @click="downloadImg(item)">下载签到二维码</a></p>
        </div>
        <div class="action">
          <p class="link-btn"><a href="javascript:;" @click="goInfo(item)">查看</a></p>
          <p class="edit"  v-if="item.isCreator === 1" @click="editActivity(item)">编辑</p>
          <p class="cancle" v-if="item.isCreator === 0 " @click="showDialog(item,1)">退出活动</p>
          <p class="cancle" v-if="item.isCreator === 1" @click="showDialog(item,2)">取消活动</p>
          <p class="download" v-if="item.isCreator === 1" @click="exportNum(item)">导出活动成员excel</p>
          <p class="icon"><i class="iconfont" @click="showQrcode(item)">&#xe61b;</i></p>
        </div>
      </div>
    </div>
    <Placeholder :src="iconUrl" text="你没有已经参加的活动~" class="mt" v-else />
    <div class="page-box" v-if="activity.total > offset">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :total="activity.total">
      </el-pagination>
    </div>
    <!-- 取消活动 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="500px"
      :center="true">
      <p class="tips">确认{{activeType===1 ? '退出' : '取消'}}活动吗?</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cancleActivity">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 二维码 -->
    <el-dialog
      title=""
      :visible.sync="qrDialogVisible"
      width="400px"
      :center="true">
      <div class="qrcode-box">
        <div class="name ellipsis">{{activityItem.creatorName || '跑团二维码'}}</div>
        <div class="num">报名成员：{{activityItem.actualJoin || 0}}人</div>
        <div class="qrcode">
          <qrcode :value="imgUrl" :options="{ size: 200 }"></qrcode>
        </div>
        <div class="tips">你可以用手机扫描二维码，下载app查看</div>
      </div>
    </el-dialog>
    <qrcode style="display:none"  id="download-img" :value="imgUrl + '&qrtype=admin'" :options="{ size: 200 }" tag="img"></qrcode>
  </section>
</template>


<script>
import api from '~/api/activity'
import Qrcode from '@xkeshi/vue-qrcode'
import Placeholder from '~/components/placeholder'
import iconUrl from '~/assets/images/attended1.png'
export default {
  layout: 'user',
  components: {
    Qrcode,
    Placeholder
  },
  data () {
    return {
      activity: '',
      activeType: 2,
      pageIndex: 1,
      offset: 10,
      dialogVisible: false,
      activityItem: '',
      qrDialogVisible: false,
      iconUrl: ''
    }
  },
  computed: {
    imgUrl () {
      if (!this.activityItem) {
        return ''
      }
      return process.env.baseUrl + 'dist/tc-share-wxactivity.html' + "?activtyId="+ this.activityItem.activityId+"&useWhere=wx"
    }
  },
  filters: {
    formatMoney (val) {
      return val === 0 ? '免费' : '收费'
    },
    formatStatus (val) {
      let status = { // 0-活动报名中，1-活动未开始，2活动进行中，3-报名已截止，4-活动已结束
         0: '活动报名中',
         1: '活动未开始',
         2: '活动进行中',
         3: '报名已截止',
         4: '活动已结束',
         5: '活动已取消'
      }
      return status[val]
    }
  },
  methods: {
    // 获取我的活动
    getMyActivity () {
      api.getMyActivity({pageIndex: this.pageIndex, offset: this.offset}).then((res) => {
        if (res.data.code ===200) {
          this.activity = res.data.data
        }
      }).catch(() => {})
    },
    // 去活动详情页
    goInfo (item) {
      this.$router.push({path:'/user/activity-info', query:{activityId: item.activityId}})
    },
    // 编辑活动
    editActivity (item) {
      this.$router.push({path:'/create/activity', query:{activityId: item.activityId, creatorId: item.creatorId}})
    },
    // 导出活动成员excel
    exportNum (item) {
      api.exportNum({activityId: item.activityId}).then((res) => {
        if (res.data.code === 200) {
          window.location = res.data.data.url
        }
      }).catch(() => {})
    },
    // 取消活动
    showDialog (item, type) {
      this.dialogVisible = true
      this.activityItem = item
      this.activeType = type
    },
    cancleActivity () {
      let item = this.activityItem
      this.dialogVisible = false
      if (this.activeType === 1) {
        // 退出活动
        api.joinActivity({activityId: item.activityId, operation: 2}).then((res) => {
          if (res.data.code === 200) {
            this.getMyActivity()
          }
        }).catch(() => {})
      } else {
        // 取消活动
        api.cancleActivity({activityId: item.activityId}).then((res) => {
          if (res.data.code === 200) {
            this.getMyActivity()
          }
        }).catch(() => {})
      }
    },
    // 分页事件
    changePage (val) {
      this.pageIndex = val
      this.getMyActivity()
    },
    // 显示跑团二维码
    showQrcode (item) {
      this.activityItem = item
      this.qrDialogVisible = true
    },
    // 下载签到二维码
    downloadImg (item) {
      this.activityItem = item
      let data =  document.getElementById('download-img').getAttribute('src')
      let fileName = this.activityItem.title + '的签到二维码.png'
      require("downloadjs")(data, fileName, '"image/png')
    }
  },
  mounted () {
    this.iconUrl = iconUrl
    this.getMyActivity()
  }
}
</script>

<style lang="scss" scoped>
.activity{
  .title{
    font-size: .14rem;
    color: #787878;
    letter-spacing: .014rem;
    overflow: hidden;
    line-height: .32rem;
    padding-bottom: 0.1rem;
    margin-bottom: 0.2rem;
    border-bottom: 1px solid #ddd;
    a{
      padding: .0 .15rem;
      background: #30c17b;
      border-radius: .06rem;
      font-size: .14rem;
      color: #fff;
      letter-spacing: .015rem;
      height: .32rem;
      float: right;
    }
  }
  .activity-box{
    .item{
      display: flex;
      padding-bottom: 0.2rem;
      border-bottom: 1px solid #ddd;
      margin-bottom: 0.2rem;
      overflow: hidden;
      font-size: 0.14rem;
      .pic{
        text-align: center;
        line-height: 1.89rem;
        background-color: #fafafa;
        width: 1.89rem;
        height: 1.89rem;
        img{
          max-width: 1.89rem;
          max-height: 1.89rem;
          vertical-align: middle;
        }
      }
      .cnt{
        flex: 1;
        margin: 0 0.2rem;
        line-height: 1.4;
        p{
          font-size: .14rem;
          color: #878787;
          padding-bottom: .08rem;
          margin-bottom: 0.05rem;
        }
        .name{
          font-size: .18rem;
          color: #424242;
          padding-bottom: .06rem;
        }
        .status{
          color: #30c17b;
          a{
            font-size: 0.12rem;
            color: #666;
            margin-left: 0.1rem;
          }
        }
      }
      .action{
        width: 1.89rem;
        height: 1.89rem;
        p{
          margin-bottom: 0.2rem;
          cursor: pointer;
          color: #30c17b;
          text-align: right;
        }
        .link-btn{
          a{
              padding: .05rem .2rem;
              display: inline-block;
              background-image: linear-gradient(-180deg,#fff,#f8f8f8);
              border: 1px solid #ccc;
              border-radius: 6px;
              font-size: 0.12rem;
              color: #666;
          }
        }
        .icon{
          i{
            color: #333;
            font-size: 0.3rem;
          }
        }
      }
    }
  }
  .mt{
    margin-top: 1rem;
  }
  .tips{
    text-align: center;
    font-size: 0.14rem;
  }
  .qrcode-box{
    text-align: center;
    padding-bottom: 0.2rem;
    .name{
      margin-bottom: 0.15rem;
      font-size: 0.18rem;
      color: #333;
    }
    .num{
      font-size: 0.16rem;
      margin-bottom: 0.15rem;
    }
    .qrcode{
      margin-bottom: 0.2rem;
    }
  }
}
</style>


