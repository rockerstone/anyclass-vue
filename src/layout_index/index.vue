<template>
  <div class="app-container" style="padding: 20px 5px">
    <el-container>
      <el-header>
        <el-row type="flex" class="row-bg" justify="center">
          <el-alert
            title="珍珠 | 您的课程查询助手"
            :closable="false"
            center
            type="info"
            effect="light"
            class="title"
          />
          <router-link to="dashboard">
            <el-button type="info" plain>后台管理</el-button>
          </router-link>
        </el-row>
      </el-header>
      <el-main style="padding: 5px">
        <el-card shadow="always" style="margin-outside: 10px">
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="24">
              <el-collapse>
                <el-collapse-item name="1" class="collapse">
                  <template slot="title">
                    <i class="header-icon el-icon-s-operation" />班级筛选器
                  </template>
                  <el-table
                    v-loading="filterLoading"
                    element-loading-text="Loading"
                    :data="classes"
                    :span-method="filterSpanMethod"
                    stripe
                    border
                    style="width: 100%"
                  >
                    <el-table-column
                      prop="year"
                      label="年级"
                      min-width="85"
                      fixed
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-button size="mini" @click="checkYear(scope.$index / 2)">{{ scope.row.year }}</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-for="(value,key) in major"
                      :key="key"
                      :prop="(key+1).toString()"
                      :label="value"
                      min-width="90"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-checkbox-group v-model="classesCheck" size="mini">
                          <el-checkbox-button :label="scope.column.label+scope.row.year.toString().substring(2)+'0'+scope.row[(key+1).toString()].substr(0, 1)">
                            {{ scope.row[(key+1).toString()] }}
                          </el-checkbox-button>
                        </el-checkbox-group>
                      </template>
                    </el-table-column></el-table>
                </el-collapse-item>
              </el-collapse>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center">
            <el-input-number v-model="week" :min="1" :max="20" class="week" label="当前周数" @change="fetchTimetable">
              <template slot-scope="scope">
                {{ scope }}12
              </template>
            </el-input-number>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center">
            <el-table
              v-loading="timetableLoading"
              :data="timetable"
              element-loading-text="Loading"
              stripe
              border
              style="width: 100%"
            >
              <el-table-column
                prop="time"
                :label="'第'+(week<10?('0'+week):week)+'周'"
                min-width="85"
                fixed
                align="center"
              />
              <el-table-column
                v-for="(value, key) in dayString"
                :key="key"
                :label="value"
                :prop="key"
                min-width="85"
                align="center"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row[key]['class'] && scope.row[key]['class'].length>0 || scope.row[key]['act'] && scope.row[key]['act'].length>0">
                    <el-button size="mini" type="info" plain style="font-size: 14px" @click="handleDialog(scope.row, key)">
                      <div v-if="scope.row[key]['class'] && scope.row[key]['class'].length>0">
                        <i class="el-icon-notebook-1" />
                        {{ scope.row[key]['class'].length }}
                      </div>
                      <div v-if="scope.row[key]['act'] && scope.row[key]['act'].length>0">
                        <i class="el-icon-discover" />
                        {{ scope.row[key]['act'].length }}
                      </div>
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-card>
      </el-main>
    </el-container>

    <el-dialog v-if="dialogVisible" :title="'第'+week+'周 ' + timedot['day'] + ' 第' + timedot['time']+ '节课 详情'" :visible.sync="dialogVisible" width="90%">
      <el-row type="flex" class="row-bg" justify="center">
        <el-col v-if="timedot['class'].length > 0">
          <el-table
            :data="timedot['class']"
            stripe
            max-height="300px"
            style="width: 100%"
          >
            <el-table-column
              label="有课班级"
              min-width="85"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col v-if="timedot['classEmpty'].length > 0">
          <el-table
            :data="timedot['classEmpty']"
            stripe
            style="width: 100%"
            max-height="300px"
          >
            <el-table-column
              label="无课班级"
              min-width="85"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col v-if="timedot['act'].length > 0">
          <el-table
            :data="timedot['act']"
            stripe
            style="width: 100%"
            max-height="300px"
          >
            <el-table-column
              label="活动列表"
              min-width="85"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTimetable } from '@/api/timetable'

export default {
  name: 'LayoutIndex',
  data() {
    return {
      timetableLoading: true,
      filterLoading: true,
      timetableOrigin: null,
      timetable: [],
      timedot: {
        'day': null,
        'time': null,
        'class': null,
        'classEmpty': null,
        'act': null
      },
      week: 1,
      years: [0, 0, 0],
      major: ['电子(国)', '机械(国)', '制药(国)', '金融(中美)', '计(中美)', '电气(中澳)'],
      classes: [
        { 'year': null, 1: '1班', 2: '1班', 3: '1班', 4: '1班', 5: '1班', 6: '1班' },
        { 'year': null, 1: '2班', 2: '2班', 3: '2班', 4: '2班', 5: '2班', 6: '2班' },
        { 'year': null, 1: '1班', 2: '1班', 3: '1班', 4: '1班', 5: '1班', 6: '1班' },
        { 'year': null, 1: '2班', 2: '2班', 3: '2班', 4: '2班', 5: '2班', 6: '2班' },
        { 'year': null, 1: '1班', 2: '1班', 3: '1班', 4: '1班', 5: '1班', 6: '1班' },
        { 'year': null, 1: '2班', 2: '2班', 3: '2班', 4: '2班', 5: '2班', 6: '2班' }
      ],
      classesCheck: [],
      classesCheckYear: { 0: [], 1: [], 2: [] },
      classesCheckFull: [],
      dayString: { 1: '星期一', 2: '星期二', 3: '星期三', 4: '星期四', 5: '星期五', 6: '星期六', 7: '星期日' },
      dialogVisible: false
    }
  },
  computed: {

  },
  watch: {
    classesCheck: function() {
      if (!this.timetableLoading) {
        this.renewTimetable()
      }
    }
  },
  created() {
    this.filterLoading = true
    this.setYear()
    this.setClasses()
    this.setTimetable()
    this.classesCheck = this.classesCheckFull
    this.filterLoading = false
    this.fetchTimetable()
  },
  methods: {
    filterSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    setYear() {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth()
      if (month < 9) {
        this.years = [year - 3, year - 2, year - 1]
      } else {
        this.years = [year - 2, year - 1, year]
      }
      for (let i = 0; i < 6; i++) {
        this.classes[i]['year'] = this.years[Math.floor(i / 2)]
      }
    },
    setClasses() {
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 3; j++) {
          for (let k = 1; k < 3; k++) {
            const title = this.major[i] + this.years[j].toString().substring(2) + '0' + k
            this.classesCheckYear[j].push(title)
            this.classesCheckFull.push(title)
          }
        }
      }
    },
    setTimetable() {
      for (let i = 1; i < 11; i++) {
        const line = { 'time': i < 10 ? '0' + i : i.toString() }
        for (let j = 1; j < 8; j++) {
          line[j] = { 'class': null, 'act': null }
        }
        this.timetable.push(line)
      }
    },
    checkYear(year) {
      let flag = true
      this.classesCheck = this.classesCheck.filter(c => {
        if (this.classesCheckYear[year].includes(c)) {
          flag = false
          return false
        } else {
          return true
        }
      })
      if (flag) {
        this.classesCheck.push.apply(this.classesCheck, this.classesCheckYear[year])
      }
    },
    fetchTimetable() {
      this.timetableLoading = true
      getTimetable(this.week).then(response => {
        this.timetableOrigin = response
        this.renewTimetable()
      })
    },
    renewTimetable() {
      this.timetableLoading = true
      for (let i = 0; i < this.timetableOrigin.length; i++) {
        const time = this.timetableOrigin[i]['time'] - 1
        const day = this.timetableOrigin[i]['day']
        let classes = this.timetableOrigin[i]['student_class'].split(',')
        let acts = this.timetableOrigin[i]['act'].split(',')
        classes = classes.filter(c => this.classesCheck.includes(c))
        if (acts[0] === '') { acts = [] }
        this.timetable[time][day]['class'] = classes
        this.timetable[time][day]['act'] = acts
      }
      this.timetableLoading = false
    },
    handleDialog(timeline, day) {
      this.timedot['day'] = this.dayString[day]
      this.timedot['time'] = timeline['time']
      this.timedot['class'] = timeline[day]['class']
      this.timedot['act'] = timeline[day]['act']
      this.timedot['classEmpty'] = this.classesCheck.filter(c => !timeline[day]['class'].includes(c))
      this.dialogVisible = true
    }
  }
}

</script>

<style scoped>
  .row-bg {
    padding: 10px 0;
    text-align: center;
    /*background-color: #f9fafc;*/
  }
  .collapse >>> .el-collapse-item__header {
    font-size: 16px;
    text-align: center;
  }
  .week {
    width: 80%;
  }
  .title >>> .el-alert__title {
    font-size: 20px;
  }
</style>
