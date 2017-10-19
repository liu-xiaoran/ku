//script的type应该为 text/babel;

var LikeButton = React.createClass({
  getInitialState: function() {
    return {liked: false};
  },
  handleClick: function(event) {
    this.setState({liked: !this.state.liked});
  },
  render: function() {
    var text = this.state.liked ? 'like' : 'haven\'t liked';
    return (
      <p onClick={this.handleClick}>
        You {text} this. Click to toggle.
      </p>
    );
  }
});

//使用getInitialState来定义初始状态，即定义对象。
//通过this.state属性读取，通过this.setState方法修改，每次修改后自动调用this.render方法再次渲染组件。
//this.props表示那些一旦定义就不再改变的特性。this.state是会随着用户互动而产生变化的特性。

var MyComponent = React.createClass({
  handleClick: function() {
    this.refs.myTextInput.focus();
  },
  render: function() {
    return (
      <div>
        <input type="text" ref="myTextInput" />
        <input type="button" value="Focus the text input" onClick={this.handleClick} />
      </div>
    );
  }
});

ReactDOM.render(
  <MyComponent />,
  document.getElementById('example')
);
//文本框必须有ref属性，然后通过this.refs.[refName]来返回真实的dome节点。

//生命周期分为三种状态：
//Mounting：已插入真实 DOM
//Updating：正在被重新渲染
//Unmounting：已移出真实 DOM
//5种处理函数，will在状态调用前，did在状态调用后：
//componentWillMount()
//componentDidMount()
//componentWillUpdate(object nextProps, object nextState)
//componentDidUpdate(object prevProps, object prevState)
//componentWillUnmount()
//两种特殊状态的处理函数：
//componentWillReceiveProps(object nextProps)：已加载组件收到新的参数时调用
//shouldComponentUpdate(object nextProps, object nextState)：组件判断是否重新渲染时调用

//原生的Ajax封装的函数
request = function(url, cb, eb) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if ((xhr.status >=200 && xhr.status < 300) || xhr.status === 304) {
                cb(xhr.responseText);
            } else {
                eb(new Error({
                    message: xhr.status
                }));
            }
        }
    };
    xhr.open('get', url, true);
    xhr.send(null);
}
