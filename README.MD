## 简答题

1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么。
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})

1. ​		这种方式添加的成员不是响应式的数据，vue在构造函数中对data中的属性使用Object.defineProperty添加getter和setter方法然后添加观察者对象并加入到观察者列表中，当有值发生变化的时候，就会去执行观察者列表中成员的UPdate方法，所以data函数是在构建的时候就创建好的响应式属性，这种通过按钮生成的方式是不具有响应式功能的，可以用Vue.set()方法进行设定才会是响应式的，因为set方法内部也调用了Object.defineProperty方法


