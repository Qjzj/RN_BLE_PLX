/**
 * @Author QJ
 * @date 2019--03 16:11
 * @desc LButton.js
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native'
import theme from '../config/theme'
const {width} = Dimensions.get('window');

class LButton extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    pressFun: PropTypes.func,
    title: PropTypes.string.isRequired,
    width: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    height: PropTypes.number,
    fontSize: PropTypes.number,
    bgColor: PropTypes.string,
    marginLeft: PropTypes.number
  };

  static defaultProps = {
    width: '100%',
    height: 40,
    fontSize: 18,
    bgColor: theme.main,
    marginLeft: 20,
  };

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => this.props.pressFun()}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: this.props.marginLeft,
          width: this.props.width,
          height: this.props.height,
          backgroundColor: this.props.bgColor,
          borderRadius: 5
        }}
      >
        <Text
          style={{
            fontSize: this.props.fontSize,
            color: 'white',
          }}
        >
          {this.props.title}
        </Text>
      </TouchableOpacity>
    )
  }
}



export default LButton;
