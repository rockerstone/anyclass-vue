import request from '@/utils/request'

export function getStudent() {
  return request({
    url: '/students/',
    method: 'get'
  })
}

export function deleteStudent(id) {
  return request({
    url: '/students/' + id + '/',
    method: 'delete'
  })
}
