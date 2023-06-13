<template>
  <div>
    <el-row>
      <el-form :model="form" label-width="80px" :inline="true">
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
              end: '23:30'
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
              end: '23:30',
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
          <el-button type="primary" @click="onSubmit">提交</el-button>
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
import Chart from '@/views/weather/WeatherChart'
import { getWeatherByPeriod } from '@/api/fandata'
import { formDateFormat } from '@/utils'
export default {
  name: 'Weather',
  components: { Chart },
  data() {
    return {
      form: {
        startDate: '2021-10-1',
        startTime: '00:00',
        endDate: '2021-10-1',
        endTime: '23:45',
        fan: '1',
        loading: false
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
      }
    }
  },
  methods: {
    onSubmit() {
      this.loading = true
      var beginTime = formDateFormat(this.form.startDate, this.form.startTime)
      var endTime = formDateFormat(this.form.endDate, this.form.endTime)
      getWeatherByPeriod(beginTime, endTime, this.form.fan).then(
        response => {
          this.xdata = response.data
          this.$message({
            message: '查询成功',
            type: 'success'
          })
        }
      ).catch(() => {
        this.loading = false
      })
      this.loading = false
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
