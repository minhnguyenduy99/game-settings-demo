<template>
  <div id="setting-history-form">
    <el-form
      label-position="top"
      label-width="100px"
    >
      <el-form-item label="Name">
        <el-input disabled :model-value="setting.name" />
      </el-form-item>
      <el-form-item label="Type">
        <el-input disabled :model-value="setting.type" />
      </el-form-item>
      <el-form-item label="Versions">
        <div>
          <el-table :data="setting.versions" border stripe flexible table-layout="auto">
            <el-table-column prop="version" label="Version" width="100px" />
            <el-table-column prop="tags" label="Tags" width="100px">
              <template #default="scope">
                <div>
                  <el-space v-if="scope.row.tags.length > 0">
                    <el-tag
                      v-for="tag in scope.row.tags" :key="tag.id"
                      type="success"
                      disable-transitions
                      class="ml-2"
                      effect="dark"
                      >{{ tag }}</el-tag
                    >
                  </el-space>
                  <p v-else class="text-primary">No tags</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="Operations" width="100px">
                <template #default="scope">
                  <el-button size="small" icon="Download" circle type="primary" @click="$downloadSettingOfVersion(scope.$index)" />
                </template>
              </el-table-column>
          </el-table>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ViewSettingHistory',
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
  computed: {
    hasSetting() {
      return !!this.setting
    }
  },
  created() {
    const { settingId, version } = this.initData || {}
    if (settingId && version) {
      this.formData.settings.push({
        settingId,
        version
      })
    } else {
      this.formData.settings = 'all' 
    }
  },
  methods: {
    $downloadSettingOfVersion(index) {
      const selectedVersion = this.setting.versions[index]
      if (!selectedVersion) {
        return
      }
      // download file
      const blob = new Blob([JSON.stringify(selectedVersion.value)])
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = `${this.setting.name}_v${selectedVersion.version}.json`
      link.click()
    }
  }
}
</script>