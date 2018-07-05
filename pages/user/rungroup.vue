<template>
  <section class="rungroup">
    <div class="title">
      <span>我的跑团</span>
      <nuxt-link to="/create/rungroup">创建跑团</nuxt-link>
    </div>
    <div class="rungroup-box" v-if="rungroup.total > 0">
      <div class="item" v-for="(item,index) in rungroup.list" :key="index">
        <div class="pic"><img :src="item.imageUrl" alt=""></div>
        <div class="cnt">
          <p class="name ellipsis" :title="item.name">{{item.name}}</p>
          <p class="introduce" :title="item.introduce">{{item.introduce}}</p>
          <p class="address ellipsis">地点：{{item.address}}</p>
          <p class="num">成员：{{item.totalMember}}人</p>
        </div>
        <div class="action">
          <p class="goto" @click="goInfo(item)">查看</p>
          <p class="edit" v-if="item.role===0" @click="editRungroup(item)">编辑</p>
          <p class="cancle" v-if="item.role===0" @click="showDialog(item,1)">解散跑团</p>
          <p class="cancle" v-else @click="showDialog(item,2)">退出跑团</p>
          <p class="icon"><i class="iconfont" @click="showQrcode(item)">&#xe61b;</i></p>
        </div>
      </div>
    </div>
    <Placeholder class="mt" :src="iconUrl" text="你还没有加入跑团" v-else />
    <div class="page-box" v-if="rungroup.total > offset">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :total="rungroup.total">
      </el-pagination>
    </div>
    <!-- 取消活动 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="500px"
      :center="true">
      <p class="tips">确认{{activeType === 1 ? "解散" : '退出'}}跑团吗?</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAction">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 二维码 -->
    <el-dialog
      title=""
      :visible.sync="qrDialogVisible"
      width="400px"
      :center="true">
      <div class="qrcode-box">
        <div class="name ellipsis">{{activityItem.name || '跑团二维码'}}</div>
        <div class="num">成员{{activityItem.totalMember || 0}}人</div>
        <div class="qrcode">
          <qrcode :value="imgUrl" :options="{ size: 200 }"></qrcode>
        </div>
        <div class="tips">你可以用手机扫描二维码，下载app查看</div>
      </div>
    </el-dialog>
  </section>
</template>


<script>
import api from '~/api/rungroup'
import Qrcode from '@xkeshi/vue-qrcode'
import Placeholder from '~/components/placeholder'
import iconUrl from '~/assets/images/attended3.png'
export default {
  layout: 'user',
  components: {
    Qrcode,
    Placeholder
  },
  data () {
    return {
      groupId: '',
      rungroup: '',
      pageIndex: 1,
      offset: 10,
      dialogVisible: false,
      activityItem: '',
      activeType: '',
      qrDialogVisible: false,
      iconUrl: ''
    }
  },
  computed: {
    imgUrl () {
      if (!this.activityItem) {
        return ''
      }
      return process.env.baseUrl + 'dist/run-group-detail.html' + "?groupId="+ this.activityItem.groupId+"&pageName=runGroupDetail&useWhere=wx"
    }
  },
  methods: {
    // 获取我的跑团
    getRungroup () {
      api.getRungroup({pageIndex: this.pageIndex, offset: this.offset, type: 1}).then((res) => {
        if (res.data.code ===200) {
          this.rungroup = res.data.data
        }
      }).catch(() => {})
    },
    // 去跑团详情页
    goInfo (item) {
      this.$router.push({path:'/user/rungroup-info', query:{groupId: item.groupId}})
    },
    // 退出解散跑团
    showDialog (item,type) {
      this.dialogVisible = true
      this.activityItem = item
      this.activeType = type
    },
    // 确认退出或者解散跑团
    confirmAction () {
      if (this.activeType === 1) {
        this.cancleGroup()
      } else {
        this.outGroup()
      }
      this.dialogVisible = false
    },
    // 解散跑团
    cancleGroup () {
      api.cancleGroup({groupId: this.activityItem.groupId}).then((res) => {
        if (res.data.code === 200) {
          this.getRungroup()
        }
      }).catch(() => {})
    },
    // 退出跑团
    outGroup () {
      api.outGroup({groupId: this.activityItem.groupId, operation: 1}).then((res) => {
        if (res.data.code === 200) {
          this.getRungroup()
        }
      }).catch(() => {})
    },
    // 分页事件
    changePage (val) {
      this.pageIndex = val
      this.getRungroup()
    },
    // 显示跑团二维码
    showQrcode (item) {
      this.activityItem = item
      this.qrDialogVisible = true
    },
    // 编辑跑团
    editRungroup (item) {
       this.$router.push({path:'/create/rungroup', query:{groupId: item.groupId}})
    }
  },
  mounted () {
    this.iconUrl = iconUrl
    this.getRungroup()
  }
}
</script>

<style lang="scss" scoped>
.rungroup{
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
  .rungroup-box{
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
        .introduce{
          height: 0.6rem;
          overflow: hidden;
          word-break: break-all;
        }
        .num{
          color: #30c17b;
        }
      }
      .action{
        width: 1rem;
        height: 1rem;
        padding-top: 0.2rem;
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


