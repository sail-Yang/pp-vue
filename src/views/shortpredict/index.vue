<template>
  <div>
    <el-row>
      <el-form :model="form" :inline="true">
        <el-row :gutter="3" type="flex" align="middle">
          <el-form-item label-width="140px">
            <span slot="label">
              训练集开始时间
              <el-tooltip class="item" effect="dark">
                <i class="el-icon-info"></i>
                <div slot="content">
                  {{ form.fan }}号风机训练集可用时间范围：<br />
                  {{ tipValue }}
                </div>
              </el-tooltip>
            </span>
            <el-col :xs="{span: 24}" :sm="{span: 12}" :lg="{span: 12}">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                placeholder="起始日期"
                :picker-options="pickerOptions"
              />
            </el-col>
            <el-col :xs="{span: 24}" :sm="{span: 12}" :lg="{span: 12}">
              <el-time-select
                v-model="form.startTime"
                placeholder="起始时间"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '23:30'
                }"
              />
            </el-col>
          </el-form-item>
          <el-form-item label-width="130px">
            <span slot="label">
              训练集结束时间
              <el-tooltip class="item" effect="dark">
                <i class="el-icon-info"></i>
                <div slot="content">
                  {{ form.fan }}号风机训练集可用时间范围：<br />
                  {{ tipValue }}
                </div>
              </el-tooltip>
            </span>
            <el-col :xs="{span: 24}" :sm="{span: 12}" :lg="{span: 12}">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                placeholder="结束日期"
                :picker-options="pickerOptions"
                @input="initForm"
              />
            </el-col>
            <el-col :xs="{span: 24}" :sm="{span: 12}" :lg="{span: 12}">
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
            </el-col>
          </el-form-item>
        </el-row>
        <el-row :gutter="3" type="flex" align="middle">
          <el-col :xs="{span: 6}" :sm="{span: 12}" :lg="{span: 4}">
            <el-form-item label="预测时长" label-width="80px">
              <el-select v-model="form.hours" placeholder="请选择时长" style="width:100px" @input="initForm">
                <el-option label="12" value="12" />
                <el-option label="24" value="24" />
                <el-option label="36" value="36" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="{span: 7}" :sm="{span: 12}" :lg="{span: 4}">
            <el-form-item label="风机" label-width="40px">
              <el-select v-model="form.fan" placeholder="请选择风机的编号" style="width:120px" @change="updateTipValue">
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
          </el-col>
          <el-col :xs="{span: 1}" :sm="{span: 2}" :lg="{span: 1}" />
          <el-col :xs="{span: 10}" :sm="{span: 10}" :lg="{span: 15}">
            <el-form-item>
              <span slot="label">
                &nbsp;
              </span>
              <el-tooltip class="item" effect="dark" content="训练集时间段必须大于两个月" placement="top">
                <el-button v-loading="loading" type="primary" size="small" style="margin-left:10px" @click="onSubmit">开始预测</el-button>
              </el-tooltip>
              <el-button type="danger" size="small" @click="onCancel">取消预测</el-button>
              <el-button type="info" size="small" @click="setDialogWidth();dialogVisible = true">导出预测数据</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3" type="flex">
          <el-form-item label="预测开始时间" label-width="110px">
            <el-col :xs="{span: 24}" :sm="{span: 12}" :lg="{span: 12}">
              <el-date-picker
                v-model="form.predStartDate"
                type="date"
                placeholder="起始日期"
                :picker-options="pickerOptions"
                disabled="true"
              />
            </el-col>
            <el-col :xs="{span: 12}" :sm="{span: 12}" :lg="{span: 12}">
              <el-time-select
                v-model="form.predStartTime"
                placeholder="起始时间"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '23:30'
                }"
                disabled="true"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="预测结束时间">
            <el-col :xs="{span: 24}" :sm="{span: 12}" :lg="{span: 12}">
              <el-date-picker
                v-model="form.predEndDate"
                type="date"
                placeholder="结束日期"
                :picker-options="pickerOptions"
                disabled="true"
              />
            </el-col>
            <el-col :xs="{span: 24}" :sm="{span: 12}" :lg="{span: 12}">
              <el-time-select
                v-model="form.predEndTime"
                :picker-options="{
                  start: '00:30',
                  step: '00:15',
                  end: '23:45',
                  minTime: predStartTime
                }"
                placeholder="结束时间"
                disabled="true"
              />
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
    <el-row>
      <div class="chart-container">
        <chart height="100%" width="100%" :xdata="xdata" :fanid="form.fan" />
      </div>
    </el-row>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :width="dialogWidth"
    >
      <el-form :model="exportform">
        <el-form-item>
          <label class="radio-label">文件名: </label>
          <el-input v-model="exportform.filename" placeholder="默认为predictData" prefix-icon="el-icon-document" />
        </el-form-item>
        <el-form-item>
          <label class="radio-label">自动宽度: </label>
          <el-radio-group v-model="exportform.autoWidth">
            <el-radio :label="true" border>
              True
            </el-radio>
            <el-radio :label="false" border>
              False
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <label class="radio-label">输出种类: </label>
          <el-select v-model="exportform.type">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-document" @click="handleDownload">导出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Chart from '@/views/shortpredict/ShortLineChart'
import { predictByPeriod, fetchTimeRange } from '@/api/fandata'
import { formDateFormat, parseTime } from '@/utils'
export default {
  name: 'Short',
  components: { Chart },
  data() {
    return {
      form: {
        startDate: '2021-3-1',
        startTime: '04:45',
        endDate: '2021-9-30',
        endTime: '04:45',
        predStartDate: '2021-10-1',
        predStartTime: '00:00',
        hours: '24',
        predEndDate: '2021-10-1',
        predEndTime: '23:45',
        fan: '1'
      },
      exportform: {
        filename: '',
        autoWidth: true,
        type: 'xlsx'
      },
      dialogWidth: 0,
      dialogVisible: false,
      downloadLoading: false,
      options: ['xlsx', 'csv', 'txt'],
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
      loading: false,
      abortController: new AbortController(),
      tipValue: ''
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.setDialogWidth()
      })()
    }
    if (sessionStorage.getItem('periodLoading') !== null) {
      this.loading = (sessionStorage.getItem('periodLoading').toLowerCase() === 'true')
    }
    this.xdata = JSON.parse(sessionStorage.getItem('periodXdata'))
    if (sessionStorage.getItem('periodFan') === null) {
      this.form.fan = '1'
    } else {
      this.form.fan = sessionStorage.getItem('periodFan')
    }
    this.updateTipValue()
  },
  methods: {
    initForm() {
      // 修改预测开始时间
      var currentDate = new Date(this.form.endDate)
      currentDate.setDate(currentDate.getDate() + 1)
      var y = currentDate.getFullYear()
      var m = currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1
      var d = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()
      this.form.predStartDate = y + '-' + m + '-' + d
      // 修改预测结束时间
      var preDate = new Date(this.form.predStartDate + ' ' + this.form.predStartTime)
      preDate.setHours(preDate.getHours() + parseInt(this.form.hours))
      preDate.setMinutes(preDate.getMinutes() - 15)
      y = preDate.getFullYear()
      m = preDate.getMonth() + 1 < 10 ? '0' + (preDate.getMonth() + 1) : preDate.getMonth() + 1
      d = preDate.getDate() < 10 ? '0' + preDate.getDate() : preDate.getDate()

      const hours = preDate.getHours()
      const minutes = preDate.getMinutes()
      // 格式化小时和分钟
      const formattedHours = hours < 10 ? `0${hours}` : hours
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
      // 构建时间字符串
      const timeString = `${formattedHours}:${formattedMinutes}`
      this.form.predEndDate = y + '-' + m + '-' + d
      this.form.predEndTime = timeString
    },
    onSubmit() {
      // 计算时间差，训练集时间段必须大于两个月
      var beginTime = formDateFormat(this.form.startDate, this.form.startTime)
      var endTime = formDateFormat(this.form.endDate, this.form.endTime)
      var beginDate = new Date(beginTime)
      var endDate = new Date(endTime)
      // 单位为ms
      if (endDate - beginDate <= 5184000000) {
        this.$message({
          message: '训练集时间段必须大于两个月',
          type: 'warning'
        })
        return
      }
      this.loading = true
      sessionStorage.setItem('periodLoading', this.loading)
      predictByPeriod(this.$store.getters.username, beginTime, endTime, this.form.hours, this.form.fan, this.abortController.signal, this.$store.getters.model).then(
        response => {
          sessionStorage.setItem('periodXdata', JSON.stringify(response.data))
          sessionStorage.setItem('periodFan', this.form.fan)
          this.xdata = JSON.parse(sessionStorage.getItem('periodXdata'))
          this.$message({
            message: '预测成功',
            type: 'success'
          })
          this.loading = false
          sessionStorage.setItem('periodLoading', this.loading)
        }
      ).catch(() => {
        this.loading = false
        sessionStorage.setItem('periodLoading', this.loading)
      })
    },
    onCancel() {
      this.abortController.abort()
      sessionStorage.setItem('periodFan', this.form.fan)
      this.loading = false
      sessionStorage.setItem('periodLoading', this.loading)
      this.$message({
        message: '成功取消预测请求',
        type: 'warning'
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleDownload() {
      this.xdata = JSON.parse(sessionStorage.getItem('periodXdata'))
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['datatime', '实际功率', '预测功率(yd15)', '预测功率(备选,power)']
        const filterVal = ['datatime', 'yd15', 'yd15Pre', 'power']
        const list = this.xdata.fanDataList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.exportform.filename || 'predictData',
          autoWidth: this.exportform.autoWidth,
          bookType: this.exportform.type
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    setDialogWidth() {
      var val = document.body.clientWidth
      const def = 600 // 默认宽度
      if (val < def) {
        this.dialogWidth = '80%'
      } else {
        this.dialogWidth = def + 'px'
      }
    },
    updateTipValue() {
      fetchTimeRange(this.form.fan).then(
        response => {
          const beginDate = new Date(response.data.min)
          const endDate = new Date(response.data.max)
          this.tipValue = parseTime(beginDate) + ' ~ ' + parseTime(endDate)
        }
      )
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
