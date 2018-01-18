import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index/index'
import Login from '@/pages/login/login'
import Production from '@/pages/productionManager/production'
import AddProduction from '@/pages/productionManager/addProduction'
import KindProperty from '@/pages/productionManager/kindProperty'
import CustomerManager from '@/pages/customerManager/customerManager'
import ContactWe from '@/pages/companyManager/contactWe'
import CompanySetting from '@/pages/companyManager/companySetting'
import AboutWe from '@/pages/companyManager/aboutWe'
import PositionSetting from '@/pages/companyManager/positionSetting'
import SellOrder from '@/pages/orderManager/sellOrder'
import AssistOrder from '@/pages/orderManager/assistOrder'
import HistoryOrder from '@/pages/orderManager/historyOrder'

import promotion from '@/pages/promotion/promotion'
import sale from '@/pages/sale/sale'
import saleteam from '@/pages/sale/saleteam'
import textPromo from '@/pages/promoColumn/textPromo'
import speedPromo from '@/pages/promoColumn/speedPromo'
import promoDisplay from '@/pages/promoColumn/promoDisplay'
import carouselSetting from '@/pages/promoColumn/carouselSetting'
import findContent from '@/pages/promoColumn/findContent'
import startPromoS from '@/pages/promoColumn/startPromoS'
import userFeedback from '@/pages/userFeedback/userFeedback'
import appManage from '@/pages/systemManage/appManage'
import logView from '@/pages/systemManage/logView'
import sensWordManage from '@/pages/systemManage/sensWordManage'
import userReg from '@/pages/systemManage/userReg'
import customerDiemn from '@/pages/dataStatis/customerDiemn'
import gatherCount from '@/pages/dataStatis/gatherCount'
import productDiemn from '@/pages/dataStatis/productDiemn'
import customHomepage from '@/pages/homepageCustom/customHomepage'
import homepageTemplet from '@/pages/homepageCustom/homepageTemplet'
import roleManage from '@/pages/userManage/roleManage'
import userManage from '@/pages/userManage/userManage'
import visitorVerify from '@/pages/userManage/visitorVerify'



Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: Index,
      children: [{
          path: '/',
          redirect: '/index/production'
        },
        {
          path: 'production',
          component: Production
        },
        {
          path: 'sellOrder',
          component: SellOrder
        },
        {
          path: 'assistOrder',
          component: AssistOrder
        },
        {
          path: 'historyOrder',
          component: HistoryOrder
        },
        {
          path: 'addProduction',
          component: AddProduction
        },
        {
          path: 'kindProperty',
          component: KindProperty
        },
        {
          path: 'customerManager',
          component: CustomerManager
        },
        {
          path: 'contactWe',
          component: ContactWe
        },
        {
          path: 'companySetting',
          component: CompanySetting
        },
        {
          path: 'positionSetting',
          component: PositionSetting
        },
        {
          path: 'aboutWe',
          component: AboutWe
        },
        {
          path: 'sale',
          component: sale
        },
        {
          path: 'saleteam',
          component: saleteam
        },
        {
          path: 'promotion',
          component: promotion
        },
        {
          path: 'textPromo',
          component: textPromo
        },
        {
          path: 'speedPromo',
          component: speedPromo
        },
        {
          path: 'promoDisplay',
          component: promoDisplay
        },
        {
          path: 'carouselSetting',
          component: carouselSetting
        },
        {
          path: 'findContent',
          component: findContent
        },
        {
          path: 'startPromoS',
          component: startPromoS
        },

        {
          path: 'userFeedback',
          component: userFeedback
        },
        {
          path: 'appManage',
          component: appManage
        },
        {
          path: 'logView',
          component: logView
        },
        {
          path: 'sensWordManage',
          component: sensWordManage
        },
        {
          path: 'userReg',
          component: userReg
        },
        {
          path: 'customerDiemn',
          component: customerDiemn
        },
        {
          path: 'gatherCount',
          component: gatherCount
        },
        {
          path: 'productDiemn',
          component: productDiemn
        },
        {
          path: 'customHomepage',
          component: customHomepage
        },
        {
          path: 'homepageTemplet',
          component: homepageTemplet
        },
        {
          path: 'roleManage',
          component: roleManage
        },
        {
          path: 'userManage',
          component: userManage
        },
        {
          path: 'visitorVerify',
          component: visitorVerify
        },
      ],
    },
    {
      path: '/login',
      component: Login
    }
  ]
})
