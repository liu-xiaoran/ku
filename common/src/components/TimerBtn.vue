<template>
    <button style="" @click="handleClick"
            :class="['button',{
              'is-disabled': disabled || time > 0
            }]"
            :disabled="disabled || time > 0">
        {{ text }}
    </button>
</template>
<script>
  export default {
    components: {},
    name: 'TimerBtn',
    componentName: 'TimerBtn',
    props: {
      second: {
        type: Number,
        default: 60
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      var time = sessionStorage.getItem('time') ? sessionStorage.getItem('time') : 0;
      if (time > 0) {
        this.run();
      }
      return {
        time: time
      }
    },
    methods: {
      run: function () {
        this.time = this.second;
        sessionStorage.setItem('time', this.time);
        this.timer()
      },
      timer: function () {
        if (this.time > 0) {
          this.time--;
          sessionStorage.setItem('time', this.time);
          setTimeout(this.timer, 1000);
        }
      },
      handleClick: function(evt) {
        this.$emit('click', evt);
      },
      stop:function(){
        this.time = 0;
        sessionStorage.setItem('time', this.time);
      }
    },
    computed: {
      text: function () {
        return this.time > 0 ? this.time + 's 后重新获取' : '获取验证码';
      }
    },
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