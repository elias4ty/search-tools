<template>
    <el-main>
        <query-header-view
                :today="header.today"
                :output="header.output"
                @queryData="queryData"
                @changeJingque="changeJingque"
                @getDateSelf="getDateSelf"
                @queryJingque="queryJingque"
                :jingque="jingque"
                :todayValue="todayValue"
                :dateArr="dateArr"
                :containLoading="containLoading">
        </query-header-view>

        <div class="blank">
            <transition name="moj" mode="out-in">
                <div class="mohu" v-if="!jingque">
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
                </div>
                <query-chart-view
                        :chartData="chartData"
                        v-else-if="!containLoading.switch"
                        :queryValue="header.query"
                        :dateArr="dateArr">
                </query-chart-view>
            </transition>
            <img v-if="containLoading.switch" src="../assets/images/adidas.jpg" alt="adidas"/>
        </div>
    </el-main>
</template>

<style>
    .blank{
        height: 60%;
        width: 95%;
        position: relative;
    }

    .blank img{
        position: absolute;
        left: 25%;
        top: 10%;
    }

    .moj-enter-active, .moj-leave-active {
        transition: opacity .2s;
    }
    .moj-enter, .moj-leave-to {
        opacity: 0;
    }
</style>

<script>
    import queryHeaderView from './commonViews/queryHeaderView'
    import queryTableView from './commonViews/queryTableView'
    import footerView from './commonViews/footerView'
    import queryChartView from './commonViews/queryChartView'
    let sqls = require('lib/sql')

    export default {
        data(){
            return {
                header : {
                    today : true,
                    output : true,
                    date : [],
                    query : ''
                },
                jingque : false,
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
                todayValue : this.getDateSelf()[0],
                querySoruce : 'week',
                dateArr : [],
                chartData : ''
            }
        },
        components : {queryHeaderView,queryTableView,footerView,queryChartView},
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

                    this.containLoading.instance.visible = false;
                    if(res.data.total === 0){
                        this.$message({
                            message : '目前还没有统计信息',
                            type : 'warning',
                            center : true,
                            duration : 1500
                        })
                        return;
                    }
                    this.containLoading.switch = false;



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
            },
            changeJingque(){
                this.jingque = !this.jingque
            },
            queryJingque(query,type = 'week'){
                if(!query){
                    this.$message({
                        message : '请输入 query 词！',
                        type : 'error',
                        center : true,
                        duration : 1000
                    })
                    return false
                }

                this.containLoading.instance = this.$loading({
                    target : '.blank',
                    text : '正在加载 ...',
                    spinner : 'el-icon-loading',
                    background : '#FFF',
                    visible : true
                })

                this.getDateAll(type);

                let url = sqls.queryJingqueByPC(query,this.dateArr);

                this.$http.jsonp(url).then(res => {
                    this.containLoading.instance.visible = false;
                    this.containLoading.switch = false;

                    console.log(JSON.parse(res.bodyText))

                    // 精确查询组件第一次进入时，虽然 this.containLoading.switch = false; 已经设置
                    // 但是这时刻组件还没有被渲染，所以没法侦听到。故放到下一次轮询中
                    this.$nextTick(function () {
                        this.chartData = JSON.parse(res.bodyText)
                    })
                },err => {
                    console.log(err)
                })
            },
            formatDate(d){
                let y = d.getFullYear(),
                    m = d.getMonth() >= 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1),
                    da = d.getDate() >= 9 ? d.getDate() : '0' + d.getDate();

                return [y,m,da].join('')
            },
            getDateAll(t){
                let start = new Date;
                start.setTime(start.setDate(start.getDate() - 1 ));
                let end = new Date(start.getTime());

                switch (t) {
                    case 'year': {
                        end.setTime(end.setFullYear(end.getFullYear() - 1))
                        break;
                    }
                    case 'half': {
                        end.setTime(end.setMonth(end.getMonth() - 6 ))
                        break;
                    }
                    case 'month' : {
                        end.setTime(end.setMonth(end.getMonth() - 1 ))
                        break;
                    }
                    case 'week' : {
                        end.setTime(end.setDate(end.getDate() - 6 ))
                        break;
                    }
                    case 'fall' : {
                        end.setTime(end.setMonth(end.getMonth() - 3))
                        break;
                    }
                }

                return this.dateArr = [this.formatDate(end),this.formatDate(start)]
            },
            getDateSelf(today = new Date(),add = 6){

                let next = new Date(today.getTime());
                next.setTime(next.setDate(next.getDate() + add));

                return this.dateArr = [this.formatDate(today),this.formatDate(next)]
            },
        }
    }
</script>