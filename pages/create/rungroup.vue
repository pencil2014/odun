<template>
  <section class="rungroup">
    <div class="header">
      <Header active="6"/>
    </div>
    <div class="content">
      <div class="create">
        <div class="title">创建跑团 （1/3）</div>
         <el-form :model="form" ref="form" class="form" label-position="top">
           <el-form-item
            label="选择团头像"
            prop=""
          >
          <div>
            <el-upload
              class="upload-demo"
              drag
              name="image"
              accept="image/jpeg,image/gif,image/png"
              :show-file-list="false"
              :data="{type:1}"
              :action="uploadUrl"
              :headers="myHeader"
              :before-upload="beforeUpload"
              :on-error="uploadError"
              :on-success="uploadSuccess"
              >
                <div class="uploadimg" v-show="form.imageUrl">
                  <img :src="form.imageUrl" alt="">
                </div>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png/gif文件，且不超过1M</div> -->
            </el-upload>
          </div>
          </el-form-item>
          <el-form-item
            label="团名称"
            prop="name"
            :rules="[
              { required: true, message: '团名称不能为空'},
              { max:25, message: '团名称最大长度为25个字'}
            ]"
          >
            <el-input  v-model.trim="form.name" placeholder="请输入团名称"></el-input>
          </el-form-item>
          <el-form-item
            label="团简介"
            prop="introduce"
            :rules="[
              { required: true, message: '团简介不能为空'},
              { max:80, message: '团名称最大长度为80个字'}
            ]"
          > 
            <el-input type="textarea" :autosize="{ minRows:6, maxRows: 10}" v-model.trim="form.introduce" placeholder="请输入团简介"></el-input>
          </el-form-item>
          <el-form-item
            label="跑团地址"
            prop="address"
            :rules="[
              { required: true, message: '跑团地址不能为空'}
            ]"
          >
          <Cascader v-model="form.address" ref="cascader" :label.sync="form.addressLabel" :grade="2" placeholder="请选择跑团地址"/>
          </el-form-item>
          <el-form-item
            label=""
            prop="subAddress"
            :rules="[
              { required: true, message: '详细地址不能为空'},
              { max:80, message: '详细地址最大长度为80个字'}
            ]"
          > 
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model.trim="form.subAddress" placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <div class="submit-btn">
            <a href="javascript:;" @click="createRungroup">创建</a>
          </div>
        </el-form>
      </div>
    </div>
  </section>
</template>

<script>
import api from '~/api/create'
import { getAreaId } from '~/tools/index'
import Header from '~/components/header.vue'
import Cascader from '~/components/cascader'
export default {
  head () {
    return {
      title: '创建跑团',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'RunStep,智能跑鞋,跑步,跑团' },
        { hid: 'description', name: 'description', content: 'RunStep官方网站,一站式专业跑团,坚持跑步鞋子免费拿' }
      ]
    }
  },
  layout: 'home',
  components: {
    Header,
    Cascader
  },
  data () {
    return {
      myHeader: {
        Authorization: ''
      },
      groupId: '',
      uploadUrl: '',
      form: { // 提交表单
        imageUrl: '',
        name: '',
        introduce: '',
        address: '',
        addressLabel: '',
        subAddress: ''
      },
      check: false
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
        message: '文件上传失败',
        type: 'warning',
        center: true
      })
    },
    // 上传成功
    uploadSuccess (response, file) {
      this.form.imageUrl = response.data.imageUrl
    },
    // 创建跑团
    createRungroup () {
      if(this.check) {
        this.$message({
          showClose: true,
          message: '正在提交，请稍后！',
          type: 'warning',
          center: true
        })
        return false
      }
      this.check = true
      if (!this.form.imageUrl) {
        this.$message({
          showClose: true,
          message: '请上传跑团头像',
          type: 'warning',
          center: true
        })
        return false
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          let address = `${this.form.addressLabel.join(',')},${this.form.subAddress}`
          api.createRungroup({
          groupId: this.groupId,
          name: this.form.name,
          introduce: this.form.introduce,
          imageUrl: this.form.imageUrl,
          address: address}).then((res) => {
            if (res.data.code === 200) {
              this.$router.push({path:'/create/groupSuc', query:{name: this.form.name, type: 1, groupId: res.data.data.groupId}})
            } else {
              let status = {
                300: '创建失败',
                301: '用户不存在',
                307: '用户已被另一台设备踢下线',
                303: '缺少参数',
                354: '跑团名称已存在'
              }
              let msg = status[res.data.code]
              this.$message({
                showClose: true,
                message: msg,
                type: 'warning',
                center: true
              })
              this.check = false
            }
          }).catch(() => {
            this.$message({
              showClose: true,
              message: '创建跑团失败',
              type: 'warning',
              center: true
            })
            this.check = false
          })
        }
      })
    },
    // 获取跑团详情
    getRungroup () {
      api.getRungroup({groupId: this.groupId}).then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.form.imageUrl = data.imageUrl
          this.form.name = data.name
          this.form.introduce = data.introduce
          this.form.subAddress = data.address
          let area = getAreaId(data.province, data.city)
          this.form.address = area
          this.$refs.cascader.setValue(area) 
        }
      }).catch(() => {})
    }
  },
  mounted () {
    // this.myHeader.Authorization = getCookie('token')
    this.myHeader.Authorization = window.localStorage.getItem('token')
    this.uploadUrl = process.env.baseUrl + 'smartShoes/web/file/upload.json'
    this.groupId = this.$route.query.groupId || ''
    if (!!this.groupId) {
      this.getRungroup()
    }
  }
}
</script>

<style lang="scss" scoped>
.rungroup{
  font-size: 0.16rem;
  .header{
    padding-top: 0.14rem;
  }
  .create{
    margin: .4rem 0 1rem 0;
    border: 1px solid #e4e4e4;
    border-radius: 3px;
    padding: .4rem;
    .title{
      font-size: 0.18rem;
    }
    .form{
      padding-top: 0.4rem;
      .uploadimg{
        width: 100%;
        height: 100%;
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
}
</style>
