<template>
  <div class="home">
    <div class="card">
      <div class="login">
        <el-form
          :model="ruleForm"
          status-icon
          ref="ruleFormlogin"
          label-width="100px"
          class="demo-ruleForm"
          :rules="rules"
        >
          <!-- <el-form-item class="select">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
          <el-form-item label="账号" prop="id">
            <el-input
              v-model="ruleForm.account"
              placeholder="请输入HR工号"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="验证码"
            prop="imgPwd"
            :class="['imgPwd', imgStatus ? 'show' : '']"
          >
            <el-input
              v-model="ruleForm.imgPwd"
              placeholder="请输入图形验证码"
            ></el-input>
            <img
              src="@/assets/images/src=http___s4.sinaimg.cn_mw690_003bsgbmgy6R6efoOr1c3&refer=http___s4.sinaimg.jpg"
              alt=""
            />
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-input
              v-model="ruleForm.pwd"
              type="password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <div class="btn">
              <el-button @click="toRegister">注册</el-button>
            </div>
            <div class="btn">
              <el-button @click="toMainPage">登录</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="img">
        <div>
          <img src="@/assets/images/1.png" alt="" />
        </div>
        <div>Welcome to use Workattsys</div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "@/assets/js/register";

export default {
  name: "Home",
  methods: {
    toRegister() {
      this.$router.push("/Register");
    },
    toMainPage() {
      this.$router.push("/MainPage")
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          login({
            id: this.ruleForm.account,
            pwd: this.ruleForm.pwd,
            imgPwd: this.ruleForm.imgPwd,
            flag: Number(this.value),
          }).then((res) => {
            if (res && res.status && res.status === 1) {
              console.log(res.data);
              alert("登录成功");
              return;
            }
            this.imgIndex++;
            if (this.imgIndex >= 3) {
              this.imgStatus = true;
            }
            alert("登录失败");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  data() {
    const validateAccount = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入HR工号"));
        return;
      }
      callback();
    };
    const validatePwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
        return;
      }
      callback();
    };
    const validateImgPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入图形验证码"));
        return;
      }
      callback();
    };
    return {
      imgIndex: 0,
      imgStatus: false,
      ruleForm: {
        account: "",
        pwd: "",
        imgPwd: "",
      },
      
      
      value: "0",
      rules: {
        account: [{ validator: validateAccount, trigger: "blur" }],
        pwd: [{ validator: validatePwd, trigger: "blur" }],
        // imgPwd: [{ validator: validateImgPwd, trigger: "blur" }],
      },
    };
  },
};
</script>

<style lang="less">
.home {
  .imgPwd {
    .el-form-item__content {
      display: flex;
    }
  }
}
</style>

<style lang="less" scoped>
.home {
  display: flex;
  background: #d0c8c8;
  height: 100vh;
  align-items: center;
  justify-content: center;
  .login {
    background: #fff;
    justify-content: center;
    display: flex;
    align-items: center;
  }
  .card {
    background: #fff;
    padding: 20px;
    display: flex;
    box-shadow: 10px 10px 20px 10px #999;
    border-radius: 4px;
    border: solid 1px #999;
  }
  .img {
    background: #fff;
    font-size: 20px;
    letter-spacing: 1.5px;
    font-weight: 600;

    img {
      width: 400px;
    }
  }
  .select {
    margin-bottom: 100px;
  }
  .login {
    width: 360px;
    padding: 50px 15px 50px 0;
  }
  .mb {
    margin-bottom: 100px;
  }
  .btn {
    .el-button {
      width: 180px;
      font-weight: 600;
    }
  }
  //.btns {
    // margin-top: 60px;
  //}

  .imgPwd {
    opacity: 0;
    &.show {
      opacity: 1;
    }
    .el-input {
      width: 160px;
    }
    img {
      height: 40px;
      width: 70px;
    }
  }
}
</style>

