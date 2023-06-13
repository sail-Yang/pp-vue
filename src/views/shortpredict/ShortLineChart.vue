<template>
  <div v-loading="loading" element-loading-text="拼命加载中" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/components/Charts/mixins/resize'
import { predictByRealTime } from '@/api/fandata'
import { chartTimeFormat } from '@/utils'
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
    },
    xdata: {
      type: Object,
      default(rawProps) { }
    },
    fanid: {
      type: Number,
      default: 1
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
    },
    xdata: 'initChart'
  },
  mounted() {
    this.loading = true
    this.$nextTick(() => {
      if (sessionStorage.getItem('periodXdata') !== null) {
        this.xdata = JSON.parse(sessionStorage.getItem('periodXdata'))
      } else {
        predictByRealTime(this.fanid).then(
          response => {
            this.xdata = response.data
          }
        ).catch(() => {
          this.$message({
            message: '服务器错误',
            type: 'failure'
          })
          this.loading = false
        })
      }
      this.initChart()
      this.loading = false
    })
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
        title: {
          top: 50,
          text: '功率预测 · ' + this.fanid + '号风机',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 18,
            color: '#0a4494'
          },
          left: '5%'
        },
        xAxis: {
          type: 'category',
          data: this.xdata.fanDataList.map(item => chartTimeFormat(item.datatime)),
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '2%',
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
          data: ['实际功率(POWER)', '预测功率(YD15)', '预测功率(备选,PREPOWER)'],
          right: '4%'
        },
        series: [{
          name: '实际功率(POWER)', itemStyle: {
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
          data: this.xdata.fanDataList.map(item => item.power),
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '预测功率(YD15)',
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
          data: this.xdata.fanDataList.map(item => item.yd15),
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: '预测功率(备选,PREPOWER)',
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
          data: this.xdata.fanDataList.map(item => item.prePower),
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }
        ]
      })
    }
  }
}
</script>
