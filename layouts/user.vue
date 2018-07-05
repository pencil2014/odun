<template>
  <div class="user">
    <div class="user-header">
      <Header active="0"/>
    </div>
    <div class="user-box content">
      <div class="user-left">
        <Menu />
      </div>
      <div class="user-cnt">
        <nuxt/>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Header from '~/components/header.vue'
import Footer from '~/components/footer.vue'
import Menu from '~/components/usernav.vue'
export default {
  head () {
    return {
      title: '用户中心',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'RunStep,智能跑鞋,跑步,跑团' },
        { hid: 'description', name: 'description', content: 'RunStep官方网站,一站式专业跑团,坚持跑步鞋子免费拿' }
      ]
    }
  },
  components: {
    Header,
    Footer,
    Menu
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
@import "../assets/styles/common.css";
.user{
  background-color: #fafafa;
  .user-header{
    padding: .14rem 0 .75rem;
    background: #30c17b;
    .header a.red {
      color: #000!important;
    }
  }
  .user-box{
    font-size: 0.18rem;
    padding-top: 0;
    .user-left{
      width: 25%;
      float: left;
      padding: 0.2rem;
    }
    .user-cnt{
      padding: 0.3rem;
      position: relative;
      margin-left: 26%;
      margin-top: -0.3rem;
      background-color: #fff;
      min-height: 8rem;
    }
  }
}


</style>



