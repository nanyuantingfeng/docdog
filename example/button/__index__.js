import React from 'react';
import ButtonIndexMd from './index.md'
import ButtonDemoBasicMd from './demo/basic.md'
import ButtonDemoButtonGroupMd from './demo/button-group.md'
import ButtonDemoDisabledMd from './demo/disabled.md'
import ButtonDemoGhostMd from './demo/ghost.md'
import ButtonDemoIconMd from './demo/icon.md'
import ButtonDemoLoadingMd from './demo/loading.md'
import ButtonDemoMultipleMd from './demo/multiple.md'
import ButtonDemoOtherMd from './demo/other.md'
import ButtonDemoSizeMd from './demo/size.md'
import Content from '../C.js'
export default class Button extends React.Component {
    render() {
      return (
      <Content 
        header={ButtonIndexMd}  
        examples={[
        ButtonDemoBasicMd,
ButtonDemoButtonGroupMd,
ButtonDemoDisabledMd,
ButtonDemoGhostMd,
ButtonDemoIconMd,
ButtonDemoLoadingMd,
ButtonDemoMultipleMd,
ButtonDemoOtherMd,
ButtonDemoSizeMd
      ]}/>
      )
    }
  }
Button.label = ButtonIndexMd.label;