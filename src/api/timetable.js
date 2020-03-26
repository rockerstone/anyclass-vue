import request from '@/utils/request'

export function getTimetable(week = 1) {
  return request({
    url: '/time_table/' + week + '/',
    method: 'get'
  })
}

export function createTimetable() {
  return request({
    url: '/time_table/create/',
    method: 'get'
  })
}

export function updateTimetable() {
  return request({
    url: '/time_table/update/',
    method: 'get'
  })
}
