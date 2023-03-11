<script setup>
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside>
          <el-scrollbar>
            <el-menu ref="navMenu" router :default-openeds="[pages.gameSettings]" :default-active="pages.gameSettings">
              <el-sub-menu :index="pages.gameSettings">
                <template #title>
                  <el-icon><Collection /></el-icon>Game Design
                </template>
                <el-menu-item :index="pages.gameSettings">
                  <el-icon><set-up /></el-icon>Game Settings
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu :index="pages.postmanToSwagger">
                <template #title>
                  <el-icon><Collection /></el-icon>API Documentation
                </template>
                <el-menu-item :index="pages.postmanToSwagger">
                  <el-icon><set-up /></el-icon>
                  Postman to Swagger
                </el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <router-view>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

export default {
  name: 'App',
  props: {
    routeVal: String,
  },
  data: () => ({
    pages: {
      gameSettings: '/game-settings',
      postmanToSwagger: '/postman-to-swagger'
    },
    activeMenu: '/game-settings',
  }),
  mounted() {
    console.log(this.routeVal)
    if (!Object.values(this.pages).includes(this.routeVal)) {
      this.activeMenu = this.pages.gameSettings
    } else {
      this.activeMenu = this.route
    }
    this.$refs.navMenu.open(this.activeMenu)
  },
}
</script>

<style scoped>
.el-menu-item a {
  text-decoration: none;
  color: unset;
}
</style>