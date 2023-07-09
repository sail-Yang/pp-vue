<template>
  <el-table :data="list" fit style="width: 100%;height: 100%;padding-top: 15px;">
    <el-table-column label="风机编号" align="center">
      <template slot-scope="scope">
        {{ scope.row.id }}
      </template>
    </el-table-column>
    <el-table-column label="风机总预测次数" align="center">
      <template slot-scope="scope">
        <el-tag type="success">
          {{ scope.row.nums }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="近5日预警" align="center">
      <template slot-scope="scope">
        <el-button v-if="scope.row.outliers > 0" type="warning" size="mini">
          有异常值
        </el-button>
        <el-button v-else type="info" size="mini" disabled="true">
          无异常值
        </el-button>
      </template>
    </el-table-column>
    <el-table-column label="维修人员" align="center">
      <template slot-scope="scope">
        <div v-if="scope.row.userId > 0 && checkPermission(['user'])">
          <el-button type="primary" size="mini">
            {{ scope.row.userName }}
          </el-button>
        </div>
        <div v-else-if="scope.row.userId > 0 && checkPermission(['admin'])">
          <el-dropdown @command="handleCommand">
            <el-button type="primary" size="mini">
              {{ scope.row.userName }}<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,index) in usernames" :key="index" :command="beforeHandleCommand(scope.$index,item,scope.row.id)">
                {{ item }}
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.userName !== '指派'" :command="beforeHandleCommand(scope.$index,'cancel',scope.row.id)">
                <el-tag type="danger" size="mini">取消</el-tag>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-else-if="scope.row.userId == 0 && checkPermission(['admin'])">
          <el-dropdown @command="handleCommand">
            <el-button type="primary" size="mini">
              <div v-if="scope.row.userName === '' || scope.row.userName === null">
                指派<i class="el-icon-arrow-down el-icon--right" />
              </div>
              <div v-else>
                {{ scope.row.userName }}<i class="el-icon-arrow-down el-icon--right" />
              </div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,index) in usernames" :key="index" :command="beforeHandleCommand(scope.$index,item,scope.row.id)">
                {{ item }}
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.userName !== '指派' && scope.row.userName !== '' && scope.row.userName !== null" :command="beforeHandleCommand(scope.$index,'cancel',scope.row.id)">
                <el-tag type="danger" size="mini">取消</el-tag>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-else>
          <el-button type="info" size="mini" :disabled="true">
            指派
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchFanList, updateFanUser } from '@/api/fandata'
import { getUserNames } from '@/api/user'
import checkPermission from '@/utils/permission'
export default {
  filters: {
  },
  data() {
    return {
      list: null,
      usernames: null
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    getUserNames().then(response => {
      const { data } = response
      this.usernames = data
    })
  },
  methods: {
    fetchData() {
      fetchFanList(this.$store.getters.username).then(response => {
        this.list = response.data.fanlist
      })
    },
    checkPermission,
    beforeHandleCommand(index, command, id) {
      return {
        'index': index,
        'username': command,
        'fanId': id
      }
    },
    handleCommand(command) {
      if (command.username !== 'cancel') {
        this.list[command.index].userName = command.username
        updateFanUser(command.fanId, command.username).then((res) => {
          this.$message({
            message: '指派成功',
            type: 'success'
          })
        })
      } else {
        this.list[command.index].userName = '指派'
        updateFanUser(command.fanId, 'cancel').then((res) => {
          this.$message({
            message: '取消成功',
            type: 'success'
          })
        })
      }
    }
  }
}
</script>
