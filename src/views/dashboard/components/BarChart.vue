<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
const animationDuration = 3000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '600px'
    },
    fanlist: {
      type: Object,
      default(rawProps) { }
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    },
    fanlist: 'initChart'
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
    console.log(this.fanlist)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 60,
          left: '3%',
          right: '8%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          name: '风机编号',
          data: this.fanlist.map(item => item.id),
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          name: '(近日预警次数/次)',
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '近日预警数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.fanlist.map(item => item.outliers),
          animationDuration
        }]
      })
    }
  }
}
</script>
