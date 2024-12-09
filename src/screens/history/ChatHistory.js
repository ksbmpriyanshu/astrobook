import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import { Colors, Sizes, Fonts } from '../../assets/style';
import { SCREEN_WIDTH } from '../../config/Screen';
import moment from 'moment';
import { secondsToHMS, showNumber } from '../../utils/services';
import { base_url } from '../../config/constants';
import { colors } from '../../config/Constants1';

const ChatHistory = ({ chatHistoryData }) => {

  //console.log("chatHistoryData", chatHistoryData)
  if (chatHistoryData === null || chatHistoryData.length === 0) {
    chatHistoryData = 0;
  }
  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.container}>
        <Text
          style={{
            ...Fonts.black11InterMedium,
            fontSize: 13,
            marginBottom: Sizes.fixPadding * 0.5,
          }}>
          ORDER ID: {item?.transactionId}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: base_url + item?.astrologerId?.profileImage }}
              style={{ width: '100%', height: '100%', borderRadius: 1000 }}
            />
          </View>
          <View style={{ marginLeft: Sizes.fixPadding }}>
            <Text style={{ ...Fonts.primaryLight14RobotoMedium }}>
              {item?.astrologerId?.astrologerName}
            </Text>
            <Text style={{ ...Fonts.gray12RobotoMedium }}>
              {item?.astrologerId?.gender}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: Sizes.fixPadding }}>
          <Text
            style={{ ...Fonts.gray14RobotoRegular, color: Colors.blackLight }}>
            Order Time:{' '}
            {moment(new Date(item?.createdAt)).format('DD MMM YYYY hh:mm A')}
          </Text>
          <Text
            style={{ ...Fonts.gray14RobotoRegular, color: Colors.blackLight }}>
            Duration: {secondsToHMS(item?.durationInSeconds)}
          </Text>
          <Text
            style={{ ...Fonts.gray14RobotoRegular, color: Colors.blackLight }}>
            Chat Price: {showNumber(item?.chatPrice)}/min
          </Text>
          <Text
            style={{ ...Fonts.gray14RobotoRegular, color: Colors.blackLight }}>
            Total Charge: {showNumber(item?.totalChatPrice)}
          </Text>
          <Text
            style={{ ...Fonts.gray14RobotoRegular, color: Colors.blackLight }}>
            Status: {item?.status}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteDark }}>
      {chatHistoryData ?
        <FlatList
          data={chatHistoryData}
          renderItem={renderItem}
          initialNumToRender={5}
          contentContainerStyle={{ padding: Sizes.fixPadding * 1.5 }}
        />
        : <View style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingVertical: 200 }}>
          <Text style={{ display: "flex", alignSelf: "center", justifyContent: "center", color: colors.black_color, fontSize: 15 }}>No Data Available</Text>
        </View>
      }
    </View>
  );
};

const mapStateToProps = state => ({
  chatHistoryData: state.history.chatHistoryData,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(ChatHistory);

const styles = StyleSheet.create({
  container: {
    marginBottom: Sizes.fixPadding * 1.5,
    backgroundColor: Colors.white,
    borderRadius: Sizes.fixPadding * 0.7,
    paddingHorizontal: Sizes.fixPadding * 0.7,
    paddingVertical: Sizes.fixPadding,
  },
  imageContainer: {
    width: SCREEN_WIDTH * 0.16,
    height: SCREEN_WIDTH * 0.16,
    borderRadius: 1000,
    overflow: 'hidden',
  },
});
