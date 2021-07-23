import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        companyName:'随便起的公司名',
        logo:'',
    },
    getters:{
        companyName:state =>{
            let companyName = state.companyName
            if(!companyName){
                companyName = JSON.parse(window.sessionStorage.getItem('companyName'))
            }
            return companyName
        },
        logo:state =>{
            let logo = state.logo
            if(!logo){
                logo = JSON.parse(window.sessionStorage.getItem('logo'))
            }
            return logo
        }
    },
    mutations:{
        setCompanyName: (state,companyName) =>{
            state.companyName = companyName
            window.sessionStorage.setItem('companyName',JSON.stringify(companyName))
        },
        setLogo: (state,logo) =>{
            state.logo = logo
            window.sessionStorage.setItem('logo',JSON.stringify(logo))
        }
    }
})

export default store