<template>
  <div class="dashboard-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <div class="dashboard-text" style="text-align: center">活动管理</div>
      </div>
      <el-table
        v-loading="actsLoading"
        :data="acts"
        element-loading-text="Loading"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column
          prop="real_name"
          label="负责人"
          min-width="100"
          sortable
          align="center"
        />
        <el-table-column
          prop="title"
          label="活动名称"
          min-width="200"
          sortable
          align="center"
        />
        <el-table-column
          prop="week"
          label="周数"
          min-width="200"
          sortable
          align="center"
        />
        <el-table-column
          prop="day"
          label="星期"
          min-width="80"
          sortable
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ dayString[scope.row.day] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="time"
          label="时间"
          min-width="120"
          sortable
          align="center"
        />
        <el-table-column
          prop="update_time"
          label="更新时间"
          min-width="120"
          sortable
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row['update_time'].substr(0, 10) }}
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="操作"
          align="center"
          min-width="160"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleActDialog(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleActDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24">
        <el-button class="el-table-add-row" type="info" plain :disabled="role !== 'admin'" @click="handleActDialog(actNull)"> + 添加 </el-button>
      </el-col>
    </el-card>
    <el-dialog title="活动详情" :visible.sync="dialogFormVisible" width="75%">
      <el-form ref="ACT" :model="act" label-width="auto" label-position="left" :rules="rules">
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="act.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="活动周数" prop="week">
          <el-select v-model="act.week" placeholder="请选择活动周数" filterable style="width:100%">
            <el-option
              v-for="w in 20"
              :key="w"
              :label="w"
              :value="w"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="活动星期" prop="day">
          <el-select v-model="act.day" placeholder="请选择活动星期" filterable style="width:100%">
            <el-option
              v-for="(value, key) in dayString"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" prop="time">
          <el-select v-model="act.time" placeholder="请选择活动时间" filterable style="width:100%">
            <el-option
              v-for="t in 10"
              :key="t"
              :label="'第'+t+'节课'"
              :value="t"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="活动负责人" prop="leader">
          <el-select v-model="act.leader" placeholder="请选择活动负责人" filterable style="width:100%">
            <el-option
              v-for="(value, key) in students"
              :key="key"
              :label="value[0]+' '+value[1]"
              :value="key"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelActDialog">取 消</el-button>
        <el-button type="primary" @click="confirmActDialog">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAct, createAct, updateAct, deleteAct } from '@/api/act'
import { getStudent } from '@/api/membership'

export default {
  name: 'Act',
  data() {
    return {
      students: {},
      acts: null,
      act: {
        id: null,
        title: null,
        week: null,
        day: null,
        time: null,
        leader: null,
        real_name: null
      },
      actNull: {
        id: null,
        title: null,
        week: null,
        day: null,
        time: null,
        leader: null,
        real_name: null
      },
      actsLoading: true,
      dialogFormVisible: false,
      dayString: {
        1: '星期一',
        2: '星期二',
        3: '星期三',
        4: '星期四',
        5: '星期五',
        6: '星期六',
        7: '星期日'
      },
      rules: {
        title: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        week: [
          { required: true, message: '请选择活动周数', trigger: 'blur' }
        ],
        day: [
          { required: true, message: '请选择活动星期', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择活动时间', trigger: 'blur' }
        ],
        leader: [
          { required: true, message: '请选择活动负责人', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'role'
    ])
  },
  created() {
    this.fetchStudentAct()
  },
  methods: {
    fetchStudentAct() {
      getStudent().then(response => {
        response.forEach(s => {
          this.students[s.id] = [s.student_id, s.real_name]
        })
        this.fetchAct()
      })
    },
    fetchAct() {
      this.actsLoading = true
      getAct().then(response => {
        response.forEach(a => {
          a['real_name'] = this.students[a.leader][1]
          a['leader'] = a['leader'].toString()
        })
        this.acts = response
        this.actsLoading = false
      }).catch(() => {
        this.acts = null
        this.actsLoading = false
      })
    },
    handleActDialog(act) {
      this.act = JSON.parse(JSON.stringify(act))
      this.dialogFormVisible = true
      this.$refs['ACT'].resetFields()
    },
    cancelActDialog() {
      this.dialogFormVisible = false
    },
    confirmActDialog() {
      this.$refs['ACT'].validate((valid) => {
        if (valid) {
          if (this.act.id === null) {
            this.handleActCreate(this.act)
          } else {
            this.handleActEdit(this.act)
          }
          this.dialogFormVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleActCreate(data) {
      createAct(data).then(() => {
        this.fetchAct()
      })
    },
    handleActEdit(data) {
      updateAct(data.id, data).then(() => {
        this.fetchAct()
      })
    },
    handleActDelete(id) {
      deleteAct(id).then(() => {
        this.fetchAct()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 20px;
      line-height: 25px;
    }
  }
  .el-table-add-row {
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100%;
    border: 1px dashed #c1c1cd;
    border-radius: 3px;
    /*display: flex;*/
    color: #000000;
  }
</style>
