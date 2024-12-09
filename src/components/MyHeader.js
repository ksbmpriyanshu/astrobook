import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Linking,
  PermissionsAndroid,
  Alert,
  Platform
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors, fonts,getFontSize} from '../config/Constants1';
import { openFacebook, openInstagram, openYoutube } from './Methods';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';
import { Buffer } from 'buffer';



const MyHeader = ({ title,navigation, statusBar, socialIcons = false, download = false,id}) => {

  return (
    <SafeAreaView
      style={{backgroundColor: colors.background_theme2}}
      forceInset={{top: 'always', bottom: 'never'}}>
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingVertical: 12,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            flex: 0,
            width: '15%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons
            name="arrow-back"
            color={colors.white_color}
            size={getFontSize(2.5)}
          />
        </TouchableOpacity>
        <View style={{flex: 0.8}}>
          <Text allowFontScaling={false}
            numberOfLines={1}
            style={{
              fontSize: getFontSize(1.7),
              color: colors.white_color,
              fontFamily: fonts.medium,
            }}>
            {title}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MyHeader;
