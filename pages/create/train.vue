<template>
  <section class="train">
    <div class="header">
      <Header active="6"/>
    </div>
    <div class="content">
      <div class="create">
        <div class="title">创建训练计划（1/2）</div>
         <el-form :model="form" ref="form" class="form" label-position="top">
           <p class="subtitle">基本信息</p>
           <el-form-item
            class="inline"
            label="类型"
            prop="type"
            :rules="[
              { required: true, message: '类型不能为空'}
            ]"
          > 
            <el-select v-model="form.type" placeholder="请选择">
              <el-option :value="0" label="跑步" />
            </el-select>
           </el-form-item>

           <el-form-item
            class="inline"
            label="训练名称"
            prop="name"
            :rules="[
              { required: true, message: '训练名称不能为空'}
            ]"
          >
            <el-input  v-model.trim="form.name" placeholder="请输入训练名称"></el-input>
          </el-form-item> 

           <el-form-item
            class="inline"
            label="开始时间"
            prop="startTime"
            :rules="[
              { required: true, message: '开始时间不能为空'}
            ]"
          > 
            <el-date-picker
              v-model="form.startTime"
              class="inline"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="timestamp"
              :default-value="new Date().getTime()+900000"
              placeholder="选择日期">
            </el-date-picker>
           </el-form-item>

           <el-form-item
            class="inline"
            label="结束时间"
            prop="endTime"
            :rules="[
              { required: true, message: '结束时间不能为空'}
            ]"
          >
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="timestamp"
              placeholder="选择日期">
            </el-date-picker>
           </el-form-item>

           <el-form-item
            class="inline"
            label="每次距离"
            prop="mileage"
            :rules="[
              { required: true, message: '每次距离不能为空'}
            ]"
          >
            <el-input  v-model.trim="form.mileage" placeholder="请输入每次距离"></el-input>
          </el-form-item> 
          <el-form-item
            class="inline"
            label="任务次数"
            prop="signNum"
            :rules="[
              { required: true, message: '任务次数不能为空'}
            ]"
          >
            <el-input  v-model.trim="form.signNum" placeholder="请输入任务次数"></el-input>
          </el-form-item>
           <p class="subtitle">训练封面</p>
          <el-form-item
            label="上传训练计划封面"
            prop=""
          >
          <div>
            <el-upload
              class="upload-demo"
              drag
              name="image"
              accept="image/jpeg,image/gif,image/png"
              :show-file-list="false"
              :data="{type:6}"
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

          <div class="submit-btn">
            <a href="javascript:;" @click="createTrain">创建</a>
          </div>
         </el-form>
      </div>
    </div>
  </section>
</template>

<script>
import api from '~/api/create'
import Header from '~/components/header.vue'
export default {
  head () {
    return {
      title: '创建训练计划',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'RunStep,智能跑鞋,跑步,跑团' },
        { hid: 'description', name: 'description', content: 'RunStep官方网站,一站式专业跑团,坚持跑步鞋子免费拿' }
      ]
    }
  },
  layout: 'home',
  components: {
    Header
  },
  data () {
    return {
      uesrId: '',
      groupId: '',
      myHeader: {
        Authorization: ''
      },
      uploadUrl: '',
      form: { // 提交表单
        imageUrl: '',
        name: '',
        startTime: '',
        endTime: '',
        type: '',
        mileage: '',
        signNum: '',
        trainId: ''
      }
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
    // 创建训练计划
    createTrain () {
      api.createTrain({
        userId: this.userId,
        groupId: this.groupId,
        name: this.form.name,
        imageUrl: this.form.imageUrl,
        type: this.form.type,
        startTime: this.form.startTime / 1000,
        endTime: this.form.endTime / 1000,
        mileage: this.form.mileage,
        signNum: this.form.signNum,
        trainId: this.form.trainId
      }).then((res) => {
        if (res.data.code ===200) {
          this.$router.push({path: '/user/rungroup-info', query:{groupId: this.groupId, type: 'train'}})
        } else {
          this.$message({
            showClose: true,
            message: '创建训练计划失败',
            type: 'warning',
            center: true
          })
        }
      }).catch(() => {
        this.$message({
          showClose: true,
          message: '创建训练计划失败',
          type: 'warning',
          center: true
        })
      })
    },
    // 获取训练计划
    getTrain () {
      api.getTrain({
        userId: this.userId,
        trainId: this.trainId
      }).then((res) => {
        if (res.data.code === 200) {
          this.form = res.data.data
          this.form.startTime *= 1000
          this.form.endTime *= 1000
        }
      }).catch(() => {})
    }
  },
  mounted () {
    this.myHeader.Authorization = window.localStorage.getItem('token')
    this.uploadUrl = process.env.baseUrl + 'smartShoes/web/file/upload.json'
    this.userId = JSON.parse(window.sessionStorage.getItem('userInfo')).userId
    this.groupId = this.$route.query.groupId
    this.trainId = this.$route.query.trainId
    // 编辑时先获取内容
    if (!!this.trainId) {
      this.getTrain()
    }
  }
}
</script>

<style lang="scss" scoped>
.train{
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
    .subtitle{
      color: #999;
      margin-bottom: 0.1rem;
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

