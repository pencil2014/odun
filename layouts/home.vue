<template>
  <div>
    <nuxt/>
    <Footer/>
  </div>
</template>

<script>
import Footer from '~/components/footer.vue'
export default {
  components: {
    Footer
  }
}
</script>

<style lang="scss">
@import "../assets/styles/common.css";
</style>

