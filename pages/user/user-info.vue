<template>
  <section class="userinfo">
    <div class="title">个人资料</div>
    <div class="user-box">
      <el-form :model="form" ref="form" class="form" label-position="top">
         <el-form-item
            label="头像"
            prop="">
            <el-upload
              class="upload-demo"
              drag
              name="image"
              accept="image/jpeg,image/gif,image/png"
              :show-file-list="false"
              :data="{type:2}"
              :action="uploadUrl"
              :headers="myHeader"
              :before-upload="beforeUpload"
              :on-error="uploadError"
              :on-success="uploadSuccess">
                <div class="uploadimg" v-show="form.imageUrl">
                  <img :src="form.imageUrl" alt="">
                </div>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>

          <el-form-item
            label="签名"
            prop="talk"
            :rules="[
              { max:100, message: '签名最大长度为100个字'}
            ]"
          > 
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model.trim="form.talk" placeholder="请输入签名"></el-input>
          </el-form-item>

          <el-form-item
            class="inline"
            label="姓名"
            prop="nickName"
            :rules="[
              { required: true, message: '姓名不能为空'},
              { max:25, message: '姓名最大长度为25个字'}
            ]"
          >
            <el-input  v-model.trim="form.nickName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item
            class="inline"
            label="性别"
            prop="sex"
            :rules="[
              { required: true, message: '性别不能为空'}
            ]"
          > 
            <el-select v-model="form.sex" placeholder="请选择性别">
              <el-option :value="0" label="男" />
              <el-option :value="1" label="女" />
            </el-select>
           </el-form-item>

           <el-form-item
            class="inline"
            label="出生年份"
            prop="birthYear"
            :rules="[
              { required: true, message: '出生年份不能为空'}
            ]"
          > 
            <el-date-picker
              v-model="form.birthYear"
              type="year"
              placeholder="选择年">
            </el-date-picker>
           </el-form-item>

          <el-form-item
           class="inline"
            label="出生月份"
            prop="birthMonth"
            :rules="[
              { required: true, message: '出生月份不能为空'}
            ]"
          > 
            <el-date-picker
              v-model="form.birthMonth"
              type="month"
              placeholder="选择月">
            </el-date-picker>
           </el-form-item>

           <el-form-item
            label="职业"
            prop="job"
            :rules="[
              { required: true, message: '职业不能为空'}
            ]"
          > 
            <el-cascader
              expand-trigger="hover"
              :options="jobs"
              v-model="form.job"
            >
            </el-cascader>
          </el-form-item>

           <el-form-item
            class="inline"
            label="身高"
            prop="height"
            :rules="[
              { required: true, message: '身高不能为空'}
            ]"
          > 
            <el-input placeholder="请输入内容" v-model="form.height">
              <template slot="append">CM</template>
            </el-input>
           </el-form-item>

           <el-form-item
            class="inline"
            label="体重"
            prop="height"
            :rules="[
              { required: true, message: '体重不能为空'}
            ]"
          > 
            <el-input placeholder="请输入内容" v-model="form.weight">
              <template slot="append">KG</template>
            </el-input>
           </el-form-item>

           <el-form-item
            label="地域"
            prop="address"
            :rules="[
              { required: true, message: '地域不能为空'}
            ]"
          >
            <el-cascader
              expand-trigger="hover"
              :options="area"
              v-model="form.address"
              >
            </el-cascader>
          </el-form-item>
          
          <div class="submit-btn">
            <a href="javascript:;" @click="update">保存</a>
          </div>
           
       </el-form>
    </div>
  </section>
</template>

<script>
import api from '~/api/user'
import Cascader from '~/components/cascader'
import address from 'static/address.json'
import jobData from 'static/jobs.json'
import {getArea2} from '~/tools/index'
export default {
  layout: 'user',
  components: {
    Cascader
  },
  data () {
    return {
      myHeader: {
        Authorization: ''
      },
      uploadUrl: '',
      form: {
        imageUrl: '',
        talk: '',
        nickName: '',
        sex: '',
        birthMonth: '',
        birthYear: '',
        job: [],
        height: '',
        weight: '',
        province: '',
        city: '',
        address: []
      },
      jobs: [],
      area: [],
      status: false
     }
  },
  methods: {
    // 文件上传之前检测大小
    beforeUpload (file) {
      let size = parseInt(file.size / 1024, 10)
      let type = 'image/png|image/jpeg|iamge/gif'.indexOf(file.type) > -1
      if (!type) {
        this.$message({
          showClose: true,
          message: '只能上传jpg/png/gif文件',
          type: 'warning',
          center: true
        })
        return false
      }
      if (size > 1024) {
        this.$message({
          showClose: true,
          message: '图片大小不能超过1M',
          type: 'warning',
          center: true
        })
        return false
      }
    },
    // 上传出错提示
    uploadError (err, file) {
      this.$message({
        showClose: true,
        message: '图片上传失败',
        type: 'warning',
        center: true
      })
    },
    // 上传成功
    uploadSuccess (response, file) {
      this.form.imageUrl = response.data.imageUrl
    },
    // 获取个人信息
    getUserInfo () {
      api.getUserInfo({}).then((res) => {
        if (res.data.code === 200){
          let data = res.data.data
          this.form = data
          let job = data.job
          let jobs = []
          jobData.jobs.forEach((el) => {
            let child = el.children
            let status = false
            child.forEach(element => {
              if (element.value === job) {
                status = true
              }
            })
            if (status) {
              jobs = [el.value, job]
            }
          })
          this.form.job = jobs
          this.form.address = [data.country, data.province, data.city]
          console.log(data.country, data.province, data.city)
        }
      }).catch(() => {})
    },
    // 更新个人信息
    update () {
      if (!this.form.imageUrl) {
        this.$message({
          showClose: true,
          message: '请上传图像',
          type: 'warning',
          center: true
        })
        return false
      }
      if (this.status) {
        return false
      }
      this.status = true
      this.$refs.form.validate((valid) => {
        api.update({
        sex: this.form.sex,
        birthYear: this.form.birthYear,
        birthMonth: this.form.birthMonth,
        imageUrl: this.form.imageUrl,
        nickName: this.form.nickName,
        talk: this.form.talk,
        job: this.form.job[1],
        height: this.form.height,
        weight: this.form.weight,
        address: this.form.address.join(','),
        country: this.form.address[0],
        province: this.form.address[1],
        city: this.form.address[2]
      }).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            showClose: true,
            message: '更新成功',
            type: 'success',
            center: true
          })
          this.getUserInfo()
          this.status = false
        } else{
          this.$message({
            showClose: true,
            message: '更新失败',
            type: 'warning',
            center: true
          })
          this.status = false
        }
      }).catch(() => {
        this.status = false
      })
      })
    }
  },
  mounted () {
    this.myHeader.Authorization = window.localStorage.getItem('token')
    this.uploadUrl = process.env.baseUrl + 'smartShoes/web/file/upload.json'
    this.jobs = jobData.jobs
    this.getUserInfo()
    this.area = getArea2()
  }
}
</script>


<style lang="scss" scoped>
.userinfo{
    .title{
      font-size: 0.16rem;
      color: #999;
    }
    .form{
      margin-top: 0.4rem;
      overflow: hidden;
      .el-cascader{
        width: 100%;
      }
      .inline{
        width: 50%;
        display: inline-block;
        .el-input,.el-select{
          width: 60%;
        }
      }
      .uploadimg{
        width: 3.6rem;
        height: 1.8rem;
        text-align: center;
        line-height: 1.8rem;
        img{
          max-width: 100%;
          max-height: 100%;
          vertical-align: middle;
        }
      }
      .submit-btn{
        text-align: center;
        padding-top: 0.4rem;
        padding-bottom: 1rem;
        a{
          text-align: center;
          display: inline-block;
          background: #30c17b;
          border-radius: 1rem;
          width: 2rem;
          height: .6rem;
          line-height: .6rem;
          font-size: 0.2rem;
          color: #fff;
          cursor: pointer;
        }
      }
    }
}
</style>

<style lang="scss">
.userinfo{
  .user-box{
    .el-form{
      .el-form--label-top,.el-form-item__label{
          margin: 0;
          padding: 0 ;
      }
    }
  }
}
</style>