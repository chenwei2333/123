<template>
  <div class="RecordPage">
    <HeadMenu />
    <div class="outer-background">
      <div class="core-background">
        <div style="width: 100%;height:25px">
          <div style="width: 70%; float: left">
            <el-dropdown
              @command="changeChart"
              style="float: left; margin-left: 5px"
            >
              <el-button>
                {{ currentChartModel }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  {{ availableChartModel }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown
              @command="changeDepartment"
              style="float: left; margin-left: 5px"
            >
              <el-button>
                {{ currentDepartment }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="leftdepartment in filterDepartment"
                  :key="leftdepartment"
                  :command="leftdepartment"
                  >{{ leftdepartment }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div style="width: 30%; float: left">
            <el-input
              v-model="input"
              placeholder="输入工号/姓名查询"
              style="width: 80%"
            ></el-input>
            <el-button
              icon="el-icon-search"
              circle
              style="margin-left: 5px"
            ></el-button>
          </div>
        </div>
        <el-divider></el-divider>
        <div style="width: 100%; float: left" v-if="currentChartModel === '周历模式'">
          <div style="width: 70%; float: left">
            <div class="calendarChart" >
              <el-calendar :first-day-of-week="7" style="height: 100%;border: 5px whitesmoke solid;" >
                <template slot="dateCell" slot-scope="{data}">
                  <div :class="data.isSelected ? 'is-selected' : ''" @click="handelDateCellSelect(data)" style="margin-top:-5px;padding-top:10px;position:relative;width:100%;height:100%;">
                    <div>{{ data.day.split("-").slice(1)[1] }}</div>
                    <div style="color:red">{{recordDegree(monthRecord[data.day])}}</div>
                  </div>
                </template>
              </el-calendar>
            </div>
          </div>
          <div style="width: 30%; float: right">
            <el-table
              :data="staffRecordMsgs"
              height="500px"
              stripe
              style="width: 100%"
            >
              <el-table-column prop="id" label="工号" width="70"></el-table-column>
              <el-table-column prop="name" label="姓名" width="100"></el-table-column>
              <el-table-column prop="datetime" label="日期" width="90"></el-table-column>
              <el-table-column prop="department" label="部门" width="90"></el-table-column>
              <el-table-column prop="status" label="状态" width="60"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="diagramChart" v-else>
          <div style="width: 100%; float: left;">
            <div id="barChart"></div>
          </div>
          <!-- <div style=" width: 40%; float: left; ">
            <div id="pieChart"></div>
          </div> -->
        </div>
      </div>
    </div>
    <CopyrightFooter />
  </div>
</template>

<script>
import moment from "moment";//moment.js时间格式
import {getAllAttRecord,getExRecordMsg} from "../assets/js/api"
import HeadMenu from "../components/HeadMenu.vue";
import CopyrightFooter from "../components/CopyrightFooter.vue";

export default {
  name: "RecordPage",

  components: {
    HeadMenu,
    CopyrightFooter,
  },
  data() {
    const staffRecord= {
        id: "S23333",
        name: "小明",
        status: "迟到",
        datetime:"2021-7-10",
        department:"销售"
      };
    return {
      currentChartModel: "周历模式",
      availableChartModel: "图表模式",
      currentDepartment: "全部",
      selectedDay:'',
      department: ["全部", "销售", "前台", "管理", "后勤"],
      input: "",
      monthRecord:{
        "2021-07-13":
        {
            "attendance_num":30,
            "late_num":3,
            "early_leave_num":2,
            "absence_num":3,
            "leave_num":2
        },
        "2021-07-14":
        {
            "attendance_num":30,
            "late_num":2,
            "early_leave_num":3,
            "absence_num":2,
            "leave_num":3
        }
      },
      staffRecordMsgs: Array(2).fill(staffRecord),
      initDatay: [20, 25, 30, 26],
      initDatay2: [
        { value: 20, name: "出勤" },
        { value: 10, name: "迟到" },
        { value: 2, name: "早退" },
        { value: 7, name: "缺勤" },
        { value: 5, name: "请假" },
      ],
    };
  },
  computed: {
    filterDepartment() {
      return this.department.filter((item) => item !== this.currentDepartment);
    },
    
  },
  watch: {
    initDatay: {
      handler: function () {
        this.drawLine();
      },
      deep: true,
    },
  },
  methods: {
    changeChart() {
      var temp = this.currentChartModel;
      console.log(this.currentChartModel, this.availableChartModel);
      this.currentChartModel = this.availableChartModel;
      this.availableChartModel = temp;
      if (this.currentChartModel === "图表模式") this.drawDiagram();
      console.log(this.dataProcess());
    },
    changeDepartment(command) {
      // console.log(command);
      this.currentDepartment = command;
      this.updateExRecordMsg(this.selectedDay,this.currentDepartment);
    },
    handelDateCellSelect(date){
      this.selectedDay = date.day;
      this.updateExRecordMsg(date.day,this.currentDepartment);
    },
    updateAllAttRecord(date,department){
      getAllAttRecord({
        "company_name":this.$store.state.companyName,
        "datetime":date,
        "department":department
        }).then((response)=>{
          if(response.status==1){
            this.monthRecord=response.data;
          }else{
            this.$message(response.msg);
          }
        }
      );
    },
    updateExRecordMsg(date,department){
      getExRecordMsg({
        "company_name":this.$store.state.companyName,
        "datetime":date,
        "department":department
        }).then((response)=>{
          if(response.status==1){
            this.staffRecordMsgs=response.data;
          }else{
            this.$message(response.msg);
          }
        }
      );
    },
    recordDegree(data){
      if(data){
        //比较late_num early_leave_num absence_num leave_num
        let ExNum = data.late_num + data.early_leave_num + data.absence_num + data.leave_num;
        if(ExNum > 5)
          return "异常";
        else
          return "异常";
      }
    },
    dataProcess(){
      //将monthRecord转化为echart可显示的数据
      var result=[];
      let _product = ['product'];
      let _late_num = ['迟到'];
      let _early_leave_num = ['早退'];
      let _absence_num = ['缺勤'];
      let _leave_num = ['请假'];
      for(let _record in this.monthRecord){
        // console.log(this.monthRecord[_record].late_num, this.monthRecord[_record].early_leave_num, 
        // this.monthRecord[_record].absence_num, this.monthRecord[_record].leave_num);
        _product.push(_record);
        _late_num.push(this.monthRecord[_record].late_num);
        _early_leave_num.push(this.monthRecord[_record].early_leave_num);
        _absence_num.push(this.monthRecord[_record].absence_num);
        _leave_num.push(this.monthRecord[_record].leave_num);
      }
      result.push(_product);
      result.push(_late_num);
      result.push(_early_leave_num);
      result.push(_absence_num);
      result.push(_leave_num);
      return result;
    },
    drawDiagram() {
      this.$nextTick(() => {
        let myChart = this.$echarts.init(document.getElementById("barChart"));

        let option = {
        legend: {},
        tooltip: {
            trigger: 'axis',
        },
        dataset: {
            source: this.dataProcess()
        },
        xAxis: {type: 'category'},
        yAxis: {gridIndex: 0},
        grid: {top: '55%'},
        dataZoom: [
          {   // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 10,      // 左边在 10% 的位置。
            end: 60         // 右边在 60% 的位置。
          }
        ],
        series: [
            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
            {
                type: 'pie',
                id: 'pie',
                radius: '30%',
                center: ['50%', '25%'],
                label: {
                    formatter: '{b} : ({d}%)'
                },
                encode: {
                    itemName: 'product',
                    value: 2,
                    tooltip: 2
                }
            }
          ]
        };
        myChart.on('updateAxisPointer', function (event) {
          var xAxisInfo = event.axesInfo[0];
          if (xAxisInfo) {
            var dimension = xAxisInfo.value + 1;
            myChart.setOption({
                series: {
                    id: 'pie',
                    label: {
                        formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                    },
                    encode: {
                        value: dimension,
                        tooltip: dimension
                    }
                }
            });
          }
        });
        myChart.setOption(option);
      });
    },
  },
  mounted() {
    let _date=moment(new Date());
    this.selectedDay = moment(_date).format("YYYY-MM-DD");
    let _month = moment(_date).format("YYYY-MM");
    // console.log(this.selectedDay,_month);
    this.updateAllAttRecord("_month","全部");
  },
};
</script>
<style scoped>
.calendarChart {
  width: 100%;
}
.diagramChart {
  width: 100%;
}
#barChart {
  width: 100%;
  height: 555px;
}
#pieChart {
  width: 100%;
  height: 555px;
}
</style>

<style>
.calendarChart .el-calendar-table .el-calendar-day {
  height: 68px;
}
</style>