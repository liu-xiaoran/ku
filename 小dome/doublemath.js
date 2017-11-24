//加法
function add(arg1, arg2) {
    var m = 0,s1 = arg1.toString(), s2 = arg2.toString();
    try {
             m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
             m += s2.split(".")[1].length;
    }
    catch (e) {
    }
   
  arg1 = mul(arg1,Math.pow(10, m))
  arg2 = mul(arg2,Math.pow(10, m))
  
    return (arg1 + arg2) / Math.pow(10, m);
}
//减法
function sub(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
   
    arg1 = mul(arg1,Math.pow(10, m))
  arg2 = mul(arg2,Math.pow(10, m))
    return (arg1 - arg2) / Math.pow(10, m);
}
//乘法
function mul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
//除法
function div(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) /Number(s2.replace(".", "")) / Math.pow(10, m);
}
