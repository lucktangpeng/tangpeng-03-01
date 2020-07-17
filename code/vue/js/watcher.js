class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    // data中的属性名称
    this.key = key;
    // 回调函数负责更新视图
    this.cb = cb;
    // 把watcher对象记录到Dep类的静态属性target
    Dep.target = this;
    // 触发get方法，在get方法中会调用addSub，将dep.target添加到subs数组中
    this.oldvalue = vm[key];
    // 添加完后，清空，防止重复添加
    Dep.target = null;
  }
  // 当数据变化的时候更新视图
  update() {
    let newValue = this.vm[this.key];
    if (this.oldvalue === newValue) {
      return;
    }
    this.cb(newValue);
  }
}
