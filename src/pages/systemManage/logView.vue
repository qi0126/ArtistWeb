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
            <el-select v-model="businessDataValue" placeholder="请选择" size="small" @change="changeLogFun(1,15)">
              <el-option
                v-for="item in businessData"
                :key="item.value"
                :label="item.label"
                :value="item.value" >
              </el-option>
            </el-select>
            设备筛选
            <el-select v-model="appVerValue" placeholder="请选择" size="small" @change="changeLogFun(1,15)">
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
              @change="changeLogFun(1,15)"
              >
            </el-date-picker>
          </div>
        </div>
        <div>
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            stripe
            >
            <el-table-column
              type="index"
              label="序"
              align="center">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="用户名"
              align="center">
            </el-table-column>
            <el-table-column
              prop="appType"
              label="终端平台"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.appType == 0">Android</span>
                <span v-if="scope.row.appType == 1">iOS</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="imei"
              label="标识"
              align="center">
            </el-table-column>
            <el-table-column
              prop="type"
              label="操作"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.type == 0">业务操作</span>
                <span v-if="scope.row.type == 1">应用内异常</span>
                <span v-if="scope.row.type == 2">崩溃</span>
                <span v-if="scope.row.type == 3">其他</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="info"
              label="内容"
              align="center">
            </el-table-column>
            <el-table-column
              prop="operation"
              label="业务类型"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.type == 0">启动</span>
                <span v-if="scope.row.type == 1">登录</span>
                <span v-if="scope.row.type == 2">订单操作</span>
                <span v-if="scope.row.type == 3">退出</span>
                <span v-if="scope.row.type == 4">其他</span>
              </template>
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
            :current-page=pageNum
            :page-sizes="[15, 30, 50, 100]"
            :page-size=pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=total>
          </el-pagination>
        </div>
	    </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [], //日志查看数据
      currentPage4: 1,
      businessData: [
        //业务类型
        {
          value: -1,
          label: "全部类型"
        },
        {
          value: 0,
          label: "业务操作"
        },
        {
          value: 1,
          label: "应用内异常"
        },
        {
          value: 2,
          label: "崩溃"
        },
        {
          value: 3,
          label: "其他"
        }
      ],
      businessDataValue: -1, //业务类型选择项
      appVerData: [
        //手机机型数据
        {
          value: -1,
          label: "全部设备"
        },
        {
          value: 0,
          label: "Android"
        },
        {
          value: 1,
          label: "iOS"
        }
      ],
      appVerValue: -1, //机型选择项
      timeData: "",
      pageNum: 1, //分页页码，默认第1页
      pageSize: 15, //分页每页显示几条记录，默认15
      total: 0, //总数据多少条
      searchTF:false,//是显示结果还是搜索结果
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this;
      self.logDisplay(self.pageNum, self.pageSize);
    },
    //日志查看分页查看
    logDisplay(num, size) {
      var self = this;
      let params = {
        PRS: {
          page: num,
          size: size
        }
      };
      this.Axios.get("/common/log", params)
        .then(data => {
          if (data.data.code == 0) {
            var tempList = data.data.data.list;
            self.total = data.data.data.total;
            for (var j in tempList) {
              //日期格式转换
              var tempTxt =
                tempList[j].time.substring(0, 4) +
                "年" +
                tempList[j].time.substring(4, 6) +
                "月" +
                tempList[j].time.substring(6, 8) +
                "日 " +
                tempList[j].time.substring(8, 10) +
                ":" +
                tempList[j].time.substring(10, 12) +
                ":" +
                tempList[j].time.substring(12, 14);
              tempList[j].time = tempTxt;
            }
            self.tableData = tempList;
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.logDisplay);
        });
    },
    //筛选条件事件
    changeLogFun(num,size) {
      var self = this;
      self.searchTF = true;

      //Date格式化方法
      Date.prototype.format = function(fmt) {
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          S: this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        }
        for (var k in o) {
          if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
          }
        }
        return fmt;
      };

      self.pageNum = num
      self.pageSize = size
      // console.log(self.timeData.length)
      var tempDate = []
      if (self.timeData.length == 2) {
        var time1 = self.timeData[0].format("yyyyMMddmmss");
        var time2 = self.timeData[1].format("yyyyMMddmmss");
        time2=time2.substring(0, 8)+'2359'
        tempDate = [time1, time2];
      }else{
        tempDate = []
      }
      // console.log(tempDate)
      let params = {
        PRS: {
          times: tempDate,
          type: self.businessDataValue,
          appType: self.appVerValue,
          page: self.pageNum,
          size: self.pageSize
        }
      };

      this.Axios.get("/common/log/query", params)
        .then(data => {
          if (data.data.code == 0) {
            // console.log(data.data.data)
            var tempList = data.data.data.list;
            self.total = data.data.data.total;
            for (var j in tempList) {
              //日期格式转换
              var tempTxt =
                tempList[j].time.substring(0, 4) +
                "年" +
                tempList[j].time.substring(4, 6) +
                "月" +
                tempList[j].time.substring(6, 8) +
                "日 " +
                tempList[j].time.substring(8, 10) +
                ":" +
                tempList[j].time.substring(10, 12) +
                ":" +
                tempList[j].time.substring(12, 14);
              tempList[j].time = tempTxt;
            }
            self.tableData = tempList;
            this.$message({
              message: data.data.msg,
              type: "success"
            });
          } else {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.extCatch(err, this.changeLogFun);
        });

    },
    //修改分页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      if(this.searchTF){//判断是条件搜索还是直接显示的分页
        this.changeLogFun(this.pageNum, this.pageSize)
      }else{
        this.logDisplay(this.pageNum, this.pageSize)
      }
    },
    //修改分页页码
    handleCurrentChange(val) {
      this.pageNum = val;
      if(this.searchTF){//判断是条件搜索还是直接显示的分页
        this.changeLogFun(this.pageNum, this.pageSize)
      }else{
        this.logDisplay(this.pageNum, this.pageSize)
      }
      
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