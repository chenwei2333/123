<template>
  <div class="MessagePage">
    <HeadMenu />
    <div class="outer-background">
      <div class="core-background">
        <div style=" width: 12%; float: left; height: 640px;">
          <el-radio-group v-model="isDisplayAll" style="margin-bottom: 20px" @change="handleCategoryChange">
            <el-radio-button :label="false">{{
              currentMsgCategory
            }}</el-radio-button>
            <el-radio-button :label="true">全部</el-radio-button>
          </el-radio-group>
          <el-menu ref="categoryMenu" class="el-menu-vertical-demo" :collapse="isDisplayAll" @select="handleCategorySelect">
            <el-submenu index="type">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">类型</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="item in MsgType"
                  :key="item"
                  :index="item"
                  >{{ item }}</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="department">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">职务</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="item in department" :key="item" :index="item">{{
                  item
                }}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </div>
        <div style="width: 30%; float: left;margin-top:-5px;border: 5px whitesmoke solid;">
          <div
            style=" width: 100%; height: 40px; padding: 5px 0; background-color: #d0c8c8; ">
            <el-input
              v-model="queryMsg"
              placeholder="输入工号/姓名查询"
              style="width: 80%"
            ></el-input>
            <el-button
              icon="el-icon-search"
              circle
              style="margin-left: 5px"
              @click="queryApplicationMsg"
            ></el-button>
          </div>
          <div class="applicationHeaderContainer" v-if="applicationMsgs.length>0">
            <el-link
              :underline="false"
              class="applicationHeader"
              v-for="(item, i) in applicationMsgs"
              :key="i"
              @click="showMsgDetail(i)"
            >
              <div style=" width: 370px; height: 50px; margin: 5px 0; background-color: whitesmoke; border: 1px white solid; ">
                <!-- 用比例实在对不齐，没辙了，只能用定长 -->
                <el-image
                  :src="item.head_img"
                  style="
                    height: 90%;
                    width: 16%;
                    float: left;
                    margin-top: 3px;
                    margin-left: 5px;
                  "
                />
                <div
                  style="
                    float: right;
                    font-size: 2px;
                    width: 20%;
                    margin-top: 1px;
                    margin-right: 5px;
                    color: burlywood;
                  "
                >
                  <div style="width: 100%; text-align: right">
                    {{ item.datetime }}
                  </div>
                  <!-- <div style="width: 100%; text-align: right">
                    {{ item.msgTime }}
                  </div> -->
                </div>
                <div style="float: left; margin-top: 1px; margin-left: 5px">
                  <div style="width: 100%; text-align: left; color: lightcoral">
                    {{ item.name }}
                  </div>
                  <div style=" width: 210px; text-align: left; font-size: 2px; margin-top: 10px;">
                    <div class="ellipsis-display-text">{{ item.info }}</div>
                  </div>
                </div>
              </div>
            </el-link>
          </div>
          <div class="applicationHeaderContainer" v-else>
            <el-empty description="暂无"></el-empty>
          </div>
        </div>
        <div class="applicationDetail" v-if="currentApplicationMsg.application_id==0">
          <el-empty description="在左侧选择查看和审批一条申请消息"></el-empty>
        </div>
        <div class="applicationDetail" v-else>
          <div style="width: 100%;height: 70px;background-color: whitesmoke;border: 1px white solid;">
            <h2>{{ currentApplicationMsg.type }}申请</h2>
            <div
              style="text-align: right; position:absolute;right: 30px; top:50px;"
            >
              {{ currentApplicationMsg.datetime }}
            </div>
          </div>
          <div style="width: 100%; height: 180px;">
            <el-image
              :src="currentApplicationMsg.head_img"
              style="
                width: 25%;
                float: left;
                margin: 5px;
              "
            />
            <div style="width: 40%; float: left">
              <h4>员工姓名：{{ currentApplicationMsg.name }}</h4>
              <h4>员工工号：{{ currentApplicationMsg.staff_id }}</h4>
              <h4>所属部门：{{ currentApplicationMsg.department }}</h4>
            </div>
            <div
              style="
                width: 26%;
                font-size:larger;
                float: right;
                margin-top: 10px;
                color: lightcoral;
              "
            >{{ pastTime }}
              <!-- <div style="font-size:larger;margin-top: 10px;color: lightcoral;text-align: center">{{ pastTime }}</div> -->
            </div>
          </div>
          <div style=" width: 100%; height: 260px; background-color: whitesmoke; float: left; ">
            <div style=" width: 80%; height: 220px; background-color: white; margin-top: 10px; margin: auto; ">
              <h4>{{ currentApplicationMsg.info }}</h4>
            </div>
          </div>
          <div style="width: 100%; height: 100px; float: left">
            <div
              style="width: 80%; height: 90%; padding-top: 10px; margin: auto"
            >
              <el-dropdown @command="changeOpinion" style="float: left">
                <el-button>
                  {{ currentOpinion }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="availableOpinion">
                    {{ availableOpinion }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="输入审批意见"
                v-model="opinionInput"
                style="margin-left: 5px; width: 70%; float: left"
              >
              </el-input>
              <el-button style="margin-left: 5px; float: left" @click="disposeApplication">审批</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CopyrightFooter />
  </div>
</template>

<script>
import moment from "moment";
import HeadMenu from "../components/HeadMenu.vue";
import CopyrightFooter from "../components/CopyrightFooter.vue";
import {getApplicationMsg,disposeApplicationMsg} from "../assets/js/api"

export default {
  name: "MessagePage",

  components: {
    HeadMenu,
    CopyrightFooter,
  },
  data() {
    const applicationMsg = {
      application_id:0,
      type:3,
      staff_id: "S23333",
      name: "隔壁老王",
      head_img: "../assets/images/logo.jpg",
      datetime: "2021-7-10 11:30:20",
      department: "销售",
      info: "家有喜事，妻盼吾归,家有喜事，妻盼吾归,家有喜事，妻盼吾归,家有喜事，妻盼吾归",
    };
    return {
      logoPath: require("../assets/images/logo.png"),
      isDisplayAll: true,
      currentMsgCategory: "分类",
      currentOpinion: "同意",
      availableOpinion: "拒绝",
      currentApplicationMsg: applicationMsg,
      queryMsg: "",
      pastTime: 0,
      opinionInput: "",
      MsgType: ["签到", "入职", "辞职", "请假", "销假", "外派"],
      department: ["销售", "前台", "管理", "后勤"],
      applicationContainer:[],
      applicationMsgs: Array(2).fill(applicationMsg),
    };
  },
  methods: {
    handleCategoryChange(val){
      this.queryMsg="";
      if(val){
        this.applicationMsgs=this.applicationContainer;
        this.$refs.categoryMenu.activeIndex = null;//取消选中状态
        this.currentMsgCategory = "分类";
      }
    },
    handleCategorySelect(value,obj){
      //console.log(obj[0],obj[1]);
      this.currentMsgCategory = value;
      this.applicationMsgs=[];
      for(var i=0;i<this.applicationContainer.length;i++){
        // console.log(this.applicationContainer[i][obj[0]]);
        if(this.applicationContainer[i][obj[0]]==value){
          this.applicationMsgs.push(this.applicationContainer[i]);
        }
      }
    },
    queryApplicationMsg(){
      if(this.queryMsg.trim().length<1)
        return;
      let _value = this.queryMsg.trim().toLowerCase();
      console.log(_value);
      let resultData = []; // 用于存放搜索出来数据的新数组
      if (_value) {
        this.applicationContainer.filter(item => {
          if ((item.staff_id.toLowerCase().indexOf(_value) !== -1)||
          (item.name.toLowerCase().indexOf(_value) !== -1)) {
            resultData.push(item);
          }
        })
      }
      this.applicationMsgs = resultData;
    },
    showMsgDetail(i){
      this.currentApplicationMsg=this.applicationMsgs[i];
      //计算相对时间
      this.pastTime = moment(this.currentApplicationMsg.datetime,"YYYY-MM-DD hh-mm-ss").endOf('day').fromNow();
      //moment(this.currentApplicationMsg.datetime).endOf('day').fromNow();
    },
    changeOpinion(command) {
      var temp = this.currentOpinion;
      this.currentOpinion = command;
      this.availableOpinion = temp;
    },
    updateApplicationMsg(type){
      getApplicationMsg({
        "company_name":this.$store.state.companyName,
        "type":type
        }).then((response)=>{
          if(response.status==1){
            this.applicationMsgs = this.applicationContainer = response.data;
          }else{
            this.$message(response.msg);
          }
        }
      );
    },
    disposeApplication(){
      let _status=this.currentOpinion=="同意"?2:3;
      disposeApplicationMsg({
        "id":this.currentApplicationMsg.id,
        "status":_status,
        "hr_comment":this.opinionInput.trim()
        }).then((response)=>{
          if(response.status==1){
            this.$message(response.msg);
            this.currentApplicationMsg.application_id=0;
          }else{
            this.$message(response.msg);
          }
        }
      );
    }
  },
  mounted() {
    this.updateApplicationMsg("all");
  },
};
</script>
<style scoped>
.applicationHeaderContainer{
  width: 100%;
  height: 595px; 
  background-color: white;
  overflow: auto;
}
.applicationHeader {
  width: 100%;
  height: 50px;
  margin: 1px 0;
  /* color:burlywood */
}
.applicationDetail{
  width: 56%;
  height: 620px;
  padding:5px;
  float: left;
}
h4 {
  text-align: left;
  padding-left: 10px;
}
</style>