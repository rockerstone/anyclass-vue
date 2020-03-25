import request from '@/utils/request'

export function createAct(data) {
  return request({
    url: '/acts/',
    method: 'post',
    data
  })
}

export function getAct() {
  return request({
    url: '/acts/',
    method: 'get'
  })
}

export function updateAct(id, data) {
  return request({
    url: '/acts/' + id + '/',
    method: 'put',
    data
  })
}

export function deleteAct(id) {
  return request({
    url: '/acts/' + id + '/',
    method: 'delete'
  })
}
