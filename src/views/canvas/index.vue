<template>
  <div class="app-container">
    <canvas 
      ref="myCanvas" 
      width="600" 
      height="600" 
      class="canvas"
      @mousedown="addIcon" />
    <img id="icon" src="../../assets/jizhan.png" alt="" @click="add($event)">
    
  </div>
</template>

<script>
const Icon = function(x , y){
  this.x = x;
  this.y = y;
}

Icon.prototype = {
  
  move:function(x,y){
    this.x = x;
    this.y = y;
  }
  
}

export default {
  data() {
    return {
      c: null,
      ctx: null,
      isAdd: true,
      icons: [],
      currIcon: '',
    }
  },
  mounted() {
    this.init()
  },
  
  methods: {
    init() {
      this.c = this.$refs.myCanvas
      if (this.c.getContext) {
        this.ctx = this.c.getContext('2d')
      }
    },
    add() {
      this.isAdd = true
    },
    addIcon(event) {
      const img = document.getElementById('icon')
      var mouse = {
        x: event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - this.c.offsetLeft - 210-14,
        y: event.clientY + document.documentElement.scrollTop + document.body.scrollTop - this.c.offsetTop - 95-28
      }
      this.icons.forEach((item) => {
        if((mouse.x>= item.x-14 && mouse.x<= item.x+14) &&(mouse.y >= item.y-28 && mouse.y <= item.y)){
          this.isAdd = false;
          this.currIcon = item;
        }
      });
      if(this.isAdd){
        this.currIcon = new Icon(mouse.x , mouse.y);
        this.icons.push(this.currIcon);
      }else {
        window.onmousemove = (event) =>{
          event = event || window.event;
          this.ctx.clearRect(0,0,this.c.width,this.c.height);

          var mouse ={
            x: event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - this.c.offsetLeft - 14,
            y: event.clientY + document.documentElement.scrollTop + document.body.scrollTop - this.c.offsetTop - 28
          }
          // 边界值
          let leftNode = {
            x: 0,
            y: 0
          } 
          let rightNode = {
            x : 600-28,
            y: 600-28
          }
            
          if(mouse.x <= leftNode.x) mouse.x = leftNode.x
          if(mouse.x >= rightNode.x) mouse.x = rightNode.x
          if(mouse.y <= leftNode.y) mouse.y = leftNode.y
          if(mouse.y>= rightNode.y) mouse.y = rightNode.y

          this.currIcon.move(mouse.x , mouse.y);
          this.drawIcon(img);
        }
      }
      this.drawIcon(img);
      window.onmouseup = function(){
        window.onmousemove = null;
      }
    
    },
    

    drawIcon(img) {
      
      this.icons.forEach((item) =>{
        this.ctx.drawImage(img, item.x, item.y, 28, 28)
			});
    }
   
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";
  img{
      width: 28px;
    }
  .canvas{
 
    border: 1px solid #000000;
  }
</style>
