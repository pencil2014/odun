<template>
  <section class="run">
    <div class="header-banner">
      <div class="head">
        <Header active="3"/>
      </div>
      <div class="content">
        <div class="search">
          <input type="text" v-model="keywords" name="serialid" placeholder="防伪查询，输入鞋子序列号或者芯片序列号">
          <div class="search-btn" @click.enter="search"><i class="iconfont">&#xe633;</i></div>
        </div>
      </div>
    </div>
    <div class="run-rule">
      <div class="content">
        <div class="info">
          <div class="description">
            <h3>选择契约跑</h3>
            <p>选择适合你的契约跑类型，坚持下来，鞋子就是你的</p>
          </div>
          <div class="shoes-box">
            <div class="item" v-for="(item,index) in official" :key="index">
              <div class="item-header">
                <h3 class="title">契约跑套餐：{{item.ruleName}}</h3>
                <span class="item-rule" @click="showDialog(item)">查看规则</span>
              </div>
              <div class="des-box">
                <div class="pic">
                  <img :src="item.imageUrl" alt="">
                </div>
                <div class="des">
                  <h4>{{item.title}}</h4>
                  <p class="description">{{item.description}}</p>
                  <p class="time">活动时间：{{item.startTime}} ~ {{item.endTime}}</p>
                  <div class="moeny-box">
                    <p class="money">契约金：<b>￥{{item.amount}} </b> <span>(完成任务押金退还)</span> </p>
                    <a href="javascript:;" :class="['link-btn', {'disabled': disabledTime(item.endTime)}]" @click="signUp(item)">立即报名</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 契约跑规则 -->
    <el-dialog title="" :visible.sync="dialogVisible">
      <div class="run-rule-cnt">
        <h5 class="title">{{activeRule.title}}</h5>
        <div class="des">
          <p class="name">{{activeRule.name}}</p>
          <p class="time">活动时间：{{activeItem.startTime}} - {{activeItem.endTime}}</p>
        </div>
        <div class="info">
          <p class="sub-title">规则描述</p>
          <p class="item" v-for="(item,index) in activeRule.des" :key="index">{{index+1}}、{{item}}</p>
        </div>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import api from '~/api/run'
import Header from '~/components/header.vue'
export default {
  head () {
    return {
      title: '契约跑',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'RunStep,智能跑鞋,跑步,跑团' },
        { hid: 'description', name: 'description', content: 'RunStep官方网站,一站式专业跑团,坚持跑步鞋子免费拿' }
      ]
    }
  },
  layout: 'home',
  components:{
    Header
  },
  // asyncData () {
  //   // 获取契约跑套餐数据
  //   return api.getOfficial({}).then((res) => {
  //     return { official: res.data.data.list || [] }
  //   }).catch(() => {
  //     return { official: [] }
  //   })
  // },
  data () {
    return {
      keywords: '', // 搜索关键字
      official: '', // 契约跑套餐
      dialogVisible: false, //  契约跑规则弹出框
      rule:[ // 契约跑规则
        {
          title: '18天坚持跑活动规则',
          name: '18天坚持跑',
          time: '2017年10月20日-2017年11月20日',
          des: [
            '活动期间，参加活动者单次跑步距离不得少于5公里否则判做无效，当天需要重跑。',
            '另外，若大于5公里，需要保证5公里的数据都是有效数据，即每公里的配速要控制在3“00‘-8”00’之间，每公里的平均步频要控制在100步／分钟-210步／分钟之间。不足一公里的数据算作无效。',
            '在单次跑步大于等于5公里的情况下，如果当无效公里数大于有效公里数，则当前单次跑步数据则判定为无效。当天需要重跑。',
            '在单次跑步大于等于5公里的情况下，如果当无效公里数小于有效公里数，则当前单次跑步数据的部分有效数据记录为有效数据，剩余的需要补跑。',
            '补跑规则：每次补跑的总距离要大于等于补跑的距离，并且补跑的有效距离要大于无效距离，有效距离才算有效。否则补跑距离都无效，需要继续补跑。',
            '当所有有效距离大于等于5公里，才算此次任务完成，打卡成功。'
          ]
        },{
          title: '130公里累计跑活动规则',
          name: '130公里累计跑',
          time: '2017年10月20日-2017年11月20日',
          des: [
            '在活动期间累计跑完130公里算完成任务，但单次跑步的有效距离最少不能低于3公里，支持一天多次跑，但最多只统计有效距离10公里，',
            '另外，需要保证每公里的数据都是有效数据，即每公里的配速要控制在3″00′-8″00′之间，每公里的平均步频要控制在100步／分钟-210步／分钟之间。有效公里数必须大于等于3公里，不足一公里的数据算作无效。'
          ]
        }
      ],
      activeRule: '', // 当前激活规则
      activeItem: '' // 当前激活item
    }
  },
  methods: {
    // 获取契约跑套餐数据
    getOfficial () {
      api.getOfficial({}).then((res) => {
        this.official = res.data.data.list || []
      }).catch(() => {})
    },
    // 搜索产品
    search () {
      if (!this.keywords) {
        this.$message({
          showClose: true,
          message: '请输入鞋子或者芯片序列号',
          type: 'warning',
          center: true
        })
        return false
      }
      this.$router.push({path: '/views/search', query:{keywords: this.keywords}})
    },
    // 弹出规则弹框
    showDialog (item) {
      this.activeItem = item
      this.activeRule = this.rule[item.ruleId]
      this.dialogVisible = true
    },
    // 检测是否可以报名
    disabledTime (time) {
      let date = time.replace(/[年|月|日]/g, '/') || ''
      return new Date(date).getTime() < new Date().getTime()
    },
    // 立即报名
    signUp (item) {
      if(this.disabledTime(item.endTime)){
        this.$message({
          showClose: true,
          message: '套餐已失效，暂时无法报名!',
          type: 'warning',
          center: true
        })
        return false
      }
    }
  },
  mounted () {
    this.getOfficial()
    // console.log(this.official)
  }
}
</script>
<style lang="scss" scoped>
.run{
  font-weight: 300;
  .header-banner{
    background: url('~/assets/images/1c.png');
    background-size: cover;
    background-position: 50%;
    background-repeat: no-repeat;
    height: 6.7rem;
    position: relative;
    top: 0;
    .head{
      padding: 0.14rem 0;
    }
    .search{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      -ms-transform: translate(-50%,-50%);
      width: 6.47rem;
      height: .9rem;
      background: rgba(0,0,0,.11);
      border: 1px solid #fff;
      border-radius: 100px;
      margin: 0 auto;
      padding-left: .43rem;
      vertical-align: middle;
      input{
        width: 5rem;
        height: .87rem;
        border-color: rgba(79,179,210,0);
        background: transparent;
        font-family: PingFangSC-Light;
        font-size: 0.24rem;
        color: hsla(0,0%,100%,.52);
        outline: none;
        padding-left: .12rem;
        vertical-align: top;
      }
      .search-btn{
        height: 0.9rem;
        line-height: 0.9rem;
        vertical-align: top;
        display: inline-block;
        cursor: pointer;
        i{
          font-size: 0.36rem;
          vertical-align: top;
          color: #fff;
        }
      }
    }
  }
  .run-rule{
    background: #fafafa;
    .content{
      margin-top: -0.35rem;
    }
    .info{
      font-size: 0.16rem;
      background-color: #fff;
      position: relative;
      padding-top: 0.7rem;
      .description{
        text-align: center;
        h3{
          font-size: 0.4rem;
          color: rgba(0,0,0,.52);
          padding-bottom: .33rem;
          font-weight: 300;
        }
        p{
          font-size: 0.2rem;
          color: rgba(0,0,0,.52);
        }
      }
    }
    .shoes-box{
      padding-left: 10%;
      padding-right: 10%;
      margin: 0 auto;
      text-align: center;
      padding-bottom: 1.18rem;
      .item{
        margin-bottom: .1rem;
        padding-bottom: .6rem;
        padding-left: .2rem;
        padding-right: .2rem;
        margin-top: .62rem;
        background: #fff;
        box-shadow: 1px 1px 2px 2px rgba(0,0,0,.1);
        .item-header{
          padding-top: .4rem;
          padding-bottom: .55rem;
          .title{
            font-size: .25rem;
            color: #404040;
            float: left;
            font-weight: 300;
          }
          .item-rule{
            font-size: .16rem;
            color: #575757;
            float: right;
            cursor: pointer;
          }
        }
        .des-box{
          overflow: hidden;
          .pic{
            width: 35%;
            float: left;
            img{
              width: 100%;
              height: 2.51rem;
              background: #eee;
            }
          }
          .des{
            width: 65%;
            text-align: left;
            padding-left: .36rem;
            float: left;
            h4{
              font-size: .25rem;
              color: #404040;
              font-weight: 300;
            }
            .description{
              text-align: left;
              font-size: .16rem;
              color: #999;
              padding-top: .1rem;
              padding-bottom: .1rem;
            }
            .time{
              color: #999;
              padding-bottom: .1rem;
            }
            .moeny-box{
              position: relative;
              padding-top: .53rem;
              .money{
                font-size: .24rem;
                color: #ff3c3c;
                float: left;
                line-height: 0.4rem;
                b{
                  font-weight: 400;
                }
                span{
                  font-size: 0.16rem;
                }
              }
              .link-btn{
                float: right;
                text-align: center;
                background: #0f82fa;
                border-radius: 100px;
                width: 1.5rem;
                height: .4rem;
                font-size: .16rem;
                color: #fff;
                line-height: .4rem;
                &.disabled{
                  background-color: #ccc;
                  cursor: not-allowed;
                }
              }
            }
          }
        }

      }
    }
  }
  .run-rule-cnt{
    font-family: PingFangSC-Medium;
    font-weight: 300;
    .title{
      text-align: center;
      font-size: .30rem;
      color: #545454;
      padding-bottom: .75rem;
      font-weight: 400;
    }
    .name,.sub-title{
      font-size: .22rem;
      color: #404040;
      padding-bottom: 0.1rem;
      font-weight: 400;
    }
    .time{
      font-size: .18rem;
      color: #1c1c1c;
      line-height: 37px;
      padding-bottom: .2rem;
      font-weight: 300;
    }
    .info{
      .item{
        font-size: 0.16rem;
        color: #272727;
        line-height: 1.4;
        padding-bottom: .2rem;
      }
    }
  }
}
</style>
