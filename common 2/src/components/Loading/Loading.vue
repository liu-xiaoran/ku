<style lang="scss">
@import "../../style/utils.scss";
// @include font-dpr(".Loading--message",12);
.Loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.Loading--main {
  padding: .2rem;
  border-radius: 5px;
  line-height: 0;
  text-align: center;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, .6)
}

.Loading--message {
  margin: 0;
  padding-top: .2rem;
  font-size: 16px;
  line-height: 1;
  color: #fff;
  @include font-dpr(12px);
}
</style>

<template>
<div class="Loading" v-show="visible" :style="{zIndex: zIndex}">
  <div class="Loading--main">
    <Spinner :size="size" bgcolor="#f5f5f5" forecolor="transparent"/>
    <p class="Loading--message" v-show="message">{{message}}</p>
  </div>
</div>
</template>

<script>
import { Spinner } from '../Spinner'

export default {
  data() {
    return {
      message: '',
      visible: false,
      zIndex: 7,
      size:lib.flexible.dpr*30
    }
  },

  components: {
    Spinner
  },

  methods: {
    show(message) {
      this.message = message
      this.visible = true
    },

    hide() {
      this.message = ''
      this.visible = false
      this.zIndex = 4
    }
  }
}
</script>
