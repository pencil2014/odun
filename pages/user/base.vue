<template>
  <section class="base">
    <div class="base-title">我在RunStep的成果</div>
    <div class="panle-box">
      <div class="panle-item">
        <div class="item-panle-tip">累计运动时长(小时)</div>
        <div class="item-score" v-if="baseInfo">{{baseInfo.score.hours || 0}}</div>
      </div>
      <div class="panle-item">
        <div class="item-panle-tip">累计走步数</div>
        <div class="item-score" v-if="baseInfo">{{baseInfo.score.steps || 0}}</div>
      </div>
      <div class="panle-item">
        <div class="item-panle-tip">累计跑步距离km</div>
        <div class="item-score" v-if="baseInfo">{{baseInfo.score.run || 0}}</div>
      </div>
    </div>
    <div class="base-title">最近我获得的勋章 <span v-if="baseInfo">（{{baseInfo.medal.total}}枚）</span></div>
    <div class="cnt">
      <div class="medal-box" v-if="baseInfo.medal && baseInfo.medal.total > 0">
        <div class="medal-item" v-for="(item,index) in baseInfo.medal.list" :key="index">
          <p class="pic"><img :src="item.imageUrl" alt=""></p>
          <p class="name">{{item.name}}</p>
        </div>
      </div>
      <Placeholder v-else :src="attended2" text="你还没有获得一枚勋章，要加油哟～"/>
    </div>
    
    <div class="base-title">最近一次跑步记录</div>
    <div class="run-box">
      <div class="cnt">
        <div class="run-info"  v-if="baseInfo.record && !!baseInfo.record.recordId">
          <div class="info-left">
            <p class="info-time">{{baseInfo.record.startTime}}</p>
            <p class="info-mileage">
              <img src="~/assets/images/runlast1.png" alt="">
              时间{{baseInfo.record.duration | formatTime}}
            </p>
            <p class="info-mileage">
               <img src="~/assets/images/runlast2.png" alt="">
               距离{{baseInfo.record.mileage}}公里
            </p>
            <p class="info-calorie">
              <img src="~/assets/images/runlast3.png" alt="">
              卡路里燃烧{{baseInfo.record.calorie}}大卡
            </p>
            <p class="info-maxpace">
              <img src="~/assets/images/runlast4.png" alt="">
              1公里最快配速{{baseInfo.record.maxPace | formatPace}}
            </p>
            <p class="info-frequency">
              <img src="~/assets/images/runlast5.png" alt="">
              步频{{baseInfo.record.frequency}}步／分钟<span v-if="!baseInfo.record.frequency">（未连接硬件）</span>
            </p>
            <p class="info-step">
              <img src="~/assets/images/runlast6.png" alt="">
              1步姿：后脚跟{{baseInfo.record.backStep}}%，内八{{baseInfo.record.innerStep}}%
            </p>
          </div>
          <div class="info-right">
            <p class="title">运动轨迹</p>
            <div id="container" class="map-box"></div> 
          </div>
        </div>
        <Placeholder v-else :src="attended3" text="你还没有运动记录，需要努力哟～"/>
      </div>
    </div>
    <div class="base-title">本周走步详情</div>
    <div class="echarts-box">
      <div class="echarts" id="echarts" style="width: 100%;height:400px;"></div>
    </div>
    <div class="base-title">最近参加的活动</div>
    <div class="activity-box">
      <div class="cnt">
        <div class="activity-cnt" v-if="baseInfo.activity && !!baseInfo.activity.activityId">
          <div class="pic">
            <img :src="baseInfo.activity.imageUrl" alt="">
          </div>
          <div class="activity-info">
            <p class="title">{{baseInfo.activity.title}}</p>
            <p class="time">时间：{{baseInfo.activity.startTime}}~{{baseInfo.activity.endTime}}</p>
            <p class="address ellipsis">地点：{{baseInfo.activity.address}}</p>
            <p class="num">参与人数：{{baseInfo.activity.actualJoin}} / {{baseInfo.activity.totalJoin | formatjoin}} 人</p>
            <p class="money">{{baseInfo.activity.deposit | formatDep}}</p>
            <!-- 0-报名中，1-活动进行中，2-已截止报名，3-活动已结束 -->
            <p class="status">{{baseInfo.activity.astatus | formatStatus}}</p>
          </div>
        </div>
        <Placeholder v-else :src="attended1" text="你没有已经参加的活动~"/>
      </div>
    </div>
  </section>
</template>

<script>
import api from '~/api/base'
import Placeholder from '~/components/placeholder.vue'
// 加载默认图片
import attended1 from '~/assets/images/attended1.png'
import attended2 from '~/assets/images/attended2.png'
import attended3 from '~/assets/images/attended3.png'
export default {
  layout: 'user',
  components: {
    Placeholder
  },
  data () {
    return {
      // 默认图片
      attended1: '',
      attended2: '',
      attended3: '',
      // 基本信息
      baseInfo: '',
      myChart: '',
      maps: '',
      marker: '',
      lineArr: []
    }
  },
  methods: {
    // 获取基本数据
    getBaseInfo () {
      api.getBaseInfo({}).then((res) => {
        if (res.data.code === 200) {
          this.baseInfo = res.data.data
          this.echartsData(res.data.data.weekStep)
        }
      }).catch(() => {})
    },
    // 初始化echart
    initEcharts () {
      var echarts = require('echarts')
      this.myChart = echarts.init(document.getElementById('echarts'))
      var option = {
          title: {
              text: '本周走步详情',
          },
          color: '#30c17b',
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              data:[]
          },
          xAxis:  {
              type: 'category',
              boundaryGap: false,
              data: []
          },
          yAxis: {
              type: 'value'
          },
          series: [
              {
                  name:'累计步数',
                  type:'line',
                  data:[],
                  markPoint: {
                      data: [
                          {type: 'max', name: '最大值'},
                          {type: 'min', name: '最小值'}
                      ]
                  }
              }
          ]
      }
      this.myChart.setOption(option)
    },
    // 处理echart数据
    echartsData (data) {
      let arr = data.list
      let xData = [], yData =[]
      arr.forEach(element => {
        xData.push(element.date)
        yData.push(element.step)
      })
      this.myChart.setOption({
         xAxis: {
            data: xData
        },
        series: [{
            name: '累计步数',
            data: yData
        }]
      })
    },
    // 初始化高德地图
    initMap () {
      var url = 'http://webapi.amap.com/maps?v=1.4.6&key=2309210a690b194071839885aae695da&callback=loadMap'
      var jsapi = document.createElement('script')
      jsapi.charset = 'utf-8'
      jsapi.src = url
      document.head.appendChild(jsapi)
    },
    startRun (pointList) {  //开始绘制轨迹
      let timer = ''
      if (!pointList) {
        timer = setTimeout(() => {
          this.startRun(this.baseInfo.record.routeDetail)
        }, 1000)
        return false
      } else {
        clearTimeout(timer)
      }
      let x = pointList[0].lo
      let y = pointList[0].la
      this.completeEventHandler(x, y)
      this.marker.moveAlong(this.lineArr, 80)    // 开始轨迹回放
    },
    completeEventHandler (x, y) {
      this.marker = new AMap.Marker({  
        map: this.maps,  
        draggable:true, //是否可拖动  
        position: new AMap.LngLat(x,y),//基点位置  
        icon: new AMap.Icon({size: new AMap.Size(32,32)}), //marker图标，直接传递地址url  
        autoRotation: true  
      })     
      let pointList = this.baseInfo.record.routeDetail
      for (let i = 1; i < pointList.length; i++) {
          let lngX = pointList[i].lo
          let latY = pointList[i].la
          this.lineArr.push(new AMap.LngLat(lngX,latY))
      }
      //绘制轨迹  
      var polyline = new AMap.Polyline({  
          map: this.maps,  
          path: this.lineArr,  
          strokeColor: "#0BD26C", // 线颜色  
          strokeOpacity: 1, // 线透明度  
          strokeWeight: 5, // 线宽  
          strokeStyle: "solid", // 线样式
          strokeDasharray: [10, 5] // 补充线样式
        })
        polyline.setMap(this.maps)
        this.maps.setFitView()
    }
  },
  filters: {
    formatTime (val) {
      let min = Math.floor(val / 60)
      let sec = val % 60
      return `${min}分钟${sec}秒`
    },
    formatPace (val) {
      let min = Math.floor(val / 60)
      let sec =  val % 60
      return `${min}'${sec}''`
    },
    formatjoin (val) {
      return val === 0 ? '无限制' : val
    },
    formatDep (val) {
      return val === 0 ? '免费' : val
    },
    // 0-报名中，1-活动进行中，2-已截止报名，3-活动已结束 
    formatStatus (val) {
      let status = {
        0: '报名中',
        1: '活动进行中',
        2: '已截止报名',
        3: '活动已结束'
      }
      return status[val]
    }
  },
  mounted () {
    // 设置默认图片
    this.attended1 = attended1
    this.attended2 = attended2
    this.attended3 = attended3
    // 请求基本信息
    this.getBaseInfo()
    // 初始化echart
    this.initEcharts()
    // 地图回调
    window.loadMap = () => {
      this.maps = new AMap.Map('container', {
        resizeEnable: true,
        center: [116.397428, 39.90923],
        zoom: 14
      })
      this.startRun(this.baseInfo.record.routeDetail)
    }
    this.initMap()
  }
}
</script>

<style lang="scss" scoped>
.base{
  .base-title{
    padding-bottom: .25rem;
    font-size: 0.14rem;
    color: #787878;
    letter-spacing: 1.4px;
  }
  .cnt{
    box-shadow: 1px 2px 1px  #eee;
    padding-bottom: 0.2rem;
    margin-bottom: 0.3rem;
  }
  .panle-box{
    overflow: hidden;
    margin-bottom: 0.2rem;
    .panle-item{
      width: 30%;
      float: left;
      margin:0 0.2rem 0.1rem 0;
      padding-left: .25rem;
      padding-top: .36rem;
      height: 1.58rem;
      background: #fff;
      box-shadow: 3px 3px 1px #eee;
      border-radius: 6px;
      border: 1px solid #eee;
      &:nth-child(n+3){
        margin-right: 0;
      }
      .item-panle-tip{
        font-size: 0.14rem;
        color: #787878;
        letter-spacing: 1.4px;
        padding-bottom: .15rem;
      }
      .item-score{
        line-height: 1.4;
        font-size: .36rem;
        color: #30c17b;
        letter-spacing: .036rem;
        font-weight: 300;
      }
    }
  }
  .medal-box{
    overflow: hidden;
    .medal-item{
      float: left;
      text-align: center;
      padding-bottom: .2rem;
      width: 20%;
      img{
        max-height: 1rem;
        vertical-align: middle;
      }
      .name{
        font-size: 0.14rem;
        color: #787878;
        letter-spacing: 1.4px;
        padding-top: .2rem;
      }
    }
  }
  .echarts-box{
    background-color: #fafafa;
    margin-bottom: 0.3rem;
  }
  .run-info{
    overflow: hidden;
    font-size: 0.16rem;
    font-weight: 300;
    .info-left{
      width: 50%;
      padding-right: 0.15rem;
      float: left;
      p{
        vertical-align: middle;
        padding: 0.1rem 0;
        img{
          vertical-align: middle;
          margin-right: 0.1rem;
          height: 0.26rem;
        }
      }
    }
    .info-right{
      width: 50%;
      padding-left: 0.15rem;
      float: right;
      .map-box{
        height: 3rem;
        width: 100%;
      }
      .title{
        font-size: 0.14rem;
        margin-bottom: 0.1rem;
      }
    }
  }
  .activity-box{
    .activity-cnt{
      overflow: hidden;
      .pic{
        float: left;
        width: 1.89rem;
        height: 1.89rem;
        line-height: 1.89rem;
        margin-right: 0.2rem;
        background-color: #fafafa;
        overflow: hidden;
        text-align: center;
        img{
          max-height: 1.89rem;
          max-width: 1.89rem;
          vertical-align: middle;
        }
      }
      .activity-info{
        line-height: 1.4;
        font-weight: 300;
        p{
          font-size: .16rem;
          color: #878787;
          margin-bottom: 0.05rem;
        }
        .title{
          font-size: 0.18rem;
          color: #424242;
        }
        .status{
          font-size: 0.12rem;
          display: inline-block;
          background: #d8d8d8;
          border-radius: 3px;
          height: .3rem;
          line-height: 0.3rem;
          padding: 0 0.1rem;
          margin-top: 0.1rem;
        }
      }
    }
  }
}
</style>



