<template>
    <div class="blank">
       <img v-if="_img" src="../../assets/images/adidas.jpg" alt="adidas"/>
    </div>
</template>

<script>
    export default {
        props : ['_img']
    }
</script>

<style>
    .blank{
        height: 60%;
        width: 80%;
        position: relative;
    }

    .blank img{
        position: absolute;
        left: 25%;
        top: 10%;
    }
</style>