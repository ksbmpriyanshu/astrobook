import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import MyHeader from '../../components/MyHeader';
import {
  accept_chat,
  api_callintake,
  api_callintakesubmit,
  api_getastrochatstatus,
  api_url,
  base_url,
  colors,
  fonts,
  kundli_get_kundli,
  user_chat_in,
  api2_create_kundali,
  create_kundali_chat,
  getFontSize,
  update_astro_chat,
} from '../../config/Constants1';
import DropDownPicker from 'react-native-dropdown-picker';
import { Picker, PickerIOS } from '@react-native-picker/picker';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import axios from 'axios';
import { connect } from 'react-redux';
import MyLoader from '../../components/MyLoader';
import database from '@react-native-firebase/database';
import { CommonActions } from '@react-navigation/native';
import { warnign_toast } from '../../components/MyToastMessage';
const { width, height } = Dimensions.get('screen');
import { useTranslation } from 'react-i18next';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Colors, Sizes, Fonts } from '../../assets/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SCREEN_HEIGHT } from '../../config/Screen';
import { Modal } from 'react-native-paper';
import * as ChatActions from '../../redux/actions/ChatActions';
import { showToastMessage } from '../../utils/services';
import * as SettingActions from '../../redux/actions/SettingActions'
import { changeLanguage } from 'i18next';
import ConnectingModal from './components/ConnectingModal';
import { KeyboardAvoidingView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ChatIntakeForm = ({
  route,
  dispatch,
  navigation,
  linkedProfileData,
  customerData,
  locationData
}) => {
  const { t } = useTranslation();
  const astroData = route.params;
  const [dateVisible, setDateVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  console.log(route.params?.astrostatus, 'price data')

  const [state, setState] = useState({
    newProfile: false,
    selectedProfile: null,
    firstName: '',
    lastName: '',
    gender: 'male',
    occupation: '',
    question: '',
    profilesBottomSheetVisible: false,
    maritalStatus: null,
    modalVisible: false,
    description: '',

  });
 console.log(locationData?.address,'adress data')
  useEffect(() => {
    dispatch(ChatActions.getMyLinkedProfile());
  }, [dispatch]);

  const updateState = data => {
    setState(prevState => {
      const newData = { ...prevState, ...data };
      return newData;
    });
  };

  const resetState = () => {
    updateState({
      newProfile: false,
      selectedProfile: null,
      firstName: '',
      lastName: '',
      gender: 'male',
      occupation: '',
      question: '',
      profilesBottomSheetVisible: false,
      maritalStatus: null,
      modalVisible: false,
      date: null,
      time: null,
      description: ''
    })
    dispatch(SettingActions.setLocationData(null))
  }
  const modaldelete = () => {
    return (
      setModalVisible1(false)
    )
  }
  const {
    newProfile,
    firstName,
    lastName,
    gender,
    profilesBottomSheetVisible,
    maritalStatus,
    selectedProfile,
    modalVisible,
    occupation,
    time,
    date,
    description
  } = state;
  console.log(selectedProfile, 'chatdata')


  const handle_date = (event, selectedDate) => {
    if (event.type == 'set') {
      const currentDate = selectedDate || date;
      updateState({ date: currentDate });
    }
    setDateVisible(false);

  };



  const handle_time = (event, selectedDate) => {
    if (event.type == 'set') {
      const currentDate = selectedDate || time;
      updateState({ time: currentDate });
    }
    setTimeVisible(false);

  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.black_color1,
      }}>
      {headerInfo()}
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <FlatList
            ListHeaderComponent={
              <>
                {newProfileInfo()}
                {firstNameInfo()}
                {lastNameInfo()}
                {genderInfo()}
                {dobInfo()}
                {placeOfBirthInfo()}
                {maritalStatusInfo()}
                {descriptionInfo()}
              </>
            }
            style={{ height: SCREEN_HEIGHT * 0.8 }}
          />
          {startChatInfo()}
        </KeyboardAvoidingView>
        <ConnectingModal visible={modalVisible1} onClose={() => setModalVisible1(false)} astroData={route.params?.astrostatus} />
        {dateVisible && (
          <DateTimePicker
            value={date instanceof Date ? date : new Date()}
            mode="date"
            onChange={handle_date}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 1, 1)}
            display="spinner"
          />
        )}
        {timeVisible && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            display="spinner"
            is24Hour={false}
            onChange={handle_time}
          />
        )}
      </View>

      {startChatModalInfo()}
      {linkedProfileInfo()}
    </View>
  );

  function linkedProfileInfo() {
    const on_select = () => {
      if (selectedProfile != null) {
        updateState({ time: selectedProfile?.timeOfBirth });
        updateState({ date: selectedProfile?.dateOfBirth });

        dispatch(
          SettingActions.setLocationData({
            address: selectedProfile?.placeOfBirth,
            lat: selectedProfile?.latitude,
            lon: selectedProfile?.longitude,
          }),
        );
        updateState({
          firstName: selectedProfile?.firstName,
          lastName: selectedProfile?.lastName,
          occupation: selectedProfile?.topic_of_concern,
          profilesBottomSheetVisible: false,
          newProfile: true,
          gender: selectedProfile?.gender,
          maritalStatus: selectedProfile?.maritalStatus,
          description: selectedProfile?.description
        });
      } else {
        showToastMessage({ message: 'Please select a profile' });
      }
    };

    const renderItem = ({ item, index }) => {
      console.log(item?._id,'iddd ')
      const dateDiff = birthDate => {
        const start = new Date(birthDate);
        const end = new Date();

        // Calculate the difference in milliseconds
        const diffMilliseconds = end - start;

        // Calculate the difference in years, months, and days
        const diffDate = new Date(diffMilliseconds);
        const years = diffDate.getUTCFullYear() - 1970;
        const months = diffDate.getUTCMonth();
        const days = diffDate.getUTCDate() - 1;
        if (years == 0 && months == 0) {
          return `${days}D`;
        } else if (years == 0 && months != 0) {
          return `${months}M ${days}D`;
        }
        return `${years}Y ${months}M ${days}D`;
      };
const linkeddelete = () => {
  const payload = {
      linkedId: item?._id
  }
    dispatch(ChatActions.getLinkedData(payload))
}

      return (
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

        <TouchableOpacity
          onPress={() => updateState({ selectedProfile: item })}
          style={{
            borderBottomWidth: 1,
            borderColor: Colors.grayLight,
            flexDirection: 'row',
            paddingVertical: 10,
          }}>
          <Ionicons
            name={
              item._id == selectedProfile?._id
              ? 'radio-button-on'
              : 'radio-button-off'
            }
            size={20}
            color={Colors.grayDark}
            />
          <Text
            style={{
              ...Fonts.gray14PoppinsRegular,
              marginLeft: 10,
              textTransform: 'uppercase',
              color: Colors.black
            }}>
            {item.firstName},{' '}
            {dateDiff(moment(item?.dateOfBirth).format('YYYY-MM-DD'))}{' '}
            {item.gender}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => linkeddelete()}
            // onPress={() => Kundalidelete(item._id)}
            style={{
              flexDirection: 'row',
              width: '13%',
              justifyContent: 'space-between',
            }}>
            <MaterialCommunityIcons
              name="delete"
              color={colors.black_color7}
              size={23}
            />
          </TouchableOpacity>
              </View>
      );
    };

    return (
      <Modal
        visible={profilesBottomSheetVisible}
        style={{ justifyContent: 'flex-end' }}
        onDismiss={() => updateState({ profilesBottomSheetVisible: false })}>
        <View
          style={{
            flex: 0,
            padding: Sizes.fixPadding * 2,
            backgroundColor: Colors.white,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            maxHeight: SCREEN_HEIGHT * 0.7,
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...Fonts.black18RobotoMedium, marginBottom: 10 }}>
              Enter Your Details
            </Text>
            <TouchableOpacity
              onPress={() => updateState({ profilesBottomSheetVisible: false })}>
              <Ionicons
                name={'close-circle-outline'}
                size={25}
                color={Colors.gray}
              />
            </TouchableOpacity>
          </View>
          {linkedProfileData && (
            <FlatList data={linkedProfileData.slice().reverse()} renderItem={renderItem} />
          )}

          <TouchableOpacity
            onPress={() => on_select()}
            style={{
              backgroundColor: Colors.primaryDark,
              alignItems: 'center',
              marginTop: 10,
              paddingVertical: Sizes.fixPadding,
              justifyContent: 'center',
              borderRadius: 15,
            }}>
            <Text numberOfLines={1} style={{ ...Fonts.white14PoppinsBold }}>
              Select Profile
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  function startChatModalInfo() {
    const onStartChat = () => {
      // route.params?.astrostatus
      if (route.params?.astrostatus != 'online') {
        showToastMessage({ message: `Astrologer is ${route.params?.astrostatus}` })
        setModalVisible1(false)
        console.log('start')
        return
      }
      else{
        if (customerData?.wallet_balance < astroData?.chatPrice * 5) {
          showToastMessage({ message: 'Insufficient Balance' });
          return;
        }else{
          console.log('start1')
          setModalVisible1(true)
          const payload = {
            isNewProfile: newProfile,
            profileData: {
              firstName: firstName,
              lastName: lastName,
              gender: gender,
              dateOfBirth: date,
              timeOfBirth: time,
              placeOfBirth: locationData?.address,
              // placeOfBirth: customerData?.address?.birthPlace,
              maritalStatus: maritalStatus,
              topic_of_concern: occupation,
              latitude: locationData?.lat,
              // latitude: customerData?.address?.latitude,
              // longitude: customerData?.address?.longitude,
              longitude: locationData?.lon,
              description: description
            },
            selectedProfileId: selectedProfile?._id ?? null,
            chatPrice: astroData?.type === 'chat' ? astroData?.chatPrice : astroData?.callPrice,
            onComplete: resetState,
            astrologerId: astroData?.astrologerId,
            type: astroData?.type,
            astrologerName: astroData?.astrologerName,
            modalComp: () => setModalVisible1(false),
            navigation
          }
          console.log(payload?.profileData, 'intakeform', )
          // dispatch(ChatActions.onChatCallCheck(payload));
          dispatch(ChatActions.onChatRequestSend(payload))
          resetState()
        }
       
      }
     
      

    }

    return (
      <Modal
        visible={modalVisible}
        transparent={true}
        onDismiss={() => updateState({ modalVisible: false })}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 0,
              width: '90%',
              alignSelf: 'center',
              backgroundColor: colors.background_theme1,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: getFontSize(1.8),
                color: colors.black_color,
                fontFamily: fonts.semi_bold,
                textAlign: 'center',
                padding: 15,
              }}>
              Astrologer can {astroData?.type} in these languages
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: getFontSize(1.7),
                color: colors.black_color8,
                fontFamily: fonts.medium,
                textAlign: 'center',
                marginBottom: 5,
              }}>
              {astroData?.language && astroData?.language.join(', ')}
            </Text>
            <View
              style={{
                flex: 0,
                height: 1,
                marginBottom: 15,
                marginTop: 1,
                backgroundColor: colors.yellow_color1,
              }}
            />
            <View style={{ flex: 0, padding: 15 }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: getFontSize(1.8),
                  fontFamily: fonts.bold,
                  color: colors.black_color,
                  textAlign: 'center',
                }}>
                {astroData?.astrologerName}
              </Text>

              <TouchableOpacity
              disabled={route.params?.astrostatus != 'online' ? true : false}
                onPress={() => onStartChat()}
                style={{
                  flex: 0,
                  width: '80%',
                  alignSelf: 'center',
                  paddingVertical: 10,
                  borderRadius: 5,
                  // backgroundColor: colors.background_theme2,
                  backgroundColor: route.params?.astrostatus != 'online' ? 'grey' : colors.background_theme2,
                  marginVertical: 10,
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: getFontSize(1.7),
                    color: colors.background_theme1,
                    fontFamily: fonts.bold,
                    textAlign: 'center',
                  }}>
                  Start
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  function
    startChatInfo() {
    const validation = () => {
      const nameRegex = /^[a-zA-Z\s]+(([',. -][a-zA-Z\s])?[a-zA-Z\s]*)*$/
      if (firstName.length == 0) {
        showToastMessage({ message: 'Please enter first name' });
        return;
      } else if (!nameRegex.test(firstName)) {
        showToastMessage({ message: 'Please enter correct first name' });
        return
      } else if (lastName.length == 0) {
        showToastMessage({ message: 'Please enter last name' });
        return
      } else if (!nameRegex.test(lastName)) {
        showToastMessage({ message: 'Please enter correct last name' });
        return
      } else if (!date) {
        showToastMessage({ message: 'Please select date of birth' });
        return;
      } else if (!time) {
        showToastMessage({ message: 'Please select time of birth' });
        return;
      }
      else if (!locationData) {
        showToastMessage({ message: 'Please select place of birth' });
        return;
      }
      else if (!maritalStatus) {
        showToastMessage({ message: 'Please select marital status' });
        return;
      } else if (occupation.length == 0) {
        showToastMessage({ message: 'Please enter occupation' });
        return;
      } else if (!nameRegex.test(occupation)) {
        showToastMessage({ message: 'Please enter correct occupation' });
        return;
      } else {
        updateState({ modalVisible: true })
      }
    }
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => validation()} style={styles.submitButton}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: getFontSize(1.5),
            color: colors.background_theme1,
            fontFamily: fonts.medium,
            textAlign: 'center',
          }}>
          {`Start ${astroData?.type} with ${astroData?.astrologerName}`}
        </Text>
      </TouchableOpacity>
    );
  }

  function descriptionInfo() {
    const onChangeText = (text) => {
      updateState({ description: text })
      if (newProfile) {
        updateState({ newProfile: false, selectedProfile: null })
      }
    }
    return (
      <View style={[styles.itemContainer, {}]}>
        <Text allowFontScaling={false} style={styles.heading}>
          {t('questions')}
        </Text>
        <TextInput
          value={description}
          placeholder={t('type_your')}
          // editable={!newProfile}
          placeholderTextColor={colors.black_color6}
          multiline={true}
          scrollEnabled
          numberOfLines={10}
          onChangeText={onChangeText}
          textAlignVertical="top"
          style={{
            padding: 10,
            backgroundColor: colors.black_color1,
            marginTop: 10,
            borderRadius: 5,
            height: 150,
            color: colors.black_color,
            borderWidth: 1,
            borderColor: '#ddd',
          }}
        />
      </View>
    );
  }

  function maritalStatusInfo() {
    return (
      <View style={styles.itemRowContainer}>
        <View style={{ flex: 0.5, marginBottom: 15 }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: getFontSize(1.5),
              color: colors.black_color,
              fontFamily: fonts.medium,
            }}>
            {t('marital_status')}<Text style={{ color: Colors.red }}>*</Text>
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              marginTop: 10,
              borderRadius: 5,
              backgroundColor: colors.black_color1,
              width: width * 0.4,
              height: 50,
              color: 'black',
            }}>
            <Picker
              selectedValue={maritalStatus}
              themeVariant="dark"
              // enabled={!newProfile}
              onValueChange={(itemValue, itemIndex) => {
                updateState({ maritalStatus: itemValue });
                if (newProfile) {
                  updateState({ newProfile: false, selectedProfile: null })
                }
              }}
              style={{ color: 'black' }}>
              <Picker.Item
                label="Select Marital"
                value="Select Marital"
                style={{ fontSize: getFontSize(1.6) }}
              />
              <Picker.Item
                label="Married"
                value="Married"
                style={{ fontSize: getFontSize(1.6) }}
              />
              <Picker.Item
                label="Unmarried"
                value="Unmarried"
                style={{ fontSize: getFontSize(1.6) }}
              />
              <Picker.Item
                label="Other"
                value="Other"
                style={{ fontSize: getFontSize(1.6) }}
              />
            </Picker>
          </View>
        </View>
        <View style={{ flex: 0.5, marginBottom: 15 }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: getFontSize(1.5),
              color: colors.black_color8,
              fontFamily: fonts.medium,
            }}>
            {t('occuption')}<Text style={{ color: Colors.red }}>*</Text>
          </Text>
          <TextInput
            value={occupation}
            // editable={!newProfile}
            placeholder={'Occupation'}
            numberOfLines={1}
            placeholderTextColor={Colors.blackLight}
            onChangeText={(text) => {
              updateState({ occupation: text })
              if (newProfile) {
                updateState({ newProfile: false, selectedProfile: null })
              }
            }}
            style={{
              width: '100%',
              padding: 10,
              backgroundColor: colors.black_color1,
              marginTop: 10,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#ddd',
              ...Fonts.black14RobotoRegular,
              fontSize: getFontSize(1.5),
            }} />
        </View>
      </View>
    );
  }

  function placeOfBirthInfo() {
    return (
      <View style={styles.itemContainer}>
        <Text allowFontScaling={false} style={styles.heading}>
          {t('place_of_birth')}<Text style={{ color: Colors.red }}>*</Text>
        </Text>
        <TouchableOpacity
          disabled={newProfile}
          onPress={() =>
            navigation.navigate('placeOfBirth')
          }
          style={styles.pickerButton}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: getFontSize(1.5),
              color: colors.black_color,
              fontFamily: fonts.medium,
            }}>
            {!locationData ? t('select_birth') : locationData?.address}
          </Text>
        </TouchableOpacity>
        {/* <TextInput
          value={customerData?.address?.birthPlace}
          editable={false}
          placeholder="Enter your first name"
          placeholderTextColor={colors.black_color6}
          // onChangeText={text => updateState({ firstName: text })}
          style={{
            padding: 10,
            backgroundColor: colors.black_color1,
            marginTop: 10,
            color: colors.black_color,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#ddd',
            fontSize: getFontSize(1.6),
          }}
        /> */}
      </View>
    );
  }

  function dobInfo() {
    return (
      <View style={styles.itemRowContainer}>
        <View style={{ flex: 0.5, marginBottom: 15 }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: getFontSize(1.6),
              color: colors.black_color8,
              fontFamily: fonts.medium,
            }}>
            {t('date_of_birth')}<Text style={{ color: Colors.red }}>*</Text>
          </Text>
          <TouchableOpacity
            onPress={() => {
             
              if (newProfile) {      
                updateState({ newProfile: false, selectedProfile: null })
              }
              setDateVisible(true)
            }}
            // disabled={newProfile}
            style={{
              flex: 0,
              width: '90%',
              padding: 10,
              backgroundColor: colors.black_color1,
              borderRadius: 5,
              color: colors.black_color,
              marginTop: 10,
              borderWidth: 1,
              borderColor: '#ddd',
            }}>
            <Text
              allowFontScaling={false}
              style={{ color: colors.black_color, fontSize: getFontSize(1.5) }}>
              {date != null ? moment(date).format('DD-MM-YYYY') : 'DD-MM-YYYY'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.5, marginBottom: 15 }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: getFontSize(1.6),
              color: colors.black_color8,
              fontFamily: fonts.medium,
            }}>
            {t('time_of_birth')}<Text style={{ color: Colors.red }}>*</Text>
          </Text>
          <TouchableOpacity
            onPress={() => {
              setTimeVisible(true)
              if (newProfile) {
                updateState({ newProfile: false, selectedProfile: null })
              }
            }}
            // disabled={newProfile}
            style={{
              flex: 0,
              width: '90%',
              padding: 10,
              backgroundColor: colors.black_color1,
              borderRadius: 5,
              marginTop: 10,
              borderWidth: 1,
              borderColor: '#ddd',
            }}>
            <Text
              allowFontScaling={false}
              style={{ color: colors.black_color, fontSize: getFontSize(1.5) }}>
              {time != null ? moment(time).format('HH:mm a') : 'HH:MM'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function genderInfo() {
    return (
      <View style={styles.itemContainer}>
        <Text allowFontScaling={false} style={styles.heading}>
          {t('gender')}<Text style={{ color: Colors.red }}>*</Text>
        </Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            marginTop: 10,
            borderRadius: 5,
            backgroundColor: colors.black_color1,
            height: 50,
          }}>
          <Picker
            selectedValue={gender}
            themeVariant="dark"
            // enabled={!newProfile}
            onValueChange={(itemValue, itemIndex) => {
              updateState({ gender: itemValue });
              if (newProfile) {
                updateState({ newProfile: false, selectedProfile: null })
              }
            }}
            style={{ padding: 0, margin: 0, color: 'black' }}>
            <Picker.Item
              label={t('male')}
              value="Male"
              style={{ fontSize: getFontSize(1.6) }}
            />
            <Picker.Item
              label={t('female')}
              value="Female"
              style={{ fontSize: getFontSize(1.6) }}
            />
          </Picker>
        </View>
      </View>
    );
  }

  function lastNameInfo() {
    return (
      <View style={styles.itemContainer}>
        <Text allowFontScaling={false} style={styles.heading}>
          Last Name<Text style={{ color: Colors.red }}>*</Text>
        </Text>
        <TextInput
          value={lastName}
          placeholder="Enter your last name"
          // editable={!newProfile}
          placeholderTextColor={colors.black_color6}
          onChangeText={text => {
            updateState({ lastName: text })
            if (newProfile) {
              updateState({ newProfile: false, selectedProfile: null })
            }
          }}
          style={{
            padding: 10,
            backgroundColor: colors.black_color1,
            marginTop: 10,
            color: colors.black_color,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#ddd',
            fontSize: getFontSize(1.6),
          }}
        />
      </View>
    );
  }

  function firstNameInfo() {
    return (
      <View style={styles.itemContainer}>
        <Text allowFontScaling={false} style={styles.heading}>
          First Name<Text style={{ color: Colors.red }}>*</Text>
        </Text>
        <TextInput
          value={firstName}
          // editable={!newProfile}
          placeholder="Enter your first name"
          placeholderTextColor={colors.black_color6}
          onChangeText={text => {
            updateState({ firstName: text })
            if (newProfile) {
              updateState({ newProfile: false, selectedProfile: null })
            }
          }}
          style={{
            padding: 10,
            backgroundColor: colors.black_color1,
            marginTop: 10,
            color: colors.black_color,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#ddd',
            fontSize: getFontSize(1.6),
          }}
        />
      </View>
    );
  }

  function newProfileInfo() {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={() => resetState()} style={styles.itemContainer}>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            marginTop: 10,
            borderRadius: 5,
            backgroundColor: colors.black_color1,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Text allowFontScaling={false} style={styles.heading}>
            New Profile
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  function headerInfo() {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.background_theme2, padding: Sizes.fixPadding * 1.3 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons
            name="arrow-back"
            color={colors.white_color}
            size={getFontSize(2.5)}
            onPress={() => navigation.goBack()}
          />
          <Text style={{
            fontFamily: fonts.medium, fontSize: getFontSize(1.7),
            color: colors.white_color,
            marginLeft: Sizes.fixPadding
          }}>Intake Details</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => updateState({ profilesBottomSheetVisible: true })}
        >
          <Text style={{
            fontFamily: fonts.medium, fontSize: getFontSize(1.5),
            color: colors.white_color,
            textDecorationLine: 'underline',
          }}>Saved Profile</Text>
        </TouchableOpacity>
      </View>
    )
  }

};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  firebaseId: state.customer.firebaseId,
  wallet: state.customer.wallet,
  linkedProfileData: state.chat.linkedProfileData,
  locationData: state.setting.locationData
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(ChatIntakeForm);

const styles = StyleSheet.create({
  container: {
    width: width * 0.92,
    height: height * 0.85,
    backgroundColor: colors.background_theme1,
    alignSelf: 'center',
    shadowColor: colors.black_color7,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    flex: 1,
  },
  itemContainer: {
    flex: 0,
    marginBottom: 15,
  },
  itemRowContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    fontSize: getFontSize(1.6),
    color: colors.black_color8,
    fontFamily: fonts.medium,
  },
  pickerButton: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.black_color1,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    flex: 0,
    width: '80%',
    alignSelf: 'center',
    backgroundColor: colors.background_theme2,
    paddingVertical: 10,
    borderRadius: 5,
    shadowColor: colors.black_color8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginVertical: 10,
  },
});
