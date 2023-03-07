

<template>
  <el-container class="layout-container-demo">
    <el-aside>
      <el-scrollbar>
        <el-menu :default-openeds="['1']">
          <el-sub-menu index="1">
            <template #title>
              <el-icon><Collection /></el-icon>Game Design
            </template>
            <el-menu-item index="1-2">
              <el-icon><set-up /></el-icon>Game Settings
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header>
        <div class="toolbar">
          <el-input
            class="mr-4"
            v-model="input"
            size="large"
            placeholder="Search for settings"
            suffix-icon="Search"
            style="margin-right: 10px"
          />
          <el-button size="large" type="primary" @click="saveSettingDialogOpened = true">Add New Setting</el-button>
          <el-button size="large" type="primary" @click="$event => addTagDialogOpened = true">Add Tag</el-button>
          <el-button size="large" type="primary" @click="$event => exportDialogOpened = true">Export</el-button>
          <el-button size="large" type="primary">Import</el-button>
        </div>
      </el-header>


      <el-main>
        <el-scrollbar>
          <div style="padding: 10px;">
            <el-table :data="tableData">
              <el-table-column prop="name" label="Name" width="140" />
              <el-table-column prop="type" label="Type" width="100" />
              <el-table-column prop="currentVersion" label="Current Version" width="140" align="center">
                <template #default="scope">
                  <div>
                    <p class="text-primary">{{ scope.row.currentVersion.version }}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="currentVersion" label="Tags">
                <template #default="scope">
                  <div>
                    <el-space v-if="scope.row.currentVersion.tags.length > 0">
                      <el-tag
                        v-for="tag in scope.row.currentVersion.tags" :key="tag.id"
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
              <el-table-column fixed="right" label="Operations" width="150">
                <template #default="scope">
                  <div class="button-group">
                    <el-button icon="Upload" circle type="primary" @click="$openUploadSettingForm(scope.$index)" />
                    <el-button icon="List" circle type="primary" @click="$openSettingHistoryDialog(scope.$index)" />
                    <el-button icon="Delete" circle type="danger" />
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog
    v-model="saveSettingDialogOpened"
    title="Upload setting"
    destroy-on-close
  >
    <upload-setting-form @submit="$saveSetting" />
  </el-dialog>
  <el-dialog
    v-model="addTagDialogOpened"
    title="Add new tag"
    destroy-on-close
  >
    <add-tag-form :setting="selectedSetting" @submit="$addTagForSetting" />
  </el-dialog>
  <el-dialog
    v-model="settingHistoryDialogOpened"
    title="Setting history"
    destroy-on-close
  >
    <view-setting-history :setting="selectedSetting" />
  </el-dialog>
  <el-dialog
    v-model="exportDialogOpened"
    title="Export setting"
    destroy-on-close
  >
    <export-setting-form />
  </el-dialog>
</template>

<script>
import { ElNotification } from 'element-plus'
import UploadSettingForm from "../components/UploadSettingForm.vue"
import ViewSettingHistory from "../components/ViewSettingHistory.vue"
import AddTagForm from "../components/AddTagForm.vue"
import ExportSettingForm from "../components/ExportSettingForm.vue"
import { SettingService } from '../services'

const settingsService = new SettingService()

export default {
  components: {
    UploadSettingForm,
    AddTagForm,
    ViewSettingHistory,
    ExportSettingForm,
  },
  data() {
    return {
      saveSettingDialogOpened: false,
      addTagDialogOpened: false,
      settingHistoryDialogOpened: false,
      exportDialogOpened: false,
      input: '',
      tableData: [],
      selectedSettingIndex: -1,
    }
  },
  created: function () {
    this.$refreshTableData()
  },
  computed: {
    selectedSetting() {
      return this.tableData[this.selectedSettingIndex]
    },
  },
  watch: {
    addTagDialogOpened(val) {
      if (!val) {
        this.selectedSettingIndex = -1
      }
    },
    uploadSettingVersionDialogedOpened(val) {
      if (!val) {
        this.selectedSettingIndex = -1
      }
    },
    saveSettingDialogOpened(val) {
      if (!val) {
        this.selectedSettingIndex = -1
      }
    },
  },
  methods: {
    $saveSetting(data) {
      const { file } = data
      settingsService.saveSetting(file).then(() => {
        this.saveSettingDialogOpened = false
        this.$refreshTableData()
        ElNotification({
          title: 'Success',
          message: 'Upload setting successfully',
          type: 'success',
        })
      }).catch(error => {
        const message = error.message
        ElNotification({
          title: 'Error',
          message,
          type: 'error',
        })
      })
    },
    $addTagForSetting(data) {
      const { name, settings } = data
      settingsService.addTag(name, settings).then(() => {
        this.addTagDialogOpened = false
        this.$refreshTableData()
        ElNotification({
          title: 'Success',
          message: 'Add tag successfully',
          type: 'success',
        })
      }).catch(error => {
        const message = error.message
        ElNotification({
          title: 'Error',
          message,
          type: 'error',
        })
      })
    },
    $openUploadSettingForm(index) {
      this.selectedSettingIndex = index
      this.saveSettingDialogOpened = true
    },
    $openAddTagForm(index) {
      this.selectedSettingIndex = index
      this.addTagDialogOpened = true
    },
    $openSettingHistoryDialog(index) {
      this.selectedSettingIndex = index
      this.settingHistoryDialogOpened = true
    },
    $refreshTableData() {
      this.tableData.length = 0
      settingsService.getSettings().then(listSettings => {
        this.tableData.push(...listSettings)
      })
    },
  }
}
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-1);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background:      #E5EAF3;
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: flex;
  align-items: center;
  justify-content: start;
  height: 100%;
}
</style>
