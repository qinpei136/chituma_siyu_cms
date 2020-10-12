/**
 * reType: 类型检测
 * obj: 传入值
 * return: 返回type
 * reType(any): 返回type
 **/
function reType(obj) {
  var type = Object.prototype.toString;
  var typeIs = type.call(obj);
  return typeIs ? typeIs.split(" ")[1].slice(0, -1).toLowerCase() : "";
}

console.log(reType(true));
