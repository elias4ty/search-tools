<template>
    <div class="t-input">
        <el-card shadow="never">
            <el-input prefix-icon="el-icon-search" placeholder="请输入 query 词" clearable v-model="queryValue"></el-input>
            <el-select v-model="queryTypeValue" placeholder="查询类型">
                <el-option
                        v-for="item in queryType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="pageTypeValue" placeholder="页面类型" v-if="pageType.length">
                <el-option
                        v-for="item in pageType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-button plain type="primary" icon="el-icon-search" @click="checkDate()">查询</el-button>
            <el-button v-if="today" plain type="info" icon="el-icon-search" @click="checkQuery()">当日查询</el-button>
            <el-date-picker
                    align="center"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyyMMdd"
                    placeholder="整周查询"
                    v-model="dateData">
            </el-date-picker>
            <el-button-group v-if="output">
                <el-button  type="primary">导出</el-button>
                <el-button  type="primary">批量导出</el-button>
            </el-button-group>
            <el-button v-if="!output" type="primary">导出</el-button>
        </el-card>
    </div>
</template>

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
            containLoading : null
        },
        data() {
            return {
                queryType: [{
                    value: '模糊查询',
                    label: '模糊查询'
                }, {
                    value: '精确查询',
                    label: '精确查询'
                }],
                queryTypeValue: '模糊查询',
                dateData : this.getToday(),
                queryValue : ''
            }
        },
        methods : {
            formatDate(d){
                let y = d.getFullYear(),
                    m = d.getMonth() >= 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1),
                    da = d.getDate() >= 9 ? d.getDate() : '0' + da.getDate();

                return [y,m,da].join('')
            },
            getToday(){
                return this.formatDate(new Date())
            },
            checkQuery(type = 'single') {
                if(this.queryValue === ''){
                    this.$message({
                        message : '请输入 query 词！',
                        type : 'error',
                        center : true,
                        duration : 1000
                    })
                    return false
                }else{
                    if(this.containLoading.switch){
                        this.containLoading.instance = this.$loading({
                            target : '.blank',
                            text : '正在加载 ...',
                            spinner : 'el-icon-loading',
                            background : '#FFF',
                            visible : true
                        })
                    }
                    this.$emit('queryData',this.queryValue,['20180510','20180516'],1)
                }

                return true
            },
            checkDate(){
                if(this.dateData == null|| this.dateData === ''){
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