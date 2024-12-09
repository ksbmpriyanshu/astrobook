import { call, put, takeLatest, takeLeading } from 'redux-saga/effects';
import { getRequest, postRequest } from '../../utils/apiRequests';
import * as actionTypes from '../actionTypes';
import { api_url, book_pooja, customer_home_banner, get_all_pooja_list, get_call_astrologer, get_chat_astrologer, get_new_pooja, get_pooja, get_puja_history_data, get_video_call_astrologer } from '../../config/constants';
import { navigate } from '../../NavigationService';
import { razorpayPayment } from '../../utils/razorpay';
import { Alert } from 'react-native';
import { showToastMessage } from '../../utils/services';

function* getHomeData(actions) {
    try {
        const { payload } = actions
        yield put({ type: actionTypes.SET_IS_LOADING, payload: true })

        const poojaDataResponse = yield getRequest({
            url: api_url + get_pooja,
        })

        console.log("222", poojaDataResponse)
        if (poojaDataResponse?.success) {
            yield put({ type: actionTypes.SET_POOJA_DATA, payload: poojaDataResponse?.pooja })
        }
        yield put({ type: actionTypes.SET_IS_LOADING, payload: true })

    } catch (e) {
        yield put({ type: actionTypes.SET_IS_LOADING, payload: true })
        console.log('hii', e);
    }
}

function* getNewPoojaData(actions) {
    try {
        const { payload } = actions
        yield put({ type: actionTypes.SET_IS_LOADING, payload: true })

        const poojaDataResponse = yield getRequest({
            url: api_url + get_new_pooja,
        })
        console.log("2222", payload)

        if (poojaDataResponse?.success) {
            yield put({ type: actionTypes.SET_NEW_POOJA_DATA, payload: poojaDataResponse?.pooja })
        }

        yield put({ type: actionTypes.SET_IS_LOADING, payload: true })

    } catch (e) {
        yield put({ type: actionTypes.SET_IS_LOADING, payload: true })
        console.log('hii', e);
    }
}

// function* getAllPoojaList(actions){
//     try {
//         const { payload } = actions
//         yield put({ type: actionTypes.SET_IS_LOADING, payload: true })
//         const poojaListResponse = yield getRequest({
//             url: api_url + get_all_pooja_list,
//         })
//         console.log("first1111",poojaListResponse)

//         if (poojaListResponse?.success) {
//             yield put({ type: actionTypes.SET_ALL_POOJA_LIST, payload: poojaListResponse?.pooja })
//         }

//     } catch (e) {
//         yield put({ type: actionTypes.SET_IS_LOADING, payload: true })
//         console.log('hii', e);
//     }

// }


function* getBookPooja(actions) {
    console.log("action", actions)
    try {
        const { BookPujaData, customerData } = actions.payload
        yield put({ type: actionTypes.SET_IS_LOADING, payload: true })
        const bookedResponse = yield postRequest({
            url: api_url + book_pooja,
            data: BookPujaData
        })
        console.log("bookedResponse",bookedResponse)
        if (bookedResponse?.success) {
            yield put({ type: actionTypes.SET_BOOK_POOJA, payload: bookedResponse?.pooja })
            Alert.alert("AstroRemedy","PoojaBooed....")
            // const razorpayResponse = yield razorpayPayment({ amount: bookedResponse?.order?.price, email: customerData?.email, contact: customerData?.phoneNumber, name: customerData?.customerName })
            // console.log("razrp", razorpayResponse)
            // if (razorpayResponse) {
            //     call(navigate, 'Home');
            //     console.log("payment", "true");
            // }
            // yield put({ type: actionTypes.OPEN_MODAL });
            // console.log("OPEN_MODAL",actionTypes.OPEN_MODAL )
        } else {
            Alert.alert("Astro Remedy", bookedResponse?.message);
        }

    } catch (e) {
        yield put({ type: actionTypes.SET_IS_LOADING, payload: true })
        console.log('hii', e);
    }
}

function* getBookPoojaHistoryData(actions) {
    try {
        yield put({ type: actionTypes.SET_IS_LOADING, payload: true })
        const Response = yield postRequest({
            url: api_url + get_puja_history_data,
            data: { customerId: actions.payload._id }
        })
        console.log("111222", Response)
        if (Response?.success) {
            yield put({ type: actionTypes.SET_BOOK_POOJA_HISTORY_DATA, payload: Response?.results })
        } else {
            // Alert.alert("Astro Remedy", Response?.message);
            showToastMessage({ message: Response?.message})
        }
    } catch (e) {
        yield put({ type: actionTypes.SET_IS_LOADING, payload: true })
        console.log('hii', e);
    }
}

export default function* poojaSaga() {
    yield takeLeading(actionTypes.GET_HOME_DATA, getHomeData);
    yield takeLeading(actionTypes.GET_NEW_POOJA_DATA, getNewPoojaData);
    yield takeLeading(actionTypes.GET_BOOK_POOJA, getBookPooja)
    yield takeLeading(actionTypes.GET_BOOK_POOJA_HISTORY_DATA, getBookPoojaHistoryData)
}