<template>
	<canvas :id="canvasId" :width="width" :height="height"></canvas>
</template>

<script>
	export default {
		name: 'ring',
		props: {
		  canvasId: {
		    type: String,
		    default: ''
		  },
		  width: {
		    type: [String, Number],
		    default: ''
		  },
		  height: {
		    type: [String, Number],
		    default: ''
		  },
		  type: {
		    type: String,
		    default: 'ring' // 圆环ring 柱状图bar 折线图 line 饼状pie
		  },
		  data: { // 存放图表数据
		    type: Array,
		    default: []
		  },
		  options: {
		    type: Object,
		    required: false
		  }
		},  
		data() {
			return {
			  canvas: '',
			  ctx: '',
			  totalValue: ''
			}
		},
		mounted () { 
		  this.sChart(this.canvasId, this.type, this.data, this.options)
		},
		methods: {
			sChart (canvas, type, data, options) {
			  this.canvas = document.getElementById(canvas)
			  this.ctx = this.canvas.getContext('2d')
			  this.type = type
			  this.data = data // 存放图表数据
			  this.dataLength = this.data.length // 图表数据的长度
			  this.totalValue = this.getTotalValue() // 获取饼图数据总和
			  this.init(options)
			},
			init: function (options) {
			  if (this.dataLength === 0) {
			    return false
			  }
			  if (options) {
			    for (var key in options) {
			      if (key === 'colorList' && Array.isArray(options[key])) {
			        this[key] = options[key].concat(this[key])
			      } else {
			        this[key] = options[key]
			      }
			    }
			  }
			  this.radius*=lib.flexible.dpr
			  this.innerRadius*=lib.flexible.dpr
			  this.drawPieUpdate()

			},
			drawPieUpdate: function () {
				this.ctx.scale(1/lib.flexible.dpr,1/lib.flexible.dpr);
		        this.ctx.fillStyle = this.bgColor
		        this.ctx.fillRect(0, 0, this.width*lib.flexible.dpr, this.height*lib.flexible.dpr)
		        this.drawPieChart()
		      },
		    drawPieChart: function () {
		        let x = this.width*lib.flexible.dpr / 2
		        let y = this.height*lib.flexible.dpr / 2
		        for (var i = 0; i < this.dataLength; i++) {
		          this.ctx.beginPath()
		          this.ctx.fillStyle = this.colorList[i]
		          this.ctx.moveTo(x, y)
		          this.data[i].start = i === 0 ? -Math.PI / 2 : this.data[i - 1].end
		          this.data[i].end = this.data[i].start + this.data[i].value / this.totalValue * 2 * Math.PI
		          // 绘制扇形
		          this.ctx.arc(x, y, this.radius, this.data[i].start, this.data[i].end)
		          this.ctx.closePath()
		          this.ctx.fill()

		          this.data[i].middle = (this.data[i].start + this.data[i].end) / 2
		          this.ctx.strokeStyle = this.colorList[i]

		        }
		        // 如果类型是环形图，绘制一个内圆
		        if (this.type === 'ring') {
		          this.ctx.beginPath()
		          this.ctx.fillStyle = this.bgColor
		          this.ctx.arc(x, y, this.innerRadius, 0, Math.PI * 2)

		          this.ctx.fill()
		        }
		      },  
		    /**
			 * 获取饼状或环形图的数据总和
			 * @return {Number} total
			 */
			getTotalValue () {
			  var total = 0
			  for (var i = 0; i < this.dataLength; i++) {
			    total += this.data[i].value
			  }
			  return total
			}  
		}
	}
</script>

<style lang="less" scoped>
	
</style>