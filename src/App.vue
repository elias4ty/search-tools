<template>
  <el-container>
    <el-header>
      <el-menu class="el-menu-demo" mode="horizontal" >
        <img src="./assets/images/logo.png" alt="logo" title="logo" style="margin: 16px 20px"/>
        <el-menu-item index="4"class="t-menu-item">消息中心</el-menu-item>
        <el-menu-item index="3"class="t-menu-item">意见反馈</el-menu-item>
        <el-menu-item index="2"class="t-menu-item">[退出]</el-menu-item>
        <el-menu-item index="1"class="t-menu-item"><i class="el-icon-star-on"></i>汤泱</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside style="box-sizing: content-box;width: auto;">
        <el-radio-group v-model="isCollapse" style="margin: 20px;">
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>
        <el-menu class="el-menu-vertical-demo" :collapse="isCollapse">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">PC 网页</span>
            </template>
            <el-menu-item index="1-1">query 查询</el-menu-item>
            <el-submenu index="1-2">
              <span slot="title">用户行为分析</span>
              <el-menu-item index="1-2-1">session 查询</el-menu-item>
              <el-menu-item index="1-2-2">随机 session 导出</el-menu-item>
            </el-submenu>
            <el-submenu index="1-3">
              <span slot="title">SA</span>
              <el-menu-item index="1-3-1">query 点击分析</el-menu-item>
              <el-menu-item index="1-3-2">百度点击分析(元搜索)</el-menu-item>
              <el-menu-item index="1-3-3">站点点击分析</el-menu-item>
            </el-submenu>
            <el-menu-item index="1-4">query 抽取</el-menu-item>
            <el-menu-item index="1-5">热门 query</el-menu-item>
            <el-menu-item index="1-6">搜索词上升排行榜</el-menu-item>
            <el-menu-item index="1-7">渠道管理</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-mobile-phone"></i>
              <span slot="title">wap 网页</span>
            </template>
            <el-menu-item index="2-1">query 查询</el-menu-item>
            <el-submenu index="2-2">
              <span slot="title">用户行为分析</span>
              <el-menu-item index="2-2-1">session 查询</el-menu-item>
              <el-menu-item index="2-2-2">随机 session 导出</el-menu-item>
            </el-submenu>
            <el-submenu index="2-3">
              <span slot="title">SA</span>
              <el-menu-item index="2-3-1">query 点击分析</el-menu-item>
              <el-menu-item index="2-3-2">百度点击分析(元搜索)</el-menu-item>
              <el-menu-item index="2-3-3">站点点击分析</el-menu-item>
            </el-submenu>
            <el-menu-item index="2-4">query 抽取</el-menu-item>
            <el-menu-item index="2-5">热门 query</el-menu-item>
            <el-menu-item index="2-6">搜索词上升排行榜</el-menu-item>
            <el-menu-item index="2-7">渠道管理</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <container-view></container-view>
    </el-container>
  </el-container>
</template>

<script>
    import containerView from './views/containerView'

export default {
    components : {containerView},
    data() {
        return {
            isCollapse : false
        }
    }
}
</script>


<style>
.t-input .el-input{
  width: auto;
  margin: 0 8px;
}

.t-input button{
  margin: 0 8px;
}

.t-input .el-card{
  border: hidden;
  margin-bottom: 10px;
}

.t-input .el-select{
  width: 12%;
}

.t-input .el-date-editor{
  width: 25%;
}

.t-table{
  margin-bottom: 30px;
}

.t-page{
  display: flex;
  justify-content: center;
}
</style>
