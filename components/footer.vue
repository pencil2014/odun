<template>
  <footer class="footer">
    <div class="content">
      <p class="description">
        深圳市欧盾智能科技有限公司，是一家专注从事智能穿戴设备方案的创新型科技公司，公司顺应智能硬件发展潮流，强调科技创新，力求在智能穿戴重点领域，运动，健康，体育竞技方面，实现自主品牌的研发和推广，目前已合作的品牌商包括361°，特步，贵人鸟，乔丹，提供的产品市场反映良好。软件研发团队有27人，硬件研发团队有12人。
      </p>
      <div class="map">
        <div class="map-item">
          <h3 class="title">网页导航</h3>
          <ul class="link">
            <li><nuxt-link to="/">首页</nuxt-link></li>
            <li><nuxt-link to="/views/goods">产品</nuxt-link></li>
            <li><nuxt-link to="/views/run">契约跑</nuxt-link></li>
            <li><nuxt-link to="/views/activity">跑团/活动</nuxt-link></li>
            <li><nuxt-link to="/views/about">关于我们</nuxt-link></li>
          </ul>
        </div>
        <div class="map-item">
          <h3 class="title">联系</h3>
          <p class="concat">Email: tom@odun.com</p>
          <p class="concat">Contact: TOM YUAN</p>
          <p class="concat">Call: (0086)+13922934293</p>
        </div>
        <div class="map-item">
          <h3 class="title">关于</h3>
          <p class="about">深圳欧盾智能科技有限公司</p>
          <p class="about">地址：深圳市南山区讯美科技 广场二栋1006</p>
        </div>
        <div class="map-item">
          <h3 class="title">语言</h3>
          <p class="lang"> <a href="http://www.odun.com" target="_blank"></a> 中文</p>
        </div>
      </div>
      <div class="copyright">
        Copyright (c) 2004-{{year}} Odun enterprise website <a href="http://www.miitbeian.gov.cn" target="_blank">GuangDong ICP No. 14001512-2 All Rights Reserved</a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    // 获取当前年份
    year () {
      return new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/var.scss";
.footer{
  text-align: left;
  padding: 0.4rem 0;
  color: $color-black;
  line-height: 1.4;
  background: $backgoundcolor;
  font-size: 0.12rem;
  .description {
    padding: 0 0.15rem 0.3rem;
    border-bottom: 0.01rem solid $border-color;
  }
  .map{
    padding: 0.2rem 0 0.4rem;
    border-bottom: 0.01rem solid $border-color;
    overflow: hidden;
    .map-item{
      width: 20%;
      float: left;
      padding: 0 0.15rem;
      .title{
        font-size: 0.14rem;
        margin-bottom: 0.1rem;
        font-weight: normal;
      }
      .link{
        line-height: 1.5;
        a{
          color: $color-black;
          &:hover{
            text-decoration: underline;
          }
        }
      }
      .concat, .about, .lang{
        line-height: 1.5;
      }
    }
  }
  .copyright{
    padding: 0.2rem 0.15rem 0;
    a{
      color: $color-link;
      &:hover{
        color: $color-link-hover;
        text-decoration: underline;
      }
    }
  }
}
</style>
