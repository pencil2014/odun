<template>
  <section class="activity">
    <div class="header">
      <Header active="6"/>
    </div>
    <div class="content">
      <div class="create-box">
        <div class="title">创建活动 （1/3）</div>
         <el-form :model="form" ref="form" class="form" label-position="top">

           <p class="subtitle">基本信息</p>

           <el-form-item
            class="inline"
            label="类型"
            prop="activityType"
            :rules="[
              { required: true, message: '类型不能为空'}
            ]"
          > 
            <el-select v-model="form.activityType" placeholder="请选择">
              <el-option :value="0" label="跑步" />
            </el-select>
           </el-form-item>

           <el-form-item
            class="inline"
            label="活动开始时间"
            prop="startTime"
            :rules="[
              { required: true, message: '活动开始时间不能为空'}
            ]"
          > 
            <el-date-picker
              v-model="form.startTime"
              class="inline"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-value="new Date().getTime()+900000"
              placeholder="选择日期">
            </el-date-picker>
           </el-form-item>

           <el-form-item
            class="inline"
            label="活动结束时间"
            prop="endTime"
            :rules="[
              { required: true, message: '活动结束时间不能为空'}
            ]"
          >
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
           </el-form-item>

           <el-form-item
            class="inline"
            label="报名截止时间"
            prop="endJoinTime"
            :rules="[
              { required: true, message: '报名截止时间不能为空'}
            ]"
          >
            <el-date-picker
              v-model="form.endJoinTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
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
           
          <p class="subtitle mt">活动标题和描述</p>
          <el-form-item
            label="活动标题"
            prop="title"
            :rules="[
              { required: true, message: '活动标题不能为空'},
              { max:25, message: '团名称最大长度为25个字'}
            ]"
          >
            <el-input  v-model.trim="form.title" placeholder="请输入活动标题"></el-input>
          </el-form-item> 
          
          <el-form-item
            label="活动描述简介"
            prop="introduce"
            :rules="[
              { required: true, message: '活动描述简介不能为空'},
              { max:5000, message: '活动描述简介最大长度为5000个字'}
            ]"
          > 
            <el-input type="textarea" :autosize="{ minRows:10, maxRows: 20}" v-model.trim="form.introduce" placeholder="请输入团简介"></el-input>
          </el-form-item>
          <el-form-item
            label="活动描述详细"
            prop="introduceDesc"
          > 
           <div class="editor">
             <ueditor @getContent="getContent"  ref="ueditor"/>
           </div>
          </el-form-item>  
           
           <p class="subtitle mt">活动封面</p> 

           <el-form-item
            label="上传活动封面"
            prop=""
          >
          <div>
            <el-upload
              class="upload-demo"
              drag
              name="image"
              accept="image/jpeg,image/gif,image/png"
              :show-file-list="false"
              :data="{type:0}"
              :action="uploadUrl"
              :headers="myHeader"
              :before-upload="beforeUpload"
              :on-error="uploadError"
              :on-success="uploadSuccess"
              >
                <div class="uploadimg" v-show="form.coverImg">
                  <img :src="form.coverImg" alt="">
                </div>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png/gif文件，且不超过1M</div> -->
            </el-upload>
          </div>
          </el-form-item>


          <p class="subtitle mt">活动附加信息 <span>( 备注：此栏目不填写则为默认数据 )</span></p> 

          <el-form-item
            class="inline"
            label="费用（元/人）"
            prop="cost"
            :rules="[
              { required: true, message: '活动标题不能为空'}
            ]"
          >
            <el-input  v-model.trim="form.cost" placeholder="元/人"></el-input>
          </el-form-item> 

          <el-form-item
            class="inline"
            label="人数（0表示无限制）"
            prop="totalJoin"
            :rules="[
              { required: true, message: '人数不能为空'}
            ]"
          >
            <el-input  v-model.trim="form.totalJoin" placeholder="人"></el-input>
          </el-form-item>

          <el-form-item
            class="inline"
            label="报名需要审核"
            prop="needVerify"
          > 
            <el-select v-model="form.needVerify" placeholder="请选择">
              <el-option :value="0" label="不需要" ></el-option>
              <el-option :value="1" label="需要" ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            class="inline"
            label="报名填写手机"
            prop="needPhone"
          > 
            <el-select v-model="form.needPhone" placeholder="请选择">
              <el-option :value="0" label="不需要" ></el-option>
              <el-option :value="1" label="需要" ></el-option>
            </el-select>
           </el-form-item>

          <el-form-item
            class="inline"
            label="报名填写身份证"
            prop="needIdCard"
          > 
            <el-select v-model="form.needIdCard" placeholder="请选择">
              <el-option :value="0" label="不需要" ></el-option>
              <el-option :value="1" label="需要" ></el-option>
            </el-select>
           </el-form-item>

          <el-form-item
            class="inline"
            label="报名填写姓名"
            prop="needRealName"
          > 
            <el-select v-model="form.needRealName" placeholder="请选择">
              <el-option :value="0" label="不需要" ></el-option>
              <el-option :value="1" label="需要" ></el-option>
            </el-select>
           </el-form-item>

           <el-form-item
            class="inline"
            label="仅团内成员报名"
            prop="open"
          > 
            <el-switch
              v-model="form.open"
              active-color="#13ce66"
              inactive-color="#ccc">
            </el-switch>
           </el-form-item>

          <el-form-item
            class="inline"
            label="性别"
            prop="needSex"
          > 
            <el-select v-model="form.needSex" placeholder="请选择">
              <el-option :value="0" label="不需要" ></el-option>
              <el-option :value="1" label="需要" ></el-option>
            </el-select>
           </el-form-item>

          <el-form-item
            class="inline"
            label="服装尺码"
            prop="needDressSize"
          > 
            <el-select v-model="form.needDressSize" placeholder="请选择">
              <el-option :value="0" label="不需要" ></el-option>
              <el-option :value="1" label="需要" ></el-option>
            </el-select>
           </el-form-item>

          <el-form-item
            class="inline"
            label="鞋子尺码"
            prop="needShoesSize"
          > 
            <el-select v-model="form.needShoesSize" placeholder="请选择">
              <el-option :value="0" label="不需要" ></el-option>
              <el-option :value="1" label="需要" ></el-option>
            </el-select>
           </el-form-item>

          <el-form-item
            class="inline"
            label="紧急联系人"
            prop="needEc"
          > 
            <el-select v-model="form.needEc" placeholder="请选择">
              <el-option :value="0" label="不需要" ></el-option>
              <el-option :value="1" label="需要" ></el-option>
            </el-select>
           </el-form-item>

          <el-form-item
            class="inline"
            label="裤子尺码"
            prop="needTrousersSize"
          > 
            <el-select v-model="form.needTrousersSize" placeholder="请选择">
              <el-option :value="0" label="不需要" ></el-option>
              <el-option :value="1" label="需要" ></el-option>
            </el-select>
           </el-form-item>

          <el-form-item
            class="inline"
            label="自定义内容"
            prop="needVolunteerNum"
          > 
            <el-select v-model="form.needVolunteerNum" placeholder="请选择">
              <el-option :value="0" label="不需要" ></el-option>
              <el-option :value="1" label="需要" ></el-option>
            </el-select>
           </el-form-item>

          <el-form-item
            class="inline"
            label="活动可报名类型"
            prop=""
          >  
            <el-checkbox v-model="form.allowPersonal">个人</el-checkbox>
            <el-checkbox v-model="form.allowFamily">亲子</el-checkbox>
            <el-checkbox v-model="form.allowGroup">企业团体</el-checkbox>
           </el-form-item>

          <div class="submit-btn">
            <a href="javascript:;" @click="createActivity">创建</a>
          </div>
        </el-form>
      </div>
    </div>
  </section>
</template>

<script>
import api from '~/api/create'
import { getAreaId, formatDate} from '~/tools/index'
import Header from '~/components/header.vue'
import Cascader from '~/components/cascader'
import Ueditor from '~/components/ueditor'
export default {
  head () {
    return {
      title: '创建活动',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'RunStep,智能跑鞋,跑步,跑团' },
        { hid: 'description', name: 'description', content: 'RunStep官方网站,一站式专业跑团,坚持跑步鞋子免费拿' }
      ]
    }
  },
  layout: 'home',
  components: {
    Header,
    Cascader,
    Ueditor
  },
  data () {
    return {
      myHeader: {
        Authorization: ''
      },
      uploadUrl: '',
      activityId: '',
      creatorId: '',
      form: { // 提交表单
        activityType: 0,
        startTime: '',
        endTime: '',
        endJoinTime: '',
        address: '',
        addressLabel: '',
        subAddress: '',
        title: '',
        introduce: '',
        coverImg: '',
        cost: 0,
        totalJoin: 0,
        needVerify: 0,
        needPhone: 0,
        needIdCard: 0,
        needRealName: 0,
        open: false,
        creatorType: 1,
        creatorId: '',
        introduceDesc: '',
        needSex: 0,
        needDressSize: 0,
        needShoesSize: 0,
        needEc: 0,
        needTrousersSize: 0,
        allowPersonal: false,
        allowFamily: false,
        allowGroup: false,
        needVolunteerNum: 0
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
      this.form.coverImg = response.data.imageUrl
    },
    // 获取富文本内容
    getContent (cnt) {
      this.form.introduceDesc = cnt
    },
    // 创建活动
    createActivity () {
      if (new Date(this.form.startTime) < new Date()) {
        this.$message({
          showClose: true,
          message: '开始时间不能小于当前时间',
          type: 'warning',
          center: true
        })
        return false
      }
      if (new Date(this.form.endTime) < new Date(this.form.startTime)) {
        this.$message({
          showClose: true,
          message: '结束时间不能小于开始时间',
          type: 'warning',
          center: true
        })
        return false
      }
      if (new Date(this.form.endTime) < new Date(this.form.endJoinTime) || new Date(this.form.endJoinTime) < new Date(this.form.startTime)) {
        this.$message({
          showClose: true,
          message: '报名截止时间不能小于开始时间或者大于结束时间',
          type: 'warning',
          center: true
        })
        return false
      }
      if (!this.form.coverImg) {
        this.$message({
          showClose: true,
          message: '请上传上传活动封面',
          type: 'warning',
          center: true
        })
        return false
      }
      if (Number(this.form.cost) < 0) {
        this.$message({
          showClose: true,
          message: '费用小于0或者无效',
          type: 'warning',
          center: true
        })
        return false
      }
      if (Number(this.form.totalJoin) < 0) {
        this.$message({
          showClose: true,
          message: '人数小于0或者无效',
          type: 'warning',
          center: true
        })
        return false
      }
      if (!(this.form.allowPersonal || this.form.allowFamily || this.form.allowGroup)) {
        this.$message({
          showClose: true,
          message: '请选择活动可报名类型',
          type: 'warning',
          center: true
        })
        return false
      }
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          let address = `${this.form.addressLabel.join(',')},${this.form.subAddress}`
          let userId = JSON.parse(window.sessionStorage.getItem('userInfo')).userId
          api.createActivity({
            activityId: this.activityId,
            activityType: this.form.activityType,
            startTime: formatDate(this.form.startTime, 'yyyy-MM-dd HH:mm'),
            endTime: formatDate(this.form.endTime, 'yyyy-MM-dd HH:mm'),
            endJoinTime: formatDate(this.form.endJoinTime, 'yyyy-MM-dd HH:mm'),
            address: address,
            title: this.form.title,
            introduce: this.form.introduce,
            coverImg: this.form.coverImg,
            cost: this.form.cost,
            totalJoin: this.form.totalJoin,
            needVerify: this.form.needVerify,
            needPhone: this.form.needPhone,
            needIdCard: this.form.needIdCard,
            needRealName: this.form.needRealName,
            open: this.form.open ? 0 : 1,
            creatorType: this.form.creatorType,
            creatorId: userId,
            notice: this.form.notice,
            needSex: this.form.needSex,
            needDressSize: this.form.needDressSize,
            needShoesSize: this.form.needShoesSize,
            needJob: this.form.needJob,
            needTrousersSize: this.form.needTrousersSize,
            needAge: this.form.needAge,
            needEc: this.form.needEc,
            introduceDesc: this.form.introduceDesc,
            allowPersonal: this.form.allowPersonal ? 1 : 0,
            allowFamily: this.form.allowFamily ? 1 : 0,
            allowGroup: this.form.allowGroup ? 1 : 0,
            needVolunteerNum: this.form.needVolunteerNum
          }).then((res) => {
            if (res.data.code === 200) {
              this.$router.push({path:'/create/activitySuc', query:{name: this.form.title, type: 1, activityId: res.data.data.id}})
            } else {
              let status = {
                300: '创建失败',
                301: '用户不存在',
                307: '用户已被另一台设备踢下线',
                303: '缺少参数'
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
    // 获取活动详情
    getActivity () {
      api.getActivity({activityId: this.activityId}).then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.form.startTime = new Date(data.startTime) 
          this.form.endTime = new Date(data.endTime)
          this.form.endJoinTime = new Date(data.endJoinTime)
          this.form.subAddress = data.address
          this.form.title = data.title
          this.form.introduce = data.introduce
          this.form.introduceDesc = data.introduceDesc
          this.form.coverImg = data.coverImg
          this.form.cost = data.cost,
          this.form.totalJoin = data.totalJoin,
          this.form.needVerify = data.needVerify,
          this.form.needPhone = data.needPhone,
          this.form.needIdCard = data.needIdCard,
          this.form.needRealName = data.needRealName,
          this.form.open = data.open === 0 ? true : false,
          this.form.creatorType = data.creatorType,
          this.form.creatorId = data.creatorId,
          this.form.notice = data.notice,
          this.form.needSex = data.needSex,
          this.form.needDressSize = data.needDressSize,
          this.form.needShoesSize = data.needShoesSize,
          this.form.needJob = data.needJob,
          this.form.needTrousersSize = data.needTrousersSize,
          this.form.needAge = data.needAge,
          this.form.needEc = data.needEc,
          this.form.allowPersonal = data.allowPersonal === 1 ? true : false,
          this.form.allowFamily = data.allowFamily === 1 ? true : false,
          this.form.allowGroup = data.allowGroup === 1 ? true : false,
          this.form.needVolunteerNum = data.needVolunteerNum

          this.$refs.ueditor.setContent(this.form.introduceDesc)
          let area = getAreaId(data.province, data.city)

          this.form.address = area
          this.form.addressLabel = [data.province, data.city]
          this.$refs.cascader.setValue(area)
        }
      }).catch(() => {})
    }
  },
  mounted () {
    // this.myHeader.Authorization = getCookie('token')
    this.myHeader.Authorization = window.localStorage.getItem('token')
    this.uploadUrl = process.env.baseUrl + 'smartShoes/web/file/upload.json'
    this.activityId = this.$route.query.activityId || ''
    this.creatorId = this.$route.query.creatorId || ''
    // 编辑获取活动内容
    if (!!this.activityId) {
      this.getActivity()
    }
  }
}
</script>

<style lang="scss" scoped>
.activity{
  font-size: 0.16rem;
  .header{
    padding-top: 0.14rem;
  }
  .create-box{
    margin: .4rem 0 1rem 0;
    border: 1px solid #e4e4e4;
    border-radius: 3px;
    padding: .4rem;
    .title{
      font-size: 0.18rem;
    }
    .form{
      padding-top: 0.4rem;
      .subtitle{
        font-size: .16rem;
        color: #999;
        margin-bottom: .28rem;
        &.mt{
          margin-top: 0.4rem;
        }
        span{
          margin-left: 0.6rem;
          font-size: 0.12rem;
        }
      }
      .inline{
        width: 50%;
        display: inline-block;
        .el-input,.el-select{
          width: 60%;
        }
      }
      .el-cascader{
        width: 30%;
      }
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

<style lang="scss">
.activity{
  .create-box{
    .el-form{
      .el-form--label-top,.el-form-item__label{
          margin: 0;
          padding: 0 ;
      }
    }
  }
}
</style>
