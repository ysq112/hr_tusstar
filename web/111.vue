<template>
    <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>学生管理</el-breadcrumb-item>
        <el-breadcrumb-item>学生列表</el-breadcrumb-item>
      </el-breadcrumb>
  
      <!-- 分割线 -->
      <el-divider></el-divider>
  
      <!-- 按钮操作区域 -->
      <el-row>
        <!-- 搜索框 -->
        <el-col :span="5">
          <el-input placeholder="学号/姓名....." v-model="searchVal" style="width:250px">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
  
        <!-- 添加学生用户记录 -->
        <el-col :span="2">
          <el-button type="primary" @click="addStuDialogVisble = true">
            添加
            <i class="el-icon-circle-plus-outline el-icon--right"></i>
          </el-button>
        </el-col>
  
        <!-- 批量删除 -->
        <el-col :span="2">
          <el-button type="danger" @click="multipleDelete(sels)" :disabled="this.sels.length === 0">
            删除
            <i class="el-icon-delete el-icon--right"></i>
          </el-button>
        </el-col>
  
        <!-- Xls文件导入 -->
        <el-col :span="2">
          <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
        </el-col>
  
        <!-- Xls 文件导出 -->
        <el-col :span="2">
          <el-button @click="handleExport()" type="primary">
            导出
            <i class="el-icon-download el-icon--right"></i>
          </el-button>
        </el-col>
  
        <!-- 导入文件模板 -->
        <el-col :span="10">
          <el-button @click="handleTemplate()" type="info">
            模板
            <i class="el-icon-view"></i>
          </el-button>
        </el-col>
  
        <!-- 操作区域结束 -->
      </el-row>
  
      <!-- 分割线 -->
      <el-divider></el-divider>
  
      <!-- 表格区域 -->
      <el-table
        v-loading="loading"
        :row-key="getRowKeys"
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @selection-change="selsChange"
      >
        <!-- 行数据选择器 -->
        <el-table-column type="selection" :reserve-selection="true" align="center" width="55"></el-table-column>
  
        <el-table-column align="center" label="姓名">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column align="center" label="性别">
          <template slot-scope="scope">{{ scope.row.sex }}</template>
        </el-table-column>
  
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
  
        <el-table-column label="状态" align="center">
          <template slot-scope="scope"><el-tag type="success">{{ scope.row.status }}</el-tag></template>
        </el-table-column>
  
        <el-table-column align="center" label="学号">
          <template slot-scope="scope">{{ scope.row.sno }}</template>
        </el-table-column>
  
        <el-table-column label="班级" align="center">
          <template slot-scope="scope">{{ scope.row.class }}</template>
        </el-table-column>
  
        <el-table-column label="专业" align="center">
          <template slot-scope="scope">{{ scope.row.major }}</template>
        </el-table-column>
  
        <el-table-column label="学校" align="center">
          <template slot-scope="scope">{{ scope.row.school }}</template>
        </el-table-column>
        <!-- 行数据操作栏 -->
        <el-table-column width="170" abel="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" slot="reference">
              <i class="el-icon-edit"></i>编辑
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
              <i class="el-icon-delete"></i>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分割线 -->
      <el-divider></el-divider>
  
      <!-- 分页操作区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10,50,100, 200]"
        :page-size="10"
        layout="prev, pager, next, jumper,sizes, total "
        :total="this.tableData.length"
      ></el-pagination>
  
      <!-- 添加学生记录对话框 -->
      <el-dialog title="添加学生记录" :visible.sync="addStuDialogVisble" width="30%" center>
        <el-form :model="stuInfo" ref="stuInfo" class="demo-ruleForm" label-width="70px">
          <el-form-item
            prop="sno"
            label="学号"
            :rules="{ required: true, message: '请输入学号', trigger: 'blur' }"
          >
            <el-input v-model="stuInfo.sno"></el-input>
          </el-form-item>
  
          <el-form-item
            prop="name"
            label="姓名"
            :rules="{ required: true, message: '请输入姓名', trigger: 'blur' }"
          >
            <el-input v-model="stuInfo.name"></el-input>
          </el-form-item>
          <el-form-item
            prop="class"
            label="班级"
            :rules="{ required: true, message: '请输入班级', trigger: 'blur' }"
          >
            <el-input v-model="stuInfo.class"></el-input>
          </el-form-item>
          <el-form-item
            prop="phone"
            label="手机号"
            :rules="{ required: true, message: '请输入手机号', trigger: 'blur' }"
          >
            <el-input v-model="stuInfo.phone"></el-input>
          </el-form-item>
          <el-form-item
            prop="email"
            label="邮箱"
            :rules="{ required: true, message: '请输入邮箱号', trigger: 'blur' }"
          >
            <el-input v-model="stuInfo.email"></el-input>
          </el-form-item>
          <el-form-item
            prop="major"
            label="专业"
            :rules="{ required: true, message: '请输入专业', trigger: 'blur' }"
          >
            <el-input v-model="stuInfo.major"></el-input>
          </el-form-item>
          <el-form-item
            prop="school"
            label="学校"
            :rules="{ required: true, message: '请输入学校', trigger: 'blur' }"
          >
            <el-input v-model="stuInfo.school"></el-input>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="stuInfo.sex" label="1">男</el-radio>
            <el-radio v-model="stuInfo.sex" label="2">女</el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="stuInfo.status" label="0">投递简历中</el-radio>
            <el-radio v-model="stuInfo.status" label="1">实习中</el-radio>
            <el-radio v-model="stuInfo.status" label="2">实习已结束</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('stuInfo')">添加</el-button>
            <el-button @click="resetForm('stuInfo')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
  
      <!-- 编辑学生记录对话框 -->
      <el-dialog
        title="编辑学生记录"
        :visible.sync="editStuDialogVisble"
        width="30%"
        center
      >
        <el-form :model="stuInfo" ref="stuInfo" class="demo-ruleForm" label-width="70px">
          <el-form-item
            prop="sno"
            label="学号"
            :rules="{ required: true, message: '请输入学号', trigger: 'blur' }"
          >
            <el-input v-model="stuInfo.sno"></el-input>
          </el-form-item>
  
          <el-form-item
            prop="name"
            label="姓名"
            :rules="{ required: true, message: '请输入姓名', trigger: 'blur' }"
          >
            <el-input v-model="stuInfo.name"></el-input>
          </el-form-item>
          <el-form-item
            prop="class"
            label="班级"
            :rules="{ required: true, message: '请输入班级', trigger: 'blur' }"
          >
            <el-input v-model="stuInfo.class"></el-input>
          </el-form-item>
          <el-form-item
            prop="email"
            label="邮箱"
            :rules="{ required: true, message: '请输入邮箱号', trigger: 'blur' }"
          >
            <el-input v-model="stuInfo.email"></el-input>
          </el-form-item>
          <el-form-item
            prop="major"
            label="专业"
            :rules="{ required: true, message: '请输入专业', trigger: 'blur' }"
          >
            <el-input v-model="stuInfo.major"></el-input>
          </el-form-item>
          <el-form-item
            prop="school"
            label="学校"
            :rules="{ required: true, message: '请输入学校', trigger: 'blur' }"
          >
            <el-input v-model="stuInfo.school"></el-input>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="stuInfo.status" label="0">投递简历中</el-radio>
            <el-radio v-model="stuInfo.status" label="1">实习中</el-radio>
            <el-radio v-model="stuInfo.status" label="2">实习已结束</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitEditForm('stuInfo')">修改</el-button>
            <el-button @click="resetForm('stuInfo')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </template>
  
  <script>
  // 导入Excel上传组件
  import UploadExcelComponent from "@/components/UploadExcel/Index";
  export default {
     inject:['reload'],
    // 组件名
    name: "UploadExcel",
    // 使用组件
    components: { UploadExcelComponent },
  
    data() {
      return {
        loading: true,
        currentPage: 1, // 初始页
        pagesize: 10, // 每页的数据
        tableList: [], //导出Xls表数据
        tableHeader: [], // 导出Xls表头
        sels: [], // 选择行(值)
        searchVal: "", // 搜索框值
        addStuDialogVisble: false, // 控制添加对话框(Visable)
        editStuDialogVisble: false, // 控制编辑对话框(Visable)
        table: [], // 临时学生列表存储
        stuInfo: {
          //表单数据(model)
          sno: "",
          name: "",
          sex: "1",
          class: "",
          phone: "",
          email: "",
          major: "",
          school: "",
          status: "0"
        }
      };
    },
    created() {
      console.log("Requesting Student list......");
      this.studentList(); //获取学生列表
    },
    methods: {
      /* 获取学生列表 */
      studentList() {
        this.$axios({
          url: "/api/student/list",
          method: "post",
          crossdomain: true
        })
          .then(res => {
            // 请求成功
            if (res.data.code == "0000") {
              this.table = res.data.studentlist;
              this.loading = false;
            } else {
              /* SQL Error */
              this.$message.error("数据请求失败!");
            }
          })
          .catch(error => {
            //请求失败
            console.log(error);
            this.$message.error("服务器请求失败!");
          });
      },
      /* 文件导入预处理 */
      beforeUpload(file) {
        // 取文件大小，限制文件大小超过1mb
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (isLt1M) {
          return true;
        }
        this.$message({
          message: "上传的Excel文件不能大于1mb.",
          type: "warning"
        });
        return false;
      },
      /* 文件读取后执行 */
      handleSuccess({ results, header }) {
        this.tableList = results;
        this.tableHeader = header;
        // 导入模板表头
        const tHeader = [
          "学号",
          "姓名",
          "性别",
          "班级",
          "手机号",
          "邮箱",
          "专业",
          "学校",
          "状态"
        ];
        // 表头比对
        if (header.join(",") != tHeader.join(",")) {
          this.$message.error("表格导入模板错误!");
          return;
        }
        // 批量导入
        this.handleUpload();
      },
      handleUpload() {
        var params = new URLSearchParams(); // 请求参数
        params.append(
          "tableList",
          JSON.stringify(this.tableList, { arrayFormat: "brackets" })
        );
        this.$axios({
          url: "/api/student/upload",
          method: "post",
          crossdomain: true,
          data: params
        })
          .then(res => {
            console.log(res);
            if (res.data.code == "0000") {
              this.$message({
                message: "数据导入成功!",
                type: "success"
              });
              this.reload();
            } else {
              this.$message.error("数据导入错误!");
            }
          })
          .catch(error => {
            console.log(error);
            this.$message.error("服务器请求错误!");
          });
      },
      /* 提交添加学生记录表单 */
      submitForm(formName) {
        var params = new URLSearchParams();
        params.append("sno", this.stuInfo.sno);
        params.append("name", this.stuInfo.name);
        params.append("sex", this.stuInfo.sex);
        params.append("class", this.stuInfo.class);
        params.append("phone", this.stuInfo.phone);
        params.append("email", this.stuInfo.email);
        params.append("major", this.stuInfo.major);
        params.append("school", this.stuInfo.school);
        params.append("status", this.stuInfo.status);
        /* 验证表单 */
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$axios({
              url: "/api/student/add",
              method: "post",
              crossdomain: true,
              data: params
            })
              .then(res => {
                console.log(res);
                if (res.data.code == "0000") {
                  this.$message({
                    message: "添加成功!",
                    type: "success"
                  });
                  this.reload();
                } else {
                  this.$message.error("数据添加错误!");
                }
              })
              .catch(error => {
                console.log(error);
                this.$message.error("服务器请求错误!");
              });
          } else {
            console.log("error submit!!");
            this.$message.error("表单提交错误!");
            return false;
          }
        });
      },
      /* 提交学生记录编辑表单 */
      submitEditForm(formName) {
        // 请求参数
        var params = new URLSearchParams();
        params.append("sno", this.stuInfo.sno);
        params.append("name", this.stuInfo.name);
        params.append("sex", this.stuInfo.sex);
        params.append("class", this.stuInfo.class);
        params.append("phone", this.stuInfo.phone);
        params.append("email", this.stuInfo.email);
        params.append("major", this.stuInfo.major);
        params.append("school", this.stuInfo.school);
        params.append("status", this.stuInfo.status);
        /* 验证表单 */
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$axios({
              url: "/api/student/edit",
              method: "post",
              crossdomain: true,
              data: params
            })
              .then(res => {
                console.log(res);
                if (res.data.code == "0000") {
                  this.$message({
                    message: "修改成功!",
                    type: "success"
                  });
                  this.reload();
                } else {
                  this.$message.error("数据修改错误!");
                }
              })
              .catch(error => {
                console.log(error);
                this.$message.error("服务器请求错误!");
              });
          } else {
            console.log("error submit!!");
            this.$message.error("表单提交错误!");
            return false;
          }
        });
      },
      /* 获取当前已选择的行 */
      selsChange(sels) {
        this.$forceUpdate();
        console.log(sels);
        this.sels = sels;
      },
      /* 批量删除学记录 */
      multipleDelete(sels) {
        /* 将已选择的行的ID号添加到数组  */
        var phones = this.sels.map(item => item.phone).join();
        //console.log(phones);
        this.$confirm("此操作将永久删除已选择记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.resDelets(phones); //请求批量删除
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      /* 请求批量删除*/
      resDelets(phones) {
        var params = new URLSearchParams();
        params.append(
          "phone",
          JSON.stringify(phones, { arrayFormat: "brackets" })
        );
        this.$axios({
          url: "/api/student/deletes",
          method: "post",
          crossdomain: true,
          data: params
        })
          .then(res => {
            console.log(res);
            if (res.data.code == "0000") {
              this.$message({
                message: "删除成功!",
                type: "success"
              });
              this.reload();
            } else {
              this.$message.error("批量删除错误!");
            }
          })
          .catch(error => {
            console.log(error);
            this.$message.error("服务器请求错误!");
          });
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      /*  编辑学生记录(modle 绑定) */
      handleEdit(index, row) {
        this.editStuDialogVisble = true;
        console.log(index, row);
        this.stuInfo.sno = row.sno;
        this.stuInfo.name = row.name;
        this.stuInfo.phone = row.phone;
        this.stuInfo.email = row.email;
        this.stuInfo.class = row.class;
        this.stuInfo.school = row.school;
        this.stuInfo.major = row.major;
        if (row.status == "投递简历中") {
          this.stuInfo.status = "0";
        } else if (row.status == "实习中") {
          this.stuInfo.status = "1";
        } else if (row.status == "实习已结束") {
          this.stuInfo.status = "2";
        }
      },
      /* 单个记录删除 */
      handleDelete(index, row) {
        console.log(index, row);
        this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.resDelete(row.phone);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      /* 请求删除记录 */
      resDelete(phone) {
        var params = new URLSearchParams();
        params.append("phone", phone);
        this.$axios({
          url: "/api/student/delete",
          method: "post",
          crossdomain: true,
          data: params
        })
          .then(res => {
            console.log(res.data);
            if (res.data.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.reload();
            } else {
              console.log(res.data);
              /* SQL 错误 */
              this.$message.error("数据删除失败!");
            }
          })
          .catch(error => {
            /* 请求错误 */
            console.log(error);
            this.$message.error("服务器请求失败!");
          });
      },
      /* 导出为 Xls文件 */
      handleExport() {
        require.ensure([], () => {
          const { export_json_to_excel } = require("../../vendor/Export2Excel");
          // 表头
          const tHeader = [
            "学号",
            "姓名",
            "性别",
            "班级",
            "手机号",
            "邮箱",
            "专业",
            "学校",
            "状态"
          ];
          // 表头相应的Tag
          const filterVal = [
            "sno",
            "name",
            "sex",
            "class",
            "phone",
            "email",
            "major",
            "school",
            "status"
          ];
          // 绑定Tag
          const list = this.tableData;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "学生列表");
        });
        this.$message({
          message: "导出成功!",
          type: "success"
        });
      },
      /* 导入模板下载 */
      handleTemplate() {
        require.ensure([], () => {
          const { export_json_to_excel } = require("../../vendor/Export2Excel");
          // Table Header
          const tHeader = [
            "学号",
            "姓名",
            "性别",
            "班级",
            "手机号",
            "邮箱",
            "专业",
            "学校",
            "状态"
          ];
          const data = [];
          export_json_to_excel(tHeader, data, "数据导入模板");
        });
        this.$message({
          message: "导入模板下载成功!",
          type: "success"
        });
      },
      /* 导出格式化 */
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]));
      },
      // 初始页currentPage、初始每页数据数pagesize和数据data
      handleSizeChange(size) {
        this.pagesize = size; // 每页下拉显示数据
        //console.log(this.pagesize);
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage; //点击第几页
        //console.log(this.currentPage);
      },
      getRowKeys(row) {
        return row.phone;
      }
    },
  
    computed: {
      /* 本地搜索功能*/
      tableData() {
        const search = this.searchVal;
        if (search) {
          // 数组过滤
          return this.table.filter(data => {
            return Object.keys(data).some(key => {
              return (
                String(data[key])
                  .toLowerCase()
                  .indexOf(search) > -1
              );
            });
          });
        }
        return this.table;
      }
    }
  };
  </script>
  
  <style scoped>
  
  /* 分页组件右对齐 */
  .el-pagination {
    float: right;
  }
  </style>