<template>
  <div id="import-setting-form">
    <el-form label-width="100px">
      <el-form-item label="File">
        <div>
          <el-upload
          class="upload-demo"
          :limit="1"
          :auto-upload="false"
          :on-change="$onFileUploaded"
        >
          <el-button type="primary" plain>Click to upload</el-button>
          <template #tip>
            <div class="el-upload__tip">
              This must be a zip file
            </div>
          </template>
        </el-upload>
        </div>
      </el-form-item>
      <el-form-item>
        <el-divider style="margin: 10px 0" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent="$onSubmit">Create</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ImportSettingForm',
  data() {
    return {
      formData: {
        file: null,
      },
    }
  },
  methods: {
    $onSubmit() {
      console.log(this.formData)
      this.$emit('submit', this.formData)
      this.$forceUpdate()
    },
    $onFileUploaded(file) {
      console.log(file)
      this.formData.file = file.raw
    }
  }
}
</script>