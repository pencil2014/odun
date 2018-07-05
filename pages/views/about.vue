<template>
  <section class="about">
    <div class="head-banner">
      <div class="head">
        <Header active="5"/>
      </div>
    </div>
    <div class="about-cnt">
      <div class="content">
        <div class="about-menu">
          <ul :class="{'fixed': isFixed}">
            <li><a href="#profile">公司简介</a></li>
            <li><a href="#value">价值观</a></li>
            <li><a href="#concat">联系我们</a></li>
            <li><a href="#recruit">招聘信息</a></li>
          </ul>
        </div>
        <div class="about-info">
          <div class="profile" id="profile">
            <h3 class="title">公司简介</h3>
            <p class="text">
              深圳市欧盾智能科技有限公司，是一家专注从事智能穿戴设备方案的创新型科技公司，公司顺应智能硬件发展潮流，强调科技创新，力求在智能穿戴重点领域，运动，健康，体育竞技方面，实现自主品牌的研发和推广，目前已合作的品牌商包括361°，特步，贵人鸟，乔丹，提供的产品市场反映良好。软件研发团队有27人，硬件研发团队有12人。
            </p>
          </div>
          <div class="value" id="value">
            <h3 class="title">价值观</h3>
            <div class="value-box">
              <div class="value-item">
                <h4>精准提供二次消费黄金时间</h4>
                <p>用户购买的鞋子使用了多久，还剩多长的使用寿命， 什么时候给用户进行二次销售RunStep智能芯片都能 精准的反馈过来</p>
              </div>
              <div class="value-item">
                <h4>零成本推广</h4>
                <p>品牌通过芯片将用户圈在一起，所有推广零成本一键精准发送给有需要的用户</p>
              </div>
              <div class="value-item">
                <h4>挖掘其它品牌用户.</h4>
                <p>利用稳固的用户圈子进行一系列独家且有意义的线上线下活动如家庭活动等，快速的吸引其他品牌的用户加入</p>
              </div>
              <div class="value-item">
                <h4>架空代理商</h4>
                <p>品牌通过RunStep智能芯片及APP牢牢抓住所有用户的综合数据,极大了削弱代理商和品牌讨价还价的筹码</p>
              </div>
              <div class="value-item">
                <h4>店铺选址</h4>
                <p>利用RunStep智能芯片及APP采集的用户区域热点图，精准区分用户的区域密集度，从而为新开店铺选址提供精确的数据支持</p>
              </div>
              <div class="value-item">
                <h4>防伪支持</h4>
                <p>通过RunStep智能芯片模块唯一的序列号与产品唯一的条码号进行一对一的匹配，从而极大的防止假冒产品在市面上的流通</p>
              </div>
              <div class="value-item">
                <h4>质量反馈</h4>
                <p>用户买回鞋子后，使用的次数是否频繁，产品质量是否有问题，通过RunStep智能芯片都能得到快速反馈</p>
              </div>
              <div class="value-item">
                <h4>设计开发</h4>
                <p>消费者需要什么样的产品，怎样的设计才是他们最喜欢的，品牌都能以极低的成本通过RunStep智能芯片得到反馈，从而为设计开发提供思路与方向</p>
              </div>
            </div>
          </div>
          <div class="concat" id="concat">
            <h3 class="title">联系我们</h3>
            <div class="concat-email">
              <h4>请发邮件给我们</h4>
              <p>点击下面按钮发送Email</p>
              <a href="mailto:tom@odun.com">发送邮件</a>
            </div>
            <div class="concat-msg">
              <h4>请留言给我们</h4>
              <el-form :model="form" ref="form" class="form">
                <el-form-item
                  label="Title"
                  prop="title"
                  :rules="[
                    { required: true, message: 'Title不能为空'}
                  ]"
                >
                  <el-input v-model.trim="form.title" placeholder="Title" ></el-input>
                </el-form-item>
                <el-form-item
                  label="Content"
                  prop="content"
                  :rules="[
                    { required: true, message: 'Content不能为空'}
                  ]"
                >
                  <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}"  v-model.trim="form.content" placeholder="Content"></el-input>
                </el-form-item>
                <el-form-item
                  label="E-mail"
                  prop="email"
                  :rules="[
                    { required: true, message: 'E-mail不能为空'},
                    { pattern: /^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/, message: '邮箱格式不正确'}
                  ]"
                >
                  <el-input  v-model.trim="form.email" placeholder="E-mail"></el-input>
                </el-form-item>
                <el-form-item
                  label="Phone"
                  prop="phone"
                  :rules="[
                    { required: true, message: '手机不能为空'},
                    { pattern: /(^1\d{10}$)|(^0\d{2,3}-?\d{7,8}$)/, message: '电话格式不正确'}
                  ]"
                >
                  <el-input v-model.trim="form.phone"  placeholder="Phone"></el-input>
                </el-form-item>
                <el-form-item
                  label="Contact"
                  prop="contact"
                >
                  <el-input  v-model.trim="form.contact" placeholder="contact"></el-input>
                </el-form-item>
                <div class="submit-btn">
                  <button type="button" @click.enter="submit">提交</button>
                </div>
              </el-form>
            </div>
            <div class="concat-phone">
              <h4>请打电话给我们吧</h4>
              <p>我们的联系电话</p>
              <ul>
                <li>Contact: TOM YUAN</li>
                <li>Call:(0086)+13922934293</li>
                <li>Email：tom@odun.com</li>
                <li>0755-86532478</li>
              </ul>
            </div>
          </div>
          <div class="recruit" id="recruit">
            <h3 class="title">招聘信息</h3>
            <div class="recruit-box">
              <h4>嵌入式研发工程师</h4>
              <p>1、本科及以上学历（3年以上工作经验），通信、计算机、电子等相关专业；</p>
              <p>2、精通至少一款ARM控制器体系架构，并具有实际的开发经验，熟悉nodic, ST蓝牙芯片, ST 3DH加速度传感器；</p>
              <p>3、精通C语言，熟悉汇编语言，有良好的编程习惯和技巧；</p>
              <p>4、 熟悉各种通讯接口和协议（UART、I2C、SPI、USB、CAN等），有实际的接口驱动编程经验，熟悉嵌入式实时操作系统者优先；</p>
              <p>5、熟悉LINUX内核系统常用linux命令，熟悉linux编程；</p>
              <p>6、精通数字控制算法，并有实际开发经验者优先考虑；</p>
              <p>7、有智能硬件开发研究经验者优先考虑；</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from '~/api/about'
import Header from '~/components/header.vue'
export default {
  head () {
    return {
      title: '关于我们',
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
      isFixed: false, // 菜单是否固定
      form: { // 留言表单
        title: '',
        content: '',
        email: '',
        phone: '',
        contact: ''
      }
    }
  },
  methods: {
    // 滚动事件
    handleScroll () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 650) {
        this.isFixed = true
      } else {
        this.isFixed = false
      }
    },
    // 提交表单
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          api.concatUs({
            title: this.form.title,
            content: this.form.content,
            email: this.form.email,
            phone: this.form.phone,
            contact: this.form.concact
          }).then((res) => {
            if (res.data.code === 200) {
              this.$message({
                showClose: true,
                message: '提交成功',
                type: 'success',
                center: true
              })
            } else {
              this.$message({
                showClose: true,
                message: '提交失败',
                type: 'warning',
                center: true
              })
            }
          }).catch(() => {
            this.$message({
              showClose: true,
              message: '提交失败',
              type: 'warning',
              center: true
            })
          })
        }
      })
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll) // 监听滚动事件
  }
}
</script>

<style lang="scss" scoped>
.about{
  font-size: 0.18rem;
  font-weight: 300;
  padding-bottom: 1rem;
  .head-banner{
    background: url('~/assets/images/aboutbg.jpg');
    background-size: cover;
    background-position: 50%;
    background-repeat: no-repeat;
    height: 6.7rem;
    .head{
      padding-top: 0.14rem;
    }
  }
  .about-cnt{
    position: relative;
    z-index: 2;
    background: #fff;
    max-width: 12rem;
    margin: -.3rem auto 0;
    padding-top: .5rem;
    .about-menu{
      position: relative;
      width: 15%;
      float: left;
      color: #3e3e3e;
      overflow: hidden;
      background: #fff;
      padding-left: 5%;
      li{
        padding-top: .19rem;
        padding-bottom: .19rem;
        border-bottom: .01rem solid silver;
        border-bottom-color: hsla(0,0%,75%,.7);
        a{
          font-size: 0.18rem;
          color: #3e3e3e;
          letter-spacing: 0.02rem;
          text-decoration: none;
          &:hover{
            color: #3fad70;
          }
        }
      }
    }
    .about-info{
      float: right;
      width: 70%;
      margin: 0 5%;
      line-height: 1.4;
      .title{
        font-size: .26rem;
        color: #3fad70;
        padding-bottom: 0.1rem;
        border-bottom: 1px solid silver;
        border-bottom-color: hsla(0,0%,75%,.7);
        font-weight: 300;
      }
      .profile{
        .text{
          padding-top: .24rem;
          font-size: .16rem;
          color: #5f5f5f;
          line-height: 1.6;
        }
      }
      .value{
        padding-top: 0.4rem;
        line-height: 1.4;
        .value-box{
          overflow: hidden;
          .value-item{
            width: 50%;
            padding-right: 0.3rem;
            float: left;
            margin-bottom: 0rem;
            h4{
              padding-top: .41rem;
              padding-bottom: .13rem;
              font-family: PingFangSC-Medium;
              font-size: 0.16rem;
              color: #5f5f5f;
              letter-spacing: 0.018px;
              font-weight: 600;
            }
            p{
              font-size: 0.16rem;
              color: #5f5f5f;
              letter-spacing: 0.018rem;
              height: 1rem;
            }
          }
        }
        
      }
      .concat{
        padding-top: 0.4rem;
        h4{
          font-family: PingFangSC-Medium;
          font-size: 0.16rem;
          color: #505050;
          padding-bottom: .2rem;
        }
        .concat-email{
          padding-top: 0.3rem;
          p{
            font-size: 0.14rem;
            color: #505050;
          }
          a{
            background-color: #7ed321;
            border-radius: .3rem;
            text-align: center;
            width: 1.27rem;
            height: .4rem;
            display: block;
            font-family: PingFangSC-Light;
            font-size: .18rem;
            color: #fff;
            line-height: .4rem;
            margin: 0.1rem 0 .5rem;
          }
        }
        .concat-msg{
          width: 60%;
          .submit-btn{
            button{
              width: 1.2rem;
              background: #7ed321;
              border-radius: .3rem;
              text-align: center;
              line-height: .35rem;
              cursor: pointer;
              font-size: .18rem;
              color: #fff;
              margin-top: .2rem;
              border: none;
              outline: none;
            }
          }
        }
        .concat-phone{
          padding-top: 0.5rem;
          margin-bottom: 0.5rem;
          overflow: hidden;
          p{
            font-size: 0.16rem;
            color: #505050;
          }
          ul{
            font-size: 0.16rem;
            color: #505050;
            margin-top: .22rem;
            li{
              width: 50%;
              float: left;
              line-height: 2;
            }
          }
        }
      }
      .recruit{
        padding-top: 0.4rem;
        .recruit-box{
          h4{
            font-size: 0.18rem;
            padding: 0.3rem 0 0.2rem 0;
            font-weight: 600;
            color: #333;
          }
          p{
            font-size: 0.16rem;
            padding-bottom: 0.1rem;
          }
        }
      }
    }
  }
  .fixed{
    position: fixed;
    top: 0.5rem;
  }

}
</style>


