var num = 1;
// console.log(typeof num);
// console.log(num instanceof Number);

// var bool = true;
// console.log(typeof bool);
// console.log(bool instanceof Boolean);

console.log(typeof "num");
console.log(typeof num);
console.log(typeof true);
console.log(typeof undefined);
console.log(typeof (() => {}));

console.log([] instanceof Array);
console.log({} instanceof Object);
console.log(/\d/ instanceof RegExp);

var type = Object.prototype.toString;
console.log(type.call(""));
console.log(type.call(/\d/));
var str = new String("sfdfd");
console.log(type.call(str));

console.log(type.call("").search("String"));

function reType(obj) {
  var type = Object.prototype.toString;
  var typeArr = [
    "String",
    "Number",
    "Boolean",
    "Undefined",
    "Null",
    "Array",
    "Object",
    "RegExp",
  ];
  var typeIndex = -1;
  var typeIs = "";

  for (const iterator of typeArr) {
    typeIndex = type.call(obj).search(iterator);
    if (typeIndex > -1) {
      typeIs = iterator;
      break;
    }
  }
  return typeIs.toLowerCase();
}
