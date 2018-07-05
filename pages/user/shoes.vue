<template>
  <section class="shoes">
    <div class="title">我的鞋子</div>
    <div class="shoes-box">
      <div class="list" v-if="shoes">
        <div class="item">
          <div class="pic">
            <img :src="shoes.imageUrl" alt="">
          </div>
          <div class="info">
            <p class="name">{{shoes.name}}</p>
            <p class="sub">{{shoes.alias}}</p>
            <p class="time">激活：{{shoes.activeTime}}</p>
          </div>
          <div class="data">
            <p class="mileage">{{shoes.mileage}}公里</p>
            <p class="wear">磨损：{{shoes.wear}}</p>
          </div>
        </div>
      </div>
      <Placeholder v-else :src="iconUrl" text="您还没有绑定RunStep智能鞋" class="mt"/>
    </div>
  </section>
</template>

<script>
import api from '~/api/shoes'
import Placeholder from '~/components/placeholder'
import iconUrl from '~/assets/images/shoes.png'
export default {
  layout: 'user',
  components: {
    Placeholder
  },
  data () {
    return {
      iconUrl: '',
      shoes: ''
    }
  },
  methods: {
    // 获取鞋子信息
    getShoes () {
      api.getShoes({}).then((res) => {
        if (res.data.code === 200) {
          this.shoes = res.data.data.list[0] || ''
        }
      }).catch(() => {})
    }
  },
  mounted () {
    this.iconUrl = iconUrl
    this.getShoes()
  }
}
</script>

<style lang="scss" scoped>
.shoes{
  min-height: 8rem;
  font-size: 0.14rem;
  .title{
    color: #787878;
    letter-spacing: 1.4px;
    padding-bottom: .18rem;
    border-bottom: 1px solid #dcdcdc;
  }
  .shoes-box{
    .mt{
      margin-top: 2rem;
    }
    .list{
      .item{
        border-bottom: 1px solid #ddd;
        overflow: hidden;
      }
      .pic,.info,.data{
        float: left;
      }
      .pic{
        width: 20%;
        img{
          max-height: 2rem;
          max-width: 2rem;
        }
      }
      .info{
        width: 60%;
        padding-top: 0.6rem;
        padding-left: 1rem;
        font-weight: 300;
        .name{
          font-size: 0.2rem;
          padding-bottom: 0.1rem;
        }
        .sub,.time{
          font-size: .14rem;
          color: #939393;
          padding-bottom: 0.1rem;
        }
      }
      .data{
        width: 20%;
        padding-top: 0.7rem;
        font-weight: 300;
        p{
          font-size: .18rem;
          color: #1f1f1f;
          padding-bottom: 0.1rem;
        }
      }
    }
    
  }
}
</style>
