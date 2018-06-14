/******************************************************
 * Created by nanyuantingfeng on 2018/5/31 17:57.
 *****************************************************/
import * as React from 'react';
import ButtonX from 'antd/lib/button'

export default class Button extends React.PureComponent {
  render () {
    return (
      <ButtonX {...this.props} />
    );
  }
}

Button.Group = ButtonX.Group
