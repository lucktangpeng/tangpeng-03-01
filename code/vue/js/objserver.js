class Observer {
  constructor(data) {
    this.walk(data);
  }
  walk(data) {
    // 1. 判断data是否是对象
    if (!data || typeof data !== "object") {
      return;
    }
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
    });
  }
  defineReactive(obj, key, val) {
    this.walk(val);
    // 负责收集依赖，并发送通知
    let dep = new Dep();
    const that = this;
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 这个地方不能使用data[key],因为会造成死递归，所以要使用val
        Dep.target && dep.addSub(Dep.target);
        return val;
      },
      set(newValue) {
        if (newValue === val) {
          return;
        }
        val = newValue;
        that.walk(val);
        // 发送通知
        dep.notify();
      },
    });
  }
}
