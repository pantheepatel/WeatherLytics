import HomeScreen from './src/screens/HomeScreen';
import { Animated, StyleSheet, Text, View, ImageBackground, TextInput, SafeAreaView, ScrollView, Button, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Feather, Ionicons } from '@expo/vector-icons';
import { styles } from './src/styles/styles'
import { loadData } from './src/services/mainService';
import Loading from './src/screens/Loading';
export default function App() {
  return (
    <View>
      {
        loadData?<HomeScreen />:<Loading/>
      }
      
    </View>
  );
}