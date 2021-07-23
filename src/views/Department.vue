<template>
  <div class="Deptinformation">
    <!--工具条-->
    <el-col class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          所属部门:
          <el-select
            v-model="filters.department"
            clearable
            placeholder="所属部门"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.name" placeholder="编号/名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getDepartmentData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="users"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="dept_id" label="部门编号" width="110px" sortable> </el-table-column>
      <el-table-column prop="dept_name" label="部门名称" width="100px"> </el-table-column>
      <el-table-column prop="wage_h" label="时薪" width="100px"> </el-table-column>
      <el-table-column prop="overtime_pay_h" label="加班时薪" width="100px">
      </el-table-column>
      <el-table-column prop="s_time" label="上班时间" width="110px"> </el-table-column>
      <el-table-column prop="e_time" label="下班时间" width="110px"> </el-table-column>
      <el-table-column prop="r_time" label="中午休息时间" width="110px"> </el-table-column>
      <el-table-column prop="late_times" label="限定迟到次数" width="110px">
      </el-table-column>
      <el-table-column prop="vacation_days" label="限定年假天数" width="110px">
      </el-table-column>
      <el-table-column prop="absent_times" label="限定缺勤次数" width="110px">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
            
            >
          <el-button
            type="danger"
            size="small"
            @click="handleDel(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button
        type="danger"
        @click="batchRemove"
        :disabled="this.sels.length === 0"
        >批量删除</el-button
      >
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        style="float: right"
      >
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog
      title="编辑"
      :visible.sync="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editForm"
        label-width="80px"
        :rules="editFormRules"
        ref="editForm"
      >
        <el-form-item label="部门编号" prop="dept_id">
          <el-input v-model="editForm.dept_id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="dept_name">
          <el-input v-model="editForm.dept_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="时薪" prop="wage_h">
          <el-input v-model="editForm.wage_h" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="加班时薪" prop="overtime_pay_h">
          <el-input
            v-model="editForm.overtime_pay_h"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="上班时间" prop="s_time">
          <el-input v-model="editForm.s_time" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="下班时间" prop="e_time">
          <el-input v-model="editForm.e_time" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="中午休息时间" prop="r_time">
          <el-input v-model="editForm.r_time" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="限定迟到次数" prop="late_times">
          <el-input
            v-model="editForm.late_times"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="限定年假天数" prop="vacation_days">
          <el-input
            v-model="editForm.vacation_days"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="限定缺勤次数" prop="absent_times">
          <el-input
            v-model="editForm.absent_times"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="editSubmit"
          :loading="editLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog
      title="新增"
      :visible.sync="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
        ref="addForm"
      >
        <el-form-item label="部门编号" prop="dept_id">
          <el-input v-model="addForm.dept_id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="dept_name">
          <el-input v-model="addForm.dept_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="时薪" prop="wage_h">
          <el-input v-model="addForm.wage_h" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="加班时薪" prop="overtime_pay_h">
          <el-input
            v-model="addForm.overtime_pay_h"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="上班时间" prop="s_time">
          <el-input v-model="addForm.s_time" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="下班时间" prop="e_time">
          <el-input v-model="addForm.e_time" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="中午休息时间" prop="r_time">
          <el-input v-model="addForm.r_time" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="限定迟到次数" prop="late_times">
          <el-input
            v-model="addForm.late_times"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="限定年假天数" prop="vacation_days">
          <el-input
            v-model="addForm.vacation_days"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="限定缺勤次数" prop="absent_times">
          <el-input
            v-model="addForm.absent_times"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="addSubmit"
          :loading="addLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDepartment,
  updateDepartment,
  deleteDepartment,
  addDepartment
} from "@/assets/js/api";
export default {
  data() {
    return {
      options: [
        {
          value: "dept1",
          label: "部门一",
        },
        {
          value: "dept2",
          label: "部门二",
        },
      ],
      filters: {
        name: "",
        department: "",
      },
      users: [
        {
          dept_id: "2018302110104",
          dept_name: "2018302110104",
          wage_h: 20,
          overtime_pay_h: 100,
          s_time: "9:00",
          e_time: "5:00",
          r_time: "2:00",
          late_times: 5,
          vacation_days: 10,
          absent_times: 88,
        },
      ],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      },
      //编辑界面数据
      editForm: {
          dept_id: "",
          dept_name: "",
          wage_h: '',
          overtime_pay_h: '',
          s_time: "",
          e_time: "",
          r_time: "",
          late_times: '',
          vacation_days: '',
          absent_times: '',
      },
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      },
      //新增界面数据
      addForm: {
         dept_id: "",
          dept_name: "",
          wage_h: '',
          overtime_pay_h: '',
          s_time: "",
          e_time: "",
          r_time: "",
          late_times: '',
          vacation_days: '',
          absent_times: '',
      },
    };
  },
  methods: {
     getDepartmentData() {
      getDepartment({ page: this.page }).then((res) => {
        console.log(res);
        if (res && res.data && res.data.status === 1) {
          this.users = res.data.data;
          this.total = res.data.total;
          return;
        }
        console.log("error ");
      });
    },
    
    
    handleCurrentChange(val) {
      this.page = val;
      this.getDepartmentData();
    },
   
    //删除
    handleDel: function (index, row) {
      console.log(index, row);
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.id };
          deleteDepartment(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getDepartmentData();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
      console.log(this.editForm);
    },
    //显示新增界面
    handleAdd: function () {
      this.addFormVisible = true;
      // this.addForm = {
      //   staff_id: "",
      //   name: "",
      //   sex: -1,
      //   department: "",
      //   job_type_id: "",
      //   annual_freedays: "",
      //   entry_time: "",
      // };
    },
    //编辑
    editSubmit: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            updateDepartment(para).then((res) => {
              console.log(res);
            this.editFormVisible = false;
              this.$message({
                message: "编辑成功",
                type: "success",
              });
              this.getDepartmentData();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            para.birth =
              !para.birth || para.birth == ""
                ? ""
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
            addDepartment(para).then((res) => {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success",
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getDepartmentData();
            });
          });
        }
      });
    },
    selsChange: function (sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function () {
      var ids = this.sels.map((item) => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { ids: ids };
          batchRemoveUser(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getDepartmentData();
          });
        })
        .catch(() => {});
    },
  },
  mounted() {
    this.getDepartmentData();
  },
};
</script>

<style>
</style>