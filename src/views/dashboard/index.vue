<template>
  <div class="dashboard-container">
    <el-card class="box-card" shadow="always" style="margin-bottom: 20px">
      <el-row type="flex" class="row-bg" justify="center">
        <el-table
          :data="info"
          stripe
          border
          style="width: 100%"
        >
          <el-table-column
            prop="username"
            label="用户名"
            align="center"
            min-width="150px"
          />
          <el-table-column
            label="用户权限"
            align="center"
            min-width="150px"
          >
            <template>
              {{ role==="admin" ? '管理员' : '普通用户' }}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="24" text-align="center">
          <el-button type="primary" icon="el-icon-tickets" plain disabled>信息修改</el-button>
        </el-col>
      </el-row>
    </el-card>
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
            <el-button type="success" :loading="loading" plain @click="gotoTimetable">查看时间表</el-button>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center">
            <el-button type="primary" :loading="loading" plain @click="updateTimetable">更新时间表</el-button>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center">
            <el-button type="danger" :loading="loading" plain @click="createTimetable">重置时间表</el-button>
          </el-row>
        </div>
      </div>
      <div v-else>
        <el-row class="row-bg">
          <el-col :span="24" text-align="center">
            <el-button type="success" icon="el-icon-date" plain @click="gotoTimetable">查看时间表</el-button>
          </el-col>
        </el-row>
      </div>
      <el-row v-if="loading" type="flex" class="row-bg" justify="center">
        <el-col :xs="24" :sm="20" :md="20" :lg="20">
          <el-progress :text-inside="true" :stroke-width="24" :percentage="loadingProgress" status="success" />
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row class="row-bg hidden-xs-only">
        <el-col :span="8" text-align="center">
          <el-button
            type="primary"
            icon="el-icon-s-custom"
            plain
            @click="$router.replace('/membership')"
          >成员管理</el-button>        </el-col>
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
            @click="$router.replace('/membership')"
          >成员管理</el-button>
        </el-row>
        <el-row type="flex" class="row-bg" justify="center">
          <el-button
            type="primary"
            icon="el-icon-s-cooperation"
            plain
            @click="$router.replace('/course')"
          >课程管理</el-button>
        </el-row>
        <el-row type="flex" class="row-bg" justify="center">
          <el-button
            type="primary"
            icon="el-icon-s-flag"
            :disabled="role !== 'admin'"
            plain
            @click="$router.replace('/act')"
          >活动管理</el-button>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { createTimetable, updateTimetable } from '@/api/timetable'
import { getInfo } from '@/api/user'
import 'element-ui/lib/theme-chalk/display.css'

export default {
  name: 'Dashboard',
  data() {
    return {
      info: null,
      loading: false,
      loadingProgress: 0
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'role'
    ])
  },
  created() {
    this.fetchInfo()
  },
  methods: {
    fetchInfo() {
      getInfo().then(response => {
        this.info = [response]
      })
    },
    gotoTimetable() {
      this.$router.replace('/')
    },
    progress() {
      this.loadingProgress += 1
      if (this.loadingProgress >= 100) {
        this.loadingProgress = 100
      }
    },
    createTimetable() {
      this.loading = true
      const inter = setInterval(this.progress, 40)
      createTimetable().then(response => {
        console.log(response)
        this.loading = false
        clearInterval(inter)
        this.loadingProgress = 0
        this.$message({
          message: '时间表重置完成',
          type: 'success',
          // duration: 5 * 1000
          duration: 5 * 1000
        })
      })
    },
    updateTimetable() {
      this.loading = true
      const inter = setInterval(this.progress, 600)
      updateTimetable().then(response => {
        console.log(response)
        this.loading = false
        clearInterval(inter)
        this.loadingProgress = 0
        this.$message({
          message: '时间表更新完成',
          type: 'success',
          // duration: 5 * 1000
          duration: 5 * 1000
        })
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
