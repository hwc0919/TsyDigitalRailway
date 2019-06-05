// import { getParams } from '@/libs/util'
const USER_MAP = {
  super_admin: {
    name: 'super_admin',
    user_id: '1',
    access: ['super_admin', 'admin'],
    token: 'super_admin',
    avator: ''
  },
  admin: {
    name: 'admin',
    user_id: '2',
    access: ['admin'],
    token: 'admin',
    avator: ''
  }
}

export const login = req => {
  // req = JSON.parse(req.body)
  return Promise.resolve({ data: { token: USER_MAP[req.userName].token } })
}

export const getUserInfo = req => {
  // const params = getParams(req.url)
  return Promise.resolve({ data: USER_MAP[req] })
}

export const logout = req => {
  return Promise.resolve({ data: null })
}

export const getMessageInit = () => {
  let unreadList = []
  let readedList = []
  let trashList = []
  return Promise.resolve({ data: {
    unread: unreadList,
    readed: readedList,
    trash: trashList
  } })
}

export const getContentByMsgId = () => {
  return Promise.resolve({ data: `<divcourier new',="" monospace;font-weight:="" normal;font-size:="" 12px;line-height:="" 18px;white-space:="" pre;"=""><div>&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size: medium;">这是消息内容，这个内容是使用<span style="color: rgb(255, 255, 255); background-color: rgb(28, 72, 127);">富文本编辑器</span>编辑的，所以你可以看到一些<span style="text-decoration-line: underline; font-style: italic; color: rgb(194, 79, 74);">格式</span></span></div><ol><li>你可以查看Mock返回的数据格式，和api请求的接口，来确定你的后端接口的开发</li><li>使用你的真实接口后，前端页面基本不需要修改即可满足基本需求</li><li>快来试试吧</li></ol><p>${Random.csentence(100, 200)}</p></divcourier>` })
}

export const hasRead = () => {
  return Promise.resolve({ data: true })
}

export const removeReaded = () => {
  return Promise.resolve({ data: true })
}

export const restoreTrash = () => {
  return Promise.resolve({ data: true })
}

export const messageCount = () => {
  return Promise.resolve({ data: 3 })
}

export const getUnreadCount = () => {
  return Promise.resolve({ data: 3 })
}

export const getMessage = () => {
  return Promise.resolve({ data: 'No message!' })
}
/*
import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
*/
