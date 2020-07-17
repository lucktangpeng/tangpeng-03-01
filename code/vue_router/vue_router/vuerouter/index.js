let _Vue = null;

export default class VueRouter {
  static install(vue) {
    //vue.use调用install方式的时候会传递两个函数
    // 第一个是vue的构造函数
    // 第二个是可选的选项对象
    // 1. 判断当前插件是否已经被安装
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true;
    // 2. 需要把vue的构造函数记录下来，记录到全局变量中
    _Vue = vue;
    // 3. 把创建vue实例时创建的route对象，传入到所有vue实例上
    // 我们使用的this.$router就是在这个时候被注入的vue实例上的
    // 混入
    _Vue.mixin({
      beforeCreate() {
        // 因为beforeCreate是生命周期，会多次被调用
        // 检查对象中是否包含router，vue实例中是包含的，组件中是没有的
        if (this.$options.router) {
          // this.$options 可以拿到实例中除了data之外的所有属性和方法
          _Vue.prototype.$router = this.$options.router;
          this.$options.router.init();
        }
      },
    });
  }
  constructor(options) {
    this.options = options;
    this.routerMap = {};
    // observable 可以帮我们把对象变成响应式的，
    // current 当前的路由地址，默认是/
    this.data = _Vue.observable({ current: "#/" });
  }

  init() {
    this.createRouteMap();
    this.initComponents(_Vue);
    this.initEvent()
  }
  createRouteMap() {
    // 遍历所有的路由规则，把路由规则解析成键值对的形式，存储到routeMap中
    this.options.routes.forEach((route) => {
      this.routerMap[route.path] = route.component;
    });
    console.log('执行了')
  }
  initComponents(Vue) {
    Vue.component("router-link", {
      props: {
        to: String,
      },
      // 直接使用render就不用使用渲染器了
      render (h) {
        return h("a",{ attrs: { href: this.to}, on: {click: this.clickhander}}, [this.$slots.default])
      },
      methods:{
        clickhander(e){
            // history.hashchange({},"","#"+this.to)
            history.pushState({},"","#"+this.to)
            this.$router.data.current= "#"+this.to
            // 阻止默认行为
            e.preventDefault()
        }
    }
      // template 需要加载渲染器，虚使用完整版本的vue体积会大10K，
      // 渲染器的作用就是把template，渲染成render
    //   template: '<a :href="to"><slot></slot></a>',
    })
    const self = this;
    Vue.component("router-view", {

        render (h) {
            const vm = self.routerMap[self.data.current.split("#")[1]]
            return h(vm)
        }
    })
  }
  initEvent(){
    window.addEventListener("hashchange",()=>{
        this.data.current = "#" + window.location.pathname
    })
}
}