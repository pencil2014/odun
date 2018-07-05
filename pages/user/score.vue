<template>
  <section class="score">
    <div class="top">
      <div class="distance">
        <p class="title">我的跑步成绩</p>
        <p class="sub">累计跑步距离：<span>{{condition.totalMileage || 0}}</span>公里</p>
      </div>
      <div class="download" @click="showDialog">导出所有数据</div>
    </div>
    <div class="condition" v-if="condition.list && condition.list.length > 0">
      <div class="year">
        <div class="label">年份</div>
        <div class="list">
          <span 
          :class="{'active': item.year === year}" 
          v-for="(item,index) in condition.list" :key="index"
          @click="changeYear(item.year)"
          >{{item.year}}年</span>
        </div>
      </div>
      <div class="month">
        <div class="label">月份</div>
        <div class="list">
          <span 
          @click="changeMonth(item)"
          :class="{'active': item === month}" 
          v-for="(item,index) in monthList" 
          :key="index">{{item}}月</span>
        </div>
      </div>
    </div>
    <div class="pagelist">
      <div class="title">本月累计里程：<span>{{runList.totalMileage || 0}}</span>公里</div>
      <div class="table-box">
        <el-table
          v-if="runList.list && runList.list.length > 0"
          :data="runList.list"
          :header-row-style="{display:'none'}"
          row-class-name="tablelist">
          <el-table-column
            width="100"
            label="">
            <template slot-scope="scope">
              <img src="~/assets/images/run_icon.png" alt="">
            </template>
          </el-table-column>
          <el-table-column
            label="">
            <template slot-scope="scope">
              <p class="type">{{scope.row.runType}}</p>
              <p class="time">{{scope.row.startTime}}</p>
            </template>
          </el-table-column>
          <el-table-column label="">
            <template slot-scope="scope">
              <p class="duration"><img src="~/assets/images/time.png" alt=""> 用时 {{scope.row.duration | formatSecnd}}</p>
            </template>
          </el-table-column>
          <el-table-column label="">
            <template slot-scope="scope">
              <p class="mileage"><img src="~/assets/images/run.png" alt=""> 跑了{{scope.row.mileage}}公里</p>
            </template>
          </el-table-column>
        </el-table>
        <Placeholder v-else :src="attended3" text="你还没有你还没有任何的跑步记录" class="mt"/>
      </div>
      <div class="page-box" v-if="runList.total > offset">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="changePage"
          :total="runList.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="选择时间范围" 
      :visible.sync="dialogFormVisible" 
      width="30%"
      center>
      <div style="text-align: center;">
        <el-date-picker
        v-model="timeRange"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="downLoad">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import api from '~/api/score'
import Placeholder from '~/components/placeholder.vue'
import attended3 from '~/assets/images/attended3.png'
export default {
  layout: 'user',
  components: {
    Placeholder
  },
  data () {
    return {
      pageIndex: 1,
      offset: 10,
      year: '',
      month: '',
      condition: '',
      runList: '',
      attended3: '',
      dialogFormVisible: false,
      timeRange: ''
    }
  },
  methods: {
    // 获取筛选条件
    getRecordMonth () {
      api.getRecordMonth({}).then((res) => {
        if (res.data.code === 200) {
          this.condition = res.data.data || []
          let item = res.data.data.list[0] || ''
          if (!!item) {
            this.year = item.year
            this.month = JSON.parse(item.month)[0]
          }
          if(!!this.year){
            this.getHistory()
          }
        }
      }).catch(() => {
        console.log('获取筛选条件失败')
      })
    },
    // 获取跑步记录
    getHistory () {
      api.getHistory({
        pageIndex: this.pageIndex,
        offset: this.offset,
        year: this.year,
        month: this.month
      }).then((res) => {
        if (res.data.code === 200) {
          this.runList = res.data.data
        }
      }).catch(() => {})
    },
    // 改变筛选条件
    changeYear (year) {
      this.year = year
      this.month = this.monthList[0]
      this.getHistory()
    },
    changeMonth (month) {
      this.month = month
      this.getHistory()
    },
    // 导出数据
    showDialog () {
      this.dialogFormVisible = true
    },
    downLoad () {
      this.dialogFormVisible = false
      api.downLoad({
      startTime: this.timeRange[0], 
      endTime: this.timeRange[1]}).then((res) => {
        if (res.data.code === 200) {
          let url = res.data.data.url
          if (!!url) {
           window.location = url
          }
        } else{
          this.$message({
            showClose: true,
            message: '数据导出失败',
            type: 'warning',
            center: true
          })
        }
      }).catch(() => {
        this.$message({
          showClose: true,
          message: '数据导出失败',
          type: 'warning',
          center: true
        })
      })
    },
    // 分页事件
    changePage (val) {
      this.pageIndex = val
      this.getHistory()
    }
  },
  computed: {
    monthList () {
      let arr = this.condition.list
      let result =arr.filter((el) => {
        return el.year === this.year
      })
      return JSON.parse(result[0].month)
    }
  },
  mounted () {
    this.attended3 = attended3
    this.getRecordMonth()
  }
}
</script>

<style lang="scss" scoped>
.score{
  background-color: #fff;
  font-size: 0.14rem;
  color: #888;
  font-weight: 400;
  min-height: 8rem;
  .top{
    overflow: hidden;
    .distance{
      float: left;
      line-height: 1.4;
      .title{
        font-size: 0.16rem;
      }
      .sub{
        font-size: 0.14rem;
        padding-top: 0.05rem;
      }
    }
    .download{
      float: right;
      font-size: 0.12rem;
      color: #30c17b;
      cursor: pointer;
    }
  }
  .condition{
    padding-top: 0.2rem;
    font-size: 0.12rem;
    .year,.month{
      padding-bottom: 0.2rem;
      overflow: hidden;
      line-height: 1.4;
      .label{
        width: 0.5rem;
        float: left;
        line-height: 0.26rem;
      }
      .list{
        margin-left: 0.6rem;
        span{
          display: inline-block;
          padding: 0.05rem 0.1rem;
          border-radius: 4px;
          margin-right: 0.1rem;
          cursor: pointer;
          &.active{
            background-color: #30c17b;
            color: #fff;
          }
        }
      }
    }
  }
  .mt{
    margin-top: 1rem;
  }
  .pagelist{
    .title{
      font-size: .12rem;
      color: #30c17b;
      letter-spacing: .012rem;
      padding-bottom: .2rem;
      margin-top: 0.1rem;
      border-bottom: 1px solid #ebeef5;
    }
    .tablelist{
      p{
        color: #888;
        vertical-align: middle;
        img{
          vertical-align: middle;
          margin-top: -4px;
        }
      }
    }
    .page-box{
      padding-top: 0.2rem;
    }
  }
}
</style>
