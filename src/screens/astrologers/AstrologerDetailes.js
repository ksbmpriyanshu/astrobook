import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ImageBackground,
  // Modal,
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import MyHeader from '../../components/MyHeader';
import {
  colors,
  fonts,
  getFontSize,
} from '../../config/Constants1';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useState } from 'react';
import MyLoader from '../../components/MyLoader';
import { connect } from 'react-redux';
const { width } = Dimensions.get('screen');
import { useTranslation } from 'react-i18next';
import * as AstrologerActions from '../../redux/actions/AstrologerActions';
import { base_url, img_url } from '../../config/constants';
import { Colors, Sizes, Fonts } from '../../assets/style';
import * as ChatActions from '../../redux/actions/ChatActions';
import { showNumber, showToastMessage } from '../../utils/services';
import { SCREEN_WIDTH } from '../../config/Screen';
import Stars from 'react-native-stars';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AstrologerDetailes = ({
  route,
  navigation,
  dispatch,
  reviewData,
  astroData,
  isFollow
}) => {
  const { t } = useTranslation();
  const purpose = route.params.type;
  const [isLoading, setIsLoading] = useState(false);

  const [state, setState] = useState({
    seeMore: false,
    seeMore1: false
  });
  console.log(astroData, 'IMage')

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <MyHeader
          title={t('astrologer_details')}
          navigation={navigation}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);

  useEffect(() => {
    dispatch(AstrologerActions.getAstrologerData(route?.params?._id));
    return () => {
      dispatch(AstrologerActions.setAstrologerReviewData(null));
    }
  }, [dispatch]);

  const updateState = data => {
    setState(prevState => {
      const newData = { ...prevState, ...data }
      return newData
    })
  }

  const { seeMore, seeMore1 } = state
  console.log(seeMore1, 'muskan')
  return (
    <View style={{ flex: 1, backgroundColor: Colors.grayLight }}>
      <MyLoader isVisible={isLoading} />
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={
            <>
              {astroData && astroDetailInfo()}
              {astroData && chatCallPriceInfo()}
              {astroData?.nextOnline?.date && nextOnlineInfo()}
              {astroData && aboutInfo()}
              {/* {astroData && skillsInfo()} */}
              {astroData && mainExpertiesInfo()}
              {astroData && remediesInfo()}
              {reviewData && ratingInfo()}
              {reviewData && reviewInfo()}
            </>
          }
        />
        {chatCallButtonInfo()}
      </View>
    </View>
  );

  function reviewInfo() {
    const noreviewFound = () => {
      return (
        <View>
          <Text style={{ color: Colors.grayDarkA, textAlign: 'center' }}>No Review Found</Text>
        </View>
      )
    }
    const renderItem = ({ item }) => {
      return (
        <View
          style={{
            borderWidth: 1,
            borderRadius: 10,
            borderColor: Colors.gray,
            marginBottom: 10,
            padding: Sizes.fixPadding,
            marginHorizontal: Sizes.fixPadding
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  width: SCREEN_WIDTH * 0.12,
                  height: SCREEN_WIDTH * 0.12,
                  borderRadius: 100,
                  overflow: 'hidden',
                }}>
                <Image
                  source={{ uri: img_url + item?.customer?.image }}
                  resizeMode="cover"
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ ...Fonts.black14InterMedium }}>
                  {item?.customer?.customerName}
                </Text>
                <Text style={{ ...Fonts.gray14RobotoRegular }}>
                  {moment(item?.createdAt).format('DD MMM YYYY')}
                </Text>
              </View>
            </View>
            <View>
              <Stars
                default={parseFloat(item?.ratings)}
                disabled
                count={5}
                half={true}
                starSize={14}
                fullStar={
                  <Ionicons
                    name={'star'}
                    size={14}
                    color={Colors.primaryLight}
                  />
                }
                emptyStar={
                  <Ionicons
                    name={'star-outline'}
                    size={14}
                    color={Colors.primaryLight}
                  />
                }
                halfStar={
                  <Ionicons
                    size={14}
                    name={'star-half'}
                    style={{ color: Colors.primaryLight }}
                  />
                }
              />
            </View>
          </View>
          <View style={{ marginTop: 10 }}>

            {item?.comments === '' ? (<Text style={{ ...Fonts.gray12RobotoMedium }}>
              No Comments
            </Text>) : (<Text style={{ ...Fonts.black12RobotoRegular }}>
              {item?.comments}
            </Text>)}
          </View>
        </View>
      );
    };
    return (
      <View
        style={{
          // paddingHorizontal: Sizes.fixPadding * 1.5,
          // paddingTop: Sizes.fixPadding * 1.5,
          backgroundColor: Colors.white,
        }}>

        <View style={{ marginTop: Sizes.fixPadding * 1.5, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: Colors.grayMedium, paddingBottom: Sizes.fixPadding }}>
          <Text style={{ ...Fonts.primaryDark18RobotoMedium }}>
          {t('customer_revie')}
          </Text>
        </View>
        <View style={{ marginTop: Sizes.fixPadding }}>
          <FlatList
            data={reviewData?.reviews}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={noreviewFound()}
          />
        </View>
      </View>
    );
  }


  function ratingInfo() {
    const getFillColor = (percentage) => {
      return percentage > 0 ? Colors.primaryLight : Colors.grayLight;
    };

    const getStarColor = (percentage) => {
      return percentage > 0 ? Colors.primaryLight : Colors.gray;
    };

    return (
      <View
        style={{
          // margin: Sizes.fixPadding * 1.5,
          backgroundColor: Colors.white,
        }}>
        <View style={{ padding: Sizes.fixPadding * 0.4, backgroundColor: Colors.grayLight, marginTop: Sizes.fixPadding * 1.5 }}>
        </View>
        <View style={{ marginTop: Sizes.fixPadding * 1.5, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: Colors.grayMedium, paddingBottom: Sizes.fixPadding }}>
          <Text style={{ ...Fonts.primaryDark18RobotoMedium }}>
          {t('Rating_reviews')}<Text style={{ color: Colors.black }}>({reviewData?.summary?.totalReview})</Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: Sizes.fixPadding * 1.5,
          }}>
          <Stars
            default={reviewData?.summary?.averageRating ?? astroData?.rating}
            disabled
            count={5}
            half={true}
            starSize={20}
            fullStar={
              <Ionicons name={'star'} size={20} color={getStarColor(reviewData?.summary?.averageRating ?? 0)} />
            }
            emptyStar={
              <Ionicons
                name={'star-outline'}
                size={20}
                color={getStarColor(reviewData?.summary?.averageRating ?? 0)}
              />
            }
            halfStar={
              <Ionicons
                size={20}
                name={'star-half'}
                style={{ color: getStarColor(reviewData?.summary?.averageRating ?? 0) }}
              />
            }
          />
        </View>
        {['five', 'four', 'three', 'two', 'one'].map((rating, index) => {
          const ratingPercentage = reviewData?.summary[`${rating}Percentage`] ?? 0;
          const ratingCount = reviewData?.summary[`${rating}Rating`] ?? 0;
          const starCount = 5 - index;

          return (
            <View
              key={rating}
              style={{
                flexDirection: 'row',
                marginVertical: 5,
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: Sizes.fixPadding * 1.5,

              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ ...Fonts.black14InterMedium, marginRight: 5 }}>
                    {starCount}
                  </Text>
                  <Ionicons name={'star'} size={14} color={getStarColor(ratingPercentage)} />
                </View>
                <View
                  style={{
                    backgroundColor: Colors.grayLight,
                    width: SCREEN_WIDTH * 0.7,
                    height: SCREEN_WIDTH * 0.04,
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginLeft: 10,
                  }}>
                  <View
                    style={{
                      backgroundColor: getFillColor(ratingPercentage),
                      width: `${ratingPercentage}%`,
                      height: '100%',
                    }}></View>
                </View>
              </View>
              <Text style={{ ...Fonts.gray14RobotoMedium, marginLeft: 10 }}>
                {ratingCount}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }


  function mainExpertiesInfo() {
    return (
      <View style={{ backgroundColor: Colors.white, }}>
        <View style={{ padding: Sizes.fixPadding * 0.4, backgroundColor: Colors.grayLight, marginTop: Sizes.fixPadding * 1.5 }}>
        </View>
        <View style={{ marginTop: Sizes.fixPadding * 1.5, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: Colors.grayMedium, paddingBottom: Sizes.fixPadding }}>
          <Text style={{ ...Fonts.primaryDark18RobotoMedium, }}>{t('main_expert')}</Text>
        </View>
        <Text
          textBreakStrategy='highQuality'
          style={{ ...Fonts.blackLight14RobotoRegular, marginTop: Sizes.fixPadding, paddingHorizontal: Sizes.fixPadding * 1.5, }}
        >{astroData?.mainExpertise && astroData?.mainExpertise.map(item => item?.mainExpertise).join(', ')}</Text>
      </View>
    )
  }

  // function remediesInfo() {

  //   return (
  //     <View style={{  backgroundColor: Colors.white, }}>
  //       <View style={{padding:Sizes.fixPadding * 0.4,backgroundColor:Colors.grayLight,marginTop:Sizes.fixPadding * 1.5}}>
  //       </View>
  //          <View style={{marginTop:Sizes.fixPadding * 1.5,justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderColor:Colors.grayMedium,}}>
  //       <Text style={{ ...Fonts.primaryDark18RobotoMedium, marginBottom: Sizes.fixPadding }}>Remedies</Text>
  //       </View>
  //       <View style={{flexDirection:'row',alignItems:'center',marginTop:Sizes.fixPadding,paddingHorizontal: Sizes.fixPadding * 1.5, }}>

  //       <Text
  //         textBreakStrategy='highQuality'
  //         style={{ ...Fonts.blackLight14RobotoRegular, }}
  //         >{astroData?.remedies && astroData?.remedies.map(item => item?.title).join(', ')}</Text>
  //        {/* {astroData?.remedies ? (<Text
  //         textBreakStrategy='highQuality'
  //         style={{ ...Fonts.blackLight14RobotoRegular, padding: Sizes.fixPadding * 1.5,}}
  //         >{astroData?.remedies?.description.length > 100 && !seeMore ? astroData?.remedies?.description.slice(0, 100) : astroData?.remedies?.description}<Text onPress={() => updateState({ seeMore: !seeMore })} style={{ color: Colors.primaryLight }}> {astroData?.remedies?.description.length > 350 ? seeMore ? 'See less...' : 'See more...' : ''}</Text></Text>) : <Text style={{ textAlign: 'center', color: Colors.grayA }}>No Description Found </Text>} */}
  //      <Text>- </Text>
  //        <Text
  //         textBreakStrategy='highQuality'
  //         style={{ ...Fonts.blackLight14RobotoRegular, }}
  //         >{astroData?.remedies && astroData?.remedies.map(item => item?.description).join(', ')}</Text>
  //         </View>
  //     </View>
  //   )
  // }

  function remediesInfo() {
    const renderItem = ({ item }) => {
      return (
        <View style={{ backgroundColor: '#F6F5F5', width: SCREEN_WIDTH / 2 - Sizes.fixPadding, marginHorizontal: Sizes.fixPadding, borderRadius: 10, marginTop: Sizes.fixPadding }}>
          <Text style={{ ...Fonts.primaryDark18RobotoMedium, marginTop: Sizes.fixPadding, textAlign: 'center' }}>{item?.title}</Text>
          <View style={{ paddingVertical: Sizes.fixPadding * 0.3, backgroundColor: Colors.white }}>

          </View>

          {item?.description ? (<Text
            textBreakStrategy='highQuality'
            style={{ ...Fonts.blackLight14RobotoRegular, padding: Sizes.fixPadding * 1.5, }}
          >{item?.description?.length > 10 && !seeMore ? item?.description.slice(0, 90) : item?.description}<Text onPress={() => updateState({ seeMore: !seeMore })} style={{ color: Colors.primaryLight }}> {item?.description.length > 10 ? seeMore ? 'Read less...' : 'Read more...' : ''}</Text></Text>) : <Text style={{ textAlign: 'center', color: Colors.grayA }}>No Description Found </Text>}
        </View>
      )
    }
    return (
      <View style={{ backgroundColor: Colors.white }}>
        <View style={{ padding: Sizes.fixPadding * 0.4, backgroundColor: Colors.grayLight, marginTop: Sizes.fixPadding * 1.5 }}>
        </View>
        <View style={{ marginTop: Sizes.fixPadding * 1.5, borderBottomWidth: 1, borderColor: Colors.grayMedium, }}>
          <Text style={{ ...Fonts.primaryDark18RobotoMedium, marginBottom: Sizes.fixPadding, textAlign: 'center' }}>{t('remedies')}</Text>
        </View>
        <FlatList
          data={astroData?.remedies}
          renderItem={renderItem}

          horizontal
        />
      </View>
    )
  }

  function skillsInfo() {
    return (
      <View style={{ padding: Sizes.fixPadding * 1.5, backgroundColor: Colors.white, }}>
        <Text style={{ ...Fonts.primaryDark18RobotoMedium, marginBottom: Sizes.fixPadding }}>Skills</Text>
        <Text
          textBreakStrategy='highQuality'
          style={{ ...Fonts.blackLight14RobotoRegular, }}
        >{astroData?.skill && astroData?.skill.map(item => item?.skill).join(', ')}</Text>
      </View>
    )
  }

  function aboutInfo() {
    console.log(astroData?.long_bio, 'longbio')
    return (
      <View style={{ backgroundColor: Colors.white, }}>
        <View style={{ padding: Sizes.fixPadding * 0.4, backgroundColor: Colors.grayLight, marginTop: Sizes.fixPadding * 1.5 }}>
        </View>
        <View style={{ marginTop: Sizes.fixPadding * 0.7, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: Colors.grayMedium, paddingBottom: Sizes.fixPadding * 0.5 }}>
          <Text style={{ ...Fonts.primaryDark18RobotoMedium, color: Colors.primaryLight, paddingVertical: Sizes.fixPadding * 0.2 }}> {t('about')}</Text>
        </View>
        {astroData?.long_bio ? (<Text
          textBreakStrategy='highQuality'
          style={{ ...Fonts.blackLight14RobotoRegular, padding: Sizes.fixPadding * 1.5, }}
        >{astroData?.long_bio.length > 350 && !seeMore1 ? astroData?.long_bio.slice(0, 350) : astroData?.long_bio}<Text onPress={() => updateState({ seeMore1: !seeMore1 })} style={{ color: Colors.primaryLight }}> {astroData?.long_bio.length > 350 ? seeMore1 ? 'Read less ..' : 'Read more ..' : ''}</Text></Text>) : <Text style={{ textAlign: 'center', color: Colors.grayA }}>No Description Found </Text>}

      </View>
    )
  }

  function nextOnlineInfo() {
    return <View style={{ padding: Sizes.fixPadding * 1.5, backgroundColor: '#fff4e8', marginBottom: Sizes.fixPadding }}>
      <Text style={{ ...Fonts.black18RobotoMedium, marginBottom: Sizes.fixPadding * 0.5 }}>Next Online Time</Text>
      <View style={styles.servicesContainer}>
        <Text style={styles.servicesCol1}>{`${moment(astroData?.nextOnline?.data).format('DD MMMM YYYY')} ${moment(astroData?.nextOnline?.time).format('hh:mm A')}`}</Text>
      </View>
    </View>;
  }

  function chatCallPriceInfo() {
    const chatmultiply2 = (astroData?.chat_price + parseFloat(astroData?.commission_chat_price)) + (astroData?.chat_price + parseFloat(astroData?.commission_chat_price))
    const callmultiply2 = (astroData?.call_price + parseFloat(astroData?.commission_call_price)) + (astroData?.call_price + parseFloat(astroData?.commission_call_price))
    const videocall2 = (astroData?.normal_video_call_price + parseFloat(astroData?.commission_normal_video_call_price)) + (astroData?.normal_video_call_price + parseFloat(astroData?.commission_normal_video_call_price))

    const onChatNow = () => {

      if (astroData?.chat_status != 'online') {
        showToastMessage({ message: `Astrologer is ${astroData?.chat_status}` })
        return
      }
      const payload = {
        type: 'chat',
        astrologerName: astroData?.astrologerName,
        language: astroData?.language,
        astrologerId: astroData?._id,
        chatPrice:
          parseFloat(astroData?.chat_price) +
          parseFloat(astroData?.commission_chat_price),
        astrostatus: astroData?.chat_status
      };
      dispatch(ChatActions.onChatNow(payload));


    };
    const onCallNow = () => {

      if (astroData?.call_status != 'online') {
        showToastMessage({ message: ` Astrologer is ${astroData?.call_status}` })
        return
      }
      const payload = {
        type: 'call',
        astrologerName: astroData?.astrologerName,
        language: astroData?.language,
        astrologerId: astroData?._id,
        callPrice:
          parseFloat(astroData?.call_price) +
          parseFloat(astroData?.commission_call_price),
        astrostatus: astroData?.call_status
      };
      dispatch(ChatActions.onChatNow(payload));

    };

    const onVideoCallNow = () => {
      if (astroData?.video_call_status != 'online') {
        showToastMessage({ message: `Astrologer is ${astroData?.video_call_status}` })
        return
      }
      const payload = {
        type: 'video call',
        astrologerName: astroData?.astrologerName,
        language: astroData?.language,
        astrologerId: astroData?._id,
        callPrice:
          parseFloat(astroData?.normal_video_call_price) +
          parseFloat(astroData?.commission_normal_video_call_price),
        astrostatus: astroData?.video_call_status
      };
      dispatch(ChatActions.onChatNow(payload));
    }

    return <View style={{ backgroundColor: Colors.white, }}>
      <View style={{ padding: Sizes.fixPadding * 0.5, backgroundColor: Colors.grayLight }}>
      </View>
      <View style={{ marginVertical: Sizes.fixPadding * 1.5, borderBottomWidth: 1, borderColor: Colors.grayMedium }}>
        <Text style={{ ...Fonts.primaryDark18RobotoMedium, marginBottom: Sizes.fixPadding * 0.5, color: Colors.primaryLight, textAlign: 'center' }}>{t('consultent_charge')}</Text>
      </View>

      <View style={{ flexDirection: 'row', marginHorizontal: Sizes.fixPadding }}>
        <LinearGradient
          colors={['#F87956', '#FF452C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: '30%', paddingVertical: Sizes.fixPadding * 0.6, borderRadius: 10 }}
        >
          <TouchableOpacity
            onPress={() => onCallNow()}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

              <View style={{
                height: SCREEN_WIDTH * 0.08, width: SCREEN_WIDTH * 0.08, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white, marginLeft: Sizes.fixPadding * 0.6
              }}>
                <Ionicons
                  name={'call'}
                  size={17}
                  color={Colors.primaryLight}
                />
              </View>
              <View style={{ backgroundColor: colors.white_color, paddingHorizontal: Sizes.fixPadding * 1.5, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
                <Text style={{ ...Fonts.black14InterMedium, color: Colors.primaryLight }}>Call</Text>
              </View>

            </View>
            <View style={{ marginVertical: Sizes.fixPadding }}>
              <Text style={styles.servicesCol2}>{showNumber(astroData?.call_price + parseFloat(astroData?.commission_call_price))}/min</Text>
              <Text style={styles.servicesCol3}>{showNumber(callmultiply2)} /min</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          colors={['#F87956', '#FF452C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: '30%', paddingVertical: Sizes.fixPadding * 0.6, borderRadius: 10, marginHorizontal: Sizes.fixPadding * 1.5 }}
        >
          <TouchableOpacity onPress={() => onChatNow()} >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

              <View style={{
                height: SCREEN_WIDTH * 0.08, width: SCREEN_WIDTH * 0.08, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white, marginLeft: Sizes.fixPadding * 0.6
              }}>
                <Ionicons
                  name={'chatbubbles-outline'}
                  size={17}
                  color={Colors.primaryLight}
                />
              </View>
              <View style={{ backgroundColor: colors.white_color, paddingHorizontal: Sizes.fixPadding * 1.2, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
                <Text style={{ ...Fonts.black14InterMedium, color: Colors.primaryLight }}>Chat</Text>
              </View>

            </View>
            <View style={{ marginVertical: Sizes.fixPadding }}>
              <Text style={styles.servicesCol2}>{showNumber(astroData?.chat_price + parseFloat(astroData?.commission_chat_price))}/min</Text>
              <Text style={styles.servicesCol3}>{showNumber(chatmultiply2)} /min</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          colors={['#F87956', '#FF452C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: '30%', paddingVertical: Sizes.fixPadding * 0.6, borderRadius: 10 }}
        >
          <TouchableOpacity onPress={onVideoCallNow} >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>



              <View style={{
                height: SCREEN_WIDTH * 0.08, width: SCREEN_WIDTH * 0.08, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white, marginLeft: Sizes.fixPadding * 0.6
              }}>
                <Ionicons
                  name={'videocam'}
                  size={17}
                  color={Colors.primaryLight}
                />
              </View>
              <View style={{ backgroundColor: colors.white_color, paddingHorizontal: Sizes.fixPadding * 1, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
                <Text style={{ ...Fonts.black14InterMedium, color: Colors.primaryLight }}>Video</Text>
              </View>

            </View>
            <View style={{ marginVertical: Sizes.fixPadding }}>
              <Text style={styles.servicesCol2}>{showNumber(astroData?.normal_video_call_price + parseFloat(astroData?.commission_normal_video_call_price))}/min</Text>
              <Text style={styles.servicesCol3}>{showNumber(videocall2)} /min</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>

    </View>;
  }

  function astroDetailInfo() {
    return (
      <ImageBackground
        source={require('../../assets/images/astrologer_background.png')}
        style={{
          flex: 0,
          paddingHorizontal: 15,
          paddingVertical: 15,
        }}>

        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            position: 'relative',
            bottom: -20,
            zIndex: 1,
          }}>
        </View>
        <View
          style={{
            flex: 0,
            width: '80%',
            alignSelf: 'center',

            backgroundColor: 'rgba(0.741, 0.741, 0.741, 0.451)',
            // backgroundColor:'red',
            borderRadius: 20,
            paddingVertical: width * 0.12,
            marginTop: 10,
          }}>

          <Text style={{ ...Fonts.white16RobotoMedium, position: 'absolute', top: 10, left: 10 }}>{astroData?.astrologerName}</Text>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
            <Image
              source={{ uri: base_url + astroData?.profileImage }}
              style={{
                width: width * 0.25,
                height: width * 0.25,
                borderWidth: 2,
                borderRadius: (width * 0.25) / 2,
                borderColor: colors.background_theme2,
                position: 'relative',
                left: (-width * 0.25) / 2,
                marginLeft: 10,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
              }}
            />
            <View
              style={{
                flex: 1,
                position: 'relative',
                justifyContent: 'center',
                left: (-width * 0.25) / 2.5,
              }}>

              <View style={{ flex: 0, flexDirection: 'row', marginBottom: 2 }}>
                <Ionicons
                  name="people-circle-sharp"
                  color={colors.white_color}
                  size={15}
                />
                {/* <Text
                  allowFontScaling={false}
                  style={{
                    width: '100%',
                    marginLeft: 5,
                    fontSize: getFontSize(1.4),
                    color: colors.white_color,
                    fontFamily: fonts.medium,
                  }}>
                  {astroData?.expertise && astroData?.expertise.map(item => item.expertise).join(', ')}
                </Text> */}
                <Text
                  allowFontScaling={false}
                  style={{
                    // width: '150%',
                    flex: 1,
                    // marginLeft: 5,
                    fontSize: getFontSize(1.4),
                    color: colors.white_color,
                    fontFamily: fonts.medium,
                    // borderWidth:2,
                    alignItems: 'center',
                    // right: 5
                  }}>{astroData?.skill && astroData?.skill.map(item => item?.skill).join(',')}</Text>
              </View>

              <View style={{ flex: 0, flexDirection: 'row', marginBottom: 2 }}>
                <MaterialCommunityIcons
                  name="google-translate"
                  color={colors.white_color}
                  size={15}
                />
                <Text
                  allowFontScaling={false}
                  style={{
                    width: '100%',
                    marginLeft: 5,
                    fontSize: getFontSize(1.4),
                    color: colors.white_color,
                    fontFamily: fonts.medium,
                  }}>
                  {[...astroData?.language].join(',')}
                </Text>
              </View>

              <View style={{ flex: 0, flexDirection: 'row', marginBottom: 2 }}>
                <MaterialIcons
                  name="explicit"
                  color={colors.white_color}
                  size={15}
                />
                <Text
                  allowFontScaling={false}
                  style={{
                    width: '100%',
                    marginLeft: 5,
                    fontSize: getFontSize(1.3),
                    color: colors.white_color,
                    fontFamily: fonts.medium,
                  }}>
                  {`${t('experience')}: ${astroData?.experience}-Years`}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            position: 'relative',
            bottom: 12,
          }}>
          <TouchableOpacity
            onPress={() => dispatch(AstrologerActions.onFollowUnfollowAstrologer(route?.params?._id))}
            style={{
              flex: 0,
              width: '30%',
              paddingVertical: 2,
              backgroundColor: colors.background_theme2,
              borderRadius: 20,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: getFontSize(1.3),
                color: colors.black_color,
                fontFamily: fonts.medium,
                textAlign: 'center',
              }}>
              {isFollow
                ? `${t('following')}`
                : `${t('follow')}`}
              {/* {astroData?.follower_count} */}
            </Text>
          </TouchableOpacity>
          {/* {astroData?.offer_category &&
            astroData.offer_category.split(',').includes('2') && (
              <TouchableOpacity
                style={{
                  flex: 0,
                  width: '30%',
                  paddingVertical: 2,
                  backgroundColor: colors.background_theme2,
                  borderRadius: 20,
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: getFontSize(1.3),
                    color: colors.black_color,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  {t('special_offer')}
                </Text>
              </TouchableOpacity>
            )} */}
        </View>
      </ImageBackground>
    );
  }

  function chatCallButtonInfo() {
    const onChatNow = () => {

      if (astroData?.chat_status != 'online') {
        showToastMessage({ message: `Astrologer is ${astroData?.chat_status}` })
        return
      }
      const payload = {
        type: 'chat',
        astrologerName: astroData?.astrologerName,
        language: astroData?.language,
        astrologerId: astroData?._id,
        chatPrice:
          parseFloat(astroData?.chat_price) +
          parseFloat(astroData?.commission_chat_price),
        astrostatus: astroData?.chat_status
      };
      dispatch(ChatActions.onChatNow(payload));


    };
    const onCallNow = () => {

      if (astroData?.call_status != 'online') {
        showToastMessage({ message: ` Astrologer is ${astroData?.call_status}` })
        return
      }
      const payload = {
        type: 'call',
        astrologerName: astroData?.astrologerName,
        language: astroData?.language,
        astrologerId: astroData?._id,
        callPrice:
          parseFloat(astroData?.call_price) +
          parseFloat(astroData?.commission_call_price),
        astrostatus: astroData?.call_status
      };
      dispatch(ChatActions.onChatNow(payload));

    };

    const onVideoCallNow = () => {
      if (astroData?.video_call_status != 'online') {
        showToastMessage({ message: `Astrologer is ${astroData?.video_call_status}` })
        return
      }
      const payload = {
        type: 'video call',
        astrologerName: astroData?.astrologerName,
        language: astroData?.language,
        astrologerId: astroData?._id,
        callPrice:
          parseFloat(astroData?.normal_video_call_price) +
          parseFloat(astroData?.commission_normal_video_call_price),
        astrostatus: astroData?.video_call_status
      };
      dispatch(ChatActions.onChatNow(payload));
    }
    const comingsoon = () => {
      showToastMessage({ message: 'Feature Coming Soon' })
    }

    const getChatColor = (status) => {
      switch (status) {
        case 'online':
          return Colors.primaryLight;
        case 'offline':
          return Colors.grayA;
        case 'busy':
          return Colors.orange_light;
        default:
          return Colors.primaryLight;
      }
    }

    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-around',
          backgroundColor: "#fbfdff",
          paddingVertical: Sizes.fixPadding,
          paddingHorizontal: 20,
          elevation: 20,
          shadowRadius: 10,
          shadowColor: '#757d85',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>


          {/* Call Now Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onCallNow()}
            style={{
              paddingVertical: Sizes.fixPadding,
              backgroundColor: '#ffffff', // White background for consistency
              borderWidth: 1,
              borderColor: '#fff',
              width: '30%',
              borderRadius: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 6,
              alignItems: 'center', // Center the content inside the button
              justifyContent: 'center', // Center vertically
              paddingHorizontal: 10, // Add padding for spacing
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}
          >
            <FontAwesome name="phone" size={20} color="#E15602" />
            <Text style={{ fontSize: 18, textAlign: 'center', color: '#E15602', fontWeight: '800', fontFamily: 'sans-serif', marginLeft: 5 }}>
              Call
            </Text>
          </TouchableOpacity>

          {/* Chat Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onChatNow()}
            style={{
              paddingVertical: Sizes.fixPadding,
              backgroundColor: '#ffffff', // White button background
              borderWidth: 1,
              borderColor: '#fff', // Border color for all buttons
              width: '30%',
              borderRadius: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 6, // Elevated shadow effect for Android
              alignItems: 'center', // Center the content inside the button
              justifyContent: 'center', // Center vertically
              paddingHorizontal: 10, // Add padding for spacing
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}
          >
            <FontAwesome name="comments" size={20} color="#E15602" />
            <Text style={{ fontSize: 18, textAlign: 'center', color: '#E15602', fontWeight: '800', fontFamily: 'sans-serif', marginLeft: 5 }}>
              Chat
            </Text>
          </TouchableOpacity>

          {/* Video Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onVideoCallNow}
            style={{
              paddingVertical: Sizes.fixPadding,
              backgroundColor: '#ffffff',
              borderWidth: 1,
              borderColor: '#fff',
              width: '30%',
              borderRadius: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 6,
              alignItems: 'center', // Center the content inside the button
              justifyContent: 'center', // Center vertically
              paddingHorizontal: 10, // Add padding for spacing
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}
          >
            <FontAwesome name="video-camera" size={20} color="#E15602" />
            <Text style={{ textAlign: 'center', color: '#E15602', fontWeight: '800', fontFamily: 'sans-serif', marginLeft: 5, fontSize: 18 }}>
              Video
            </Text>
          </TouchableOpacity>
        </View>
      </View>




    );
  }
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
  astroData: state.astrologer.astroData,
  reviewData: state.astrologer.reviewData,
  isFollow: state.astrologer.isFollow
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(AstrologerDetailes);

const styles = StyleSheet.create({
  servicesContainer: {
    flexDirection: 'column',
    marginBottom: Sizes.fixPadding * 0.5
  },
  servicesCol1: {
    ...Fonts.black14InterMedium,
    flex: 0.6
  },
  servicesCol2: {

    fontWeight: 'bold',
    fontSize: 14,
    flex: 0.4,
    color: colors.white_color,
    textAlign: 'center'

  },
  servicesCol3: {
    color: colors.white_color,
    fontSize: 12,
    flex: 0.4,
    textDecorationLine: 'line-through',
    textAlign: 'center'
  }
})  
