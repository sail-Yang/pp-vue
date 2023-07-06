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
    if (sessionStorage.getItem('periodXdata') !== null) {
      this.xdata = JSON.parse(sessionStorage.getItem('periodXdata'))
    } else {
      predictByRealTime(this.$store.getters.username, 1, this.$store.getters.model).then(
        response => {
          sessionStorage.setItem('periodXdata', JSON.stringify(response.data))
          this.xdata = JSON.parse(sessionStorage.getItem('periodXdata'))
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
          text: '自定义功率预测 · ' + this.fanid + '号风机',
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
          data: ['预测功率(YD15)', '实际功率(PREPOWER)', '预测功率(备选,ROUND(A.POWER,0))'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }, selected: {
            '预测功率(备选,ROUND(A.POWER,0))': false,
            '实际功率(PREPOWER)': false
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
          name: '时间',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#bdb7ac'
            },
            onZero: false
          },
          data: this.xdata.fanDataList.map(item => chartTimeFormat(item.datatime).replace(' ', '\n'))
        }],
        yAxis: [{
          type: 'value',
          name: '(功率/KW)',
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
                color: 'rgba(155, 179, 250, 0.5)'
              }, {
                offset: 0.8,
                color: 'rgba(155, 179, 250, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(155, 179, 250)',
              borderColor: 'rgba(155, 179, 250,0.2)',
              borderWidth: 12

            }
          },
          data: this.xdata.fanDataList.map(item => item.yd15)
        }, {
          name: '预测功率(备选,ROUND(A.POWER,0))',
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
                color: 'rgba(157, 250, 155, 0.5)'
              }, {
                offset: 0.8,
                color: 'rgba(157, 250, 155, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(157, 250, 155)',
              borderColor: 'rgba(157, 250, 155,0.27)',
              borderWidth: 12

            }
          },
          data: this.xdata.fanDataList.map(item => item.power)
        }, {
          name: '实际功率(PREPOWER)',
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
                color: 'rgba(250, 193, 239, 0.5)'
              }, {
                offset: 0.8,
                color: 'rgba(250, 193, 239, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(250, 193, 239)',
              borderColor: 'rgba(250, 193, 239,0.2)',
              borderWidth: 12
            }
          },
          data: this.xdata.fanDataList.map(item => item.prePower)
        }]
      })
      this.loading = false
    }
  }
}
</script>
