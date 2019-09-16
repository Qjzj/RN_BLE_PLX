/**
 * @Author QJ
 * @date 2019--03 12:05
 * @desc TopBarCommon.js
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform
} from 'react-native'

class TopBarCommon extends Component {
  constructor() {
    super()
  }

  static propTypes = {
    renderLeft: PropTypes.func,
    renderTitle: PropTypes.func,
    renderRight: PropTypes.func
  };

  render() {
    return (
      <View style={styles.topBarWrap}>
        {/*渲染左边内容*/}
        <View style={styles.TopBarItem}>
          {this.renderLeftItem()}
        </View>

        {/*渲染标题内容*/}
        <View style={styles.TopBarItem}>
          {this.renderTitleItem()}
        </View>

        {/*渲染右边内容*/}
        <View style={styles.TopBarItem}>
          {this.renderRightItem()}
        </View>
      </View>
    )
  }

  renderLeftItem() {
    if(this.props.renderLeft) {
      return this.props.renderLeft();
    }else {
      return null
    }
  }

  renderTitleItem() {
    if(this.props.renderTitle) {
      return this.props.renderTitle();
    }else {
      return null
    }
  }

  renderRightItem() {
    if(this.props.renderRight) {
      return this.props.renderRight()
    }else {
      return null
    }
  }

}

const styles = StyleSheet.create({
  topBarWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    height: Platform.OS === 'ios' ? 64 : 44,
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey',
    backgroundColor: 'blue'
  },
  TopBarItem: {
    minWidth: 20
  }
});

export default TopBarCommon;
