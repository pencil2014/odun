<template>
  <section class="rungroup">
    <div class="title">跑团基本信息</div>
    <div class="rungroup-info">
      <div class="item">
        <div class="pic"><img :src="rungroup.imageUrl" alt=""></div>
        <div class="cnt">
          <p class="name ellipsis">{{rungroup.name}}</p>
          <p class="introduce" :title="rungroup.introduce">{{rungroup.introduce}}</p>
          <p class="address ellipsis">地点：{{rungroup.address}}</p>
          <p class="num">成员：{{rungroup.totalMember}}人</p>
        </div>
        <div class="action">
          <p class="cancle" v-if="rungroup.role===0" @click="showDialog(1)">解散跑团</p>
          <p class="cancle" v-if="rungroup.role===0" @click="exportNum">导出团成员到excel</p>
          <p class="cancle" v-else @click="showDialog(2)">退出跑团</p>
          <p class="icon"><i class="iconfont" @click="showQrcode()">&#xe61b;</i></p>
          <p class="more">查看更多数据报表</p>
        </div>
      </div>
    </div>
    <div class="chart-box">
      <div class="week">
        <el-progress 
          type="circle" 
          :percentage="warpercent"
          :stroke-width="8"
          :width="100"
          :show-text="false"
          color="#c82a4a"></el-progress>
          <div class="text ellipsis" v-if="rungroup">
            {{rungroup.dynamic.war}}KM
          </div>
          <div class="sub-title">本周跑团跑量</div>
      </div>
      <div class="month">
        <el-progress 
          type="circle" 
          :percentage="waspercent"
          :stroke-width="8"
          :width="100"
          :show-text="false"
          color="#4990e2"></el-progress>
          <div class="text ellipsis" v-if="rungroup">
            {{rungroup.dynamic.was}}人
          </div>
          <div class="sub-title">本周打卡</div>
      </div>
      <div class="average">
        <el-progress 
          type="circle" 
          :percentage="tarpercent"
          :stroke-width="8"
          :width="100"
          :show-text="false"
          color="#01aa63"></el-progress>
          <div class="text ellipsis" v-if="rungroup">
            {{rungroup.dynamic.tapr}}KM
          </div>
          <div class="sub-title">周人均跑量</div>
      </div>
    </div>
    <div class="rungroup-box" @click.stop="showrolebox=-1"> 
      <el-tabs v-model="type" @tab-click="handleClick">
        <el-tab-pane label="最近团活动" name="activity">
          <div class="activity" v-if="activity.total > 0">
            <div class="item" v-for="(item,index) in activity.list" :key="index">
              <div class="pic"><img :src="item.coverImg" alt=""></div>
              <div class="cnt">
                <p class="name ellipsis">{{item.title}}</p>
                <p class="time">时间：{{item.startTime}} ~ {{item.endTime}}</p>
                <p class="address ellipsis">地点：{{item.address}}</p>
                <p class="num">参与人数：{{item.actualJoin}}/{{item.totalJoin}}人</p>
                <p class="money">{{item.isFree | formatMoney}}</p>
                <p class="status"><span>{{item.status | formatStatus}}</span></p>
              </div>
              <div class="action">
                <p class="link-btn" v-if="item.role === 0"><a href="javascript:;" @click="goInfo(item)">查看</a></p>
                <p class="edit"  v-if="item.role === 1" @click="editRungroup(item)">编辑</p>
                <p class="cancle" v-if="item.role === 0" @click="showDialog2(item,1)">退出活动</p>
                <p class="cancle" v-if="item.role === 1" @click="showDialog2(item,2)">取消活动</p>
                <p class="download" v-if="item.role === 1" @click="exportNum(item)">导出活动成员excel</p>
              </div>
            </div>
          </div>
          <div class="nodata" v-else>
            <Placeholder :src="iconUrl" text="当前还没有最近活动" class="mt"/>
            <a href="javascript:;" v-if="rungroup.role === 0 || rungroup.role === 1" class="link-btn">创建活动</a>
          </div>
          
        </el-tab-pane>
        <el-tab-pane label="跑团成员" name="0">
          <div class="table-box" >
            <el-table
              :data="memberList.list"
              :header-row-style="{display:'none'}"
              row-class-name="tablelist">
              <el-table-column
                width=""
                label="">
                <template slot-scope="scope">
                  <div class="pic">
                    <img :src="scope.row.imageUrl || getDefaultImg(scope.row)" alt="">
                  </div>
                  <div class="name">
                    <p class="ellipsis">{{scope.row.nickName}}</p>
                    <p>本周运动了{{scope.row.weekTimes}}次</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                width=""
                label="">
                <template slot-scope="scope">
                  <p :class="['role',{'active': scope.row.role === 0}]" v-if="scope.row.role === 0 || scope.row.role === 1">{{scope.row.role | formatRole}}</p>
                </template>
              </el-table-column>
              <el-table-column label="" width="">
                <template slot-scope="scope">
                  <p>历史活动签到：{{scope.row.extract}}次</p>
                  <p>报名：{{scope.row.totalJoin}}次</p>
                </template>
              </el-table-column>
              <el-table-column label="" width="100">
                <template slot-scope="scope">
                  <div class="edit" v-if="rungroup.role === 0 || rungroup.role === 1">
                    <span class="link" v-if="scope.row.role !== 0" @click.stop="showrolebox = showrolebox===scope.row.userId ? -1 : scope.row.userId">编辑 <i class="iconfont">&#xe601;</i></span>
                    <div class="action" v-show="showrolebox === scope.row.userId">
                      <ul>
                        <li v-if="scope.row.role !== 0" @click="operationMember(scope.row,0)">转让团长</li>
                        <li v-if="scope.row.role !== 1" @click="operationMember(scope.row,1)">设为副团长</li>
                        <li v-if="scope.row.role === 1" @click="operationMember(scope.row,2)">取消副团长</li>
                        <li v-if="scope.row.role !== 0" @click="operationMember(scope.row,3)">剔除成员</li>
                      </ul>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="昨日运动成员" name="1">
          <div class="member-box" v-if="memberList.total > 0">
            <div class="item" v-for="(item,index) in memberList.list" :key="index">
              <div class="pic">
                <img :src="item.imageUrl || getDefaultImg(item)" alt="">
              </div>
              <div class="text">
                <p class="name ellipsis">{{item.nickName}}</p>
                <p class="mileage">跑了{{item.totalMileage}}公里</p>
              </div>
            </div>
          </div>
           <div class="nodata" v-else>
            <Placeholder :src="iconUrl" text="昨日没有运动成员" class="mt"/>
          </div>

        </el-tab-pane>
        <el-tab-pane label="训练计划" name="train">
          <div class="train-box" v-if="train.total > 0">
            <div class="item" v-for="(item,index) in train.list" :key="index">
              <div class="pic">
                <img :src="item.imageUrl" alt="">
              </div>
              <div class="text">
                <p class="name">{{item.name}}</p>
                <p class="mileage">{{item.mileage}}KM | {{item.days}}天 | {{item.signNum}}次打卡</p>
                <p :class="['status',getClass(item)]" @click="joinTrain(item)">{{getStatus(item)}}</p>
              </div>
              <div class="action">
                <p class="edit" v-if="item.edit === 1 && item.startTime*1000 > new Date().getTime()" @click="goEditTrain(item)">编辑</p>
                <p class="del" v-if="item.edit === 1" @click="delTrain(item)">删除</p>
                <p>已有{{item.actualJoin}}人参加</p>
              </div>
            </div>
          </div>
          <div class="nodata" v-else>
            <Placeholder :src="iconUrl" text="当前还没有创建训练计划" class="mt"/>
            <a href="javascript:;" v-if="rungroup.role === 0 || rungroup.role === 1" class="link-btn" @click="goCreateTrain">创建训练计划</a>
          </div>
        </el-tab-pane>
        <el-tab-pane label="团相册" name="photo">
          <div class="photo-box" v-if="photo.total>0">
            <div class="upload-btn">
              <el-upload
                class="upload-demo"
                name="imgs"
                accept="image/jpeg,image/gif,image/png"
                :action="uploadUrl"
                :headers="myHeader"
                :show-file-list="false"
                :data="{userId:this.userId, groupId: this.groupId}"
                :on-error="uploadError"
                :on-success="uploadSuccess"
                multiple
                >
                <el-button size="small" type="primary">批量上传照片</el-button>
            </el-upload>
            </div>
            <div class="photo-list">
              <div class="item" v-for="(item,index) in photo.list" :key="index">
                <img :src="item.imageUrl" alt="">
                <i class="iconfont" @click="delPhoto(item)">&#xe604;</i>
              </div>
            </div>
          </div>
          <div class="nodata" v-else>
            <Placeholder :src="iconUrl" text="该相册还没有照片" class="mt"/>
            <el-upload
              class="upload-demo"
              name="imgs"
              accept="image/jpeg,image/gif,image/png"
              :action="uploadUrl"
              :headers="myHeader"
              :show-file-list="false"
              :data="{userId:this.userId, groupId: this.groupId}"
              :on-error="uploadError"
              :on-success="uploadSuccess"
              multiple
              >
              <el-button size="small" type="primary">批量上传照片</el-button>
            </el-upload>
            <!-- <a href="javascript:;" v-if="rungroup.role === 0 || rungroup.role === 1" class="link-btn">批量上传照片</a> -->
          </div>
        </el-tab-pane>
        <el-tab-pane label="团成员跑量排行" name="rank">
          <div class="rank-box">
            <el-select v-model="rankType" placeholder="请选择" @change="getRank">
              <el-option label="日" value="0"></el-option>
              <el-option label="周" value="1"></el-option>
              <el-option label="月" value="2"></el-option>
            </el-select>
            <div class="rank-list">
              <div class="item" v-for="(item,index) in rank.list" :key="index">
                <div class="rank-num">
                  <img src="~/assets/images/rank1.png" alt="" v-if="index === 0">
                  <img src="~/assets/images/rank2.png" alt="" v-if="index === 1">
                  <img src="~/assets/images/rank3.png" alt="" v-if="index === 2">
                  <p v-if="index > 2">{{index + 1}}</p>
                </div>
                <div class="rank-progress">
                  <div class="pic">
                    <img :src="item.imgUrl" alt="">
                  </div>
                  <div class="progerss">
                    <p class="name">{{item.nickName}}</p>
                    <el-progress color="#01b86b" :show-text="false" :stroke-width="8" :percentage="parseInt((item.finish/rank.list[0].finish)*100)"></el-progress>
                  </div>
                </div>
                <div class="rank-finish">{{item.finish}}公里</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="page-box" v-if="pageTotal > offset">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="pageHandle"
          :total="pageTotal">
        </el-pagination>
      </div>
    </div>
    <!-- 取消跑团 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="500px"
      :center="true">
      <p class="tips">确认{{rungroupType === 1 ? "解散" : '退出'}}跑团吗?</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAction">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 取消活动 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible2"
      width="500px"
      :center="true">
      <p class="tips">确认{{activeType===1 ? '退出' : '取消'}}活动吗?</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
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
        <div class="name ellipsis">{{rungroup.name || '跑团二维码'}}</div>
        <div class="num">成员：{{rungroup.totalMember || 0}}人</div>
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
      groupId: '',
      rungroup: '',
      rungroupType: '',
      pageIndex: 1,
      offset: 10,
      dialogVisible: false,
      qrDialogVisible: false,
      type: 'activity',
      iconUrl: '',
      activity: '',
      activityItem: '',
      activeType: '',
      dialogVisible2: false,
      memberList: '',
      train: '',
      photo: '',
      rank: '',
      showrolebox: 0,
      myHeader: {
        Authorization: ''
      },
      uploadUrl: '',
      rankType: '0'
    }
  },
  computed: {
    // 二维码url
    imgUrl () {
      if (!this.groupId) {
        return ''
      }
      return process.env.baseUrl + 'dist/run-group-detail.html' + "?groupId=" + this.groupId + "&pageName=runGroupDetail&useWhere=wx"
    },
    // 本周百分比
    warpercent () {
      if (!this.rungroup) {
        return 0
      }
      let percent = parseInt((this.rungroup.dynamic.war/this.rungroup.dynamic.wtr) * 100)
      return percent > 100 ? 100 : percent
    },
    waspercent () {
      if (!this.rungroup) {
        return 0
      }
      let percent = parseInt((this.rungroup.dynamic.was/this.rungroup.dynamic.wts) * 100)
      return percent > 100 ? 100 : percent
    },
    tarpercent () {
      if (!this.rungroup) {
        return 0
      }
      let percent = parseInt((this.rungroup.dynamic.tapr/this.rungroup.dynamic.tar) * 100)
      return percent > 100 ? 100 : percent
    },
    // 分页数据
    pageTotal () {
      let type = {
        activity: this.activity.total,
        0: this.memberList.total,
        1: this.memberList.total,
        train: this.train.total,
        rank: this.rank.total,
        photo: this.photo.total
      }
      return type[this.type]
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
         4: '活动已结束'
      }
      return status[val] || '活动已结束'
    },
    formatRole (val) {
      let role = {
        0: '团长',
        1: '副团长',
        2: '团员',
        3: '非团员'
      }
      return role[val] || '其他'
    }
  },
  methods: {
    // 获取我的跑团
    groupInfo () {
      api.groupInfo({groupId: this.groupId}).then((res) => {
        if (res.data.code ===200) {
          this.rungroup = res.data.data
        }
      }).catch(() => {})
    },
    // 退出解散跑团
    showDialog (type) {
      this.dialogVisible = true
      this.rungroupType = type
    },
    // 确认退出或者解散跑团
    confirmAction () {
      if (this.rungroupType === 1) {
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
    // 导出团成员excel
    exportNum (item) {
      api.exportNum({groupId: this.groupId}).then((res) => {
        if (res.data.code === 200) {
          window.location = res.data.data.url
        }
      }).catch(() => {})
    },
    // 分页事件
    pageHandle (val) {
      this.pageIndex = val
    },
    // 显示跑团二维码
    showQrcode () {
      this.qrDialogVisible = true
    },
    // 获取最近活动
    getActivity () {
      api.getActivity({
        groupId: this.groupId,
        pageIndex: this.pageIndex,
        offset: this.offset
      }).then((res) => {
        if (res.data.code === 200) {
          this.activity = res.data.data
        }
      }).catch(() => {})
    },
    // 去活动详情
    goInfo (item) {
      this.$router.push({path:'/user/activity-info', query:{activityId: item.activityId}})
    },
    // 编辑活动
    editRungroup (item) {
      this.$router.push({path:'/create/activity', query:{activityId: item.activityId, creatorId: item.creatorId}})
    },
    // 取消活动
    showDialog2 (item, type) {
      this.dialogVisible2 = true
      this.activityItem = item
      this.activeType = type
    },
    cancleActivity () {
      let item = this.activityItem
      this.dialogVisible2 = false
      if (this.activeType === 1) {
        // 退出活动
        api.joinActivity({activityId: item.activityId, operation: 2}).then((res) => {
          if (res.data.code === 200) {
            this.getActivity()
          }
        }).catch(() => {})
      } else {
        // 取消活动
        api.cancleActivity({activityId: item.activityId}).then((res) => {
          if (res.data.code === 200) {
            this.getActivity()
          }
        }).catch(() => {})
      }
    },
    // tab切换
    handleClick (){
      this.pageIndex = 1
      let type = this.type
      if (type === 'activity') {
        this.getActivity()
      } else if (type === '0' || type === '1') {
        this.rungroupMember()
      } else if (type === 'train') {
        this.getTrain()
      } else if (type === 'photo') {
        this.getPhoto()
      } else if (type === 'rank') {
        this.getRank()
      } else {
        // this.getActivity()
      }
    },
    // 获取跑团成员
    rungroupMember () {
      let type = (this.type === '0' || this.type === '1') ? this.type : '0'
      api.rungroupMember({
        type: type,
        groupId: this.groupId,
        pageIndex: this.pageIndex,
        offset: this.offset
      }).then((res) => {
        if (res.data.code === 200) {
          this.memberList = res.data.data
        }
      }).catch(() => {})
    },
    // 获取默认图像
    getDefaultImg (item) {
      return item.sex === 0 ? male : female
    },
    // 供转让团长，设置副团长，剔除团员功能
    operationMember (item, operation) {
      let msg = {
        0: '转让团长',
        1: '设置副团长',
        2: '取消副团长',
        3: '剔除团员'
      }
      let text = msg[operation] + ', 是否继续?'
      this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.operationMember({
            quserId: item.userId,
            groupId: this.groupId,
            operation: operation
          }).then((res) => {
            if (res.data.code === 200) {
              this.rungroupMember()
            } else {
              this.$message({
                type: 'warning',
                center: true,
                message: msg[operation] + '失败！'
              })
            }
          }).catch(() =>{})
        }).catch(() => {
        })
    },
    // 获取训练计划
    getTrain () {
      api.getTrain({
        groupId: this.groupId,
        userId: this.userId,
        pageIndex: this.pageIndex,
        offset: this.offset
      }).then((res) => {
        if (res.data.code === 200) {
          this.train = res.data.data
        }
      }).catch(() => {})
    },
    // 获取训练状态class
    getClass (item) {
      let end = item.endTime * 1000
      let start = item.startTime * 1000
      let now = new Date().getTime()
      // 训练计划结束
      if (now > end) {
        return 'disable'
      }
      if (item.isJoin === 1) {
        return now > start ? 'active' : 'has'
      } else {
        return 'green'
      }
    },
    // 获取训练计划状态
    getStatus (item) {
      let end = item.endTime * 1000
      let start = item.startTime * 1000
      let now = new Date().getTime()
      // 训练计划结束
      if (now > end) {
        return '已结束'
      }
      if (item.isJoin === 1) {
        return now > start ? '训练中' : '已领取任务'
      } else {
        return '领取任务'
      }
    },
    // 删除跑团训练计划
    delTrain (item) {
      this.$confirm('删除训练计划, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除跑团训练计划
        api.delTrain({userId: this.userId, trainId: item.trainId}).then((res) => {
          if (res.data.code === 200) {
            this.getTrain()
          }
        }).catch(() => {})
      }).catch(() => {         
      })
    },
    // 加入跑团训练计划
    joinTrain (item) {
      let end = item.endTime * 1000
      let start = item.startTime * 1000
      let now = new Date().getTime()
      if (end < now || item.isJoin === 1 ) {
        return false
      }
      api.joinTrain({userId: this.userId, trainId: item.trainId}).then((res) => {
        if (res.data.code === 200) {
          this.getTrain()
        }
      }).catch(() => {})
    },
    // 跑团图片上传成功
    uploadError(response, file, fileList) {
      this.$message({
        showClose: true,
        message: '图片上传失败!',
        type: 'warning',
        center: true
      })
    },
    // 跑团图片上传失败
    uploadSuccess(err, file, fileList) {
      this.getPhoto()
    },
    // 获取团相册
    getPhoto () {
      api.getPhoto({
        groupId: this.groupId,
        userId: this.userId,
        pageIndex: this.pageIndex,
        offset: this.offset
      }).then((res) => {
        if (res.data.code === 200) {
          this.photo = res.data.data
        }
      }).catch(() => {})
    },
    // 删除团相册
    delPhoto (item) {
      this.$confirm('删除图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除跑团图片
        api.delPhoto({userId: this.userId, photoId: item.photoId}).then((res) => {
          if (res.data.code === 200) {
            this.getPhoto()
          }
        }).catch(() => {})
      }).catch(() => {         
      })
    },
    // 跑团排行
    getRank () {
      this.rank = ''
      api.getRank({
        userId: this.userId,
        groupId: this.groupId,
        pageIndex: this.pageIndex,
        offset: this.offset,
        type: this.rankType
      }).then((res) => {
        if (res.data.code === 200) {
          this.rank = res.data.data
        }
      }).catch(() => {})
    },
    // 去创建训练计划
    goCreateTrain () {
      this.$router.push({path:'/create/train', query:{groupId: this.groupId}})
    },
    // 去编辑训练计划
    goEditTrain (item) {
      this.$router.push({path:'/create/train', query:{groupId: this.groupId, trainId: this.trainId}})
    }
  },
  mounted () {
    this.iconUrl = iconUrl
    this.groupId = this.$route.query.groupId
    this.type = this.$route.query.type || 'activity'
    this.userId = JSON.parse(window.sessionStorage.getItem('userInfo')).userId
    this.myHeader.Authorization = window.localStorage.getItem('token')
    this.uploadUrl = process.env.baseUrl + 'smartShoes/web/rungroup/photo/upload.json'
    this.groupInfo()  // 跑团信息
    this.handleClick() // 最近活动
    // this.rungroupMember() // 跑团成员
    // this.getTrain() // 获取训练计划
    // this.getPhoto() // 获取跑团相册
    // this.getRank() // 跑团排行
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
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #ddd;
  }
  .rungroup-info{
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
        overflow: hidden;
        img{
          max-width: 1.89rem;
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
        width: 1.2rem;
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
  .chart-box{
    overflow: hidden;
    margin: 0.4rem 0 0.3rem 0;
    .week,.month,.average{
      width: 33.33%;
      float: left;
      height: 1.5rem;
      text-align: center;
      position: relative;
      .sub-title{
        font-size: .14rem;
        color: #787878;
        padding: 0.1rem 0;
      }
      .text{
        position: absolute;
        width: 100%;
        top: 0.45rem;
        font-size: 0.12rem;
        padding: 0 .2rem;
        overflow: hidden;
      }
    }

  }
  .rungroup-box{
    padding-bottom: 2rem;
    .nodata{
      text-align: center;
      .link-btn{
        display: inline-block;
        text-align: center;
        background: #30c17b;
        border-radius: 6px;
        height: .32rem;
        min-width: .96rem;
        padding: 0 .1rem;
        line-height: .32rem;
        font-size: 15px;
        color: #fff;
        letter-spacing: 1.5px;
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
  .activity{
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
        overflow: hidden;
        img{
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
        padding-top: 0.4rem;
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
  .table-box{
    p{
      font-size: 0.12rem;
      color: #787878;
      line-height: 1.8;
    }
    .pic{
      width: 0.4rem;
      height: .4rem;
      line-height: 0.4rem;
      height: 100%;
      float: left;
      img{
        max-width: 0.4rem;
        max-height: 0.4rem;
        vertical-align: middle;
        border-radius: 50%;
      }
    }
    .name{
      float: left;
      margin-left: 0.2rem;
    }
    .role{
      padding: 0.03rem 0.1rem;
      display: inline-block;
      text-align: center;
      background-color: #7ed321;
      color: #fff;
      border-radius: 0.1rem;
      &.active{
        background-color: #f5a623;
      }
    }
    .edit{
      .link{
        color: #4a90e2;
        font-size: 0.12rem;
        cursor: pointer;
        i{
          position: relative;
          top: 0.02rem;
        }
      }
      .action{
        position: absolute;
        z-index: 9999;
        top: 0.5rem;
        right: 1px;
        background: #fff;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.12);
        width: 1rem;
        li{
          padding: 0.1rem;
          cursor: pointer;
        }
      }
    }
  }
  .member-box{
    overflow: hidden;
    .item{
      float: left;
      width: 25%;
      margin-bottom: 0.2rem;
      .pic{
        float: left;
        width: 0.4rem;
        height: 0.4rem;
        line-height: 0.4rem;
        img{
          max-width: 0.4rem;
          max-height: 0.4rem;
          vertical-align: middle;
        }
      }
      .text{
        margin-left: 0.5rem;
        font-size: 0.12rem;
        p{
          color: #787878;
          line-height: 1.8;
        }
      }
    }
  }
  .train-box{
    .item{
      display: flex;
      border-bottom: 1px solid #ddd;
      padding-bottom: 0.2rem;
      margin-bottom: 0.2rem;
      overflow: hidden;
      .pic{
        width: 1rem;
        height: 1rem;
        line-height: 1rem;
        background-color: #fafafa;
        overflow: hidden;
        img{
          max-height: 1rem;
          vertical-align: middle;
        }
      }
      .text{
        flex: 1;
        margin: 0 0.1rem;
        padding-top: 0.1rem;
        .name{
          font-size: 0.16rem;
          padding-bottom: 0.1rem;
        }
        .mileage{
          color: #878787;
          font-size: 0.14rem;
          padding-bottom: 0.1rem;
        }
        .status{
          background-color: #aaa;
          font-size: 0.12rem;
          display: inline;
          padding: 0.03rem 0.1rem;
          border-radius: 0.08rem;
          color: #fff;
          &.green{
            background-color: #30c17b;
            cursor: pointer;
          }
          &.has{
            background-color: #30c17b;
            cursor: not-allowed;
          }
          &.active {
            background-color: #f5a623;
            cursor: not-allowed;
          }
          &.disable{
            background-color: #aaa;
            cursor: not-allowed;
          }
        }
      }
      .action{
        padding-top: 0.35rem;
        color: #30c17b;
        font-size: 0.12rem;
        p{
          padding-bottom: 0.1rem;
        }
        .del,.edit{
          cursor: pointer;
        }
      }
    }
  }
  .photo-box{
    overflow: hidden;
    .item{
      width: 1.5rem;
      height: 1.5rem;
      background-color: #fafafa;
      overflow: hidden;
      float: left;
      margin: 0.1rem 0.1rem 0.1rem 0;
      text-align: center;
      position: relative;
      line-height: 1.5rem;
      img{
        max-width: 1.5rem;
        vertical-align: middle;
      }
      i{
        line-height: 0.3rem;
        position: absolute;
        font-size: 0.25rem;
        right: 0.01rem;
        top: 0.01rem;
        color: #ccc;
        cursor: pointer;
        &:hover{
          color: #f53f3f;
        }
      }
    }
  }
  .rank-box{
    .rank-list{
      overflow: hidden;
      font-size: 0.12rem;
      .item{
        display: flex;
        border-bottom: 1px solid #eee;
        padding-bottom: 0.1rem;
        .rank-num{
          min-width: 0.5rem;
          text-align: center;
          line-height: 0.5rem;
          img{
            max-height: 0.25rem;
            vertical-align: middle;
          }
        }
        .rank-progress{
          flex: 1;
          .name{
            color: #666;
            padding: 0.02rem 0 0.05rem 0;
            font-size: 0.14rem;
          }
        }
        .rank-finish{
          min-width: 1rem;
          height: 0.5rem;
          line-height: 0.5rem;
          text-align: center;
          color: #666;
        }
      }
    }
  }
  .page-box{
    margin: 0.2rem 0;
  }
}
</style>

<style lang="scss">
.rungroup-box{
  .el-table,.el-table__body-wrapper,.el-tabs__content{
    overflow: visible;
  }
}
</style>
