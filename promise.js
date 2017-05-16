
//promise实现
Promise = function() {
    this.queue = [];
    this.value = null;
    this.status = 'pending';// pending fulfilled rejected
};

Promise.prototype.getQueue = function() {
    return this.queue;
};
Promise.prototype.getStatus = function() {
    return this.status;
};
Promise.prototype.setStatus = function(s, value) {
    if (s === 'fulfilled' || s === 'rejected') {
        this.status = s;
        this.value = value || null;
        this.queue = [];
        var freezeObject = Object.freeze || function(){};
        freezeObject(this);// promise的状态是不可逆的
    } else {
        throw new Error({
            message: "doesn't support status: " + s
        });
    }
};
Promise.prototype.isFulfilled = function() {
    return this.status === 'fulfilled';
};
Promise.prototype.isRejected = function() {
    return this.status === 'rejected';
}
Promise.prototype.isPending = function() {
    return this.status === 'pending';
}
Promise.prototype.then = function(onFulfilled, onRejected) {
    var handler = {
        'fulfilled': onFulfilled,
        'rejected': onRejected
    };
    handler.deferred = new Deferred();

    if (!this.isPending()) {//这里允许先改变promise状态后添加回调
        utils.procedure(this.status, handler, this.value);
    } else {
        this.queue.push(handler);//then may be called multiple times on the same promise;规范2.2.6
    }
    return handler.deferred.promise;//then must return a promise;规范2.2.7
};

var utils = (function(){
    var makeSignaler = function(deferred, type) {
        return function(result) {
            transition(deferred, type, result);
        }
    };

    var procedure = function(type, handler, result) {
        var func = handler[type];
        var def = handler.deferred;

        if (func) {
            try {
                var newResult = func(result);
                if (newResult && typeof newResult.then === 'function') {//thenable
                    // 此种写法存在闭包容易造成内存泄露，我们通过高阶函数解决
                    // newResult.then(function(data) {
                    //     def.resolve(data);
                    // }, function(err) {
                    //     def.reject(err);
                    // });
                    //PromiseA+规范，x代表newResult，promise代表def.promise
                    //If x is a promise, adopt its state [3.4]:
                    //If x is pending, promise must remain pending until x is fulfilled or rejected.
                    //If/when x is fulfilled, fulfill promise with the same value.
                    //If/when x is rejected, reject promise with the same reason.
                    newResult.then(makeSignaler(def, 'fulfilled'), makeSignaler(def, 'rejected'));//此处的本质是利用了异步闭包
                } else {
                    transition(def, type, newResult);
                }
            } catch(err) {
                transition(def, 'rejected', err);
            }
        } else {
            transition(def, type, result);
        }
    };

    var transition = function(deferred, type, result) {
        if (type === 'fulfilled') {
            deferred.resolve(result);
        } else if (type === 'rejected') {
            deferred.reject(result);
        } else if (type !== 'pending') {
            throw new Error({
                'message': "doesn't support type: " + type
            });
        }
    };

    return {
        'procedure': procedure
    }
})();

Deferred = function() {
    this.promise = new Promise();
};

Deferred.prototype.resolve = function(result) {
    if (!this.promise.isPending()) {
        return;
    }

    var queue = this.promise.getQueue();
    for (var i = 0, len = queue.length; i < len; i++) {
        utils.procedure('fulfilled', queue[i], result);
    }
    this.promise.setStatus('fulfilled', result);
};

Deferred.prototype.reject = function(err) {
    if (!this.promise.isPending()) {
        return;
    }

    var queue = this.promise.getQueue();
    for (var i = 0, len = queue.length; i < len; i++) {
        utils.procedure('rejected', queue[i], err);
    }
    this.promise.setStatus('rejected', err);
}




//通过Promise机制我们的编程方式可以变成
request = function(url) {
    var def = new Deferred();

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if ((xhr.status >=200 && xhr.status < 300) || xhr.status === 304) {
                def.resolve(xhr.responseText)
            } else {//简化ajax，没有提供错误回调
                def.reject(new Error({
                    message: xhr.status
                }));
            }
        }
    };
    xhr.open('get', url, true);
    xhr.send(null);

    return def.promise;
}

request('data1.json').then(function(data1) {
    console.log(data1);//处理data1
    return request('data2.json');
}).then(function(data2) {
    console.log(data2);//处理data2
    return request('data3.json');
}, function(err) {
    console.error(err);
}).then(function(data3) {
    console.log(data3);
    alert('success');
}, function(err) {
    console.error(err);
});




//对于并行逻辑串行执行问题我们可以这样


//所有异步操作都完成时，进入完成态，
//其中一项异步操作失败则进入失败态
all = function(requestArray) {
    // var some = Array.prototype.some;
    var def = new Deferred();
    var results = [];
    var total = 0;
    requestArray.some(function(r, idx) {
        //为数组中每一项注册回调函数
        r.then(function(data) {
            if (def.promise.isPending()) {
                total++;
                results[idx] = data;

                if (total === requestArray.length) {
                    def.resolve(results);
                }
            }
        },  function(err) {
            def.reject(err);
        });
        //如果不是等待状态则停止，比如requestArray[0]失败的话，剩下数组则不用继续注册
        return !def.promise.isPending();
    });

    return def.promise;
}

all(
    [request('data1.json'),
    request('data2.json'),
    request('data3.json')]
    ).then(
        function(results){
            console.log(results);// 处理data1,data2,data3
            alert('success');
    }, function(err) {
        console.error(err);
    });



//几个测试案例

//链式调用
var p1 = new Deferred();
p1.promise.then(function(result) {
    console.log('resolve: ', result);
    return result;
}, function(err) {
    console.log('reject: ', err);
    return err;
}).then(function(result) {
    console.log('resolve2: ', result);
    return result;
}, function(err) {
    console.log('reject2: ', err);
    return err;
}).then(function(result) {
    console.log('resolve3: ', result);
    return result;
}, function(err) {
    console.log('reject3: ', err);
    return err;
});
p1.resolve('success');
//p1.reject('failed');
p1.promise.then(function(result) {
    console.log('after resolve: ', result);
    return result;
}, function(err) {
    console.log('after reject: ', err);
    return err;
}).then(function(result) {
    console.log('after resolve2: ', result);
    return result;
}, function(err) {
    console.log('after reject2: ', err);
    return err;
}).then(function(result) {
    console.log('after resolve2: ', result);
    return result;
}, function(err) {
    console.log('after reject2: ', err);
    return err;
});

//串行异步
var p2 = new Deferred();
p2.promise.then(function(result) {
    var def = new Deferred();
    setTimeout(function(){
        console.log('resolve: ', result);
        def.resolve(result);
    })
    return def.promise;
}, function(err) {
    console.log('reject: ', err);
    return err;
}).then(function(result) {
    var def = new Deferred();
    setTimeout(function(){
        console.log('resolve2: ', result);
        def.reject(result);
    })
    return def.promise;
}, function(err) {
    console.log('reject2: ', err);
    return err;
}).then(function(result) {
    console.log('resolve3: ', result);
    return result;
}, function(err) {
    console.log('reject3: ', err);
    return err;
});
p2.resolve('success');

//并行异步
var p1 = function(){
    var def = new Deferred();
    setTimeout(function() {
        console.log('p1 success');
        def.resolve('p1 success');
    }, 20);

    return def.promise;
}
var p2 = function(){
    var def = new Deferred();
    setTimeout(function() {
        console.log('p2 failed');
        def.reject('p2 failed');
    }, 10);

    return def.promise;
}

var p3 = function(){
    var def = new Deferred();
    setTimeout(function() {
        console.log('p3 success');
        def.resolve('p3 success');
    }, 15);

    return def.promise;
}

all([p1(), p2(), p3()]).then(function(results) {
    console.log(results);
}, function(err) {
    console.error(err);
});
