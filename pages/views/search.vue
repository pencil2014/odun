<template>
  <section class="search">
    <div class="header">
      <Header active="6"/>
    </div>
    <div class="search-cnt">
      <div class="content">
        <div class="search-box">
          <input type="text" class="serialid" name="serialid" v-model="keywords" placeholder="输入鞋子或芯片序列号">
          <i class="iconfont search-clear" @click="clear" v-show="keywords">&#xe604;</i>
          <i class="iconfont search-btn" @click.enter="search">&#xe633;</i>
        </div>
        <div class="search-result">
          <p class="result">搜素结果： {{shoes.deviceSn}}</p>
          <div class="info" v-if="shoes">
            <div class="picture">
              <img :src="shoes.imageUrl" alt="">
            </div>
            <div class="description">
              <h3>基本信息</h3>
              <div class="base">
                <p class="name">{{shoes.name}}</p>
                <span>颜色：{{shoes.color}}</span>
                <span>尺码：{{shoes.size}}码</span>
                <span>鞋子序列号：{{shoes.shoesSn}}</span>
                <span>硬件序列号：{{shoes.shoesSn}}</span>
              </div>
              <h3>使用信息</h3>
              <div class="use">
                <p>第一次被绑定时间：{{shoes.firstBindingTime}}</p>
                <p>已被使用累计时长：{{shoes.useDays}}天</p>
                <p>已累计使用公里数：{{shoes.totalMileage}}公里</p>
              </div>
            </div>
          </div>
          <div class="noresult" v-else>
            <p class="pic"><img src="~/assets/images/noresult.png" alt="">抱歉，没有找到你想要的!</p>
            <p>你查找的产品有可能不能是正品，或者渠道来源不明，如有疑问请致电：0755-86532478</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from '~/api/search'
import Header from '~/components/header.vue'
export default {
   head () {
    return {
      title: '产品搜索',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'RunStep,智能跑鞋,跑步,跑团' },
        { hid: 'description', name: 'description', content: 'RunStep官方网站,一站式专业跑团,坚持跑步鞋子免费拿' }
      ]
    }
  },
  layout: 'home',
  components: {
    Header
  },
  data () {
    return {
      keywords: '', // 搜索关键词
      shoes: '' // 商品信息
    }
  },
  methods: {
    // 清除搜索框
    clear () {
      this.keywords = ''
    },
    // 搜索商品
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
      api.search({sn: this.keywords}).then((res) => {
        if (res.data.code === 200) {
          this.shoes = res.data.data
        } else {
          this.shoes = ''
        }
      }).catch(() => {
        this.$message({
          showClose: true,
          message: '查询商品失败',
          type: 'warning',
          center: true
        })
      })
    }
  },
  mounted () {
    let keywords = this.$route.query.keywords
    if(!!keywords) {
      this.keywords = keywords
      this.search()
    }
  }
}
</script>

<style lang="scss" scoped>
.search{
  background-color: #f1f1f1;
  font-size: 0.24rem;
  .search-box{
    text-align: center;
    position: relative;
    margin: 0.6rem auto 0.5rem auto;
    width: 60%;
    border: 2px solid #ccc;
    border-radius: 0.5rem;
    vertical-align: middle;
    .serialid{
      width: 80%;
      height: 0.6rem;
      line-height: 0.6rem;
      text-align: center;
      background-color: #f1f1f1;
      outline: none;
      vertical-align: middle;
    }
    i{
      font-size: 0.3rem;
      color: #ccc;
      cursor: pointer;
      position: absolute;
      top: 0.15rem;
    }
    .search-clear{
      right: 0.55rem;
    }
    .search-btn{
      right: 0.15rem;
    }
  }
  .search-result{
    font-weight: 300;
    color: #333;
    font-size: 0.16rem;
    .result{
      margin-top: .75rem;
      padding-bottom: .25rem;
    }
    .info{
      background-color: #fff;
      padding: 0.5rem;
      line-height: 1.4;
      overflow: hidden;
      margin-bottom: 1rem;
      .picture{
        width: 3.6rem;
        height: 3.6rem;
        line-height: 3.6rem;
        text-align: center;
        background: #f1f1f1;
        overflow: hidden;
        vertical-align: middle;
        float: left;
        img{
          vertical-align: middle;
          max-height: 3.6rem;
        }
      }
      .description{
        margin-left: 4rem;
        h3{
          margin-bottom: 0.1rem;
        }
        .base{
          margin-bottom: 0.1rem;
          overflow: hidden;
          .name{
            margin-bottom: 0.2rem;
          }
          span{
            width: 50%;
            float: left;
            margin-bottom: 0.2rem;
          }
        }
        .use{
          p{
            margin-bottom: 0.2rem;
          }
        }
      }
    }
    .noresult{
      background-color: #fff;
      padding: 0.5rem;
      line-height: 1.4;
      overflow: hidden;
      margin-bottom: 1rem;
      text-align: center;
      height: 4.6rem;
      .pic{
        padding-top: 1rem;
      }
      p{
        vertical-align: middle;
        margin-bottom: 0.2rem;
        img{
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
