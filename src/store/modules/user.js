import find from 'lodash/find'
export default {
  namespaced: true,
  state: {
    id: 0,
    sysUserType: null,
    name: '',
    mobile: null,
    currentCompany: null,
    companyList: null,
    registerCompany: null,
    userRealName: null,
    userSignAuth: false
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateSysUserType (state, sysUserType) {
      state.sysUserType = sysUserType
    },
    updateCurrentCompany (state, currentCompany) {
      state.currentCompany = currentCompany
    },
    updateCompanyList (state, companyList) {
      state.companyList = companyList
      state.registerCompany = find(companyList, i => i.status !== 4)
    },
    updateMobile (state, mobile) {
      state.mobile = mobile
    },
    updateRegisterCompany (state, registerCompany) {
      state.registerCompany = registerCompany
    },
    updateUserRealName (state, userRealName) {
      state.userRealName = userRealName
    },
    updateUserSignAuth (state, userSignAuth) {
      state.userSignAuth = userSignAuth
    }
  }
}
