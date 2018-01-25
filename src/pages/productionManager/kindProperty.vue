<template>
  <div class="kindProperty">
    <div class="headerWrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>Artist</el-breadcrumb-item>
        <el-breadcrumb-item>产品管理</el-breadcrumb-item>
        <el-breadcrumb-item>类别属性</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="contentWrapper">
      <div class="leftWrapper">
        <div class="title">类别列表</div>
        <div class="menuWrapper">
          <el-input prefix-icon="el-icon-search" size="small" placeholder="输入关键词搜索" class="searchInp"></el-input>
          <div class="myTree">
            <el-tree
              :data="treeDatas"
              :props="defaultProps"
              :highlight-current="true"
              node-key="id"
              @node-click="clickKind"
              :render-content="renderContent">
            </el-tree>
          </div>
        </div>
      </div>
      <div class="rightWrapper">
        <div class="title">类别属性</div>
        <div class="myTable">
          <el-table
            border
            ref="tableElement"
            :data="tableDatas"
            @select="handleSelectionChange"
            @select-all="handleSelectionAllChange"
            style="width: 100%">
            <el-table-column
              type="selection"
              align="center">
            </el-table-column>
            <el-table-column
              label="中文名称"
              prop="attrCnName"
              align="center">
            </el-table-column>
            <el-table-column
              label="英文名称"
              prop="attrEnName"
              align="center">
            </el-table-column>
            <el-table-column
              label="数据类型"
              align="center">
              <template slot-scope="scope">
                <span v-show="scope.row.dataType == 10">数字</span>
                <span v-show="scope.row.dataType == 20">字符串</span>
                <span v-show="scope.row.dataType == 30">数组（数字）</span>
                <span v-show="scope.row.dataType == 40">数组（字符串）</span>
              </template>
            </el-table-column>
            <el-table-column
              label="字典数据"
              align="center">
              <template slot-scope="scope">
                <span v-for="item in scope.row.dictDataObject" :key="item.value">
                  {{ item.text }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="属性类型"
              prop="propertyType"
              align="center">
              <template slot-scope="scope">
                <span v-show="scope.row.attrType == 1">普通属性</span>
                <span v-show="scope.row.attrType == 2">可选属性</span>
                <span v-show="scope.row.attrType == 3">规格属性</span>
              </template>
            </el-table-column>
            <el-table-column
              label="是否必填"
              align="center"
              width="192">
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.isRequired" @change="isRequireChange(scope.row.id,scope.row.isRequired)">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <div class="dialogWrapper">
      <el-dialog
        title="新增类目"
        :visible.sync="tableDialog"
        width="20%">
        <div class="addKindWrapper">
          <el-input size="small" v-model.trim="addKindName" placeholder="请输入产品类目名称"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="tableDialog = false">取 消</el-button>
          <el-button type="primary" @click="addKindConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      tableDialog: false,
      treeDatas: [],
      defaultProps: {
        label: 'label'
      },
      tableDatas: [],
      tempId: null,
      selTreeObj: null,
      addKindName: null,
      selTreeId: null
    }
  },
  methods: {
    clickKind(data) {
      this.selTreeObj = data
      this.Axios
        .get(`/product/productClass/${this.selTreeObj.id}`)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.tableDatas = result.data.attrList
            this.$nextTick(() => {
              this.tableDatas.forEach(item => {
                if (item.status == 1) {
                  this.$refs.tableElement.toggleRowSelection(item)
                }
              })
            })
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.clickKind)
        })
    },
    append(e, node, data) {
      this.tableDialog = true
      this.selTreeId = data.id
      e.cancelBubble = true
    },
    addKindConfirm(){
      if(this.addKindName){
        let params ={
          className: this.addKindName,
          parentId: this.selTreeId
        }
        this.Axios.post('/product/productClass',params).then(res=>{
          let result = res.data
          if(result.code == 0){
            this.$message.success('添加成功')
            this.getKindList()
            this.tableDialog = false
          }else{
            this.$message.error(result.msg)
          }
        }).catch(err=>{
          this.extCatch(err,this.addKindConfirm)
        })
      }else{
        this.$message.warning('请输入产品类目名称')
      }
    },
    remove(e, node, data) {
      this.$confirm('确定删除？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.Axios
            .delete(`/product/productClass/${data.id}`)
            .then(res => {
              let result = res.data
              if (result.code == 0) {
                this.$message.success('删除成功')
                const parent = node.parent
                const children = parent.data.children || parent.data
                const index = children.findIndex(d => d.id === data.id)
                children.splice(index, 1)
              } else {
                this.$message.error(result.msg)
              }
            })
            .catch(err => {
              this.extCatch(err, this.remove)
            })
        })
        .catch(() => {})
      e.cancelBubble = true
    },
    kindMouseover(data) {
      this.tempId = data.id
    },
    kindMouseout() {
      this.tempId = null
    },
    renderContent(h, { node, data, store }) {
      return (
        <span
          on-mouseover={() => this.kindMouseover(data)}
          on-mouseout={() => this.kindMouseout()}
          style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;"
        >
          <span>
            <span>{node.label}</span>
          </span>
          <span v-show={this.tempId == data.id}>
            <el-button
              style="font-size: 12px;"
              type="text"
              on-click={e => this.append(e, node, data)}
            >
              <i class="el-icon-plus" />
            </el-button>
            <el-button
              style="font-size: 12px;"
              type="text"
              v-show={data.parentId != 0}
              on-click={e => this.remove(e, node, data)}
            >
              <i class="el-icon-delete" />
            </el-button>
          </span>
        </span>
      )
    },
    getKindList() {
      this.Axios
        .get('/product/productClass/tree')
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.treeDatas = result.data
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.getKindList)
        })
    },
    handleSelectionChange(selection, row) {
      let requestRoute = null
      row.status == 0
        ? (requestRoute = '/product/productClass/enabledAttr')
        : (requestRoute = '/product/productClass/forbiddenAttr')
      let params = {
        attrIds: [row.id]
      }
      this.updateAttrs(requestRoute, params)
    },
    handleSelectionAllChange(selection) {
      let requestRoute = null
      let params = { attrIds: [] }
      selection.length == 0
        ? (requestRoute = '/product/productClass/forbiddenAttr')
        : (requestRoute = '/product/productClass/enabledAttr')
      this.tableDatas.forEach(item => {
        params.attrIds.push(item.id)
      })
      this.updateAttrs(requestRoute, params)
    },
    updateAttrs(requestRoute, params) {
      this.Axios
        .post(requestRoute, params)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.$message.success('修改成功')
            this.clickKind(this.selTreeObj)
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.handleSelectionChange)
        })
    },
    isRequireChange(id, isRequire) {
      let params = {
        isRequired: isRequire
      }
      this.Axios
        .put(`/product/productClass/attr/${id}`, params)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.$message.success('修改成功')
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(err => {
          this.extCatch(err, this.isRequireChange)
        })
    }
  },
  created() {
    this.getKindList()
  },
  watch:{
    tableDialog(val){
      if(!val){
        this.addKindName = null
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
.kindProperty
  .headerWrapper
    border-bottom 1px solid #D9D9D9
    padding-bottom 10px
  .contentWrapper
    display flex
    margin-top 15px
    .title
      margin-bottom 15px
      padding-left 10px
      border-left 3px solid $base-color
      font-size 15px
    .leftWrapper
      width 300px
      flex 0 300px
      margin-right 20px
      .menuWrapper
        border 1px solid #D9D9D9
        border-radius 5px
        padding 10px
        height 750px
        overflow hidden
        overflow-y auto
        .searchInp
          margin-bottom 10px
    .rightWrapper
      flex 1
      overflow hidden
  .dialogWrapper
    .addKindWrapper
      display flex
      align-items center
      .title 
        white-space nowrap
</style>
