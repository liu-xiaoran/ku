<template>
  <div>
    <p>我们采用阿里手淘移动端自适应方案，详见<a target="_blank" href="https://github.com/amfe/lib-flexible">git地址</a></p><br>
    <p>字体不采用rem，对此我们用scss写了一个函数，简化代码，例子如下：</p>
    <div class="fontdpr">测试</div>
    <div class="fontdpr2">测试2</div>
  </div>
</template>


<style lang="scss">
  @import "../../style/utils.scss";
  .fontdpr{
  	@include font-dpr(10px);
  }
  .fontdpr2{
  	@include font-dpr(20px);
  }
</style>