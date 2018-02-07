<style lang="scss">
.Modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

/*********** 1px border Start  ***********/

.zy-border-top {
  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 1px;
    border-top: 1px solid #c8c7cc;
    transform: scaleY(0.5);
    transform-origin: left top;
  }
}

.zy-border-bottom {
  &:after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    border-bottom: 1px solid #c8c7cc;
    transform: scaleY(0.5);
    transform-origin: left bottom;
  }
}

/*********** 1px border End  ***********/


/*********** Animation Start ***********/

// zy-anim--fade
.zy-anim--fade-enter-active,
.zy-anim--fade-leave-active {
  transition: opacity .3s
}

.zy-anim--fade-enter,
.zy-anim--fade-leave-active {
  opacity: 0
}

// zy-anim--topDown
.zy-anim--topDown-enter-active,
.zy-anim--topDown-leave-active {
  transition: transform .3s
}

.zy-anim--topDown-enter,
.zy-anim--topDown-leave-active {
  transform: translateY(-100%);
}

// zy-anim--bottomUp
.zy-anim--bottomUp-enter-active,
.zy-anim--bottomUp-leave-active {
  transition: transform .3s
}

.zy-anim--bottomUp-enter,
.zy-anim--bottomUp-leave-active {
  transform: translateY(100%);
}

// zy-anim--scale
.zy-anim--scale-enter-active,
.zy-anim--scale-leave-active {
  transition: transform .3s
}

.zy-anim--scale-enter,
.zy-anim--scale-leave-active {
  transform: scale(1.1);
}

/*********** Animation End ***********/
</style>

<template>
<transition :name="animName">
  <div
    ref="modal"
    class="Modal"
    :style="{'backgroundColor': bgcolor, zIndex: zIndex}"
    v-show="visible"
    @click="hanldeClick"
  >
    <slot></slot>
  </div>
</transition>
</template>

<script>

export default {
  name: 'Modal',

  props: {
    value: {
      type: Boolean
    },
    // 背景色
    bgcolor: {
      type: String,
      default: '#fff'
    },
    // css z-index
    zIndex: {
      type: [String, Number],
      default: 2
    },
    // 显示出来时的动画方式
    anim: {
      validator: v => {
        const names = ['none', 'bottomUp', 'fade']
        return names.indexOf(v) > -1
      },
      default: 'none'
    },
    // 点击时隐藏
    dismissOnClick: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      visible: false
    }
  },

  computed: {
    animName() {
      const name = this.anim
      if (name === 'none') {
        return ''
      }
      else {
        return `zy-anim--${name}`
      }
    }
  },

  watch: {
    value(newVal) {
      this.visible = newVal
    }
  },

  methods: {
    hanldeClick(e) {
      if (e.target === this.$refs.modal && this.dismissOnClick) {
        this.$emit('input', false)
      }
    }
  }
}
</script>
