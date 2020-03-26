import request from '@/utils/request'

export function register(data) {
  return request({
    url: '/users/',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/token/',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/users/',
    method: 'get'
  })
}

export function getInfoAll() {
  return request({
    url: '/users/all/',
    method: 'get'
  })
}

export function updateInfo(id, data) {
  return request({
    url: '/users/' + id + '/',
    method: 'put',
    data
  })
}
