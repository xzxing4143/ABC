const Timer=class{
     constructor({fn,delay=1000,immediately=false,times}){
        if(Object.prototype.toString.call(fn)!='[object Function]'){
            throw new TypeError('No callback function defined!') ;
        }
        this.delay=delay;
        this.fn=fn;
        this.immediately=immediately;
        this.times=times;
        this.status='wait';//wait、running、suspend
     }
     /**
      * 修改定时器对象的间隔时间
      */
     alterDelay(delay){
         this.delay=delay;
         return this;
     }
    
    /**
     * 暂停任务
     */
    suspend(){
       this.status='suspend';
       return this;
    }
    
    /**
     * 资源是否函数 
     * 怎么释放啊，暂时没有想到哦
     */
    destory(){

    }

    /**
     * 重新开始任务
     */
    resume(){
        if(this.status=='suspend'){//当且仅当处于暂停的时候能够恢复执行
            this.status='running';
            this.do();
        }
        return this;
    }
    /**
     * 定时开始启动
     */
    start(){
        if(this.status=='wait') {
            this.status='running';
            this.do();
        }
        return this;
    }

    getStatus(){
        return this.status;
    }

    do(){//函数的执行控制
      if(this.status=='running'){
      var t=setTimeout(()=>{
            try{
              this.fn();
            }catch(e){
               throw new SyntaxError('exec the callback function error! the error Message is:'+e.getMessage);
            }
            this.do();
            return this;
        },this.delay);
      this.timers.push(t);
      }
      return this;
    }
}

export {Timer};