<template>
  <section class="walk">
    <div class="title">我的走步数据</div>
    <div class="walk-data-box">
      <div class="circle">
        <div class="progress">
          <el-progress 
          type="circle" 
          :percentage="percent"
          :stroke-width="15"
          :width="180"
          :show-text="false"
          color="#30C17B"></el-progress>
          <div class="text" v-if="steps">
            <p>目标：{{steps.today.target}}</p>
            <p class="finish">{{steps.today.finish}}</p>
            <p>今日步数</p>
          </div>
        </div>
      </div>
      <div class="week" v-if="steps">
        <div class="item" v-for="(item,index) in steps.week" :key="index">
          <div class="item-progress">
            <div class="item-progress-v" :style="{ height: item.finish/item.target*100+'%' }"></div>
          </div>
          <div class="item-text"><span :class="{active: index===new Date().getDay()-1}">{{day[index]}}</span></div>
        </div>
      </div>
    </div>
    <div class="title">走步数据详情</div>
    <div class="walk-data-info">
      <div class="download" @click="downLoad">导出所有数据</div>
      <div class="walk-chart-box">
        <div class="lenge"><span>趋势</span></div>
        <div class="num">累计步数：{{stepDetail.totalStep || 0}}步</div>
        <div class="echarts" id="echarts" style="width: 100%;height:400px;"></div>
        <div class="active-box">
          <div class="item-info">
            <div class="value">{{activeDetail.ts || 0}}</div>
            <div class="des">总步数（步）</div>
          </div>
          <div class="item-info">
            <div class="value">{{activeDetail.tm || 0}}</div>
            <div class="des">总公里（KM）</div>
          </div>
          <div class="item-info">
            <div class="value">{{activeDetail.et || 0}}</div>
            <div class="des">总时间（H）</div>
          </div>
          <div class="item-info">
            <div class="value">{{activeDetail.tc || 0}}</div>
            <div class="des">总消耗大卡（Kacl）</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from '~/api/walk'
export default {
  layout: 'user',
  components: {},
  data () {
    return {
      steps: '',
      stepDetail: '',
      activeDetail: '',
      day: ['一', '二', '三', '四', '五', '六', '日'],
      myChart: ''
    }
  },
  computed: {
    percent () {
      if(!this.steps) {
        return 0
      }
      return (this.steps.today.finish/this.steps.today.target)*100
    }
  },
  methods: {
    // 获取走步数据
    getStep () {
      api.getStep({}).then((res) => {
        if (res.data.code === 200) {
          this.steps = res.data.data
        }
      }).catch(() => {})
    },
    // 获取走步详情
    getDetail () {
      api.getDetail({}).then((res) => {
        if (res.data.code === 200) {
          this.stepDetail = res.data.data
          this.echartsData(res.data.data)
        }
      }).catch(() => {})
    },
    // 导出数据
    downLoad () {
      api.downLoad({}).then((res) => {
        if (res.data.code === 200) {
          window.location = res.data.data.url
        }
      }).catch(() => {})
    },
    // 初始化echart
    initEcharts () {
      var echarts = require('echarts')
      this.myChart = echarts.init(document.getElementById('echarts'))
      var option = {
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis'
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 60,
            end: 95
          },
          {
            type: 'inside',
            realtime: true,
            start: 45,
            end: 80
          }
      ],
        series: [{
          name:'总步数',
          data: [],
          type: 'line'
        },
        {
          name:'总公里',
          data: [],
          type: 'line'
        },
        {
          name:'总时间',
          data: [],
          type: 'line'
        },
        {
          name:'总卡路里',
          data: [],
          type: 'line'
        }
        ]
      }
      this.myChart.setOption(option)
      this.myChart.on('mousemove', (params) => {
        this.activeDetail = this.stepDetail.detail[params.dataIndex]
      })
    },
    // 处理echart数据
    echartsData (data) {
      let arr = data.detail
      let date = [], step = [], mileage = [], time = [], calorie = []
      arr.forEach(element => {
        date.push(element.date.split(' ')[0])
        step.push(element.ts)
        mileage.push(element.tm)
        time.push(element.et)
        calorie.push(element.tc)
      })
      this.myChart.setOption({
         xAxis: {
            data: date
        },
        series: [{
          name:'总步数',
          data: step,
          type: 'line'
        },
        {
          name:'总公里',
          data: mileage,
          type: 'line'
        },
        {
          name:'总时间',
          data: time,
          type: 'line'
        },
        {
          name:'总卡路里',
          data: calorie,
          type: 'line'
        }
        ]
      })
    }
  },
  mounted () {
    this.initEcharts() // 初始化echart
    this.getStep() // 获取走步数据
    this.getDetail() // 获取走步详情
  }
}
</script>

<style lang="scss" scoped>
.walk{
  .title{
    font-size: .14rem;
    color: #787878;
    letter-spacing: .014rem;
    padding-bottom: .34rem;
  }
  .walk-data-box{
    overflow: hidden;
    height: 2.5rem;
    margin-bottom: 0.35rem;
    .circle{
      position: relative;
      width: 35%;
      height: 100%;
      float: left;
      border: 1px solid #e7e7e7;
      border-radius: 6px;
      padding: .3rem;
      .progress{
        width: 1.8rem;
        margin: auto;
      }
      .text{
        text-align: center;
        font-size: .12rem;
        color: #555;
        position: absolute;
        top:0.85rem;
        width: 1.8rem;
        p{
          padding: 0.05rem 0;
        }
        .finish{
          font-weight: bolder;
          font-size: 0.2rem;
        }
      }
    }
    .week{
      height: 2.5rem;
      background: #fff;
      border: 1px solid #e7e7e7;
      border-radius: 6px;
      margin-left: 37%;
      padding: .3rem;
      font-size: .14rem;
      color: #787878;
      letter-spacing: .014rem;
      .item{
        width: 14%;
        float: left;
        .item-progress{
          overflow: hidden;
          margin: 0 auto;
          width: .15rem;
          height: 1.7rem;
          background: #ececec;
          border-radius: 6px;
          position: relative;
          top: 0;
          .item-progress-v{
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 20%;
            font-size: 12px;
            line-height: 20px;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            background-color: #30c17b;
            box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
          }
        }
        .item-text{
          text-align: center;
          padding-top: .1rem;
          padding-bottom: .2rem;
          span{
            display: inline-block;
            padding: .05rem .05rem;
            border-radius: 50%;
            font-family: PingFangSC-Semibold;
            font-size: 12px;
            &.active{
              background: #30c17b;
              color: #fff;
            }
          }
        }
      }
    }
  }
  .walk-data-info{
    .download{
      text-align: right;
      margin-top: -.25rem;
      padding-bottom: .25rem;
      font-size: 0.14rem;
      color: #30c17b;
      cursor: pointer;
    }
    .walk-chart-box{
      border: 1px solid #e7e7e7;
      border-radius: 6px;
      padding-bottom: .8rem;
      margin-bottom: 1rem;
      .lenge{
        padding: .22rem;
        border-bottom: 1px solid #e6e6e6;
        span{
          font-size: .16rem;
          color: #34c27e;
          letter-spacing: .016rem;
          padding: .1rem;
          padding-bottom: .18rem;
          border-bottom: 3px solid #34c27e;
        }
      }
      .num{
        padding: .33rem;
        font-size: .16rem;
        color: #000;
        letter-spacing: .018rem;
        font-weight: 300;
      }
      .active-box{
        margin-top: 0.5rem;
        width: 100%;
        .item-info{
          width: 24%;
          float: left;
          text-align: center;
          .value{
            font-size: 0.3rem;
            color: #404040;
            letter-spacing: 3.4px;
            font-weight: 300;
            margin-bottom: 0.1rem;
          }
          .des{
            font-size: 0.12rem;
            color: #525252;
            letter-spacing: 1.2px;
          }
        }
      }
    }
  }
}
</style>


