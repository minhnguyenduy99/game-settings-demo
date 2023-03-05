<template>
  <div id="upload-setting-version-form">
    <el-form abel-width="100px">
      <el-form-item label="Tag name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-divider style="margin: 10px 0" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent="$onSubmit">Add tag</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AddTagForm',
  props: {
    setting: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    formData: {
      name: '',
      settings: [],
    }
  }),
  created() {
    this.formData.settings = 'all'
  },
  methods: {
    $onSubmit() {
      console.log(this.formData)
      this.$emit('submit', this.formData)
    },
  }
}
</script>