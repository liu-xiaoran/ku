var arr=[];
function mima(){
	for(var i=0;i<21;i++){
		if(i%7==0)
		arr[i]=i
	}
}
 mima()
str=arr.join("1");
str=str.substr(0,3) 
console.log(str) //密码

