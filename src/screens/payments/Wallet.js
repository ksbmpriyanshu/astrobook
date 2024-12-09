import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  StyleSheet,
  TextInput,
  Linking,
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import MyHeader from '../../components/MyHeader';
import {
  api_addwallet,
  api_getRechargeplans,
  api_url,
  colors,
  fonts,
  vedic_images,
  create_phonepe_order,
  phonepe_success,
  getFontSize
} from '../../config/Constants1';
import { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { success_toast, warnign_toast } from '../../components/MyToastMessage';
import * as CustomerActions from '../../redux/actions/CustomerActions';
import { useRef } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyLoader from '../../components/MyLoader';
import * as UserActions from '../../redux/actions/CustomerActions';
import { useTranslation } from 'react-i18next';
import { showNumber } from '../../utils/services';
import { Sizes, Fonts, Colors } from '../../assets/style';
import { Input } from '@rneui/themed';
import { ColorSpace } from 'react-native-reanimated';
const { width, height } = Dimensions.get('screen');

const Wallet = ({ navigation, route, customerData, dispatch, rechargeOfferList }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [firstOffer, setFirstOffer] = useState(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <MyHeader
          title={t('recharge')}
          navigation={navigation}
          socialIcons={false}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);

  useEffect(() => {
    dispatch(CustomerActions.getWalletRechargeOfferList())
  }, [dispatch]);

  const add_money = () => {
    const amountRegex = /^\d+(\.\d+)?$/
    if (amount.length == 0) {
      warnign_toast('Please Enter your amount to add your wallet.');
      return
    } else if (amount < 1) {
      warnign_toast('Minimum amount required is INR 50');
      return
    } else if (!amountRegex.test(amount)) {
      warnign_toast('Please enter valid amount');
      return
    } else {
      navigation.navigate('WalletGstAmount', { amount: amount })
    }

  };
 console.log("customerData?.wallet_balance",customerData?.wallet_balance)
  return (
    <ImageBackground
      source={require('../../assets/images/back.png')}
      style={{ flex: 1 }}>
      <MyLoader isVisible={isLoading} />

      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text allowFontScaling={false}
            style={{
              fontSize: getFontSize(1.8),
              color: colors.black_color,
              fontFamily: fonts.semi_bold,
              alignSelf: 'center',
              marginVertical: 20,
            }}>
            {t('available_balance')}:{' '}
            <Text allowFontScaling={false} style={{ color: colors.background_theme2 }}>
              {showNumber(customerData?.wallet_balance)}
            </Text>
          </Text>
          <View
            style={{
              flex: 0,
              width: '95%',
              padding: 15,
              borderRadius: 10,
              borderColor: colors.black_color8,
              borderWidth: 1,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 15,
            }}>
            <Input
              value={amount}
              placeholder={t('enter_amount')}
              placeholderTextColor={colors.black_color7}
              keyboardType="number-pad"
              maxLength={6}
              returnKeyType="done"
              onChangeText={setAmount}
              inputStyle={styles.amountInput}
              inputContainerStyle={{ borderBottomWidth: 1, borderBottomColor: colors.black_color8, width: '70%', alignSelf: 'center' }}
              leftIcon={<Text style={{ ...Fonts.black22RobotoMedium }}>₹ </Text>}
              cursorColor={Colors.primaryDark}
              
            />

            <TouchableOpacity
              onPress={() => add_money()}
              style={{ color: 'black', backgroundColor: colors.background_theme2, padding: 10, margin: 10, borderRadius: 5 }}
              activeOpacity={0.8}>
              <Text allowFontScaling={false} style={{ color: 'black', fontSize: getFontSize(1.6) }}>{t('add_money')}</Text>
            </TouchableOpacity>

          </View>
          {imageData == '0' && (
            <TouchableOpacity
              style={{
                width: width * 0.95,
                height: width * 0.32,
                alignSelf: 'center',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.black_color,
                marginBottom: 20,
                overflow: 'hidden',
                padding: 5
              }}
              onPress={() => navigation.navigate('walletgstoffer', { data: firstOffer[0]?.recharge_of, data2: firstOffer[0]?.recharge_get })}>
              <ImageBackground
                source={require('../../assets/images/permotional_banner.jpeg')}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="cover">
                <View
                  style={{
                    width: '50%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text allowFontScaling={false}
                    style={{
                      fontSize: 18,
                      color: colors.black_color8,
                      fontFamily: fonts.medium,
                      textAlign: 'center',
                    }}>
                    Get ₹ {firstOffer && (parseFloat(firstOffer[0]?.recharge_get))}.0
                  </Text>
                  <Text allowFontScaling={false}
                    style={{
                      fontSize: 13,
                      color: colors.black_color8,
                      fontFamily: fonts.medium,
                      textAlign: 'center',
                    }}>
                    First Recharge offer{'\n'}Recharge with {'\n'}₹ {firstOffer && parseFloat(firstOffer[0]?.recharge_of)}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {rechargeOfferList &&
              rechargeOfferList.map((item, index) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('WalletGstAmount', { amount: item?.amount, rechargePlanId: item?._id })}
                  key={index}
                  style={{
                    flex: 0,
                    width: '40%',
                    height: width * 0.18,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: Sizes.fixPadding,
                    backgroundColor: colors.background_theme1,
                    marginHorizontal: '5%',
                    marginBottom: '10%',
                    overflow: 'hidden',
                    elevation: 5,
                    shadowColor: Colors.blackLight
                  }}>
                  <View style={styles.box1}>
                    <Text allowFontScaling={false}
                      style={
                        styles.bannerText
                      }>{`Extra ${item?.percentage}%`}</Text>
                  </View>
                  <Text allowFontScaling={false}
                    style={{ ...Fonts.black16RobotoMedium, color: Colors.blackLight }}>
                    ₹ {item?.amount}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>
      </View>


      <View style={{ flex: 0 }}>
        <Text allowFontScaling={false}
          style={{
            fontSize: getFontSize(1.4),
            color: colors.black_color,
            fontFamily: fonts.bold,
            textAlign: 'center',
          }}>
          {t('gst_excluded')}
        </Text>
        <Text allowFontScaling={false}
          style={{
            fontSize: getFontSize(1),
            color: colors.black_color,
            fontFamily: fonts.medium,
            textAlign: 'center',
            width: '95%',
            alignSelf: 'center',
            marginBottom: 10,
          }}>
          {t('for_payment')}
        </Text>
      </View>

    </ImageBackground>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
  rechargeOfferList: state.customer.rechargeOfferList,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);

const styles = StyleSheet.create({
  box: {
    height: 50,
    width: 50,
    backgroundColor: colors.background_theme1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  amountInput: {
    // textAlign: 'center',
    fontSize: getFontSize(1.8),
    width: '70%',
    fontFamily: fonts.medium,
    color: colors.black_color
  },

  box1: {
    width: width * 0.25,
    height: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    position: 'absolute',
    alignItems: 'center',
    transform: [{ rotate: '-50deg' }],
    overflow: 'hidden',
    right: width * 0.18,
    top: width * 0.05,
  },
  bannerText: {
    color: 'white',
    fontFamily: fonts.medium,
    fontSize: getFontSize(1),
    textAlign: 'center',
  },

  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  rowText: {
    fontSize: 14,
    color: colors.black_color7,
    fontFamily: fonts.medium,
  },
});
