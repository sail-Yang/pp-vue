<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="1" type="flex" align="middle">
        <el-col :xs="{span: 24}" :sm="{span: 4}" :lg="{span: 4}">
          <el-select v-model="listQuery.fanid" placeholder="风机编号" clearable class="filter-item">
            <el-option v-for="item in fanOptions" :key="item" :label="item+'号风机'" :value="item" />
          </el-select>
        </el-col>
        <el-col :xs="{span: 24}" :sm="{span: 4}" :lg="{span: 4}">
          <el-select v-model="listQuery.model" placeholder="模型" clearable class="filter-item">
            <el-option v-for="item in modelOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-col>
        <el-col :xs="{span: 24}" :sm="{span: 5}" :lg="{span: 4}">
          <el-select v-model="listQuery.type" placeholder="类型" clearable class="filter-item">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-col>
        <el-col :xs="{span: 24}" :sm="{span: 2}" :lg="{span: 2}">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜素
          </el-button>
        </el-col>
        <el-col :xs="{span: 24}" :sm="{span: 2}" :lg="{span: 2}">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-download" @click="setDialogWidth();exportLogDialogVisible=true">
            导出
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="1" type="flex" align="middle">
      <el-col :xs="{span: 24}" :sm="{span: 2}" :lg="{span: 24}">
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="日志编号" prop="id" sortable align="center">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="记录时间" align="center">
            <template slot-scope="{row}">
              <span>{{ row.date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="风机编号" align="center">
            <template slot-scope="{row}">
              <span>{{ row.fanId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="预测类型" align="center">
            <template slot-scope="{row}">
              <span>{{ typeMap.get(row.type) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="预测模型" align="center">
            <template slot-scope="{row}">
              <span>{{ modelMap.get(row.model) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开始预测时间" align="center">
            <template slot-scope="{row}">
              <span>{{ row.startTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束预测时间" align="center">
            <template slot-scope="{row}">
              <span>{{ row.endTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="预测结果" align="center">
            <template slot-scope="{row}">
              <span>{{ row.status === 'success' ? '预测成功' : '预测失败' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="异常数据" align="center">
            <template slot-scope="{row}">
              <el-button v-if="row.nums > 0" type="warning" size="mini" @click="setDialogWidth();queryOutliers(row);">
                查看异常值
              </el-button>
              <el-button v-else type="info" size="mini" disabled="true">
                无异常值
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row.id,$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row :gutter="3" type="flex">
          <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}">
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog
      title="异常值"
      :visible.sync="dialogVisible"
      :width="dialogWidth"
    >
      <el-table
        :key="tableKey"
        v-loading="outlierLoading"
        :data="outliers"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        :default-sort="{prop: 'id', order: 'ascending'}"
      >
        <el-table-column label="记录编号" prop="id" sortable="custom" align="center">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预测值(yd15)" align="center">
          <template slot-scope="{row}">
            <span>{{ row.yd15 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备用预测值(ROUND(A.POWER,0))" align="center">
          <template slot-scope="{row}">
            <span>{{ row.power }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-document" @click="setDialogWidth();exportOutlierDialogVisible=true">导出为表格</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导出日志"
      :visible.sync="exportLogDialogVisible"
      :width="dialogWidth"
    >
      <el-form :model="exportform">
        <el-form-item>
          <label class="radio-label">文件名: </label>
          <el-input v-model="exportform.filename" placeholder="默认为：日志记录" prefix-icon="el-icon-document" />
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
        <el-button @click="exportLogDialogVisible = false">取 消</el-button>
        <el-button v-loading="logDownloadLoading" type="primary" icon="el-icon-document" @click="handleLogDownload">导出</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导出异常值序列"
      :visible.sync="exportOutlierDialogVisible"
      :width="dialogWidth"
    >
      <el-form :model="exportform">
        <el-form-item>
          <label class="radio-label">文件名: </label>
          <el-input v-model="exportform.filename" placeholder="默认为：异常值序列" prefix-icon="el-icon-document" />
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
        <el-button @click="exportOutlierDialogVisible = false">取 消</el-button>
        <el-button v-loading="outlierDownloadLoading" type="primary" icon="el-icon-document" @click="handleOutlierDownload">导出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchOutliers, deleteItem } from '@/api/log'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const modelOptions = [
  { key: 'multi', display_name: '多模型(LMLP-RNN-LSTM)' },
  { key: 'single', display_name: '单模型(LSTM)' }
]

const modelKeyValue = modelOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const typeOptions = [
  { key: 'real', display_name: '实时预测' },
  { key: 'period', display_name: '范围预测' }
]

const typeKeyValue = typeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Log',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        noOutlier: 'success',
        outlier: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    modelFilter(type) {
      return modelKeyValue[type]
    },
    typeFilter(type) {
      return typeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      dialogVisible: false,
      listQuery: {
        page: 1,
        limit: 20,
        type: 'real',
        model: 'multi',
        fanid: 1,
        username: this.$store.getters.username
      },
      exportform: {
        filename: '',
        autoWidth: true,
        type: 'xlsx'
      },
      outliers: null,
      outlierTotal: 0,
      outlierLoading: false,
      outlierQuery: {
        page: 1,
        limit: 20
      },
      options: ['xlsx', 'csv', 'txt'],
      modelOptions,
      typeOptions,
      fanOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      temp: {
        id: undefined,
        type: '',
        model: '',
        fanid: '',
        date: new Date(),
        starttime: new Date(),
        endtime: new Date(),
        status: ''
      },
      dialogWidth: 0,
      dialogFormVisible: false,
      exportOutlierDialogVisible: false,
      exportLogDialogVisible: false,
      logDownloadLoading: false,
      outlierDownloadLoading: false,
      typeMap: new Map([
        ['real', '实时预测'],
        ['period', '范围预测']
      ]),
      modelMap: new Map([
        ['single', '单模型(LSTM)'],
        ['multi', '多模型(LMLP-RNN-LSTM)']
      ])
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.setDialogWidth()
      })()
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList({ page: this.listQuery.page, limit: this.listQuery.limit, type: this.listQuery.type, model: this.listQuery.model, fanid: this.listQuery.fanid, username: this.listQuery.username }).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.$message({
          message: '获取日志记录成功',
          type: 'success'
        })
      })
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'noOutlier',
        type: ''
      }
    },
    queryOutliers(row) {
      this.dialogVisible = true
      this.outlierLoading = true
      fetchOutliers(row.id).then(response => {
        this.outliers = response.data.outliers
        this.outlierTotal = response.data.total
      })
      this.outlierLoading = false
    },
    handleDelete(id, index) {
      deleteItem(id).then(response => {
        this.$notify({
          title: 'Success',
          message: '删除成功!',
          type: 'success',
          duration: 2000
        })
      })
      this.list.splice(index, 1)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'descending' : 'ascending'
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleLogDownload() {
      this.logDownloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['日志编号', '记录时间', '风机编号', '预测类型', '预测模型', '开始预测时间', '结束预测时间', '预测结果']
        const filterVal = ['id', 'date', 'fanId', 'type', 'model', 'startTime', 'endTime', 'status']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data: data,
          filename: this.exportform.filename || '日志记录',
          autoWidth: this.exportform.autoWidth,
          bookType: this.exportform.type
        })
        this.logDownloadLoading = false
      })
    },
    handleOutlierDownload() {
      this.outlierDownloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['编号', '预测时间点', 'yd15', 'power']
        const filterVal = ['id', 'date', 'yd15', 'power']
        const outliers = this.outliers
        const data1 = this.formatJson(filterVal, outliers)
        excel.export_json_to_excel({
          header: tHeader,
          data: data1,
          filename: this.exportform.filename || '异常值序列',
          autoWidth: this.exportform.autoWidth,
          bookType: this.exportform.type
        })
        this.outlierDownloadLoading = false
      })
    },
    setDialogWidth() {
      console.log(document.body.clientWidth)
      var val = document.body.clientWidth
      const def = 600 // 默认宽度
      if (val < def) {
        this.dialogWidth = '80%'
      } else {
        this.dialogWidth = def + 'px'
      }
    }
  }
}
</script>
