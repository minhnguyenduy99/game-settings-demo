<template>
  <div id="new-setting-form">
    <el-form label-width="100px">
      <el-form-item label="Name">
        <el-input :disabled="formDisabled" v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="Setting Type">
        <el-select :disabled="formDisabled" v-model="formData.type" placeholder="Setting Type">
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
  name: 'UploadSettingForm',
  props: {
    setting: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      formData: {
        name: '',
        type: null,
        file: null,
      },
      formDisabled: false,
    }
  },
  created: function() {
    if (this.setting) {
      this.formData.name = this.setting.name
      this.formData.type = this.setting.type
    }
  },
  mounted: function() {
    this.formDisabled = this.setting ? true : false
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