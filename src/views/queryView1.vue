<template>
    <el-main>
        <query-header-view
                :today="header.today"
                :output="header.output"
                @queryData="queryData"
                :containLoading="containLoading">
        </query-header-view>
        <query-table-view
                :tableLoading="tableLoading"
                :tableData="tableData"
                v-if="Object.keys(tableData).length">
        </query-table-view>
        <footer-view
                :pageData="pageData"
                v-if="pageData > 0"
                :query="header.query"
                :date="header.date"
                @queryData="queryData">
        </footer-view>
        <blank-view :_img="containLoading.switch"></blank-view>
    </el-main>
</template>

<script>
    import queryHeaderView from './commonViews/queryHeaderView'
    import queryTableView from './commonViews/queryTableView'
    import footerView from './commonViews/footerView'
    import blankView from './commonViews/blankView'
    let sqls = require('../../lib/sql')

    export default {
        data(){
            return {
                header : {
                    today : true,
                    output : true,
                    date : '',
                    query : ''
                },
                tableData : {},
                pageData : 0,
                containLoading : {
                    instance : false,
                    switch : true
                },
                tableLoading : {
                    instance : false,
                    switch : true
                },
                querySoruce : 'week'
            }
        },
        components : {queryHeaderView,queryTableView,footerView,blankView},
        methods : {
            queryData(query,date,page,type){

                let u = null;

                if(type && type == 'pageChange'){
                    // 局部 loading
                    this.tableLoading.instance = true
                    this.querySoruce == 'week' ? u = sqls.queryWeek(query,date,page) : u = sqls.queryToday(query,date,page)
                }else {
                    // 清除表格和分页器
                    this.tableData = [];
                    this.pageData = 0;
                    if(type == 'week'){
                        this.querySoruce = 'week'
                        u = sqls.queryWeek(query,date,page);
                    }else{
                        this.querySoruce = 'single'
                        u = sqls.queryToday(query,date,page);
                    }

                }

                this.header.query = query;
                this.header.date = date;


                this.$http.jsonp(u).then(res => {
                    console.log(res.data)
                    this.containLoading.switch = false;
                    this.containLoading.instance.visible = false;

                    // 局部 loading 的时候数据更新可能快过 loading 显示，所以要延时加载
                    setTimeout(() => {
                        this.tableData = this.buildTable(res.data)
                        this.tableLoading.instance = false
                    },200)
                },err => {
                    console.log(err)
                })
            },
            buildTable(data){
                let realData = {
                    title : [],
                    body : []
                },sortArr = Array.sort(Object.keys(data.count));
                realData.title = [...sortArr,'total'];

                let firstLine = {'query':'总体'},sum = 0;

                for(let k in data.count){
                    sum += Number(data.count[k])
                    firstLine[k] = data.count[k]
                }

                firstLine['total'] = sum;

                realData.body.push(firstLine);

                for(let d in data.doc){
                    let doc = data.doc[d],tmp = {};
                    tmp.query = doc.title

                    for(let k in doc.web){
                        tmp[k] = doc.web[k].pv
                    }
                    tmp.total = doc.count
                    realData.body.push(tmp)
                }

                this.pageData = Number(data.total)
                return realData
            }
        }
    }
</script>