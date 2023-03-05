<template>
  <div id="upload-setting-version-form">
    <el-form label-width="100px">
      <el-form-item label="Name">
        <el-input disabled v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="Setting Type">
        <el-select disabled v-model="formData.type" placeholder="Setting Type">
          <el-option label="Key Value" value="key_value" />
          <el-option label="List" value="list" />
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
          <template #tip>
            <div class="el-upload__tip">
              Setting file must be an excel file (.xlsx or .xls)
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
  name: 'UploadSettingVersionForm',
  props: {
    initData: {
      name: {
        type: String,
      },
      settingType: {
        type: String,
      }
    }
  },
  data: () => ({
    formData: {
      name: '',
      type: null,
      file: null,
    }
  }),
  created() {
    this.formData.name = this.initData.name
    this.formData.type = this.initData.settingType
  },
  methods: {
    $onSubmit() {
      console.log(this.formData)
      this.$emit('submit', this.formData)
    },
    $onFileUploaded(file) {
      console.log(file)
      this.formData.file = file.raw
    }
  }
}
</script>