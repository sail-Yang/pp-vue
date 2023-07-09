<template>
  <div v-loading="loading" element-loading-text="拼命加载中" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      loading: false
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.loading = true
    this.$nextTick(() => {
      this.initChart()
    })
    this.loading = false
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
      this.loading = false
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        xAxis: {
          data: ['08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 65,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: [{
          type: 'value',
          name: '(KW)',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#bdb7ac'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          }
        }],
        legend: {
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          top: 30,
          icon: 'rect',
          data: ['实时功率(POWER)', '预测功率1(YD15)', '预测功率2(PREPOWER)'],
          right: '4%'
        },
        series: [{
          name: '实时功率(POWER)', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: [11177, 9388, 7888, 4556, 3850, 4000, 3206, 3636, 4825, 5110, 9316, 8400, 11177, 9388, 7888, 4556, 3850, 4000, 3206, 3636, 4825, 5110, 9316, 8400, 11177, 9388, 7888, 4556, 3850, 4000, 3206, 3636, 4825, 5110, 9316, 8400, 11177, 9388, 7888, 4556, 3850, 4000, 3206, 3636, 4825, 5110, 9316, 8400, 11177, 9388, 7888, 4556, 3850, 4000, 3206, 3636, 4825, 5110, 9316, 8400, 11177, 9388, 7888, 4556, 3850, 4000, 3206, 3636, 4825, 5110, 9316, 8400],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '预测功率1(YD15)',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: [10707, 9502, 7886, 4431, 3529, 3452, 3328, 3804, 4248, 4835, 8462, 8169, 10707, 9502, 7886, 4431, 3529, 3452, 3328, 3804, 4248, 4835, 8462, 8169, 10707, 9502, 7886, 4431, 3529, 3452, 3328, 3804, 4248, 4835, 8462, 8169, 10707, 9502, 7886, 4431, 3529, 3452, 3328, 3804, 4248, 4835, 8462, 8169, 10707, 9502, 7886, 4431, 3529, 3452, 3328, 3804, 4248, 4835, 8462, 8169],
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: '预测功率2(PREPOWER)',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: [22469, 22336, 22262, 21920, 21339, 20759, 20178, 19648, 19167, 18687, 4825, 4543, 22469, 22336, 22262, 21920, 21339, 20759, 20178, 19648, 19167, 18687, 4825, 4543, 22469, 22336, 22262, 21920, 21339, 20759, 20178, 19648, 19167, 18687, 4825, 4543, 22469, 22336, 22262, 21920, 21339, 20759, 20178, 19648, 19167, 18687, 4825, 4543, 22469, 22336, 22262, 21920, 21339, 20759, 20178, 19648, 19167, 18687, 4825, 4543],
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }
        ]
      })
    }
  }
}
</script>
