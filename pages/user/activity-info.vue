<template>
  <section class="activity">
    <div class="title">活动详情</div>
    <div class="activity-info">
      <div class="item">
        <div class="pic"><img :src="activity.coverImg" alt=""></div>
        <div class="cnt">
          <p class="name ellipsis">{{activity.title}}</p>
          <p class="time">时间：{{activity.startTime}} ~ {{activity.endTime}}</p>
          <p class="address ellipsis">地点：{{activity.address}}</p>
          <p class="num">参与人数：{{activity.actualJoin}}/{{activity.totalJoin === 0 ? '无限制' : activity.totalJoin}}人</p>
          <p class="money">{{activity.isFree | formatMoney}}</p>
          <p class="status"><span>{{activity.astatus | formatStatus}}</span> <a href="javascript:;" @click="downloadImg(activity)">下载签到二维码</a></p>
        </div>
        <div class="action">
          <p class="edit">编辑</p>
          <p class="cancle" @click="showDialog()">取消活动</p>
          <p class="download" @click="exportNum()">导出活动成员excel</p>
          <p class="icon"><i class="iconfont" @click="showQrcode()">&#xe61b;</i></p>
        </div>
      </div>
    </div>
    <div class="activity-number"> 
      <el-tabs v-model="type" @tab-click="handleClick">
        <el-select v-model="regType" placeholder="请选择" @change="activityNumber">
          <el-option :value="0" label="个人">个人</el-option>
          <el-option :value="1" label="团体">团体</el-option>
          <el-option :value="2" label="亲子">亲子</el-option>
        </el-select>
        <el-tab-pane label="活动成员" name="0"></el-tab-pane>
        <el-tab-pane label="签到成员" name="1"></el-tab-pane>
        <div class="list-box" v-if="activityList.total > 0">
          <div class="item" v-for="(item,index) in activityList.list" :key="index">
            <div class="item-box">
              <div class="pic">
                <img :src="item.imageUrl || getDefaultImg(item)" alt="">
              </div>
              <div class="text">
                <p><span class="name">{{item.nickName}}</span> <span class="time">{{item.time}}</span></p>
                <p class="role active" v-if="item.role===0">{{item.role | formatRole}}</p>
                <div v-else>
                  <p v-if="activityList.role === 0"><span>姓名：{{item.name || '--'}}</span><span>手机号码：{{item.phone || '--'}}</span><span>身份证：{{item.idCard || '--'}}</span></p>
                  <p v-else><span>姓名：{{item.name || '***'}}</span><span>手机号码：***********</span><span>身份证：***********</span></p>
                </div>
              </div>
              <div class="action" v-if="activityList.role === 0 && item.role !== 0 && item.status === 1" @click="deleteMember(item)">
                踢出
              </div>
              <div class="action-pass" v-if="item.status === 0">
                <p @click="verifyMember(item,1)">审核通过</p>
                <p @click="verifyMember(item,0)">拒绝</p>
              </div>
            </div>

            <div class="sub" v-if="item.sub.length > 0">
              <div v-for="(sub, x) in item.sub" :key="x">
                <p v-if="activityList.role === 0"><span v-if="sub.name">姓名：{{sub.name}}</span><span v-if="sub.idCard">身份证：{{sub.idCard}}</span></p>
                <p v-else><span v-if="sub.name">姓名：{{sub.name}}</span><span v-if="sub.idCard">身份证：***********</span></p>
              </div>
            </div>
          </div>
        </div>
         <Placeholder v-else :src="iconUrl" text="还没有相关成员数据" class="mt"/>
      </el-tabs>
      <div class="page-box" v-if="activityList.total > offset">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="changePage"
          :total="activityList.total">
        </el-pagination>
      </div>
    </div>
    <!-- 取消活动 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="500px"
      :center="true">
      <p class="tips">确认取消活动吗?</p>
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
        <div class="name ellipsis">{{activity.title || '跑团二维码'}}</div>
        <div class="num">报名成员：{{activity.actualJoin || 0}}人</div>
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
import iconUrl from '~/assets/images/noactivity.png'
import male from '~/assets/images/male.png'
import female from '~/assets/images/female.png'
export default {
  layout: 'user',
  components: {
    Qrcode,
    Placeholder
  },
  data () {
    return {
      userId: '',
      activityId: '',
      activity: '',
      pageIndex: 1,
      offset: 10,
      dialogVisible: false,
      qrDialogVisible: false,
      type: '0',
      regType: 0,
      activityList: '',
      iconUrl: ''
    }
  },
  computed: {
    imgUrl () {
      if (!this.activityId) {
        return ''
      }
      return process.env.baseUrl + 'dist/tc-share-wxactivity.html' + "?activtyId="+ this.activityId+"&useWhere=wx"
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
         5: '活动已取消',
         6: '审核中',
         7: '已报名',
         8: '审核被拒',
         9: '已被移出活动',
         10: '未签到',
         11: '已签到',
         12: '仅团内成员可以报名',
         13: '活动进行中'
      }
      return status[val] || '活动已结束'
    },
    formatRole (val) {
      return val === 0 ? '创建者' : '参与者'
    }
  },
  methods: {
    // 获取我的活动
    activityInfo () {
      api.activityInfo({activityId: this.activityId}).then((res) => {
        if (res.data.code ===200) {
          this.activity = res.data.data
        }
      }).catch(() => {})
    },
    // 导出活动成员excel
    exportNum () {
      api.exportNum({activityId: this.activityId}).then((res) => {
        if (res.data.code === 200) {
          window.location = res.data.data.url
        }
      }).catch(() => {})
    },
    // 取消活动
    showDialog () {
      this.dialogVisible = true
    },
    cancleActivity () {
      this.dialogVisible = false
      api.cancleActivity({activityId: this.activityId}).then((res) => {
        if (res.data.code === 200) {
          this.activityInfo()
        }
      }).catch(() => {})
    },
    // 分页事件
    changePage (val) {
      this.pageIndex = val
      this.activityInfo()
    },
    // 显示跑团二维码
    showQrcode () {
      this.qrDialogVisible = true
    },
    // 下载签到二维码
    downloadImg () {
      let data =  document.getElementById('download-img').getAttribute('src')
      let fileName = this.activity.title + '的签到二维码.png'
      require("downloadjs")(data, fileName, '"image/png')
    },
 
    // 成员列表
    activityNumber () {
      api.activityNumber({
        type: this.type,
        activityId: this.activityId,
        pageIndex: this.pageIndex,
        offset: this.offset,
        regType: this.regType
      }).then((res) => {
        if (res.data.code === 200) {
          this.activityList = res.data.data
        }
      }).catch(() => {})
    },
    // tab切换
    handleClick (){
      this.pageIndex = 1
      this.activityNumber()
    },
    // 获取默认图像
    getDefaultImg (item) {
      return item.sex === '男' ? male : female
    },
    // 踢出成员
    deleteMember (item) {
      this.$confirm('踢出成员，请确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 踢出成员
        api.deleteMember({quserId: item.userId, activityId: this.activityId}).then((res) => {
          if (res.data.code === 200) {
            this.activityNumber()
            this.$message({
              showClose: true,
              message: '踢出成功!',
              type: 'success',
              center: true
            })
          } else {
            this.$message({
              showClose: true,
              message: '踢出失败!',
              type: 'warning',
              center: true
            })
          }
        }).catch(() => {})
      }).catch(() => {
      })
    },
    // 报名审核
    verifyMember (item, operation) {
      api.verifyMember({
        userId: this.userId, 
        activityId: this.activityId, 
        quserId: item.userId, 
        operation: operation,
        reason: 0,
        ext: ''
        }).then((res) => {
          if (res.data.code === 200) {
            this.activityNumber()
          }
        }).catch(() => {})
    }
  },
  mounted () {
    this.iconUrl = iconUrl
    this.activityId = this.$route.query.activityId
    this.userId = JSON.parse(window.sessionStorage.getItem('userInfo')).userId
    this.activityInfo()
    this.activityNumber()
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
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #ddd;
  }
  .activity-info{
    .item{
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
        float: left;
        img{
          max-width: 1.89rem;
          max-height: 1.89rem;
          vertical-align: middle;
        }
      }
      .cnt{
        float: left;
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
        float: right;
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
  .list-box{
    padding-bottom: 0.2rem;
    padding-top: 0.2rem;
    .item{ 
      .item-box{
        display: flex;
        border-bottom: 1px solid #ddd;
        overflow: hidden;
        margin-top: 0.2rem;
        padding-bottom: 0.2rem;
        .pic{
          width: .5rem;
          height: .5rem;
          line-height: 0.5rem;
          img{
            max-width: .5rem;
            max-height: .5rem;
            border-radius: 50%;
            vertical-align: middle;
          }
        }
        .text{
          flex: 1;
          margin-left: 0.1rem;
          color: #787878;
          font-size: 0.14rem;
          line-height: 1.4;
          p{
            margin-bottom: 0.1rem;
            span{
              margin-right: 0.5rem;
            }
          }
          .role{
            display: inline-block;
            background-color: #eee;
            padding: 0.02rem 0.1rem;
            border-radius: 6px;
            &.active{
              background-color: #fae905;
            }
          }
        }
        .action{
          font-size: .14rem;
          color: #787878;
          letter-spacing: .014rem;
          cursor: pointer;
          line-height: .58rem;
        }
        .action-pass{
          line-height: 1.4;
          p{
            margin-bottom: .1rem;
            padding: 0.04rem .1rem;
            background-image: linear-gradient(-180deg,#fff,#f8f8f8);
            border: 1px solid #979797;
            border-radius: 6px;
            text-align: center;
            font-size: 0.12rem;
            cursor: pointer;
            color: #787878;
            &:hover{
               background-image: linear-gradient(-180deg,#30c17b,#2aa76b);
               border-color: #2aa76b;
               color: #fff;
            }
          }
        }
      }
      .sub{
        background-color: #eee;
        font-size: 0.12rem;
        p{
          line-height: 1.4;
          padding: 0.02rem 0.1rem;
          span{
            margin-right: 0.1rem;
          }
        }
      }
      
    }
  }
  .mt{
    margin-top: 1rem;
  }
}
</style>

