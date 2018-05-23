<template>
    <div class="t-input">
        <el-card shadow="never">
            <el-input prefix-icon="el-icon-search" placeholder="请输入 query 词" clearable v-model="queryValue"></el-input>
            <el-select v-model="queryTypeValue" placeholder="查询类型" @change="selectChange">
                <el-option
                        v-for="item in queryType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-button plain type="primary" icon="el-icon-search" @click="checkDate()">查询</el-button>
            <transition name="mohu">
                <div v-show="!jingque" style="display: inline-block">
                    <el-select v-model="pageTypeValue" placeholder="页面类型" v-if="pageType.length">
                        <el-option
                                v-for="item in pageType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-date-picker
                            @change="dateChange"
                            align="center"
                            type="date"
                            format="yyyy-MM-dd"
                            placeholder="整周查询"
                            v-model="dateData">
                    </el-date-picker>
                    <el-button v-if="today" plain type="info" icon="el-icon-search" @click="checkQuery('single')">当日查询</el-button>
                    <el-button-group v-if="output">
                        <el-button  type="primary">导出</el-button>
                        <el-button  type="primary">批量导出</el-button>
                    </el-button-group>
                    <el-button v-if="!output" type="primary">导出</el-button>
                </div>
            </transition>
        </el-card>
    </div>
</template>

<style>
    .mohu-enter-active {
        transition: all .3s ease;
    }
    .mohu-leave-active {
        transition: all .3s;
    }
    .mohu-enter, .mohu-leave-to{
        transform: translateX(20px);
        opacity: 0;
    }
</style>

<script>
    export default {
        props:{
          today : {
              type: Boolean,
              default : false
          },
          output : {
              type : Boolean,
              default : false
          },
            pageType : {
              type : Array,
              default() {
                  return []
              }
          },
            pageTypeValue : {
              type : String,
                default : ''
            },
            containLoading : null,
            jingque : Boolean,
            todayValue : String,
            dateArr : Array
        },
        data() {
            return {
                queryType: [{
                    value: 'mohu',
                    label: '模糊查询'
                }, {
                    value: 'jingque',
                    label: '精确查询'
                }],
                queryTypeValue: 'mohu',
                dateData : '',
                queryValue : ''
            }
        },
        methods : {
            selectChange(){
                this.$emit('changeJingque')
            },
            dateChange(date){
                if(date != null)
                    this.$emit('getDateSelf',date)
            },
            checkQuery(type = 'week') {
                if(this.queryValue === ''){
                    this.$message({
                        message : '请输入 query 词！',
                        type : 'error',
                        center : true,
                        duration : 1000
                    })
                    return false
                }else{

                    // 整体 loading
                    this.containLoading.instance = this.$loading({
                        target : '.blank',
                        text : '正在加载 ...',
                        spinner : 'el-icon-loading',
                        background : '#FFF',
                        visible : true
                    })

                    if(type && type == 'single'){
                        this.$emit('queryData',this.queryValue,this.todayValue,1,'single')
                    }else {
                        this.$emit('queryData',this.queryValue,this.dateArr,1,'week')
                    }
                }

                return true
            },
            checkDate(){
                if(this.queryTypeValue == 'jingque'){
                    this.$emit('queryJingque',this.queryValue)
                }else if(this.dateData == null|| this.dateData === ''){
                    this.$message({
                        message : '请输入查询日期！',
                        type : 'error',
                        center : true,
                        duration : 1000
                    })
                }else{
                    this.checkQuery()
                }
            }
        }
    }
</script>