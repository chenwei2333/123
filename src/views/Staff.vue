<template>
  <div class="Staffinformation">
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
          <el-input
            v-model="filters.name"
            placeholder="姓名/工号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsers">查询</el-button>
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
      <el-table-column type="selection" width="100px"> </el-table-column>
      <el-table-column type="index" width="60px"> </el-table-column>
      <el-table-column prop="staff_id" label="员工工号" width="125px" sortable>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="110px" > </el-table-column>
      <el-table-column prop="sex" label="性别" width="110px" sortable> </el-table-column>
      <el-table-column prop="department" label="部门" width="110px" sortable>
      </el-table-column>
      <el-table-column prop="annual_freedays" label="剩余年假天数" width="140px" sortable>
      </el-table-column>
      <el-table-column prop="entry_time" label="入职时间" width="130px" sortable>
      </el-table-column>
      <el-table-column prop="staff_status" label="员工状态" width="120px" >
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
        <el-form-item label="工号" prop="staff_id" >
          <el-input v-model="editForm.staff_id" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name" >
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input
            v-model="editForm.department"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="剩余年假天数" prop="annual_freedays">
          <el-input
            v-model="editForm.annual_freedays"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entry_time">
          <el-input
            v-model="editForm.entry_time"
            auto-complete="off"
          ></el-input>
        </el-form-item>
         <el-form-item label="员工状态">
          <el-radio-group v-model="editForm.staff_status">
            <el-radio class="radio" :label="1">在职</el-radio>
            <el-radio class="radio" :label="2">离职</el-radio>
            <el-radio class="radio" :label="3">外派</el-radio>
          </el-radio-group>
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
        <el-form-item label="工号" prop="staff_id">
          <el-input v-model="editForm.staff_id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input
            v-model="editForm.department"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="剩余年假天数" prop="annual_freedays">
          <el-input
            v-model="editForm.annual_freedays"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entry_time">
          <el-input
            v-model="editForm.entry_time"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="员工状态">
          <el-radio-group v-model="editForm.staff_status">
            <el-radio class="radio" :label="1">在职</el-radio>
            <el-radio class="radio" :label="2">离职</el-radio>
            <el-radio class="radio" :label="3">外派</el-radio>
          </el-radio-group>
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
  getStaff,
  addStaff,
  updateStaff,
  deleteStaff,
} from  "@/assets/js/api";
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
          staff_id: "2018302110104",
          name: "杨光",
          sex: "女",
          department: "前台",
          annual_freedays: "10",
          entry_time: "2018-1-23",
          staff_status: "在职",
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
        id: 0,
        staff_id: "",
        name: "",
        sex: -1,
        department: "",
        annual_freedays: "",
        entry_time: "",
      },
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      },
      //新增界面数据
      addForm: {
        staff_id: "",
        name: "",
        sex: -1,
        department: "",
        annual_freedays: "",
        entry_time: "",
      },
    };
  },
  methods: {
    getStaffData() {
      getStaff({ page: this.page }).then((res) => {
        console.log(res);
        if (res && res.data && res.data.status === 1) {
          this.users = res.data.data;
          this.total = res.data.total;
          return;
        }
        console.log("error ");
      });
    },


    //性别显示转换
    formatSex: function (row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    // //获取用户列表
    // getUsers() {
    // 	let para = {
    // 		page: this.page,
    // 		name: this.filters.name
    // 	};
    // 	this.listLoading = true;
    // 	//NProgress.start();
    // 	getUserListPage(para).then((res) => {
    // 		this.total = res.data.total;
    // 		this.users = res.data.users;
    // 		this.listLoading = false;
    // 		//NProgress.done();
    // 	});
    // },

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
          deleteStaff(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getStaffData();
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
      this.addForm = {
        staff_id: "",
        name: "",
        sex: -1,
        department: "",
        annual_freedays: "",
        entry_time: "",
      };
    },
    //编辑
     editSubmit: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            updateStaff(para).then((res) => {
              console.log(res);
            this.editFormVisible = false;
              this.$message({
                message: "编辑成功",
                type: "success",
              });
              this.getStaffData();
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
            addStaff(para).then((res) => {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success",
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getStaffData();
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
            this.getStaffData();
          });
        })
        .catch(() => {});
    },
  },
  mounted() {
    this.getStaffData();
  },
};
</script>

<style>
</style>