// 全局变量问题
// 在函数顶部使用单var语句是比较有用的一种形式;
// 使用单一的var把DOM引用一起指定为局部变量;
// for循环
for (var i = 0, max = myarray.length; i < max; i++) {   // 使用myarray[i]做点什么
}

function looper() { var i = 0, max, myarray = []; for (i = 0, max = myarray.length; i < max; i++) { } }
// 最好替代i++，使用i+=1;
// for-in循环
// for-in循环应该用在非数组对象的遍历上，枚举。不推荐使用于数组。
var man ={  //定义对象
    hands:2,
    legs:2,
    heads:1
};
// 添加一个方法给所有的对象
if(typeof Object.prototype.clone === 'undefined'){
    Object.prototype.clone = function(){};
}
for (var i in man) {
    if (man.hasOwnProperty(i)){ //过滤掉继承而来的属性
        console.log(i,":",man[i]);  
    }
}
for(var i in man){
    if(Object.prototype.hasOwnProperty.call(man,i)){ // call可以改变函数的上下文，指定this
        console.log(i,"i",man[i]);
    }
}
// 扩展内置原型
if(typeof Object.prototype.myMethod !== 'function'){
    Object.prototype.myMethod = function(){
        // 内置原型
    }
}
// 避免隐式类型转换
Number("08") //速度快于 parseInt()
// 类的命名首字母大写，变量或函数名有多个单词时，采用驼峰命名法。
// 使用全部单词大写来命名常量。 尾下划线表示私有，前下划线表示私有属性，前后表示不属于该语言技术部分。

