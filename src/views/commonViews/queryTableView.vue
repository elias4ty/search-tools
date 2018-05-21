<template>
    <div class="t-table">
        <el-card>
            <el-table
                    v-loading="tableLoading.instance"
                    element-loading-text="莫着急 ..."
                    element-loading-background="#FFF"
                    :data="tableData.body"
                    stripe
                    max-height="400"
                    size = "medium"
                    highlight-current-row = "true"
                    style="width: 100%">

                <el-table-column
                    fixed
                    align="center"
                    label="query"
                    min-width="200">
                    <template slot-scope="scope">
                        <a class="t-out" type="text" @click="goClick(scope.row.query)">{{scope.row.query}}</a>
                    </template>
                </el-table-column>

                <el-table-column v-for="t in tableData.title"
                                 align="center"
                                 :prop="t"
                                 :label="t">
                </el-table-column>

                <el-table-column
                        fixed="right"
                        align="center"
                        label="其他"
                        width="150">
                    <template slot-scope="caozuo">
                        <el-button type="success" round size="mini">历史</el-button>
                        <el-button type="danger" round size="mini">SA</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<style>
    .t-out{
        color: #409EFF;
    }

    .t-out:hover{
        cursor: pointer;
    }
</style>

<script>
    export default {
        props : {
            tableData : {
                type : Object,
                default(){
                    return {}
                }
            },
            tableLoading : Object
        },
        methods : {
            goClick(q){
                console.log(q)
                window.open(`http://www.sogoucn.com/wap.html?dbg=off&query=${q}`)
            }
        }
    }
</script>
