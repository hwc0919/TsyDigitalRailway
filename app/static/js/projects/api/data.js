import axios from '@/libs/api.request'

export const getProjectList = () => {
  return axios.request({
    url: 'ListProjectsHandler.ashx',
    method: 'get'
  })
}

export const uploadPrjLogo = (prjDir, logoFile) => {
  let formdata = new FormData()
  formdata.append('prjDir', prjDir)
  formdata.append('logoFile', logoFile)

  return axios.request({
    url: 'uploadPrjLogoHandler.ashx',
    method: 'post',
    data: formdata
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}
