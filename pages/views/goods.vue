<template>
  <section class="goods">
    <div class="head">
      <Header active="2" />
    </div>
    <div class="box">
      <div class="banner1">
        <div class="content">
          <div class="picture">
            <img src="~/assets/images/phone.png" alt="phone">
          </div>
          <div class="desription">
            <div class="free">
              <img src="~/assets/images/free.png" alt="free">
            </div>
            <div class="download">
              <div class="code">
                <img src="~/assets/images/app_code.png" alt="qrcode">
              </div>
              <div class="link">
                <a href="https://itunes.apple.com/cn/app/%E6%AC%A7%E7%9B%BE%E9%85%B7%E8%B7%91/id1279128697?mt=8" target="_blank">Appstore下载</a>
                <a href="http://sj.qq.com/myapp/detail.htm?apkName=com.odun.odunRunning" target="_blank">Android下载</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="banner2">
        <div class="content">
          <div class="description">
            <h3>你走的每一步我们都算数</h3>
            <p>精准记录你的走步数据，你的跑步数据，提供专业的走步跑步数据展示和分析。</p>
          </div>
          <div class="picture">
            <p class="pic1">
              <img src="~/assets/images/guiji.png" alt="轨迹">
            </p>
            <p class="pic2">
              <span>
                <img src="~/assets/images/ac1.png" alt="步姿">
              </span>
              <span>
                <img src="~/assets/images/ac2.png" alt="配速">
              </span>
              <span>
                <img src="~/assets/images/ac3.png" alt="步频">
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="banner3">
        <div class="content">
          <div class="description">
            <h3>契约跑</h3>
            <p>与我们签订契约,让跑步成为你的习惯。</p>
          </div>
          <div class="picture">
            <p class="pic1">
              <img src="~/assets/images/3c.png" alt="流程">
            </p>
            <p class="pic2">
              <img src="~/assets/images/4c.png" alt="契约跑">
            </p>
          </div>
        </div>
      </div>
      <div class="banner4">
        <div class="content">
          <div class="description">
            <h3>训练计划</h3>
            <p>针对不同人群，RunStep提供多类型专业教练课程，为你量身制定科学训练计划。</p>
          </div>
          <div class="picture">
            <img class="pic1" src="~/assets/images/cc.png" alt="日历">
            <img class="pic2" src="~/assets/images/tphone.png" alt="App界面">
          </div>
        </div>
      </div>
      <div class="banner5">
        <div class="content">
          <div class="description">
            <h3>运动社区精选动态</h3>
            <p>记录运动时刻，分享快乐瞬间，邂逅精选达人，一个专业、有趣，充满正能量的运动社区。</p>
          </div>
          <div class="news" v-if="news.length > 0">
            <div class="item" v-for="(item,index) in news" :key="index">
              <p class="pic">
                <img :src="item.imageUrl" alt="">
              </p>
              <p class="des">
                {{item.title}}
              </p>
              <p class="info">
                <span class="user"><img :src="item.head" alt="头像">{{item.nickName}}</span>
                <span class="praise">{{item.totalPraise}}</span>
              </p>
            </div>
          </div>
          <Placeholder v-else />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from '~/api/goods'
import Header from '~/components/header.vue'
import Placeholder from '~/components/placeholder.vue'
export default {
  head () {
    return {
      title: '产品',
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
  data () {
    return {
      news: '' // 社区动态
    }
  },
  methods: {
    // 获取社区动态数据
    getNews () {
      api.getNews({}).then((res) => {
        this.news = res.data.data.list || []
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    this.getNews() // 获取社区动态数据
  }
}
</script>

<style lang="scss" scoped>
.goods{
  background-color: #f1f1f1;
  .head{
    padding: 0.14rem 0;
  }
  .box{
    font-size: 0.16rem;
    .content{
      .description{
        text-align: center;
        h3{
          font-size: 0.42rem;
          color: #818181;
          padding-bottom: .24rem;
          font-weight: 200;
        }
        p{
          padding-bottom: .8rem;
          font-size: 160.16rempx;
          color: #a0a3a7;
        }
      }
    }
    .banner1{
      padding: 0.6rem 0 1.5rem 0;
      .picture{
        width: 40%;
        float: left;
        text-align: center;
        img{
          width: 2.7rem;
        }
      }
      .desription{
        margin-left: 40%;
        .free{
          padding: .5rem 0 0.66rem;
          img{
            width: 4.9rem;
          }
        }
        .download{
          .code{
            float: left;
            img{
              width: 1.42rem;
            }
          }
          .link{
            margin-left: 1.6rem;
            width: 1.42rem;
            a{
              display: inline-block;
              width: 1.65rem;
              height: .51rem;
              margin-top: .15rem;
              background: #30c17b;
              border-radius: 100px;
              text-align: center;
              line-height: .51rem;
              font-family: PingFangSC-Light;
              font-size: 16px;
              color: #fff;
            }
          }
        }
      }
    }
    .banner2{
      text-align: center;
      background: #fafafa;
      padding-top: 8%;
      padding-bottom: 8%;
      .picture{
        .pic1{
          padding-bottom: .89rem;
        }
        .pic2{
          span{
            display: inline-block;
            width: 33.33%;
            text-align: center;
          }
        }
      }
    }
    .banner3{
      background-image: url('~/assets/images/11c.png');
      background-size: cover;
      background-position: 50%;
      background-repeat: no-repeat;
      text-align: center;
      padding-top: .8rem;
      padding-bottom: .8rem;
      .pic1{
        padding-bottom: .69rem;
      }
    }
    .banner4{
      background: #fafafa;
      text-align: center;
      padding-top: .78rem;
      padding-bottom: .8rem;
      .pic1{
        width: 7.41rem;
        vertical-align: middle;
      }
      .pic2{
        margin-left: 0.5rem;
        width: 3.04rem;
        vertical-align: middle;
      }
    }
    .banner5{
      background: #fff;
      text-align: center;
      padding-top: .78rem;
      padding-bottom: .8rem;
      .news{
        .item{
          float: left;
          width: 2.72rem;
          margin-right: .2rem;
          margin-bottom: .25rem;
          overflow: hidden;
          .pic{
            vertical-align: middle;
            text-align: center;
            width: 2.72rem;
            height: 2.72rem;
            line-height: 2.72rem;
            overflow: hidden;
            img{
              // max-width: 100%;
              max-height: 100%;
              vertical-align: middle;
            }
          }
          .des{
            font-size: 0.18rem;
            color: #000;
            text-align: left;
            margin-bottom: .1rem;
            margin-top: .1rem;
            height: .22rem;
            width: 2rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .info{
            overflow: hidden;
            font-size: 0.14rem;
            color: #ababab;
            height: .16rem;
            line-height: .16rem;
            font-weight: 300;
            .user{
              float: left;
              img{
                width: .16rem;
                height: .16rem;
                border-radius: 50%;
                vertical-align: middle;
                margin-right: 0.05rem;
              }
            }
            .praise{
              float: right;
            }
          }
        }
      }
    }
  }
}
</style>
