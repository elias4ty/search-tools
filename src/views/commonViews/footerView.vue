<template>
    <div class="t-page">
        <el-pagination
                @current-change="pageChange"
                @prev-click="pageChange"
                @next-click="pageChange"
                :page-size="30"
                background
                layout="prev, pager, next, total"
                :total="pageData">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        props : {
            pageData : {
                type : Number,
                required : true
            },
            query : String,
            date : null
        },
        methods : {
            pageChange(page){
                this.$emit('queryData',this.query,this.date,page,'pageChange')
            }
        }
    }
</script>