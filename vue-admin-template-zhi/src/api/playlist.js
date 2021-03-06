import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

// 发送请求，组件中可引用
export function fetchList(params){
  return request({
    params,
    url: `${baseURL}/playlist/list`,
    method: 'get',
    // withCredentials:true
  })
}

export function fetchById(params) {
  return request({
    params,
    url: `${baseURL}/playlist/getById`,
    method: 'get'
  })
}

export function update(params) {
  return request({
    url: `${baseURL}/playlist/updatePlaylist`,
    data: {
      ...params
    },
    method: 'post',
    // withCredentials:true
  })
}

export function del(params) {
  return request({
    params,
    url: `${baseURL}/playlist/del`,
    method: 'get',
  })
}
