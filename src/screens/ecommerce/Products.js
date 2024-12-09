import { View, Text, FlatList, StyleSheet, ImageBackground } from 'react-native'
import React, { useEffect } from 'react'
import { Colors, Sizes, Fonts } from '../../assets/style'
import MyStatusBar from '../../components/MyStatusbar'
import MyHeader from '../../components/MyHeader'
import { TouchableOpacity } from 'react-native'
import { SCREEN_WIDTH } from '../../config/Screen'
import LinearGradient from 'react-native-linear-gradient'
import { showNumber } from '../../utils/services'
import { colors, getFontSize } from '../../config/Constants1'
import * as EcommerceActions from '../../redux/actions/ecommerceActions'
import { connect } from 'react-redux'
import { base_url, img_url } from '../../config/constants'
const Products = ({ navigation, route, productsData, dispatch }) => {
    console.log(productsData)
    const { _id, categoryName } = route?.params

    useEffect(() => {
        dispatch(EcommerceActions.getProducts(_id))
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteDark }}>
            <MyStatusBar backgroundColor={colors.background_theme2} barStyle={'light-content'} />
            <MyHeader title={categoryName ?? 'Astro Mall'} navigation={navigation} />
            <View style={{ flex: 1 }}>
                <FlatList ListHeaderComponent={<>
                    {productsData && categoriesInfo()}
                </>}
                    contentContainerStyle={{ paddingVertical: Sizes.fixPadding * 2 }}
                />
            </View>
        </View>
    )

    function categoriesInfo() {
        const renderItem = ({ item, index }) => {
            return (
                <TouchableOpacity onPress={() => navigation.navigate('productDetails', {productData: item})} activeOpacity={0.8} style={styles.itemContainer}>
                    <ImageBackground
                        style={{ width: '100%', height: '100%' }}
                        source={{ uri: img_url + item?.image }}
                    >
                        <LinearGradient
                            style={{ width: '100%', height: '100%', justifyContent: 'flex-end', padding: Sizes.fixPadding }}
                            colors={['rgba(0, 0, 0, 0.18)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']}
                        >
                            <Text style={{ ...Fonts.white11InterMedium, fontSize: getFontSize(1.6) }}>{item?.productName}</Text>
                            <Text style={{ ...Fonts.white11InterMedium }}>{showNumber(item?.price)} <Text style={{ textDecorationLine: 'line-through', color: '#f28d77' }}>{showNumber(item?.mrp)}</Text></Text>
                        </LinearGradient>
                    </ImageBackground>
                </TouchableOpacity>
            )
        }
        return (
            <FlatList data={productsData} numColumns={2} renderItem={renderItem} />
        )
    }
}

const mapStateToProps = state => ({
    productsData: state.ecommerce.productsData
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Products)

const styles = StyleSheet.create({
    itemContainer: {
        width: SCREEN_WIDTH * 0.4,
        height: SCREEN_WIDTH * 0.6,
        borderRadius: Sizes.fixPadding,
        overflow: 'hidden',
        marginBottom: Sizes.fixPadding * 2,
        marginLeft: SCREEN_WIDTH * 0.065,
        elevation: 5
    }
})