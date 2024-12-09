import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { Colors, Sizes, Fonts } from '../../assets/style'
import MyStatusBar from '../../components/MyStatusbar'
import MyHeader from '../../components/MyHeader'
import Banner from './components/Banner'
import { showNumber } from '../../utils/services'
import * as EcommerceActions from '../../redux/actions/ecommerceActions'
import { connect } from 'react-redux'
import { colors } from '../../config/Constants1'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SCREEN_WIDTH } from '../../config/Screen'
import {useTranslation} from 'react-i18next';

const ProductDetails = ({ route, navigation, dispatch }) => {
    const {t} = useTranslation();
    const productData = route?.params?.productData
    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <MyStatusBar backgroundColor={colors.background_theme2} barStyle={'light-content'} />
            <View style={{ flex: 1 }}>
                <MyHeader title={productData?.productName} navigation={navigation} />
                <FlatList
                    ListHeaderComponent={<>
                        {productData && <Banner data={productData?.bannerImages} />}
                        {productInfo()}
                        {descriptionInfo()}
                    </>}
                />
                {submitInfo()}
            </View>
        </View>
    )

    function submitInfo() {
        const phoneNumber = '8800247824'; 

  const handlePress = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
        return (
            <View>
                <TouchableOpacity style={{backgroundColor:Colors.greenDark,marginBottom:Sizes.fixPadding,paddingVertical: Sizes.fixPadding,justifyContent:'center',alignItems:'center',width:SCREEN_WIDTH * 0.15,borderRadius:100,height:SCREEN_WIDTH * 0.15,position:'absolute',bottom:Sizes.fixPadding * 4,right :Sizes.fixPadding}} onPress={handlePress}>
                <Ionicons name="call" color={colors.white_color} size={Sizes.fixPadding * 2} />
                </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => dispatch(EcommerceActions.addToCart(productData?._id))} style={{ backgroundColor: colors.background_theme2, paddingVertical: Sizes.fixPadding }}>
                <Text style={{ ...Fonts.black16RobotoMedium, color: Colors.white, textAlign: 'center' }}> {t('add_cart')}</Text>
            </TouchableOpacity>
            </View>
        )
    }

    function descriptionInfo() {
        return (
            <View style={{ margin: Sizes.fixPadding }}>
                <Text style={{ ...Fonts.black14InterMedium, color: Colors.blackLight }}>{productData?.description}</Text>
            </View>
        )
    }

    function productInfo() {
        const getPercentage = () => {
            return 100 - (productData?.price * 100 / productData?.mrp)
        }
        return (
            <View style={{ padding: Sizes.fixPadding, backgroundColor: Colors.whiteDark }}>
                <Text style={{ ...Fonts.black22RobotoMedium }}>{productData?.productName}</Text>
                <Text style={{ ...Fonts.black16RobotoMedium, color: Colors.greenDark }}>{showNumber(productData?.price)}  <Text style={{ textDecorationLine: 'line-through', color: Colors.red_a }}>{showNumber(productData?.mrp)}</Text></Text>
                <Text style={{ ...Fonts.black16RobotoMedium, color: Colors.primaryDark }}>{parseFloat(getPercentage()).toFixed(2)}% OFF</Text>
            </View>
        )
    }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails)