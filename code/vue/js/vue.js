class Vue {
  constructor(options) {
    // 1. 通过属性保存选项的数据
    // $开头的属性代表是公共属性
    this.$options = options || {};
    this.$data = options.data || {};
    // 意思: 检查类型，如果是字符串就使用document.querySelector进行选择器查找dom
    // 如果是dom就直接返回
    this.$el =
      typeof options.el === "string"
        ? document.querySelector(options.el)
        : options.el;

    this.$methods = options.methods
    // 2. 把data中的成员装换成getter和setter,注入到vue实例中
    this._proxyData(this.$data);
    // 3. 调用observer对象，监听数据的变化
    new Observer(this.$data);
    // 4. 调用compiler对象，解析指令和差值表达式
    new Compiler(this);
  }
  // 代理数据，代理Data里的数据
  _proxyData(data) {
    // 遍历data中的所有属性
    Object.keys(data).forEach((key) => {
      // 把data的属性注入到vue的实例中
      Object.defineProperty(this, key, {
        // 是否可枚举
        enumerable: true,
        // 是否可配置
        configurable: true,
        get() {
          return data[key];
        },
        set(newValue) {
          if (newValue === data[key]) {
            return;
          }
          data[key] = newValue;
        },
      });
    });
  }
}
