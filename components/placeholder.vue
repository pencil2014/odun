<template>
  <section class="placeholder">
    <slot v-if="$slots.default"></slot>
    <div v-else>
       <img v-if="src != 'none'" :src="src">
       <div class="placeholder-text ellipsis">
         <slot v-if="$slots.text" name="text"></slot>
         <p v-else>{{text}}</p>
       </div>
    </div>
  </section>
</template>

<script>
  import defaultImage from '~/assets/images/empty_default.png'
  export default {
    props: {
      src: {
        type: String,
        default: defaultImage
      },
      text: {
        type: String,
        default: '没有相关数据！'
      }
    }
  }
</script>

<style lang="scss" scoped>
    .placeholder{
      font-size: 0.14rem;
      text-align:center;
      margin:0.3rem 0;
      &-text{
        line-height: 1.4;
        padding-top: 0.1rem;
        margin-bottom: 0.15rem;
        color: #ccc;
      }
    }
</style>
