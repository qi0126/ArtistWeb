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
              node-key="id"
              :render-content="renderContent">
            </el-tree>
          </div>
        </div>
      </div>
      <div class="rightWrapper">
        <div class="title">类别属性</div>
        <div class="myTable">
          <el-table
            :data="tableDatas"
            border
            style="width: 100%">
            <el-table-column
              type="selection"
              align="center">
            </el-table-column>
            <el-table-column
              label="中文名称"
              prop="chineseName"
              align="center">
            </el-table-column>
            <el-table-column
              label="英文名称"
              prop="englishName"
              align="center">
            </el-table-column>
            <el-table-column
              label="数据类型"
              prop="dataType"
              align="center">
            </el-table-column>
            <el-table-column
              label="字典数据"
              prop="dictionaryData"
              align="center">
            </el-table-column>
            <el-table-column
              label="属性类型"
              prop="propertyType"
              align="center">
            </el-table-column>
            <el-table-column
              label="是否必填"
              align="center"
              width="192">
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.isRequire">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      treeDatas: [
        {
          id: 1,
          name: '黄金',
          children: [
            {
              id: 11,
              name: '戒指',
              children: [
                {
                  id: 111,
                  name: '子戒指1'
                },
                {
                  id: 112,
                  name: '子戒指2'
                }
              ]
            },
            {
              id: 12,
              name: '项链',
              children: [
                {
                  id: 121,
                  name: '子项链1'
                },
                {
                  id: 122,
                  name: '子项链2'
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        label: 'name'
      },
      tableDatas: [
        {
          id: 1,
          chineseName: '产品材质',
          englishName: 'cpcz',
          dataType: '下拉',
          dictionaryData: '硬金、K金、幻彩金',
          isRequire: true,
          propertyType: '产品属性'
        },
        {
          id: 2,
          chineseName: '制造工艺',
          englishName: 'zzgy',
          dataType: '字符串',
          dictionaryData: '暂无信息',
          isRequire: false,
          propertyType: '产品属性'
        }
      ]
    }
  },
  methods: {
    append(data) {},
    remove(node, data) {},
    renderContent(h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <el-button
              style="font-size: 12px;"
              type="text"
              on-click={() => this.append(data)}
            >
              <i class="el-icon-plus" />
            </el-button>
            <el-button
              style="font-size: 12px;"
              type="text"
              on-click={() => this.remove(node, data)}
            >
              <i class="el-icon-delete" />
            </el-button>
          </span>
        </span>
      )
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
</style>
