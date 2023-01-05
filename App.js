import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Navigation from './app/Navigation';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Navigation/>
    );
  }
}
