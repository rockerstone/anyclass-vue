<template>
  <div class="dashboard-container">
    <el-card class="box-card" shadow="always" style="margin-bottom: 20px">
      <div v-if="role === 'admin'">
        <el-row class="row-bg hidden-xs-only">
          <el-col :span="8" text-align="center">
            <el-button type="success" :loading="loading" plain @click="gotoTimetable">查看时间表</el-button>
          </el-col>
          <el-col :span="8" text-align="center">
            <el-button type="primary" :loading="loading" plain @click="updateTimetable">更新时间表</el-button>
          </el-col>
          <el-col :span="8" text-align="center">
            <el-button type="danger" :loading="loading" plain @click="createTimetable">重置时间表</el-button>
          </el-col>
        </el-row>
        <div class="hidden-sm-and-up">
          <el-row type="flex" class="row-bg" justify="center">
            <el-button type="success" :loading="loading" plain style="width: 100%" @click="gotoTimetable">查看时间表</el-button>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center">
            <el-button type="primary" :loading="loading" plain style="width: 100%" @click="updateTimetable">更新时间表</el-button>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center">
            <el-button type="danger" :loading="loading" plain style="width: 100%" @click="createTimetable">重置时间表</el-button>
          </el-row>
        </div>
      </div>
      <div v-else>
        <el-row class="row-bg">
          <el-col :span="24" text-align="center">
            <el-button type="success" icon="el-icon-date" plain style="width: 100%" @click="gotoTimetable">查看时间表</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="box-card" shadow="always" style="margin-bottom: 20px">
      <el-row class="row-bg hidden-xs-only">
        <el-col :span="8" text-align="center">
          <el-button
            type="primary"
            icon="el-icon-s-custom"
            plain
            @click="$router.replace('/membership')"
          >成员管理</el-button>
        </el-col>
        <el-col :span="8" text-align="center">
          <el-button
            type="primary"
            icon="el-icon-s-cooperation"
            plain
            @click="$router.replace('/course')"
          >课程管理</el-button>
        </el-col>
        <el-col :span="8" text-align="center">
          <el-button
            type="primary"
            icon="el-icon-s-flag"
            :disabled="role !== 'admin'"
            plain
            @click="$router.replace('/act')"
          >活动管理</el-button>
        </el-col>
      </el-row>
      <div class="hidden-sm-and-up">
        <el-row type="flex" class="row-bg" justify="center">
          <el-button
            type="primary"
            icon="el-icon-s-custom"
            plain
            style="width: 100%"
            @click="$router.replace('/membership')"
          >成员管理</el-button>
        </el-row>
        <el-row type="flex" class="row-bg" justify="center">
          <el-button
            type="primary"
            icon="el-icon-s-cooperation"
            plain
            style="width: 100%"
            @click="$router.replace('/course')"
          >课程管理</el-button>
        </el-row>
        <el-row type="flex" class="row-bg" justify="center">
          <el-button
            type="primary"
            icon="el-icon-s-flag"
            :disabled="role !== 'admin'"
            plain
            style="width: 100%"
            @click="$router.replace('/act')"
          >活动管理</el-button>
        </el-row>
      </div>
    </el-card>
    <el-card class="box-card" shadow="always" style="margin-bottom: 20px">
      <el-row type="flex" class="row-bg" justify="center">
        <el-table
          :data="users"
          stripe
          border
          style="width: 100%"
        >
          <el-table-column
            prop="username"
            label="用户名"
            align="center"
            min-width="150px"
            sortable
          />
          <el-table-column
            prop="email"
            label="电子邮件"
            align="center"
            min-width="250px"
            sortable
          />
          <el-table-column
            label="用户权限"
            align="center"
            min-width="120px"
            sortable
          >
            <template slot-scope="scope">
              {{ scope.row['is_staff'] ? '管理员' : '普通用户' }}
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            align="center"
            min-width="100px"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleUserDialog(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <el-dialog v-if="dialogFormVisible" title="用户详情" :visible.sync="dialogFormVisible" width="75%">
      <el-form ref="USER" :model="user" label-width="auto" label-position="left" :rules="rules">
        <el-form-item label="用户名">
          <el-input v-model="user.username" disabled />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="user['email']" placeholder="电子邮箱" style="width:100%" :disabled="name !== user.username" />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="user['password']" type="password" placeholder="不修改则留空" style="width:100%" :disabled="name !== user.username" />
        </el-form-item>
        <el-form-item label="重复新密码" prop="repassword">
          <el-input v-model="user['repassword']" type="password" placeholder="不修改则留空" style="width:100%" :disabled="name !== user.username" />
        </el-form-item>
        <el-form-item label="人员状态">
          <el-checkbox v-model="user['is_staff']" :disabled="name === user.username || role !== 'admin'">管理员</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUserDialog">取 消</el-button>
        <el-button type="primary" @click="confirmUserDialog">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { createTimetable, updateTimetable } from '@/api/timetable'
import { getInfo, getInfoAll, updateInfo } from '@/api/user'
import 'element-ui/lib/theme-chalk/display.css'

export default {
  name: 'Dashboard',
  data() {
    const validateRePass = (rule, value, callback) => {
      if (this.user.password !== '' && value !== this.user.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      info: null,
      users: null,
      user: null,
      loading: false,
      dialogFormVisible: false,
      rules: {
        email: [
          { type: 'email', message: '请输入正确邮箱', trigger: 'blur' }
        ],
        password: [
          { pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/,
            message: '密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为 8 - 30位' }
        ],
        repassword: [
          { validator: validateRePass, trigger: 'blur' }
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
    if (this.$store.state.user.role === 'admin') {
      this.fetchInfoAll()
    } else {
      this.fetchInfo()
    }
  },
  methods: {
    fetchInfo() {
      getInfo().then(response => {
        this.users = [response]
      })
    },
    fetchInfoAll() {
      getInfoAll().then(response => {
        this.users = response
      })
    },
    gotoTimetable() {
      this.$router.replace('/')
    },
    createTimetable() {
      this.loading = true
      createTimetable().then(response => {
        this.loading = false
        this.$message({
          message: response,
          type: 'success',
          // duration: 5 * 1000
          duration: 5 * 1000
        })
      })
    },
    updateTimetable() {
      this.loading = true
      updateTimetable().then(response => {
        this.loading = false
        this.$message({
          message: response,
          type: 'success',
          // duration: 5 * 1000
          duration: 5 * 1000
        })
      })
    },
    handleUserDialog(user) {
      this.user = JSON.parse(JSON.stringify(user))
      this.dialogFormVisible = true
      this.$refs['USER'].resetFields()
    },
    cancelUserDialog() {
      this.dialogFormVisible = false
    },
    confirmUserDialog() {
      this.$refs['USER'].validate((valid) => {
        if (valid) {
          this.updateUser()
          this.dialogFormVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateUser() {
      updateInfo(this.user.id, this.user).then(response => {
        if (this.$store.state.user.role === 'admin') {
          this.fetchInfoAll()
        } else {
          this.fetchInfo()
        }
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
    font-size: 30px;
    line-height: 46px;
  }
}
.row-bg {
  padding: 10px 0;
  text-align: center;
  /*background-color: #f9fafc;*/
}
</style>
