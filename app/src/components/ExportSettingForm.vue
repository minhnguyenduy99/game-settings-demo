<template>
  <div id="export-setting-form">
    <el-form label-width="100px" label-position="top">
      <el-form-item label="Tag name">
        <el-select v-model="selectedTag" filterable placeholder="Select">
          <el-option
            v-for="item in tagList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Setting list">
        <el-table :data="settings" border stripe flexible table-layout="auto">
          <el-table-column prop="name" label="Version" />
          <el-table-column prop="type" label="Version" width="100px" />
          <el-table-column prop="version" label="Version" width="100px" />
          <el-table-column fixed="right" label="Operations" width="100px">
            <template #default="scope">
              <el-button size="small" icon="Download" circle type="primary" @click="$downloadSettingOfVersion(scope.$index)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-divider />
      <el-form-item>
        <el-button :disabled="!selectedTag" type="primary" @click="$downloadSettingFileByTagName">Export</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ElNotification } from 'element-plus'
import { SettingService } from '../services'
const settingService = new SettingService()

export default {
  name: 'ExportSettingForm',
  data: () => ({
    formData: {
    },
    tagList: [],
    selectedTag: null,
    settings: [],
  }),
  created() {
    settingService.getAllTags().then((tagList) => {
      this.tagList = tagList
    })
  },
  watch: {
    selectedTag(val) {
      if (!val) {
        this.settings.length = 0
        return
      }
      this.$getTagInfo()
    }
  },
  methods: {
    $onSubmit() {
      console.log(this.formData)
      this.$emit('submit', this.formData)
    },
    $getTagInfo() {
      settingService.getTagByName(this.selectedTag).then((tagInfo) => {
        this.settings.length = 0
        this.settings = tagInfo.settings
      })
    },
    $downloadSettingFileByTagName() {
      settingService.downloadSettingFileByTagName(this.selectedTag).catch(err => {
        // notify error
        ElNotification({
          title: 'Success',
          message: err.message,
          type: 'success',
        })
      })
    }
  }
}
</script>