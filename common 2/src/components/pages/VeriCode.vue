<template>
  <div>
    <p>防浏览器刷新</p>
    <timer-btn :second="second" type="primary" @click="send" ref="btn"></timer-btn>
    <button class="button" @click="stop" >stop</button>
  </div>
</template>
<script>
import TimerBtn from '../TimerBtn'
// import { Toast } from 'mint-ui'
export default {
  name: 'vericode',
  data(){
    return {
      second:120
    }
  },
  components: {
    TimerBtn
  },
  methods: {
    send: function () {
      // Toast('ok');
      setTimeout(this.sended, 500);//调用api
    },
    sended() {
      this.$refs.btn.run();
    },
    stop(){
      this.$refs.btn.stop();
    }
  }
}
</script>

<style>
  .button{
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 4px;
    border: 0;
    box-sizing: border-box;
    color: inherit;
    display: block;
    font-size: 18px;
    height: 41px;
    outline: 0;
    overflow: hidden;
    position: relative;
    text-align: center;
    display: inline-block;
    padding: 0 12px;
    background-color:#25A2F8;color: #fff;
  }
  .button::after {
    background-color: #000;
    content: " ";
    opacity: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute
  }
  .button:not(.is-disabled):active::after {
      opacity: .4
  }
  .button.is-disabled {
      opacity: .6
  }
</style>
