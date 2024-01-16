import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainContainer from './navigation/MainContainer';

const App: React.FC = () : React.ReactElement => {

  return (
    <MainContainer />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;