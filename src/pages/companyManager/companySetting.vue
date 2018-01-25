<template>
  <div class="companySetting">
    <div class="headerWrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>Artist</el-breadcrumb-item>
        <el-breadcrumb-item>公司管理</el-breadcrumb-item>
        <el-breadcrumb-item>公司设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="btnsWrapper">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addCompanyDialog = true">新增公司</el-button>
    </div>
    <div class="contentWrapper">
      <el-table
        :data="companys"
        @row-click="companysTable"
        border
        style="width:100%">
        <el-table-column
          align="center"
          label="公司名称">
          <template slot-scope="scope">
            <el-input size="small" v-model.trim="scope.row.name" @change="changeSetting('name',scope.row.name)"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="主页">
          <template slot-scope="scope">
            <el-input size="small" v-model.trim="scope.row.url" @change="changeSetting('url',scope.row.url)"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="公司地址">
          <template slot-scope="scope">
            <el-input size="small" v-model.trim="scope.row.address" @change="changeSetting('address',scope.row.address)"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="联系人">
          <template slot-scope="scope">
            <el-input size="small" v-model.trim="scope.row.contactPerson" @change="changeSetting('contactPerson',scope.row.contactPerson)"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="联系电话">
          <template slot-scope="scope">
            <el-input size="small" v-model.trim="scope.row.phone" :maxlength="11" @change="changeSetting('phone',scope.row.phone)"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="公司logo">
          <template slot-scope="scope">
            <img class="logoImg bt-hover" :src="fileAddress + scope.row.logoUrl" alt="暂无Logo" onClick="uploadLogo.click()">
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="公司状态">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.status" @change="changeSetting('status',scope.row.status)">
              <el-radio :label="1">有效</el-radio>
              <el-radio :label="0">无效</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="delCompany(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="dialogWrapper">
      <el-dialog
        title="添加新公司"
        :visible.sync="addCompanyDialog"
        width="40%">
        <div class="addCompanyDialog">
          <div class="item">
            <span class="text">名称：</span>
            <el-input size="small" v-model.trim="addCompanyData.name" placeholder="请填写公司名称"></el-input>
          </div>
          <div class="item">
            <span class="text">主页：</span>
            <el-input size="small" v-model.trim="addCompanyData.url" placeholder="请填写公司服务地址"></el-input>
          </div>
          <div class="item">
            <span class="text">联系人：</span>
            <el-input size="small" v-model.trim="addCompanyData.contactPerson" placeholder="请填写公司服务地址"></el-input>
          </div>
          <div class="item">
            <span class="text">联系电话：</span>
            <el-input size="small" v-model.trim="addCompanyData.phone" placeholder="请填写公司服务地址"></el-input>
          </div>
          <div class="item">
            <span class="text">公司地址：</span>
            <el-input size="small" v-model.trim="addCompanyData.address" placeholder="请填写公司服务地址"></el-input>
          </div>
          <div class="item">
            <span class="text">公司状态：</span>
            <el-radio v-model="addCompanyData.status" :label="1">有效</el-radio>
            <el-radio v-model="addCompanyData.status" :label="0">无效</el-radio>
          </div>
          <div class="item">
            <span class="text">公司logo：</span>
            <img v-if="isInit == true" :src="fileAddress + addCompanyData.logoUrl" class="bgImg bt-hover" alt="暂无背景图" onClick="logoFile.click()">
            <input type="file" id="logoFile" @change="logoFileEvent" hidden>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCompanyDialog = false">取 消</el-button>
          <el-button type="primary" @click="addCompanyEvent">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div class="commonPlace">
      <input type="file" hidden id="uploadLogo" @change="uploadLogoChange">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import utils from '@/commons/Batar/utils'
export default {
  data() {
    return {
      isInit: true,
      companys: [],
      addCompanyDialog: false,
      uploadImg: 'static/imgs/syBg.png',
      addCompanyData: {
        parentId: null,
        name: '',
        url: '',
        address: '',
        contactPerson: '',
        phone: '',
        status: 1,
        logoUrl: 'static/imgs/syBg.png',
        currentSelRow: null
      }
    }
  },
  methods: {
    uploadLogoChange(e) {
      utils.commonUpload(this, e, 0, data => {
        this.changeSetting('logoUrl', data[0].url)
      })
    },
    delCompany(id) {
      this.$confirm('确认永久删除此公司?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.Axios.delete(`company/company/${id}`)
            .then(res => {
              let result = res.data
              if (result.code == 0) {
                this.$message.success('删除成功')
                this.getCompanysEvent()
              } else {
                this.$message.error('删除成功')
              }
            })
            .catch(err => {
              this.extCatch(err, this.delCompany)
            })
        })
        .catch(err => {})
    },
    logoFileEvent(e) {
      utils.commonUpload(this, e, 0, data => {
        this.addCompanyData.logoUrl = data[0].url
      })
    },
    getCompanysEvent() {
      this.Axios.get('company/company')
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.companys = result.data
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.getCompanysEvent)
        })
    },
    changeSetting(name, val) {
      let params = {
        id: this.currentSelRow.id,
        [name]: val
      }
      this.Axios.put('company/company', params)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.$message.success('修改成功')
            if (name == 'logoUrl') {
              this.currentSelRow.logoUrl = val
            }
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.changeSetting)
        })
    },
    companysTable(row) {
      this.currentSelRow = row
    },
    addCompanyEvent() {
      if (this.checkAddCompany()) {
        this.Axios.post('/company/company', this.addCompanyData)
          .then(res => {
            let result = res.data
            if (result.code == 0) {
              this.$message.success('添加公司成功')
              this.getCompanysEvent()
              this.addCompanyDialog = false
              this.addCompanyData = {
                companyName: '',
                url: '',
                status: 1,
                logoUrl: ''
              }
            } else {
              this.$message.error(result.msg)
            }
          })
          .catch(err => {
            this.extCatch(err, this.addCompanyEvent)
          })
      }
    },
    checkAddCompany() {
      if (this.addCompanyData.name == '') {
        this.$message.error('公司名称不能为空')
        return false
      }
      if (this.addCompanyData.url == '') {
        this.$message.error('公司主页不能为空')
        return false
      }
      if (this.addCompanyData.contactPerson == '') {
        this.$message.error('公司联系人不能为空')
        return false
      }
      if (this.addCompanyData.phone == '') {
        this.$message.error('联系电话不能为空')
        return false
      }
      if (this.addCompanyData.address == '') {
        this.$message.error('公司地址不能为空')
        return false
      }
      if (
        this.addCompanyData.logoUrl == '' ||
        this.addCompanyData.logoUrl == 'static/imgs/syBg.png'
      ) {
        this.$message.error('请上传logo')
        return false
      }
      return true
    }
  },

  created() {
    this.getCompanysEvent()
  },
  watch: {
    addCompanyDialog(val) {
      if (!val) {
        this.addCompanyData = {
          name: '',
          url: '',
          address: '',
          contactPerson: '',
          phone: '',
          status: 1,
          logoUrl: 'static/imgs/syBg.png'
        }
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.companySetting
  .btnsWrapper
    margin 10px 0
  .headerWrapper
    border-bottom 1px solid #D9D9D9
    padding-bottom 10px
  .contentWrapper
    .logoImg
      width 130px
      height 40px
      border-radius 3px
  .dialogWrapper
    .addCompanyDialog
      display flex
      flex-wrap wrap
      justify-content space-between
      .item
        width 45%
        display flex
        align-items center
        margin-bottom 15px
        .text
          white-space nowrap
          min-width 70px
          text-align right
      .bgImg
        width 130px
        height 40px
        border-radius 3px
</style>
