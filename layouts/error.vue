<template>
  <div class="error">
    <div class="user-header">
      <Header active="6"/>
    </div>
    <div class="error-box">
      <div class="content">
      </div>
    </div>
    
  </div>
</template>

<script>
import Header from '~/components/header.vue'
export default {
  props: ['error'],
  layout: 'home',
  components: {
    Header
  }
}
</script>

<style lang="scss" scoped>
.error{
  background-color: #fafafa;
  .user-header{
    padding-top: 0.14rem;
  }
  .error-box{
    background-color: #fff;
    margin: 0.2rem 0;
    .content{
      min-height: 6rem;
      background: #fff url('~/assets/images/404.jpg') center no-repeat;
    }
  }
}
</style>

