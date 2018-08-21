const style = `
  box-sizing: border-box;
  text-align: center;
  z-index: 99999;
  word-break: break-word;
  position: fixed;
  left: 0;
  top: 50%;
  width: 100%;
  opacity: 0;
  transition: all 1s;
  display: none;
`;
const innerstyle = `
  color: rgb(255, 255, 255);
  font-size: 16px;
  border-radius: 8px;
  box-sizing: border-box;
  text-align: center;
  word-break: break-word;
  padding:6px 12px;
  text-shadow: none;
  background-color: rgba(0, 0, 0, 0.8);
  line-height: 1.3em;
`;
let defaults = {
  width: 160,
  text: "No Message!",
  time: 1200
}
export default (options) => {
  let holder = document.createElement('div');
  let inner = document.createElement('span');
  holder.appendChild(inner);
  holder.style.cssText = style;
  inner.style.cssText = innerstyle;
  document.body.appendChild(holder);

  options = typeof options === 'string'
    ? {...defaults,...{ text: options }}
    : {...defaults, ...options};

  inner.innerHTML = options.text;

  // Show style
  // holder.style.width = options.width + 'px';
  // holder.style.marginLeft = '-' + (options.width / 2) + 'px'
  holder.style.display = 'block';
  setTimeout(() => {
    holder.style.bottom = '200px';
    holder.style.opacity = "1";
  }, 10);

  return new Promise(resolve => {
    // After anmiation.
    setTimeout(() => {
      /* hide style*/
      holder.style.opacity = 0;
      setTimeout(() => {
        holder.remove();
        resolve();
      }, 1000);
    }, options.time);
  });
}
