import React from 'react';
import IconIndexMd from './index.md'
import IconDemoAMd from './demo/a.md'
import IconDemoBMd from './demo/b.md'
import IconDemoCMd from './demo/c.md'
import IconDemoDMd from './demo/d.md'
import IconDemoEMd from './demo/e.md'
import Content from '../C.js'
export default class Icon extends React.Component {
    render() {
      return (
      <Content 
        header={IconIndexMd}  
        examples={[
        IconDemoAMd,
IconDemoBMd,
IconDemoCMd,
IconDemoDMd,
IconDemoEMd
      ]}/>
      )
    }
  }
Icon.label = IconIndexMd.label;