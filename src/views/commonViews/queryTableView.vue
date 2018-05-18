<template>
    <div class="t-table">
        <el-card>
            <el-table
                    v-loading="tableLoading.instance"
                    element-loading-text="莫着急 ..."
                    element-loading-background="#FFF"
                    :data="tableData.body"
                    stripe
                    height="400"
                    size = "medium"
                    highlight-current-row = "true"
                    style="width: 100%">

                <el-table-column v-for="t in tableData.title"
                                 align="center"
                                 :prop="t"
                                 :label="t"
                                 min-width="100">
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

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
        }
    }
</script>