<template>
     <div class="Rating-gray">
              <i class="fa" :class="item"   v-for="(item,index) in itemClasses" :key="index"> </i>
            </div>
</template>

<script>
//星星长度
const LENGTH=5
//不同星星对应的样式 比如：全星，半星 空星（用来补齐）
const  CLS_ON='fa-star'
const  CLS_ON_HALF='fa-star-half-empty'
const  CLS_OFF='fa-star-o';
export default {
name:'Rating',
props:{
  rating:Number
},
computed:{
  itemClasses(){
       //4.8 四个全星 一个半星
       let result=[];
       //对分数进行处理 确保分数只存在整数与0.5的形式
       let sorce=Math.floor(this.rating*2)/2
      //全星
      let integer=Math.floor(sorce)
      for(let i=0;i<integer;i++){
           result.push(CLS_ON)
      }
      //半星的条件为
      let Decimal=sorce%1!=0
      if(Decimal){
         result.push(CLS_ON_HALF)
      }
      //补齐空星
      while(result.length<LENGTH){
          result.push(CLS_OFF)
      }
       return result
  }
}
}

</script>
<style scoped>
.Rating-gray {
  margin-right:1.06667vw ;
  color: #ffbe00;
  display: inline-block;
}
</style>