<template>
  <div>
    <button class="button" @click="toast" >Toast</button>
    <button class="button" @click="open('fade')" >modal</button>
    <button class="button" @click="indicator" >Indicator</button>
    <Modal v-model="visible" :anim="animName" bgcolor="rgba(0, 0, 0, .4)" zIndex="10">
      <div style="display: flex; align-items: center; height: 100%; justify-content: center;">
        <div style="background-color: #fff; padding: 20px 50px;" @click="close">Close Modal</div>
      </div>
    </Modal>
    <button class="button" @click="alert" >alert</button>
    <button class="button" @click="confirm" >confirm</button>
    <button class="button" @click="prompt" >prompt</button>
  </div>
</template>
<script>
import Toast from '../Toast';

import Loading from '../Loading';
import Modal from '../Modal/Modal';
import Dialog from '../Dialog/';
export default {
  name: 'other',
  data(){
    return {
      second:120,
      visible: false,
      animName: 'none'
    }
  },
  components: {
    Loading,
    Modal
  },
  methods: {
    toast: function () {
      Toast.show("测试","top",2000);
    },
    messageBox() {
      MessageBox('提示', '操作成功');
    },
    open(animName) {
      this.animName = animName
      this.visible = true
    },
    close() {
      this.visible = false
    },
    indicator(){
      Loading.show("加载中...");
      setTimeout(()=>{
        Loading.hide()
      },3000)
    },
    alert() {
      Dialog.alert('提示', '掌悦理财是最好的理财平台', [
        {
          title: '取消',
          onClick() {}
        },
        {
          title: '确认',
          onClick() {}
        }
      ])
    },
    confirm() {
      Dialog.confirm('提示', '真的要酱紫嘛😯', result => {
        alert(result)
      })
    },
    prompt() {
      Dialog.prompt('你最喜欢的英雄是谁？', result => {
        alert(result)
      })
    }
  }
}
</script>

<style lang="scss">
  @import "../../style/utils.scss";
  .button{
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: .1rem;
    border: 0;
    box-sizing: border-box;
    color: inherit;
    display: block;
    height: .7rem;
    outline: 0;
    overflow: hidden;
    position: relative;
    text-align: center;
    display: inline-block;
    padding: 0 .2rem;
    background-color:#25A2F8;color: #fff;
    @include font-dpr(14px);
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
