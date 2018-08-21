<style lang="scss">
.CheckboxOptionBox:first-child {
  .Cell:before {
    border-top: none !important;
  }
}

.CheckboxOptionBox {
  .Cell:before {
    border-top: 1px solid #e5e5e5 !important;
  }
}

.CheckboxOption {
  display: flex;
  height: 17px;
  align-items: center;
}

.CheckboxOption--name {
  margin-left: 10px;
  line-height: 17px;
  color: #333;
}

.CheckboxOption--icon {
  float: left;
  position: relative;
  width: 0.32rem;
  height: 0.32rem;
  border: 0.026667rem solid #555;
  border-radius: 0.04rem;
  box-sizing: border-box;
  transition: all .2s;
  &:after {
    content: ' ';
    position: absolute;
    left: 0.066667rem;
    top: -0.013333rem;
    display: block;
    width: 0.133333rem;
    height: 0.213333rem;
    border: 0.026667rem solid #f0f0f0;
    border-top: 0;
    border-left: 0;
    box-sizing: border-box;
    transform: rotate(45deg) scale(0.5);
    transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
  }
}

.CheckboxOption--icon.checked {
  &:after {
    border-color: #000;
    transform: rotate(45deg) scale(1);
  }
}
</style>

<template>
<div @click="handleClick" class="CheckboxOptionBox">
  <div slot="header" class="CheckboxOption">
    <div class="CheckboxOption--icon" :class="{'checked': checked}"></div>
    <span class="CheckboxOption--name">
      <slot></slot>
    </span>
  </div>
</div>
</template>

<script>

export default {
  name: 'CheckboxOption',

  props: ["value"],

  data() {
    return {
      checked: false
    }
  },

  

  methods: {
    handleClick() {
      this.checked = !this.checked
      this.$emit('click', this.checked)
    }
  },
  mounted(){
    if(this.value)
    this.checked=true
  }
}
</script>
