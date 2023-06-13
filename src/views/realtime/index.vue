<template>
  <div>
    <el-row>
      <el-form v-loading="loading" element-loading-text="拼命加载中" :model="form" label-width="80px" :inline="true">
        <el-form-item label="时间段">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="起始日期"
            :picker-options="pickerOptions"
          />
          <el-time-select
            v-model="form.startTime"
            placeholder="起始时间"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:45'
            }"
          />
          --
          <el-date-picker
            v-model="form.endDate"
            type="date"
            placeholder="结束日期"
            :picker-options="pickerOptions"
          />
          <el-time-select
            v-model="form.endTime"
            :picker-options="{
              start: '00:30',
              step: '00:15',
              end: '23:45',
              minTime: startTime
            }"
            placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="风机">
          <el-select v-model="form.fan" placeholder="请选择风机的编号">
            <el-option label="1号风机" value="1" />
            <el-option label="2号风机" value="2" />
            <el-option label="3号风机" value="3" />
            <el-option label="4号风机" value="4" />
            <el-option label="5号风机" value="5" />
            <el-option label="6号风机" value="6" />
            <el-option label="7号风机" value="7" />
            <el-option label="8号风机" value="8" />
            <el-option label="9号风机" value="9" />
            <el-option label="10号风机" value="10" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询功率</el-button>
          <el-button type="danger" @click="onReset">查看实时</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <div class="chart-container">
        <chart height="100%" width="100%" :xdata="xdata" :fanid="form.fan" />
      </div>
    </el-row>
  </div>
</template>

<script>
import Chart from '@/views/realtime/RealTimeLineChart'
import { getFanDataByPeriod, predictByRealTime } from '@/api/fandata'
import { formDateFormat } from '@/utils'
export default {
  name: 'Realtime',
  components: { Chart },
  data() {
    return {
      form: {
        startDate: '2021-1-2',
        startTime: '00:00',
        endDate: '2021-1-2',
        endTime: '23:45',
        fan: '1'
      },
      xdata: {},
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      loading: false
    }
  },
  mounted() {
    if (sessionStorage.getItem('realLoading') !== null) {
      this.loading = (sessionStorage.getItem('realLoading').toLowerCase() === 'true')
    }
    this.xdata = JSON.parse(sessionStorage.getItem('realXdata'))
    if (sessionStorage.getItem('realFan') === null) {
      this.form.fan = '1'
    } else {
      this.form.fan = sessionStorage.getItem('realFan')
    }
  },
  methods: {
    onSubmit() {
      sessionStorage.setItem('realFan', this.form.fan)
      this.loading = true
      sessionStorage.setItem('realLoading', this.loading)
      var beginTime = formDateFormat(this.form.startDate, this.form.startTime)
      var endTime = formDateFormat(this.form.endDate, this.form.endTime)
      getFanDataByPeriod(beginTime, endTime, this.form.fan).then(
        response => {
          sessionStorage.setItem('realXdata', JSON.stringify(response.data))
          this.xdata = JSON.parse(sessionStorage.getItem('realXdata'))
          this.$message('提交成功!')
          this.loading = false
          sessionStorage.setItem('realLoading', this.loading)
        }
      ).catch(() => {
        this.loading = false
        sessionStorage.setItem('realLoading', this.loading)
      })
    },
    onReset() {
      this.loading = true
      sessionStorage.setItem('realLoading', this.loading)
      sessionStorage.setItem('realFan', this.form.fan)
      predictByRealTime(this.form.fan).then(
        response => {
          sessionStorage.setItem('realXdata', JSON.stringify(response.data))
          this.xdata = JSON.parse(sessionStorage.getItem('realXdata'))
          this.$message({
            message: '实时查询成功',
            type: 'success'
          })
          this.loading = false
          sessionStorage.setItem('realLoading', this.loading)
        }
      ).catch(() => {
        this.$message({
          message: '服务器错误',
          type: 'failure'
        })
        this.loading = false
        sessionStorage.setItem('realLoading', this.loading)
      })
    }
  }
}

</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}

.line {
  text-align: center;
}
</style>
