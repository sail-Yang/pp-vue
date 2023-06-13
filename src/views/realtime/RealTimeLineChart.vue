<template>
  <div :id="id" v-loading="loading" element-loading-text="拼命加载中" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
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
    if (sessionStorage.getItem('realXdata') !== null) {
      this.xdata = JSON.parse(sessionStorage.getItem('realXdata'))
    } else {
      predictByRealTime(1).then(
        response => {
          sessionStorage.setItem('realXdata', JSON.stringify(response.data))
          this.xdata = JSON.parse(sessionStorage.getItem('realXdata'))
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
          text: '实时功率预测 · ' + this.fanid + '号风机',
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
          data: ['实际功率(POWER)', '预测功率(YD15)', '预测功率(备选,PREPOWER)'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#bdb7ac'
            }
          },
          data: this.xdata.fanDataList.map(item => chartTimeFormat(item.datatime))
        }],
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
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: '预测功率(YD15)',
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
                color: 'rgba(0, 136, 212, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 136, 212, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)',
              borderColor: 'rgba(0,136,212,0.2)',
              borderWidth: 12

            }
          },
          data: this.xdata.fanDataList.map(item => item.yd15)
        }, {
          name: '预测功率(备选,PREPOWER)',
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
                color: 'rgba(219, 50, 51, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(219, 50, 51, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(219,50,51)',
              borderColor: 'rgba(219,50,51,0.2)',
              borderWidth: 12
            }
          },
          data: this.xdata.fanDataList.map(item => item.prePower)
        }, {
          name: '实际功率(POWER)',
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
                color: 'rgba(137, 189, 27, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(137, 189, 27, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(137,189,27)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12

            }
          },
          data: this.xdata.fanDataList.map(item => item.power)
        }]
      })
      this.loading = false
    }
  }
}
</script>
