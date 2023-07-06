<template>
  <div :id="id" v-loading="loading" element-loading-text="拼命加载中" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
import { getWeatherByRealTime } from '@/api/fandata'
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
    xdata: 'initChart'
  },
  mounted() {
    this.loading = true
    if (sessionStorage.getItem('pressureXdata') !== null) {
      this.xdata = JSON.parse(sessionStorage.getItem('pressureXdata'))
    } else {
      getWeatherByRealTime(1).then(
        response => {
          sessionStorage.setItem('pressureXdata', JSON.stringify(response.data))
          this.xdata = JSON.parse(sessionStorage.getItem('pressureXdata'))
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
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        backgroundColor: '#333b4a',
        title: {
          top: 20,
          text: '压力 · ' + this.fanid + '号风机',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 18,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 30,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['压力(pressure)'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '4%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          name: '时间',
          axisLine: {
            lineStyle: {
              color: '#bdb7ac'
            }
          },
          data: this.xdata.fanDataList.map(item => chartTimeFormat(item.datatime).replace(' ', '\n'))
        }],
        yAxis: [{
          type: 'value',
          name: '(压力/Pa)',
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
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: '压力(pressure)',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(175, 198, 148, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(175, 198, 148, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(175, 198, 148)',
              borderColor: 'rgba(175, 198, 148,0.2)',
              borderWidth: 12
            }
          },
          data: this.xdata.fanDataList.map(item => item.pressure)
        }]
      })
      this.loading = false
    }
  }
}
</script>
