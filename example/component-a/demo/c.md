---
order: 3
title: 不可用状态
imports:
    'Button': '../Button'
---

添加 `disabled` 属性即可让按钮处于不可用状态，同时按钮样式也会改变。


````jsx

<div>
 
    <Button type="primary">Primary</Button>
    <Button type="primary" disabled>Primary(disabled)</Button>
    <br />
    <Button>Default</Button>
    <Button disabled>Default(disabled)</Button>
    <br />
    <Button ghost>Ghost</Button>
    <Button ghost disabled>Ghost(disabled)</Button>
    <br />
    <Button type="dashed">Dashed</Button>
    <Button type="dashed" disabled>Dashed(disabled)</Button>

</div>
  
````
