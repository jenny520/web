<template>
  <div class="title">
    <div class="line"></div>
    <div class="text">{{num}}{{linetext}}</div>
    <div class="line"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    props: {
      linetext: {
        type: String
      },
      num: {
        type: Number
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .title
    display: flex
    width: 80%
    height 30px
    align-items center
    margin: 28px auto 24px auto
    .line
      flex: 1
      height 1px
      background-color rgba(255,255,255,0.5)
    .text
      padding: 0 12px
      font-weight: 700
      font-size: 14px
</style>
