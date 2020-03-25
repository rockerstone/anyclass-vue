<template>
  <div class="dashboard-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <div class="dashboard-text" style="text-align: center">成员管理</div>
      </div>
      <el-table
        :data="students"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column
          prop="student_id"
          label="学号"
          min-width="120"
          sortable
          align="center"
        />
        <el-table-column
          prop="real_name"
          label="姓名"
          min-width="80"
          sortable
          align="center"
        />
        <el-table-column
          prop="grade"
          label="年级"
          min-width="80"
          sortable
          align="center"
        />
        <el-table-column
          prop="college"
          label="学院"
          min-width="120"
          sortable
          align="center"
        />
        <el-table-column
          prop="major"
          label="专业"
          min-width="300"
          sortable
          align="center"
        />
        <el-table-column
          prop="student_class"
          label="班级"
          min-width="120"
          sortable
          align="center"
        />
        <el-table-column
          prop=""
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getStudent, deleteStudent } from '@/api/membership'

export default {
  name: 'Membership',
  data() {
    return {
      students: null
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getStudent().then(response => {
        this.students = response
      })
    },
    handleDelete(id) {
      deleteStudent(id).then(() => {
        this.fetchData()
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
</style>
