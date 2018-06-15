---
order: 6
title: 按钮组合
imports:
  'Button': '../Button'
---

可以将多个 `Button` 放入 `Button.Group` 的容器中。

通过设置 `size` 为 `large` `small` 分别把按钮组合设为大、小尺寸。若不设置 `size`，则尺寸为中。


````jsx

  <div>
  
    <Button.Group>
      <Button>Cancel</Button>
      <Button>OK</Button>
    </Button.Group>
    
    <br/>
    
    <Button.Group>
      <Button disabled>L</Button>
      <Button disabled>M</Button>
      <Button disabled>R</Button>
    </Button.Group>
    
    <br/>
        
    <Button.Group>
      <Button>L</Button>
      <Button>M</Button>
      <Button>R</Button>
    </Button.Group>
    
    <br/>
        
    <Button.Group>
      <Button type="primary" icon="cloud" />
      <Button type="primary" icon="cloud-download" />
    </Button.Group>
    
  </div> 
````
