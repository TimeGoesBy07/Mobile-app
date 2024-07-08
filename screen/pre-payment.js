import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Pressable } from 'react-native'
import { Input } from '@rneui/themed'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Modal from "react-native-modal"
import Dialog from "react-native-dialog"
import { Card } from 'react-native-paper'
import axios from 'axios'
import { getDatabase, ref, onChildChanged } from '@firebase/database'
import HVTMap from './floor-plan'
import BachKhoaMap from './floor-plan-2'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Ionicons from 'react-native-vector-icons/Ionicons'

function TempComponent(props) {
	const [info, setinfo] = useState()

	useEffect(() => {
		setinfo(props)
	}, [props])

	if (info !== undefined) {
		switch (info['details']['key']) {
			case '-NlPFapga5nR38-bU4N7':
				return <HVTMap status={info['details']} user={props.user} />

			case '-NlSHotmSczuAy6vWbYX':
				return <BachKhoaMap status={info['details']} user={props.user} />

			default:
				break
		}
	}
}

const PaymentScreen = ({ route, navigation }) => {
	const getUserAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/getUser'
	const getParkingLotAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/getParkingLot'
	const [loading, setLoading] = useState(true)
	const [userData, setUserData] = useState()
	const [showBalance, setShowBalance] = useState(false)
	const [parkData, setParkData] = useState()
	const [status, setStatus] = useState()
	const [reload, setReload] = useState(false)
	const { info } = route.params
	const db = getDatabase()
	const commentsRef = ref(db, `parking lot/${info['id']}/${info['key']}`)

	onChildChanged(commentsRef, () => setReload(!reload))

	useEffect(() => {
		console.log('data is changed')
		getParkingLot()
	}, [reload])

	const getParkingLot = () => {
		axios.get(getParkingLotAPI, {
			params: {
				id: info['id'],
				key: info['key']
			}
		}).then((response) => {
			setParkData(response.data)
			let emptySlotsArr = Object.entries(response.data['status']).filter(([key, value]) => value === "empty")
			setStatus(emptySlotsArr)
		}).catch((error) => console.error(error))
	}

	const getUser = async () => {
		setLoading(true)
		const user = await AsyncStorage.getItem('user')

		axios.get(getUserAPI, { params: { uid: Object.values(JSON.parse(user))[0]['id'] } }).then((response) => {
			setUserData(Object.values(response.data)[0])
			let vehicle = Object.values(Object.values(response.data)[0]['vehiclelist'])

			let array = vehicle.map(element => ({
				key: element['registrationPlate'],
				id: element['key'],
				booking: element['isBooking'],
				value: element['registrationPlate']
			}))

			getParkingLot()
			setLoading(false)
		}).catch((error) => console.error(error))
	}

	// const handlePay = () => {
	// 	setLoading(true)

	// 	if (userData['money'] < info['price'])
	// 		setShowBalance(true)
	// 	else {



	// 		axios.post(setBalanceAPI, {
	// 			newMoney: (userData['money'] - info['price']).toString(),
	// 			id: userData['id'],
	// 			key: userData['key']
	// 		}).then(() => {
	// 			axios.post(postStatus, {
	// 				qrValidate: false,
	// 				key: '-NenHgKcDV5TVtGlANGB',
	// 				uid: 'CPokK6CcsdUTfWOJ0vzHtanNgJI2',
	// 				vehicle: selectedVehicle,
	// 				slot: selectedSpace,
	// 				isBooking: true,
	// 				bookStart: "Waiting...",
	// 				bookLocation: parkData['location']
	// 			}).then(() => {
	// 				let now = new Date()

	// 				axios.post(slotStatus, {
	// 					status: `occupied: ${userData['emailAddress']} - ${selectedVehicle['key']} - ${now.toLocaleString('en-us', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}`,
	// 					key: parkData['key'],
	// 					id: parkData['id'],
	// 					slot: selectedSpace
	// 				}).then(() => {
	// 					setLoading(false)
	// 					navigation.navigate('Vehicles')
	// 				}).catch((error) => console.log(error))
	// 			}).catch(err => console.log(err))
	// 		}).catch(err => console.log(err))
	// 	}
	// }

	// const handlePrePay = () => {
	// 	setLoading(true)

	// 	axios.post(setBalanceAPI, {
	// 		newMoney: (userData['money'] - (info['price'] / 2)).toString(),
	// 		id: userData['id'],
	// 		key: userData['key']
	// 	}).then(() => {
	// 		//write updateVehicleStatus API
	// 		axios.post(updateVehicleStatus, {
	// 			qrValidate: false,
	// 			isBooking: true
	// 		}).then(() => {
	// 			setLoading(false)
	// 			navigation.navigate('Homepage')
	// 		}).catch(err => console.log(err))
	// 	}).catch(err => console.log(err))
	// }

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			getUser()
		})

		return unsubscribe
	}, [navigation])

	useEffect(() => {
		getUser()
	}, [])

	const RightContent = props => <Ionicons {...props} name="close-circle" onPress={() => navigation.goBack()} size={30} style={{ marginRight: 20 }} color="#8291AD" />

	return (
		<ScrollView style={{ flex: 1, backgroundColor: '#8291AD' }}>
			<View style={{ paddingHorizontal: 25, paddingVertical: 45 }}>
				<Dialog.Container visible={loading}>
					<Dialog.Title><ActivityIndicator size='small' color='#8291AD' /> Loading...</Dialog.Title>
				</Dialog.Container>
				{loading === false &&
					<View>
						<Card style={{ marginBottom: 20 }}>
							<Card.Title title="Park information" titleStyle={{ fontSize: 22, fontWeight: "700" }} right={RightContent} />
							<Card.Content>
								{parkData && <View>
									<Input
										disabled
										placeholder={parkData['name']}
										leftIcon={<MaterialIcons name="local-parking" size={20} color="#666" />} />
									<Input
										disabled
										placeholder={parkData['price'].toString()}
										leftIcon={<MaterialIcons name="attach-money" size={20} color="#666" />} />
								</View>}
								{parkData && status && <TempComponent details={parkData} user={userData} />}
							</Card.Content>
						</Card>
					</View>}
			</View>
			<Modal
				animationType="slide"
				transparent={true}
				visible={showBalance}
				onRequestClose={() => {
					Alert.alert('Modal has been closed.')
					setModalVisible(!showBalance)
				}}>
				<View style={styles.modalView}>
					<Text>Not enough balance!</Text>
					<Pressable
						style={[styles.button, styles.buttonClose]}
						onPress={() => setShowBalance(!showBalance)}>
						<Text style={styles.textStyle}>OK</Text>
					</Pressable>
				</View>
			</Modal>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	modalView: {
		margin: 10,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	}
})

export default PaymentScreen