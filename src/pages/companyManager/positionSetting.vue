<template>
  <div class="positionSetting">
    <div class="popoverWrapper">
      <el-popover
        ref="addCompanyAndDepts"
        placement="bottom"
        width="250"
        trigger="click">
        <el-button type="primary" size="mini" class="el-icon-circle-plus-outline" @click="createCompanyDig = true"> 创建新公司</el-button>
        <el-button size="mini" class="el-icon-circle-plus-outline" @click="createDeptDig = true"> 创建直属部门</el-button>
      </el-popover>
    </div>

    <div class="headerWrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>Artist</el-breadcrumb-item>
        <el-breadcrumb-item>公司管理</el-breadcrumb-item>
        <el-breadcrumb-item>职位设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="contentWrapper">
      <div class="leftWrapper">
        <div class="title">团队职位设置</div>
        <div class="main">
          <el-input prefix-icon="el-icon-search" v-model="searchKey" size="small" placeholder="输入关键词搜索" class="searchInp"></el-input>
          <el-button size="small" icon="el-icon-plus" class="createGroupBtn" v-popover:addCompanyAndDepts plain @click="createCompanyOrDept">创建新公司 / 直属部门</el-button>
          <el-tree
          lazy
          :data="companies"
          :props="defaultProps"
          :load = "getChildCompanyOrDep"
          :highlight-current="false"
          @node-click="clickPosition"
          :render-content="optionsRender"
          :filter-node-method="filterNode"
          ref="positionsTree"
          node-key="id">
          </el-tree>
        </div>
      </div>

      <div class="rightWrapper">
        <div class="title">职位权限设置</div>
        <div class="contents">
          <div class="disablePositions" v-show="disablePositions">
            <img src="static/imgs/disablePositions.png" alt="暂无图片">
          </div>
          <div class="main">
            <div class="left">
              <div class="leftItem bt-hover" :class="{'active':selIndex == index}" v-for="(item,index) in allJurisdiction" @click="selNav(index)">
                <span class="desc">{{item.title}}</span>
              </div>
            </div>
            <div class="right" ref="jurisdictions">
              <div class="rightItem" v-for="(item,index) in allJurisdiction" id="myItem">
                <div class="rightItemTitle">{{item.title}}</div>
                <div class="rightItemContent">
                  <div class="rightItemJurisdiction" v-for="jurisdictionItem in item.childs">
                    <div class="jurisdictionTitle">{{jurisdictionItem.title}}</div>
                    <el-checkbox-group v-model="test" class="checkboxs">
                      <el-checkbox
                        class="cb"
                        v-for="jurusdictions in jurisdictionItem.jurusdictions"
                        :key="jurusdictions.id"
                        :label="jurusdictions.title">
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="dialogWrapper">
      <el-dialog
        title="创建公司"
        :visible.sync="createCompanyDig"
        width="40%">
        <div class="createCompanyWrapper">
          <div class="item">
            <span class="title">名称：</span>
            <el-input size="small" v-model.trim="createCompanyData.name" placeholder="请填写公司名称"></el-input>
            <span class="requireMark">*</span>
          </div>
          <div class="item">
            <span class="title">主页：</span>
            <el-input size="small" v-model.trim="createCompanyData.url" placeholder="请填写公司主页地址"></el-input>
            <span class="requireMark">*</span>
          </div>
          <div class="item">
            <span class="title">公司地址：</span>
            <el-input size="small" v-model.trim="createCompanyData.address" placeholder="请填写公司导航地址"></el-input>
            <span class="requireMark">*</span>
          </div>
          <div class="item">
            <span class="title">联系人：</span>
            <el-input size="small" v-model.trim="createCompanyData.contactPerson" placeholder="请填写公司联系人"></el-input>
            <span class="requireMark">*</span>
          </div>
          <div class="item">
            <span class="title">联系电话：</span>
            <el-input size="small" v-model.trim="createCompanyData.phone" :maxlength="11" placeholder="请填写公司联系电话"></el-input>
            <span class="requireMark">*</span>
          </div>
          <div class="item">
            <span class="title">公司状态：</span>
            <el-radio v-model="createCompanyData.status" :label="1">有效</el-radio>
            <el-radio v-model="createCompanyData.status" :label="0">无效</el-radio>
          </div>
          <div class="item">
            <span class="title">公司logo：</span>
            <img :src="createCompanyData.logoUrl" alt="暂无图片" class="bt-hover" onClick="uploadLogo.click()">
            <input type="file" hidden id="uploadLogo" @change="uploadLogoChange">
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="createCompanyDig = false">取 消</el-button>
          <el-button type="primary" @click="addCompanyConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="创建部门"
        :visible.sync="createDeptDig"
        width="25%">
        <div class="createDeptWrapper">
          <div class="item">
            <span class="title">名称：</span>
            <el-input size="small" v-model.trim="createDeptData.name" placeholder="请填写直属部门名称"></el-input>
            <span class="requireMark">*</span>
          </div>
          <div class="item">
            <span class="title">负责人：</span>
            <el-select class="whellmanSelect" v-model="createDeptData.principal_id" size="small" placeholder="请选择">
              <el-option
                v-for="item in allWhellman"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="requireMark">*</span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="createDeptDig = false">取 消</el-button>
          <el-button type="primary" @click="addDeptConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="创建职位"
        :visible.sync="createPositionDig"
        width="25%">
        <div class="createPositionWrapper">
          <div class="item">
            <span class="title">名称：</span>
            <el-input size="small" v-model.trim="createPositionData.name" placeholder="请填写职位名称"></el-input>
            <span class="requireMark">*</span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="createPositionDig = false">取 消</el-button>
          <el-button type="primary" @click="addPositionConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="公司编辑"
        :visible.sync="editCompanyDig"
        width="40%">
        <div class="editCompanyWrapper">
          <div class="item">
            <span class="title">名称：</span>
            <el-input size="small" v-model.trim="editCompanyData.name" @change="companyEditChange('name',editCompanyData.name)" placeholder="请填写公司名称"></el-input>
            <span class="requireMark">*</span>
          </div>
          <div class="item">
            <span class="title">主页：</span>
            <el-input size="small" v-model.trim="editCompanyData.url" @change="companyEditChange('url',editCompanyData.url)" placeholder="请填写公司主页地址"></el-input>
            <span class="requireMark">*</span>
          </div>
          <div class="item">
            <span class="title">公司地址：</span>
            <el-input size="small" v-model.trim="editCompanyData.address" @change="companyEditChange('address',editCompanyData.address)" placeholder="请填写公司导航地址"></el-input>
            <span class="requireMark">*</span>
          </div>
          <div class="item">
            <span class="title">联系人：</span>
            <el-input size="small" v-model.trim="editCompanyData.contactPerson" @change="companyEditChange('contactPerson',editCompanyData.contactPerson)" placeholder="请填写公司联系人"></el-input>
            <span class="requireMark">*</span>
          </div>
          <div class="item">
            <span class="title">联系电话：</span>
            <el-input size="small" v-model.trim="editCompanyData.phone" :maxlength="11" @change="companyEditChange('phone',editCompanyData.phone)" placeholder="请填写公司联系电话"></el-input>
            <span class="requireMark">*</span>
          </div>
          <div class="item">
            <span class="title">公司状态：</span>
            <el-radio-group v-model="editCompanyData.status" @change="companyEditChange('status',editCompanyData.status)">
              <el-radio :label="1">有效</el-radio>
              <el-radio :label="0">无效</el-radio>
            </el-radio-group>
          </div>
          <div class="item">
            <span class="title">公司logo：</span>
            <img :src="editCompanyData.logoUrl" alt="暂无图片" class="bt-hover" onClick="uploadLogoByEdit.click()">
            <input type="file" hidden id="uploadLogoByEdit" @change="uploadLogoChangeByEdit">
          </div>
        </div>
      </el-dialog>

      <el-dialog
        title="部门编辑"
        :visible.sync="editDeptDig"
        width="25%">
        <div class="editDeptWrapper">
          <div class="item">
            <span class="title">名称：</span>
            <el-input size="small" v-model.trim="editDeptData.name" @change="deptEditChange('name',editDeptData.name)" placeholder="请填写部门名称"></el-input>
            <span class="requireMark">*</span>
          </div>
          <div class="item">
            <span class="title">负责人：</span>
            <el-select class="whellmanSelect" v-model="editDeptData.principalId" @change="deptEditChange('principalId',editDeptData.principalId)" size="small" placeholder="请选择">
              <el-option
                v-for="item in allWhellman"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="requireMark">*</span>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        title="职位编辑"
        :visible.sync="editPositionDig"
        width="20%">
        <div class="editPositionWrapper">
          <div class="item">
            <span class="title">名称：</span>
            <el-input size="small" v-model.trim="editPositionData.name" placeholder="请填写职位名称"></el-input>
            <span class="requireMark">*</span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editPositionDig = false">取 消</el-button>
          <el-button type="primary" @click="editPositionDig = true">确 定</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import utils from '@/commons/Batar/utils'

export default {
  data() {
    return {
      searchKey: '',
      editCompanyData: {},
      editDeptData: {},
      editPositionData: {},
      allWhellman: [{ id: '1', name: '许文祥' }, { id: '2', name: '张三' }],
      createCompanyData: {
        parentId: null,
        name: '',
        url: '',
        address: '',
        contactPerson: '',
        phone: '',
        status: 1,
        logoUrl: 'static/imgs/syBg.png'
      },
      createDeptData: {
        name: '',
        companyId: null,
        parentId: null,
        principal_id: null
      },
      createPositionData: {
        name: '',
        deptId: null,
        parentJobId: null,
        companyId: null
      },
      createDeptDig: false,
      createCompanyDig: false,
      createPositionDig: false,
      editCompanyDig: false,
      editDeptDig: false,
      editPositionDig: false,
      selIndex: 0,
      disablePositions: true,
      test: [],
      defaultProps: {
        label: 'name',
        isLeaf: 'leaf'
      },
      selId: null,
      selType: null,
      allJurisdiction: [
        {
          id: 1,
          title: '产品管理',
          childs: [
            {
              id: 11,
              title: '产品库',
              status: false,
              jurusdictions: [
                { id: 111, title: '刷新产品库', status: true },
                { id: 112, title: '搜索产品', status: false }
              ]
            },
            {
              id: 12,
              title: '产品添加',
              status: false,
              jurusdictions: [
                { id: 121, title: '范德萨', status: true },
                { id: 122, title: '法规的发生', status: false }
              ]
            }
          ]
        },
        {
          id: 2,
          title: '推广类别',
          childs: [
            {
              id: 21,
              title: '推广类别',
              status: false,
              jurusdictions: [
                { id: 211, title: '发的撒谎', status: true },
                { id: 212, title: '好好干发货单', status: false }
              ]
            }
          ]
        },
        {
          id: 3,
          title: '推广栏目',
          childs: [
            {
              id: 31,
              title: '产品库',
              status: false,
              jurusdictions: [
                { id: 311, title: '刷新产品库', status: true },
                { id: 312, title: '搜索产品', status: false }
              ]
            },
            {
              id: 32,
              title: '产品添加',
              status: false,
              jurusdictions: [
                { id: 321, title: '范德萨', status: true },
                { id: 322, title: '法规的发生', status: false }
              ]
            }
          ]
        },
        {
          id: 4,
          title: '首页定制',
          childs: [
            {
              id: 41,
              title: '产品库',
              status: false,
              jurusdictions: [
                { id: 411, title: '刷新产品库', status: true },
                { id: 412, title: '搜索产品', status: false }
              ]
            },
            {
              id: 42,
              title: '产品添加',
              status: false,
              jurusdictions: [
                { id: 421, title: '范德萨', status: true },
                { id: 422, title: '法规的发生', status: false }
              ]
            }
          ]
        },
        {
          id: 5,
          title: '销售管理',
          childs: [
            {
              id: 51,
              title: '产品库',
              status: false,
              jurusdictions: [
                { id: 511, title: '刷新产品库', status: true },
                { id: 512, title: '搜索产品', status: false }
              ]
            },
            {
              id: 52,
              title: '产品添加',
              status: false,
              jurusdictions: [
                { id: 521, title: '范德萨', status: true },
                { id: 522, title: '法规的发生', status: false }
              ]
            }
          ]
        },
        {
          id: 6,
          title: '客户管理',
          childs: [
            {
              id: 61,
              title: '产品库',
              status: false,
              jurusdictions: [
                { id: 611, title: '刷新产品库', status: true },
                { id: 612, title: '搜索产品', status: false }
              ]
            },
            {
              id: 62,
              title: '产品添加',
              status: false,
              jurusdictions: [
                { id: 621, title: '范德萨', status: true },
                { id: 622, title: '法规的发生', status: false }
              ]
            }
          ]
        },
        {
          id: 7,
          title: '公司管理',
          childs: [
            {
              id: 71,
              title: '产品库',
              status: false,
              jurusdictions: [
                { id: 711, title: '刷新产品库', status: true },
                { id: 712, title: '搜索产品', status: false }
              ]
            },
            {
              id: 72,
              title: '产品添加',
              status: false,
              jurusdictions: [
                { id: 721, title: '范德萨', status: true },
                { id: 722, title: '法规的发生', status: false }
              ]
            }
          ]
        }
      ],
      heightLists: [],
      companies: [],
      tempType: 0,
      currentEditNode: null
    }
  },
  methods: {
    getMenus(){
      this.Axios.get('/account/menu').then(res=>{
        let result = res.data
        if(result.code == 0){
          // this.allJurisdiction = result.data.menu
        }else{
          this.$message.error(result.msg)
        }
      }).catch(err=>{
        this.extCatch(err,this.getMenus)
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    addPositionConfirm() {
      if (this.addPositionConfirmCheck()) {
        this.Axios
          .post('company/postionSet/postion', this.createPositionData)
          .then(res => {
            let result = res.data
            if (result.code == 0) {
              this.$message.success('添加成功')
              this.createPositionDig = false
              this.postionSet()
            } else {
              this.$message.error(result.msg)
            }
          })
          .catch(err => {
            this.extCatch(err, this.addPositionConfirm)
          })
      }
    },
    addPositionConfirmCheck() {
      let tempCreatePositionData = this.createPositionData
      if (!tempCreatePositionData || tempCreatePositionData.name == '') {
        this.$message.error('职位名称不能为空')
        return false
      }
      return true
    },
    createCompanyOrDept() {
      // 创建一级公司/部门
      this.createCompanyData.parentId = null
      this.createDeptData.companyId = null
      this.createDeptData.parentId = null
    },
    companyEditChange(name, val) {
      let params = {
        id: this.editCompanyData.id,
        [name]: val
      }
      this.Axios
        .put('/company/company', params)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.$message.success('修改成功')
            if (name == 'name') {
              this.currentEditNode.data.name = val
            }
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.companyEditChange)
        })
    },
    deptEditChange(name, val) {
      this.Axios
        .put('/company/postionSet/department', this.editDeptData)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.$message.success('修改成功')
            if (name == 'name') {
              this.currentEditNode.data.name = val
            }
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.deptEditChange)
        })
    },
    uploadLogoChangeByEdit(e) {
      utils.encodeBase64(e).then(data => {
        this.editCompanyData.logoUrl = data
        this.companyEditChange('logoUrl', data)
      })
    },
    addDeptConfirm() {
      if (this.addDeptConfirmCheck()) {
        this.Axios
          .post('company/postionSet/department', this.createDeptData)
          .then(res => {
            let result = res.data
            if (result.code == 0) {
              this.createDeptDig = false
              this.$message.success('添加成功')
              this.postionSet()
            } else {
              this.$message.error(result.msg)
            }
          })
          .catch(err => {
            this.extCatch(err, this.addDeptConfirm)
          })
      }
    },
    addDeptConfirmCheck() {
      let tempCreateDeptData = this.createDeptData
      if (tempCreateDeptData.name == '') {
        this.$message.error('直属部门名称不能为空')
        return false
      }
      if (
        !tempCreateDeptData.principal_id ||
        tempCreateDeptData.principal_id == ''
      ) {
        this.$message.error('负责人不能为空')
        return false
      }
      return true
    },
    addCompanyConfirm() {
      if (this.checkCompanyData()) {
        this.Axios
          .post('/company/company', this.createCompanyData)
          .then(res => {
            let result = res.data
            if (result.code == 0) {
              this.$message.success('添加成功')
              this.createCompanyDig = false
              this.postionSet()
            } else {
              this.$message.error(result.msg)
            }
          })
          .catch(err => {
            this.extCatch(err, this.addCompanyConfirm)
          })
      }
    },
    checkCompanyData() {
      let data = this.createCompanyData
      if (data.name == '') {
        this.$message.error('请输入公司名称')
        return false
      }
      if (data.url == '') {
        this.$message.error('请输入公司主页')
        return false
      }
      if (data.address == '') {
        this.$message.error('请输入公司导航地址')
        return false
      }
      if (data.contactPerson == '') {
        this.$message.error('请输入联系人')
        return false
      }
      if (data.phone == '') {
        this.$message.error('请输入联系人电话')
        return false
      }
      if (data.logoUrl == '' || data.logoUrl == 'static/imgs/syBg.png') {
        this.$message.error('请上传logo')
        return false
      }
      return true
    },
    uploadLogoChange(e) {
      utils.encodeBase64(e).then(data => {
        this.createCompanyData.logoUrl = data
      })
    },
    postionSet() {
      // 公司部门列表
      this.Axios
        .get('/company/postionSet')
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.companies = result.data.companies.concat(result.data.depts) // 所有一级公司
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.postionSet)
        })
    },
    getChildCompanyOrDep(node, resolve) {
      if (node.level === 0) {
        return resolve([])
      }
      setTimeout(() => {
        switch (node.data.type) {
          case 0:
            this.clickCompany(node, resolve)
            break
          case 1:
            this.clickDepts(node, resolve)
            break
          default:
            this.$message.error('无法预知的层级：error type')
        }
      }, 100)
    },
    clickCompany(node, resolve) {
      this.disablePositions = true
      this.Axios
        .get(`/company/postionSet/list/${node.data.id}`)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            let resultArray = result.data.companies.concat(result.data.depts)
            resolve(resultArray)
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.clickCompany)
        })
    },
    clickDepts(node, resolve) {
      this.disablePositions = true
      this.Axios
        .get(`/company/postionSet/department/${node.data.id}`)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            result.data.postions.forEach(obj => {
              obj.leaf = true
            })
            let resultArray = result.data.depts.concat(result.data.postions)
            resolve(resultArray)
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.clickDepts)
        })
    },
    clickPosition(data) {
      if (data.type == 0 || data.type == 1) {
        this.disablePositions = true
      } else if (data.type == 2) {
        this.disablePositions = false
        // this.$message.success('您点击了职位')
      }
    },
    selNav(index) {
      this.selIndex = index

      let myItems = document.querySelectorAll('#myItem')
      let total = myItems[index].offsetTop - 10
      this.$refs.jurisdictions.scrollTop = total
    },
    // 创建子公司/部门(一级部门/子部门)
    append(e, node, data) {
      // 公司
      this.createCompanyData.parentId = data.id
      // 职位
      this.createPositionData.deptId = data.id
      this.createPositionData.companyId = data.companyId ? data.companyId : null
      let type = data.type
      // 部门
      switch (type) {
        case 0:
          this.createDeptData.companyId = data.id
          this.createDeptData.parentId = null
          this.tempType = 0
          break
        case 1:
          this.createDeptData.companyId = data.companyId
          this.createDeptData.parentId = data.id
          this.tempType = 1
          break
        default:
          this.$message.error('type无效，请联系后台工作人员！')
      }
      e.cancelBubble = true
    },
    edit(e, node, data) {
      this.currentEditNode = node
      let type = data.type
      switch (type) {
        case 0:
          this.editCompanyDig = true
          this.getCompanyEditInfo(data.id)
          break
        case 1:
          this.editDeptDig = true
          this.getDeptEditInfo(data.id)
          break
        case 2:
          this.editPositionDig = true
          this.getPositionEditInfo(data.id)
          break
      }
      e.cancelBubble = true
    },
    getCompanyEditInfo(id) {
      this.Axios
        .get(`/company/company/${id}`)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.editCompanyData = result.data
            this.editCompanyData.logoUrl = result.data.logoUrl
              ? result.data.logoUrl
              : 'static/imgs/syBg.png'
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.getCompanyEditInfo)
        })
    },
    getDeptEditInfo(id) {
      this.Axios
        .get(`/company/postionSet/getDepartment/${id}`)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.editDeptData = result.data
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.getDeptEditInfo)
        })
    },
    getPositionEditInfo(id) {
      this.Axios
        .get(`/company/postionSet/postion/${id}`)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.editPositionData = result.data
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.getPositionEditInfo)
        })
    },
    remove(e, node, data) {
      this.$confirm('确定删除？', '提示', { type: 'warning' })
        .then(() => {
          let type = data.type
          switch (type) {
            case 0:
              this.delCompany(node, data)
              break
            case 1:
              this.delDept(node, data)
              break
            case 2:
              this.delPosition(node, data)
              break
          }
        })
        .catch(err => {})
      e.cancelBubble = true
    },
    delCompany(node, data) {
      this.Axios
        .delete(`/company/company/${data.id}`)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.$message.success('删除成功')
            this.postionSet()
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.delCompany)
        })
    },
    delDept(node, data) {
      this.Axios
        .delete(`/company/postionSet/department/${data.id}`)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.$message.success('删除成功')
            this.postionSet()
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.delDept)
        })
    },
    delPosition(node, data) {
      this.Axios
        .delete(`company/postionSet/postion/${data.id}`)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.$message.success('删除成功')
            this.postionSet()
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.delPosition)
        })
    },
    positionMouseover(data) {
      this.selId = data.id
      this.selType = data.type
    },
    positionMouseout() {
      this.selId = null
      this.selType = null
    },
    optionsRender(h, { node, data, store }) {
      return (
        <span
          on-mouseover={() => this.positionMouseover(data)}
          on-mouseout={() => this.positionMouseout()}
          style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;"
        >
          <span>
            <span>{node.label}</span>
          </span>
          <span
            v-show={
              this.selId == node.data.id && this.selType == node.data.type
            }
          >
            <el-popover placement="top" width="230" trigger="click">
              <div v-show={this.tempType == 0}>
                <el-button
                  type="primary"
                  size="mini"
                  class="el-icon-circle-plus-outline"
                  onClick={() => {
                    this.createCompanyDig = true
                  }}
                >
                  {' '}
                  创建子公司
                </el-button>
                <el-button
                  size="mini"
                  class="el-icon-circle-plus-outline"
                  onClick={() => {
                    this.createDeptDig = true
                  }}
                >
                  {' '}
                  创建子部门
                </el-button>
              </div>
              <div v-show={this.tempType == 1}>
                <el-button
                  type="primary"
                  size="mini"
                  class="el-icon-circle-plus-outline"
                  onClick={() => {
                    this.createDeptDig = true
                  }}
                >
                  {' '}
                  创建子部门
                </el-button>
                <el-button
                  size="mini"
                  class="el-icon-circle-plus-outline"
                  onClick={() => {
                    this.createPositionDig = true
                  }}
                >
                  {' '}
                  创建职位
                </el-button>
              </div>
              <el-button
                style="font-size: 13px;height:20px;margin-right:7px"
                type="text"
                slot="reference"
                onClick={e => this.append(e, node, data)}
              >
                <i class="el-icon-plus" />
              </el-button>
            </el-popover>
            <el-button
              style="font-size: 13px;"
              type="text"
              onClick={e => this.edit(e, node, data)}
            >
              <i class="el-icon-edit-outline" />
            </el-button>
            <el-button
              style="font-size: 13px;"
              type="text"
              onClick={e => this.remove(e, node, data)}
            >
              <i class="el-icon-delete" />
            </el-button>
          </span>
        </span>
      )
    },
    _handleScroll() {
      let scrollTop = this.$refs.jurisdictions.scrollTop
      for (let i = 0; i < this.heightLists.length; i++) {
        let height1 = this.heightLists[i]
        let height2 = this.heightLists[i + 1]
        if (scrollTop >= height1 && scrollTop < height2) {
          this.selIndex = i
        }
      }
    },
    _initGetHeights() {
      // 获取所有权限模块高度
      let height = 0
      this.heightLists.push(height)
      let myItems = document.querySelectorAll('#myItem')
      for (let i = 0; i < myItems.length; i++) {
        height += myItems[i].clientHeight + 16
        this.heightLists.push(height)
      }
    },
    _monitorScroll() {
      // 滚动监听
      let jurisdictions = this.$refs.jurisdictions
      jurisdictions.addEventListener('scroll', this._handleScroll)
    }
  },
  mounted() {
    this.postionSet()

    this._monitorScroll()
    this._initGetHeights()
    this.getMenus()
  },
  watch: {
    createCompanyDig(val) {
      if (!val) {
        this.createCompanyData = {
          name: '',
          url: '',
          address: '',
          contactPerson: '',
          phone: '',
          status: 1,
          logoUrl: 'static/imgs/syBg.png'
        }
      }
    },
    createDeptDig(val) {
      if (!val) {
        this.createDeptData = {
          name: '',
          companyId: null,
          parentId: null,
          principal_id: null
        }
      }
    },
    createPositionDig(val) {
      if (!val) {
        this.createPositionData = {
          name: '',
          deptId: null,
          parentJobId: null,
          companyId: null
        }
      }
    },
    searchKey(val) {
      this.$refs.positionsTree.filter(val)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
.positionSetting
  .headerWrapper
    border-bottom 1px solid #D9D9D9
    padding-bottom 10px
  .contentWrapper
    display flex
    .title
      font-size 15px
      padding-left 10px
      margin 15px 0
      border-left 3px solid $base-color
    .leftWrapper
      width 300px
      flex 0 300px
      margin-right 20px
      .main
        box-sizing border-box
        border 1px solid #D9D9D9
        border-radius 5px
        height 750px
        overflow auto
        padding 10px
        .createGroupBtn
          margin 10px 0
          width 100%
    .rightWrapper
      flex 1
      overflow hidden
      .contents
        position relative
        .disablePositions
          position absolute
          z-index 2
          top 0
          bottom 0
          left 0
          right 0
          background #fff
          display flex
          align-items center
          justify-content center
        .main
          border 1px solid #D9D9D9
          box-sizing border-box
          border-radius 5px
          height 750px
          overflow auto
          display flex
          .left
            width 150px
            flex 0 150px
            overflow auto
            border-right 1px solid #D9D9D9
            .leftItem
              box-sizing border-box
              border-left 3px solid #fff
              height 45px
              border-bottom 1px solid #F2F2F2
              color #333333
              display flex
              justify-content center
              align-items center
              transition background 0.5s
              &.active
                border-left 3px solid $base-color
                background-color #F2F2F2
              &:hover
                background-color #F2F2F2
              .desc
                border-left none
          .right
            flex 1
            padding 0 16px 16px 16px
            color #333333
            overflow auto
            .rightItem
              margin-top 16px
              .rightItemTitle
                color #B5B5B5
                margin-bottom 15px
              .rightItemContent
                box-shadow 0 0 5px #B5B5B5
                padding 15px
                border-radius 5px
                .rightItemJurisdiction
                  .jurisdictionTitle
                    padding-bottom 10px
                    border-bottom 1px solid #F2F2F2
                  .checkboxs
                    margin 0 0 20px 15px
                    .cb
                      margin 15px 15px 0 0
  .dialogWrapper
    .requireMark
      color $base-color
      font-weight bold
      margin-left 5px
    .createCompanyWrapper, .editCompanyWrapper
      display flex
      flex-wrap wrap
      justify-content space-between
      .item
        width 45%
        display flex
        margin-bottom 15px
        align-items center
        &:last-of-type
          img
            width 130px
            height 40px
            border-radius 5px
        .title
          white-space nowrap
          min-width 80px
          text-align right
    .createDeptWrapper, .editDeptWrapper
      .item
        width 100%
        display flex
        align-items center
        margin-bottom 15px
        .title
          min-width 60px
          text-align right
          white-space nowrap
        .whellmanSelect
          width 100%
    .editPositionWrapper
      .item
        display flex
        align-items center
        .title
          white-space nowrap
    .createPositionWrapper
      .item
        display flex
        align-items center
        .title
          white-space nowrap
</style>
