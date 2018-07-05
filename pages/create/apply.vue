<template>
  <section class="apply">
    <div class="header">
      <Header active="6" />
    </div>
    <div class="apply-box content">
      <!-- <div class="apply-form">
        <div class="title"></div>
        <el-form :model="form" ref="form" class="form">
          <el-form-item
            label="姓名"
            prop="name"
            :rules="[
              { required: true, message: '姓名不能为空'},
              { min:2, message: '姓名最小长度为2个字'},
            ]"
          >
            <el-input  v-model.trim="form.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item
            label="手机号"
            prop="phone"
            :rules="[
              { required: true, message: '手机号不能为空'},
              { min:11, max:11, message: '手机号长度为11位'},
              { pattern: /^1\d{10}$/, message: '手机号不正确'}
            ]"
          >
            <el-input  v-model.trim="form.phone" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item
            label="短信验证码"
            prop="code"
            :rules="[
              { required: true, message: '短信验证码不能为空'},
              { min:4, message: '短信验证码名最小长度为4位'}
            ]"
          >
            <el-input  v-model.trim="form.code" placeholder="请输入短信验证码"></el-input>
          </el-form-item>
          <el-form-item
            label="职业"
            prop="job"
            :rules="[
              { required: true, message: '职业不能为空'}
            ]"
          >
            <el-cascader
              placeholder="请选择您的职业"
              :options="jobs"
              v-model="form.job"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="收货地址"
            prop="address"
            :rules="[
              { required: true, message: '收货地址不能为空'}
            ]"
          >
            <Cascader v-model="form.address" :label.sync="form.addressLabel" :grade="3" placeholder="请选择省市区"/>
          </el-form-item>
          <el-form-item
            label=""
            prop="subAddress"
            :rules="[
              { required: true, message: '详细地址不能为空'},
              { max:80, message: '详细地址最大长度为80个字'}
            ]"
          > 
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model.trim="form.subAddress" placeholder="请输入街道/区号或楼栋号"></el-input>
          </el-form-item>
          <div class="action-btn">
            <a href="javascript:;">立即报名</a>
          </div>
        </el-form>
      </div> -->
    </div>
  </section>
</template>

<script>
import Header from '~/components/header.vue'
export default {
  layout: 'home',
  components: {
    Header
  },
  data () {
    return {
      jobs: [],
      form: {
        activityId: '',
        rule: '',
        name: '',
        phone: '',
        job: '',
        address: '',
        addressLabel: '',
        code: '',
        brandNum: 1
      }
    }
  },
  methods: {
    
  },
  mounted () {
    this.form.activityId = this.$route.query.activityId
    this.form.rule = this.$route.query.rule
  }
}
</script>


<style lang="scss" scoped>
.apply{
  background-color: #fafafa;
}
</style>


