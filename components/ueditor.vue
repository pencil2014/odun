<template>
  <div>
    <el-upload
      class="avatar-uploader"
      drag
      name="image"
      accept="image/jpeg,image/gif,image/png"
      :show-file-list="false"
      :data="{type:7}"
      :action="uploadUrl"
      :headers="myHeader"
      :on-error="uploadError"
      :on-success="uploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png/gif文件，且不超过1M</div> -->
    </el-upload>
    <div class="quill-editor">
      <no-ssr>
        <quill-editor
          v-model='content'
          :options='editorOption'
          ref="myQuillEditor"
          @change="onEditorChange($event)"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)"
        ></quill-editor>
      </no-ssr>
    </div>
  </div>
  
</template>

<script>
const toolbarOption = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  // [{ 'font': [] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'align': [] }],
  ['clean'],
  ['link', 'image']
]
export default {
  data () {
    return {
      content: '',
      editorOption: {
        theme: 'snow',
        placeholder: '请输入内容',
          modules: {
            toolbar: {
              container: toolbarOption,  // 工具栏
              handlers: {
                  'image': function (value) {
                      if (value) {
                          document.querySelector('.avatar-uploader input').click()
                      } else {
                          this.quill.format('image', false);
                      }
                  }
              }
            },
            imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
          }
        }
      },
      myHeader: {
        Authorization: ''
      },
      uploadUrl: '',
      addImgRange: ''
    }
  },
  methods: {
    setContent (value) {
      this.content = value
    },
    onEditorBlur(editor) {
      // console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      // console.log('editor focus!', editor)
    },
    onEditorChange({ editor, html, text }) {
      this.$emit('getContent', html)
    },
    onEditorReady(editor) {
      // console.log('editor ready!', editor)
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
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (response.code === 200) {
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片  res.info为服务器返回的图片地址
          quill.insertEmbed(length, 'image', response.data.imageUrl)
          // 调整光标到最后
          quill.setSelection(length + 1)
      } else {
          this.$message.error('图片插入失败')
      }
    }
  },
  mounted () {
    this.myHeader.Authorization = window.localStorage.getItem('token')
    this.uploadUrl = process.env.baseUrl + 'smartShoes/web/file/upload.json'
  }
}
</script>

<style>
.avatar-uploader{
  display: none;
}
.ql-editor{
  height: auto;
  min-height: 3rem;
  margin-bottom: 0.6rem;
}
.ql-picker-label:before{
    line-height: 24px;
    position: relative;
    top: -10px;
}
.ql-toolbar.ql-snow .ql-picker-label{
  outline: none;
}
.ql-snow .ql-picker-options .ql-picker-item{
  outline: none;
}
</style>