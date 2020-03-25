<template>
  <div class="dashboard-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <div class="dashboard-text" style="text-align: center">课程管理</div>
      </div>
      <el-select v-model="student" class="el-table-add-row" placeholder="请选择所属学生课表" filterable style="width:100%">
        <el-option
          v-for="(value, key) in students"
          :key="key"
          :label="value[0]+' '+value[1]"
          :value="key"
        />
      </el-select>
      <el-table
        v-loading="coursesLoading"
        :data="courses"
        element-loading-text="Loading"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column
          prop="real_name"
          label="学生"
          min-width="80"
          sortable
          align="center"
        />
        <el-table-column
          prop="title"
          label="课程名称"
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
        >
          <template slot-scope="scope">
            <span>{{ scope.row.week.toString() }}</span><br>
          </template>
        </el-table-column>
        <el-table-column
          prop="day"
          label="星期"
          min-width="80"
          sortable
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ dayString[scope.row.day] }}</span><br>
          </template>
        </el-table-column>
        <el-table-column
          prop="time"
          label="时间"
          min-width="120"
          sortable
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.time.toString() }}</span><br>
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
              @click="handleCourseDialog(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleCourseDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24">
        <el-button class="el-table-add-row" type="info" plain @click="handleCourseDialog(courseNull)"> + 添加 </el-button>
      </el-col>
    </el-card>

    <el-dialog title="课程" :visible.sync="dialogFormVisible" width="75%">
      <el-form ref="COURSE" :model="course" :rules="rules" label-width="auto" label-position="left">
        <el-form-item label="课程名称" prop="title">
          <el-input v-model="course.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课程周数" prop="week">
          <el-select v-model="course.week" placeholder="请选择课程周数" filterable style="width:100%" multiple>
            <el-option
              v-for="w in 20"
              :key="w.toString()"
              :label="w.toString()"
              :value="w.toString()"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程星期" prop="day">
          <el-select v-model="course.day" placeholder="请选择课程星期" filterable style="width:100%">
            <el-option
              v-for="(value, key) in dayString"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程时间" prop="time">
          <el-select v-model="course.time" placeholder="请选择课程时间" filterable style="width:100%" multiple>
            <el-option
              v-for="t in 10"
              :key="t.toString()"
              :label="'第'+t+'节课'"
              :value="t.toString()"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学生" prop="student">
          <el-select v-model="course.student" placeholder="请选择课表所属学生" filterable style="width:100%">
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
        <el-button @click="cancelCourseDialog">取 消</el-button>
        <el-button type="primary" @click="confirmCourseDialog">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { createCourse, getCourseByStudent, updateCourse, deleteCourse } from '@/api/course'
import { getStudent } from '@/api/membership'

export default {
  name: 'Course',
  data() {
    return {
      students: {},
      student: null,
      courses: null,
      course: {
        id: null,
        title: null,
        week: null,
        day: null,
        time: null,
        student: null,
        real_name: null
      },
      courseNull: {
        id: null,
        title: null,
        week: null,
        day: null,
        time: null,
        student: null,
        real_name: null
      },
      coursesLoading: true,
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
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        week: [
          { required: true, message: '请选择课程周数', trigger: 'blur' }
        ],
        day: [
          { required: true, message: '请选择课程星期', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择课程时间', trigger: 'blur' }
        ],
        student: [
          { required: true, message: '请选择课程所属学生', trigger: 'blur' }
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
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    student: function() {
      this.fetchCourse()
    }
  },
  created() {
    this.fetchStudentCourse()
  },
  methods: {
    fetchStudentCourse() {
      getStudent().then(response => {
        response.forEach(s => {
          this.students[s.id] = [s.student_id, s.real_name]
        })
        this.student = Object.keys(this.students)[0]
        this.fetchCourse()
      })
    },
    fetchCourse() {
      this.coursesLoading = true
      getCourseByStudent(this.student).then(response => {
        response.forEach(c => {
          c['real_name'] = this.students[c.student][1]
          c['student'] = c['student'].toString()
          c['week'] = c['week'].split(',')
          c['time'] = c['time'].split(',')
        })
        this.courses = response
        this.coursesLoading = false
      })
    },
    handleCourseDialog(course) {
      this.course = JSON.parse(JSON.stringify(course))
      this.dialogFormVisible = true
      this.$refs['COURSE'].resetFields()
    },
    cancelCourseDialog() {
      this.dialogFormVisible = false
    },
    confirmCourseDialog() {
      this.$refs['COURSE'].validate((valid) => {
        if (valid) {
          this.course.week = this.course.week.toString()
          this.course.time = this.course.time.toString()
          if (this.course.id === null) {
            this.handleCourseCreate(this.course)
          } else {
            this.handleCourseEdit(this.course)
          }
          this.dialogFormVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCourseCreate(data) {
      createCourse(data).then(() => {
        this.fetchCourse()
      })
    },
    handleCourseEdit(data) {
      updateCourse(data.id, data).then(() => {
        this.fetchCourse()
      })
    },
    handleCourseDelete(id) {
      deleteCourse(id).then(() => {
        this.fetchCourse()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 40px;
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
