# docdog 

> 一款自动生成的静态网站大的webpack plugin


## usage

```npm
npm i docdog
```

```
const DocDogPlugin = require('docdog')


webpackConfig.plugins.push(
    new DocDogPlugin({
        root : String<Path>,  //要扫描的文件根目录
        wrapper : String<Path>, // 将MD文件打包后需要装载的WrapperComponent
        routes: String<Path>, // 自动生成的routes文件路径
        cwd :? String<Path>,  //制定相对路径的当前目录
    })
)

```


#### 实现原理

*  遍历 root 目录下所有的下级子目录
*  遍历 root/* 目录下所有的md文件,并生成 __index__.js文件 
* __index__.js 文件中引用当前目录所有的MD文件生成的component并使用wrapper的控件包装
* __index__.js 导出

* 遍历所有的  __index__.js文件并导入
* 生成routes 文件, 格式化成静态路由列表并导出.


* 将生成的所有文件插入到webpack的编译文件系统中.
* webpack 执行编译.
