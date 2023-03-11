<template>
  <div id="postman-to-swagger-view">
    <el-container>
      <el-aside width="fit-content" style="margin-right: 20px">
        <el-form label-width="200px">
          <el-form-item label="From">
            <el-select v-model="formData.from" filterable placeholder="File type">
              <el-option
                v-for="item in fileTypeList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="To">
            <el-select v-model="formData.to" filterable placeholder="File type">
              <el-option
                v-for="item in fileTypeList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="File">
            <div>
              <el-upload
              class="upload-demo"
              :limit="1"
              :auto-upload="false"
              :on-change="$onFileUploaded"
            >
                <el-button type="primary" plain>Click to upload</el-button>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="Output file name">
            <el-input v-model="formData.outputFileName"></el-input>
          </el-form-item>
          <el-divider />
          <el-form-item>
            <el-button type="primary" @click.prevent="$onSubmit">Convert</el-button>
          </el-form-item>
        </el-form>
      </el-aside>
      <el-main v-if="convertedContent" style="padding: 0">
        <div class="file-previewer">
          <pre>{{ convertedContent }}</pre>
          <el-button class="file-previewer__btn-copy" icon="CopyDocument" circle size="large" @click="$copyDocumentToClipboard"></el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ElNotification } from 'element-plus'
import { PostmanToSwaggerService } from '../services/postman-2-swagger.service';

const p2s = new PostmanToSwaggerService()

export default {
  name: 'PostmanToSwagger',
  data: () => ({
    DEFAULT_FILE_TYPES: {
      swagger: {
        extension: 'yaml'
      },
      postman: {
        extension: 'json'
      },
    },
    output: '',
    formData: {
      outputFileName: '',
      from: 'postman',
      to: 'swagger',
      file: null,
    },
    convertedContent: '',
  }),
  computed: {
    fileTypeList: {
      get() {
        return Object.keys(this.DEFAULT_FILE_TYPES)
      }
    }
  },
  methods: {
    $onFileUploaded(file) {
      console.log(file)
      this.formData.outputFileName = this.$generateFileName(file.name)
      this.formData.file = file.raw
    },
    $onSubmit() {
      console.log(this.formData)
      p2s.convert(this.formData).then(async (result) => {
        const { blob } = result
        this.convertedContent = await blob.text()
        ElNotification({
          title: 'SUCCESS',
          message: 'Convert successfully',
          type: 'success',
        })
      }).catch(err => {
        ElNotification({
          title: 'Convert failed',
          message: err.message,
          type: 'error',
        })
      })
    },
    $generateFileName(fileName) {
      const parts = fileName.split('.').filter(part => !!part)
      if (parts.length > 1) {
        parts.pop() // remove extension
      }
      console.log(this.formData.to)
      const toExt = this.DEFAULT_FILE_TYPES[this.formData.to].extension
      return [...parts, toExt].join('.')
    },
    $downloadFile(blob) {
      const fileName = this.formData.outputFileName
      // download apiDocFile
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
    },
    $copyDocumentToClipboard() {
      // Copy the text inside the text field
      navigator.clipboard.writeText(this.convertedContent)
      ElNotification({
        message: 'Copy to clipboard',
        type: 'info',
        icon: '',
        position: 'bottom-right',
        showClose: false,
      })
    }
  }
}
</script>

<style scoped>
.file-previewer {
  border: 1px solid var(--el-border-color);
  position: relative;
  max-height: 100vh;
}

.file-previewer > pre {
  margin: 0;
  padding: 10px;
  background: #E5EAF3;
  font-size: var(--el-font-size-medium);
  white-space: pre-wrap;       /* Since CSS 2.1 */
  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
  white-space: -pre-wrap;      /* Opera 4-6 */
  white-space: -o-pre-wrap;    /* Opera 7 */
  word-wrap: break-word;       /* Internet Explorer 5.5+ */
}

.file-previewer > .file-previewer__btn-copy {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
