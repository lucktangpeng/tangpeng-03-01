// import { h,init } from "snabbdom"
// const patch = init([])

class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.methods = vm.$methods
    this.compile(this.el);
  }
  // 编译模板, 处理文本节点和元素节点
  compile(el) {
    // 返回dom对象中的节点伪数组
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      // 处理文件节点
      if (this.isTextNode(node)) {
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        // 处理元素节点
        this.compileElement(node);
      }
      // 递归处理所有深层子节点
      if (node.childNodes && node.childNodes.length) {
        this.compile(node);
      }
    });
  }
  // 编译元素节点，处理指令
  compileElement(node) {
    Array.from(node.attributes).forEach((attr) => {
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        attrName = attrName.substr(2);
        let key = attr.value;
        this.update(node, key, attrName);
      }
    });
  }
  update(node, key, attrName) {
    if (attrName.startsWith("on")) {
      this.onUpdater(node, key, attrName)
    }
    else {
      let updateFn = this[attrName + "Updater"];
      updateFn && updateFn.call(this,node, this.vm[key], key);
    }
  }

  onUpdater(node, key, attrName) {
    attrName = attrName.split(":")[1]
    node.addEventListener(attrName, this.methods[key])
  }

  htmlUpdater(node, value, key) {
    node.innerHTML = this.vm[key]
  }

  textUpdater(node, value, key) {
    node.textContent = value;
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = value;
    })
  }
  modelUpdater(node, value, key) {
    node.value = value;
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue;
    })
  }
  // 编译文本节点, 处理差值表达式
  compileText(node) {
    // 这里相当于 new RegExp('\{\{\(.+?)}\}'),所以下面能够那到值
    let reg = /\{\{(.+?)\}\}/;
    let value = node.textContent;
    if (reg.test(value)) {
      let key = RegExp.$1.trim();
      node.textContent = value.replace(reg, this.vm[key]);
      // 创建watcher对象，当数据改变更新视图
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue;
      });
    }
  }
  // 判断元素属性是否是指令
  isDirective(attrName) {
    // startsWith 表示参数字符串是否在，源字符串的头部
    return attrName.startsWith("v-");
  }
  isTextNode(node) {
    // nodeType 对 元素节点 属性节点 文件节点 分别返回 1 ，2，3
    return node.nodeType === 3;
  }
  isElementNode(node) {
    return node.nodeType === 1;
  }
}
