import request from '@/utils/request'

export function createCourse(data) {
  return request({
    url: '/courses/',
    method: 'post',
    data
  })
}

export function getCourse() {
  return request({
    url: '/courses/',
    method: 'get'
  })
}

export function getCourseByStudent(id) {
  return request({
    url: '/courses/?student=' + id,
    method: 'get'
  })
}

export function updateCourse(id, data) {
  return request({
    url: '/courses/' + id + '/',
    method: 'put',
    data
  })
}

export function deleteCourse(id) {
  return request({
    url: '/courses/' + id + '/',
    method: 'delete'
  })
}
