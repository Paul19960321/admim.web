<template>
    <div class="site-wrapper site-page">
      <div class="site-content__wrapper">
        <div class="site-top">
          <div class="wrap">
            <img :src="`${SITE_CONFIG.version}/static/img/logo.png`" width="100" height="40" alt="">
            <a href="http://www.winksign.com">
              <i class="el-icon-user-solid"></i>
              关于我们
            </a>
          </div>
        </div>
        <div class="site-content">
          <slot></slot>
          <div class="site-buttom">
            <div class="wrap">
              Copyright © 2019-2020 麦昇科技（深圳）有限公司【粤ICP备19057216号】
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    computed: {
      SITE_CONFIG: () => window.SITE_CONFIG
    }
  }
</script>

<style lang="scss">
    .site-wrapper.site-page {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(38, 50, 56, .6);
      overflow: hidden;
      &:before {
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        content: "";
        background-image: url(~@/assets/img/login_bg.jpg);
        background-size: cover;
      }
      .site-top {
        width: 100%;
        height: 54px;
        background-color: rgba(38, 50, 56, .1);
        border-bottom: 1px solid hsla(0,0%,100%,.14);
        .wrap {
          height: 100%;
          margin: 0 auto;
          font-size: 15px;
          width: 1100px;
          > img {
            margin-top: 7px;
          }
          > a {
            color: #fff;
            float: right;
            line-height: 54px;
          }
        }
      }
      .site-content__wrapper {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        padding: 0;
        margin: 0;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: transparent;
      }
      .site-content {
        height: calc(100% - 55px);
        width: 1100px;
        margin: 0 auto;
        position: relative;
      }
      .site-buttom {
        position: absolute;
        bottom: 0;
        color: #fff;
        height: 30px;
        text-align: center;
        width: 100%;
      }
    }
</style>
  