<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="2" type="flex" align="middle" style="flex-wrap: wrap; flex-direction: row">
        <el-col :xs="{span: 12}" :sm="{span: 12}" :lg="{span: 4}">
          <el-select v-model="listQuery.fanid" label="风机编号" placeholder="风机编号" clearable class="filter-item">
            <el-option v-for="item in fanOptions" :key="item" :label="item+'号风机'" :value="item" />
          </el-select>
        </el-col>
        <el-col :xs="{span: 12}" :sm="{span: 12}" :lg="{span: 4}">
          <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-col>
        <el-col :xs="{span: 12}" :sm="{span: 12}" :lg="{span: 4}">
          <el-input v-model="listQuery.username" placeholder="维修人员名" style="width: 160px" clearable class="filter-item" />
        </el-col>
        <el-col :xs="{span: 6}" :sm="{span: 6}" :lg="{span: 4}">
          <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" @click="handleFilter">
            搜素
          </el-button>
        </el-col>
        <el-col :xs="{span: 6}" :sm="{span: 6}" :lg="{span: 4}">
          <el-button v-waves class="filter-item" type="info" size="small" icon="el-icon-download" @click="setDialogWidth();exportLogDialogVisible=true">
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
          <el-table-column label="风机编号" align="center">
            <template slot-scope="{row}">
              <span>{{ row.fanId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="维修人员" prop="id" sortable align="center">
            <template slot-scope="{row}">
              <span>{{ row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" align="center">
            <template slot-scope="{row}">
              <span>{{ row.startTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束时间" align="center">
            <template slot-scope="{row}">
              <span>{{ row.endTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="维修状态" align="center">
            <template slot-scope="{row}">
              <el-tag v-if="row.status === 'no'" type="warning" size="medium">进行中</el-tag>
              <el-tag v-else type="info" size="medium">已完成</el-tag>
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
  </div>
</template>

<script>
import { fetchList, deleteItem } from '@/api/fixLog'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const statusOptions = [
  { key: 'no', display_name: '进行中' },
  { key: 'yes', display_name: '已完成' }
]

const typeKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Fix',
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
        status: 'no',
        fanid: 1,
        username: ''
      },
      exportform: {
        filename: '',
        autoWidth: true,
        type: 'xlsx'
      },
      options: ['xlsx', 'csv', 'txt'],
      statusOptions,
      fanOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      temp: {
        id: undefined,
        fanid: '',
        starttime: new Date(),
        endtime: new Date(),
        status: '',
        username: ''
      },
      dialogWidth: 0,
      dialogFormVisible: false,
      exportLogDialogVisible: false,
      logDownloadLoading: false,
      statusMap: new Map([
        ['real', '实时预测'],
        ['period', '自定义预测']
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
      fetchList({ page: this.listQuery.page, limit: this.listQuery.limit, status: this.listQuery.status, fanid: this.listQuery.fanid, username: this.listQuery.username }).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.$message({
          message: '获取维修日志记录成功',
          type: 'success',
          duration: 1000
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
    handleDelete(id, index) {
      deleteItem(id).then(response => {
        this.$notify({
          message: '删除成功!',
          type: 'success',
          duration: 2000
        })
      })
      this.list.splice(index, 1)
      this.total--
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
        const tHeader = ['日志编号', '维修人员编号', '维修人员名称', '风机号', '开始维修时间', '结束维修时间', '当前状态']
        const filterVal = ['id', 'userId', 'userName', 'fanId', 'startTime', 'endTime', 'status']
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
