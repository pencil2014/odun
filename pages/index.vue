<template>
  <section>
    <div class="runstep">
      <div class="head-box">
        <Header active="1"/>
      </div>
      <div class="banner">
        <el-carousel 
        :interval="15000" 
        :autoplay="true"
        height="100%" 
        indicator-position="none"
        ref="carousel"
        arrow="hover">
          <el-carousel-item class="banner-item page1">
            <div class="content">
              <div class="page-box">
                <p class="picture">
                  <img src="~/assets/images/ptma.png" alt="">
                </p>
                <div class="link-btn">
                  <nuxt-link to="/create/rungroup">创建跑团</nuxt-link>
                  <nuxt-link to="/create/activity">创建活动</nuxt-link>
                </div>
              </div>
            </div>
            
          </el-carousel-item>
          <el-carousel-item class="banner-item page2">
            <div class="content">
              <div class="page-box">
                <div class="product">
                  <img src="~/assets/images/shoes2.png" alt="">
                </div>
                <div class="slogon">
                  <img src="~/assets/images/freeshoes1.png" alt="">
                  <div class="download">
                    <a class="apple" href="https://itunes.apple.com/cn/app/%E6%AC%A7%E7%9B%BE%E9%85%B7%E8%B7%91/id1279128697?mt=8" target="_blank">Appstore下载</a>
                    <a class="android" href="http://sj.qq.com/myapp/detail.htm?apkName=com.odun.odunRunning" target="_blank">Android下载</a>
                  </div>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="copyright">
        Copyright (c) 2004-{{year}} Odun enterprise website <a href="http://www.miitbeian.gov.cn" target="_blank">GuangDong ICP No. 14001512-2 All Rights Reserved</a>
      </div>
    </div>
  </section>
</template>
<script>
import Header from '~/components/header.vue'
export default {
  layout: 'default',
  head () {
    return {
      title: 'RunStep官方网站',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'RunStep,智能跑鞋,跑步,跑团' },
        { hid: 'description', name: 'description', content: 'RunStep官方网站,一站式专业跑团,坚持跑步鞋子免费拿' }
      ]
    }
  },
  components: {
    Header
  },
  computed: {
    // 获取当前年份
    year () {
      return new Date().getFullYear()
    }
  },
  methods: {
    // 鼠标滚动切换banner
    changeCarousel () {
      this.$refs.carousel.next()
    }
  }
}
</script>

<style lang="scss" scoped>
.runstep{
  .head-box{
    position: relative;
    padding-top: 0.14rem;
    z-index: 3;
  }
  .banner{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    .el-carousel{
      height: 100%;
      overflow: hidden;
    }
    .banner-item{
      background-position: 50%;
      background-repeat: no-repeat;
      background-size: 110% 110%;
      background-color: #464646;
      .content{
        height: 100%;
        position: relative;
      }
      .page-box{
        width: 100%;
        height: 5rem;
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%,-50%);
        .picture{
          padding-top: 8%;
          text-align: right;
          img{
            width: 50%;
          }
        }
        .link-btn,.download{
          width: 50%;
          float: right;
          text-align: center;
          font-size: .16rem;
          a{
            display: inline-block;
            padding: .14rem .35rem;
            color: #000;
            background: #fff;
            border-radius: 100px;
            margin-right: .2rem;
            font-weight: 300;
          }
        }
        .link-btn{
          padding-top: 5%;
        }
        .product{
          width: 50%;
          float: left;
          vertical-align: top;
          img{
            width: 100%;
          }
        }
        .slogon{
          width: 50%;
          float: right;
          img{
            width: 100%;
          }
          .download{
            width: 100%;
            padding: 0;
            margin: 0;
            .android{
              background-color: #40b073;
              color: #fff;
            }
          }
        }
      }
    }
    .page1{
      background-image: url('~/assets/images/bg4.jpg');
    }
    .page2{
      background-image: url('~/assets/images/bg3.png');
    }
  }
  .copyright{
    font-size: 0.14rem;
    width: 100%;
    position: fixed;
    z-index: 3;
    bottom: .25rem;
    text-align: center;
    color: #333;
    a{
      text-decoration: none;
      color: #333;
    }
  }
}
</style>
