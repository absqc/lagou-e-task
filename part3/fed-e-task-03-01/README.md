## 一、简答题

### 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么。

```js
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
```
 答：动态给data添加成员的时候不是响应式数据，需要通过Vue.set()方法 或者 vm.$set()方法，将数据转换成响应式的。原理是，data数据在初始化的时候，会通过Observe方法转换成响应式的getter 和setter，但是新添加的数据不会做这个转换，我们只有手动调用Vue.set()方法，动态触发observe转换才能将data的数据变成响应式的。
 　

　

　



### 2、请简述 Diff 算法的执行过程
 答：diff算法主要是对比新旧vnode的差异更新dom的过程。  
在snabbdom中，会通过比较两个vnode的sel和key属性判断两个vnode是否相等。如果不相等，就会创建新的dom节点，并完成替换的操作。  
如果相等，调用patchVnode（）方法，patchVnode()方法就是比较两个vnode的差异并将差异更新到真实的dom中  
 判断新节点是否有text属性，并且不等于旧节点的text属性: 判断老节点是否有children，先移除老节点的children对应的dom元素，设置新节点对应dom元素的textContent  
新老节点都有children，且不相等：调用updateChildren(),对比子节点，并且更新子节点的差异。这里需要重点讲下updateChildren方法，在updateChildren中会循环比较新旧children中同级别的节点，在循环比较中有四种情况：第一种是判断新开始节点是否等于旧开始节点，第二种是判断新结束节点是否等于旧结束节点，第三种是判断旧开始节点是否等于新结束节点，第四种是判断新旧结束节点是否等于新开始节点。如果是相同节点，调用patchVnode更新dom，第三种和第四种情况需要移动dom元素。 如果以上四种情况都不满足，则通过新节点的key值去匹配老节点，如果没有匹配到则表示新的vnode是一个新元素，则调用creteEle()方法创建一个新的dom元素，并把它插入到相应的位置。如果匹配到则判断它们的sel属性是否相同，如果不同则表示有修改，则调用createEle()方法创建一个新的dom节点，并插入到对应的位置，如果相同则调用patchVnode()方法完成更新。   
只有新节点有children属性：如果老节点有text属性首先清空dom元素的textContent，添加所有子节点  
只有老节点有children属性：移除所有老节点  
只有老节点有text属性：清空对应dom元素的textContent  
　

　

　



 

## 二、编程题

### 1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。
```js
export let _Vue
export default class MyVueRouter {
    constructor(options) {
        this.options = options
        this.routeMap = {} // 键值对，key是路由地址，value是路由组件
        this.data = _Vue.observable({
            current: '/'
        })
    }
    /**
     * myVueRouter是一个插件，会调用Vue.use方法注册到vue实例上
     * 在Vue.use方法中，会会调用vue-router的_install()方法完成注册
     */
    static install (Vue) {
        // 1. 判断当前插件是否已经安装
        if (MyVueRouter.install.installed) {
            return
        }
        // 2. 把Vue构造函数记录到全局变量
        _Vue = Vue
        // 3. 把创建Vue实例时候传入的router对象注入到Vue实例上
        // 混入
        _Vue.mixin({
            beforeCreate () { // 在beforeCreate中可以拿到当前的this
                if (this.$options.router) {
                    _Vue.prototype.$router = this.$options.router
                    this.$options.router.init()
                }
            }
        })
    }
    init () {
        this.createRouteMap()
        this.initComponents(_Vue)
        this.initEvent()
    }
    /**
     * 将options中传过来的routes数组转换成键值对的形式存储到routeMap中
     */
    createRouteMap () {
        this.options.routes.forEach(route => {
            this.routeMap[route.path] = route.component
        })
    }
    // 用于创建router-link 和 router-view组件
    initComponents (Vue) {
        Vue.component('router-link', {
            props: {
                to: String
            },
            // template: '<a :href="to"><slot></slot></a>'
            render (h) {
                return h('a', {
                    attrs: {
                        href: '#' + this.to
                    },
                    on: {
                        click: this.clickHandler
                    }
                }, [this.$slots.default])
            },
            methods: {
                clickHandler (e) {
                    //  history.pushState({}, '', this.to)
                    window.location.hash = this.to
                    this.$router.data.current = this.to
                    e.preventDefault()
                }
            }
        })
        const self = this
        Vue.component('router-view', {
            render (h) {
                const component = self.routeMap[self.data.current]
                return h(component)
            }
        })
    }

    initEvent () {
        window.addEventListener('onhashchange', () => {
            this.data.current = window.location.hash.slice(1) || '/'
        })
    }
}

```
 　

　

### 2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。

```js
class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.compile(this.el)
    }
    //编译模板，处理文本节点和元素节点
    compile (el) {
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                this.compileText(node)
            } else if (this.isElementNode(node)) {
                this.compileElement(node)
            }
            // 
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })

    }
    //编译元素节点，处理指令
    compileElement (node) {
        // 模拟 v-text v-html
        let { attributes } = node
        Array.from(attributes).forEach(attribute => {
            // debugger
            let attrName = attribute.name
            attrName = attrName.substr(2)
            let key = attribute.value
            this.update(node, key, attrName)
        })
    }
    // 更新指令 
    update (node, key, attrName) {
        const type = attrName.split(':')[1] || ''
        const funType = type ? attrName.split(':')[0] : attrName
        let updateFn = this[`${funType}Updater`]
        let value = funType === 'on' ? this.vm.$options.methods[key] : this.vm[key]
        updateFn && updateFn(node, value, type)
    }
    //处理v-text 指令
    textUpdater (node, value) {
        node.textContent = value
    }
    //处理v-model 指令
    modelUpdater (node, value) {
        node.value = value
    }
    //处理v-html 指令
    htmlUpdater (node, value) {
        node.innerHTML = value
    }
    // 处理v-on 指令
    onUpdater (node, handler, type) {
        debugger
        node.addEventListener(type, handler)
    }
    // 编译文本节点处理差值表达式
    compileText (node) {
        // console.log('text-node----------', node)
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if (reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])
        }
    }
    // 判断元素属性是否是指令
    isDirective (attrName) {
        return attrName.startsWith('v-')

    }
    //判断节点是否是文本节点
    isTextNode (node) {
        return node.nodeType === 3
    }
    //判断节点是否是元素节点
    isElementNode (node) {
        return node.nodeType === 1
    }
}
```

　

### 3、参考 Snabbdom 提供的电影列表的示例，利用Snabbdom 实现类似的效果，如图：
# 答：作业在code目录下

