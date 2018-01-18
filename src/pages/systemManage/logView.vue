<template>
    <div class="conBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
            <el-breadcrumb-item :to="{ path: '/' }">Artist后台</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>日志查看</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
        <div class="hr"/>
        <div>
          <div class="topLeftDiv">
            业务类型
            <el-select v-model="value" placeholder="请选择" size="small">
              <el-option
                v-for="item in businessData"
                :key="item.value"
                :label="item.label"
                :value="item.value" >
              </el-option>
            </el-select>
            设备筛选
            <el-select v-model="value" placeholder="请选择" size="small">
              <el-option
                v-for="item in appVerData"
                :key="item.value"
                :label="item.label"
                :value="item.value" >
              </el-option>
            </el-select>
          </div>
          <div class="topRightDiv">
            时间筛选
            <el-date-picker
              v-model="timeData"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              >
            </el-date-picker>
          </div>
        </div>
        <div>
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            >
            <el-table-column
              prop="number"
              label="序"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="用户名"
              align="center">
            </el-table-column>
            <el-table-column
              prop="appVer"
              label="终端平台"
              align="center">
            </el-table-column>
            <el-table-column
              prop="chara"
              label="标识"
              align="center">
            </el-table-column>
            <el-table-column
              prop="operate"
              label="操作"
              align="center">
            </el-table-column>
            <el-table-column
              prop="content"
              label="内容"
              align="center">
            </el-table-column>
            <el-table-column
              prop="business"
              label="业务类型"
              align="center">
            </el-table-column>
            <el-table-column
              prop="time"
              label="时间"
              align="center">
            </el-table-column>
          </el-table>
        </div>
        <div class="paginationDiv">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
          </el-pagination>
        </div>
	    </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          number: "1",
          name: "用户名",
          appVer: "IOS",
          chara: "标识",
          operate: "操作",
          content: "内容",
          business: "业务类型",
          time: "2018-01-01 10:00",
        },
        {
          number: "2",
          name: "用户名",
          appVer: "IOS",
          chara: "标识",
          operate: "操作",
          content: "内容",
          business: "业务类型",
          time: "2018-01-01 10:00",
        },
        {
          number: "3",
          name: "用户名",
          appVer: "IOS",
          chara: "标识",
          operate: "操作",
          content: "内容",
          business: "业务类型",
          time: "2018-01-01 10:00",
        },
        {
          number: "4",
          name: "用户名",
          appVer: "IOS",
          chara: "标识",
          operate: "操作",
          content: "内容",
          business: "业务类型",
          time: "2018-01-01 10:00",
        },
        {
          number: "5",
          name: "用户名",
          appVer: "IOS",
          chara: "标识",
          operate: "操作",
          content: "内容",
          business: "业务类型",
          time: "2018-01-01 10:00",
        },
        {
          number: "6",
          name: "用户名",
          appVer: "IOS",
          chara: "标识",
          operate: "操作",
          content: "内容",
          business: "业务类型",
          time: "2018-01-01 10:00",
        },
        {
          number: "7",
          name: "用户名",
          appVer: "IOS",
          chara: "标识",
          operate: "操作",
          content: "内容",
          business: "业务类型",
          time: "2018-01-01 10:00",
        }
      ],
      currentPage4: 1,
      businessData: [{
        value: '0',
        label: '全部类型'
      }, {
        value: '1',
        label: '业务操作'
      }, {
        value: '2',
        label: '异常'
      }],
      appVerData: [{
        value: '0',
        label: '全部设备'
      }, {
        value: '1',
        label: 'IOS'
      }, {
        value: '2',
        label: 'Android'
      }],
      value: '0',
      timeData:'',
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {},
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999
.conBigDiv
  .title
    border-bottom 1px solid #d9d9d9
    padding-bottom 10px
    margin-bottom 10px
  .hr
    border-top 1px solid #d9d9d9
    height 3px
    margin 12px 0 12px 0
  .redfont
    margin-bottom 15px
    padding-left 10px
    border-left 3px solid #e60e32
    font-size 15px
  .red_font
    color $base-color
  .topLeftDiv
    width 50%
    float left
    margin-bottom 15px
  .topRightDiv
    width 50%
    float right
    text-align right
  .paginationDiv
    margin-top 15px
    text-align center
</style>