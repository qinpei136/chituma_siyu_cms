class MyControlSearch {
  constructor(props) {
    if (typeof props === "object") {
      this.obj = props;
    } else {
      this.obj = [];
    }
  }
  get(str) {
    var reget = [];
    if (this.obj.length - parseInt(str) > -1) {
      reget = this.obj.slice(0, str);
    } else {
      reget = this.obj;
    }
    return reget;
  }
  inside() {
    return this.obj.slice(0, 3);
  }
  out() {
    return this.obj.slice(3, this.obj.length);
  }
  set(str) {
    if (Array.isArray(str)) {
      this.obj.concat(str);
    }
  }
  has(str) {
    let bool = false;
    this.obj.includes(str);
    return bool;
  }
  all() {
    return this.obj;
  }
}
export default MyControlSearch;
