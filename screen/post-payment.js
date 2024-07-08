import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Pressable } from 'react-native'
import { Button } from 'react-native-elements'
import { Input } from '@rneui/themed'
import Modal from "react-native-modal"
import Dialog from "react-native-dialog"
import { Card } from 'react-native-paper'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getDatabase, ref, onChildChanged } from '@firebase/database'
import { DataTable } from 'react-native-paper'

const PostPaymentScreen = ({ route, navigation }) => {
	const getUserAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/getUser'
	const getParkingLotAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/getParkingLot'
	const setBalanceAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/setBalance'
	const slotStatus = 'https://us-central1-smart-parking-369015.cloudfunctions.net/postParkingLotStatus'
	const vehicleStatus = 'https://us-central1-smart-parking-369015.cloudfunctions.net/updateVehicleStatus'
	const [loading, setLoading] = useState(true)
	const [userData, setUserData] = useState()
	const [showBalance, setShowBalance] = useState(false)
	const [parkData, setParkData] = useState()
	const [temp, setTemp] = useState(false)
	const [reload, setReload] = useState(false)
	const [show, setShow] = useState(false)
	const [vehicle, setVehicle] = useState()
	const [priceDuration, setPriceDuration] = useState()
	const [howLong, setHowLong] = useState()
	const [howLongMinute, setHowLongMinute] = useState()
	const { info } = route.params
	const db = getDatabase()

	const commentsRef = ref(db, `users/${temp['id']}/${temp['key']}/vehiclelist/${info['key']}`)

	onChildChanged(commentsRef, () => setReload(!reload))

	const getTemp = async () => {
		const value = await AsyncStorage.getItem('user')
		setTemp(Object.values(JSON.parse(value))[0])
	}

	useEffect(() => {
		getTemp()
		getUser()
		getVehicles()
		getParkingLot()
	}, [])

	const getVehicles = async () => {
		if (temp !== null) {
			setLoading(true)
			const value = await AsyncStorage.getItem('user')

			axios.get(getUserAPI, { params: { uid: Object.values(JSON.parse(value))[0]['id'] } }).then((response) => {
				const temp = Object.values(Object.values(response.data)[0]['vehiclelist']).filter(e => e['key'] === info['key'])
				setVehicle(temp[0])
				setLoading(false)
			}).catch((error) => console.log(error))
		}
	}

	useEffect(() => {
		getVehicles()
	}, [reload])

	const getUser = async () => {
		setLoading(true)
		const user = await AsyncStorage.getItem('user')

		axios.get(getUserAPI, { params: { uid: Object.values(JSON.parse(user))[0]['id'] } }).then((response) => {
			setLoading(false)
			setUserData(Object.values(response.data)[0])
		})
	}

	const getParkingLot = () => {
		axios.get(getParkingLotAPI, {
			params: {
				id: info['parkId'],
				key: info['parkKey']
			}
		}).then((response) => {
			setParkData(response.data)
		}).catch((error) => console.error(error))
	}

	const calculatePrice = (days, hours, minutes, pricePerHour) => {
		let totalHours = days * 24 + hours
		let totalPrice

		if (minutes > 30) {
			totalHours += 1
			totalPrice = totalHours * pricePerHour
		}
		else if (minutes < 30 && totalHours === 0) {
			totalPrice = pricePerHour / 2
			totalHours = 0.5
		}
		else
			totalPrice = totalHours * pricePerHour

		return { totalPrice, totalHours, minutes }
	}

	const handleConfirmation = () => {
		setShow(false)
		setLoading(true)

		if (priceDuration > Number(userData['money'])) {
			setLoading(false)
			setShowBalance(true)
		}
		else {
			axios.post(slotStatus, {
				status: 'empty',
				key: parkData['key'],
				id: parkData['id'],
				slot: info['slot']
			}).then(() => {
				axios.post(vehicleStatus, {
					requireChecking: false,
					key: userData['key'],
					uid: userData['id'],
					vehicle: info['key'],
					slot: '',
					isBooking: false,
					bookStart: 'Waiting...',
					bookEnd: 'Waiting...',
					bookLocation: '',
					parkId: '',
					parkKey: ''
				}).then(() => {
					axios.post(setBalanceAPI, {
						newMoney: (Number(userData['money']) - priceDuration).toString(),
						id: userData['id'],
						key: userData['key']
					}).then(() => {
						setLoading(false)
						navigation.navigate({ name: 'Vehicles' })
					})
				})
			})
		}
	}

	const handlePay = () => {
		let timeStart = new Date(info['bookStart'])
		let timeEnd = new Date(vehicle['bookEnd'])

		let differenceMs = Math.abs(timeEnd - timeStart)

		var daysDifference = Math.floor(differenceMs / (1000 * 60 * 60 * 24))
		var hoursDifference = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
		var minutesDifference = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60))

		let result = calculatePrice(daysDifference, hoursDifference, minutesDifference, Number(parkData['price']))
		setPriceDuration(result.totalPrice)
		setHowLong(result.totalHours)
		setHowLongMinute(result.minutes)
		setShow(true)
	}

	return (
		<ScrollView style={{ flex: 1, backgroundColor: '#8291AD' }}>
			<View style={{ paddingHorizontal: 25, paddingVertical: 45 }}>
				<Dialog.Container visible={loading}>
					<Dialog.Title><ActivityIndicator size='small' color='#8291AD' /> Loading...</Dialog.Title>
				</Dialog.Container>
				<Dialog.Container visible={showBalance}>
					<Dialog.Title>Notice</Dialog.Title>
					<Dialog.Description>
						Not enough balance!
					</Dialog.Description>
					<Dialog.Button label="OK" onPress={() => setShowBalance(!showBalance)} />
				</Dialog.Container>
				{loading === false && <View>
					<Card style={{ marginBottom: 20 }}>
						<Card.Title title="User information" titleStyle={{ fontSize: 22, fontWeight: "700" }} />
						<Card.Content>
							{userData && <>
								<Input
									disabled
									placeholder={userData['username']}
									leftIcon={<Ionicons name="person-circle" size={20} style={{ marginRight: 10 }} color="#666" />} />
								<Input
									disabled
									placeholder={userData['money']}
									leftIcon={<Ionicons name="card" size={20} style={{ marginRight: 10 }} color="#666" />} />
							</>}
						</Card.Content>
					</Card>
					<Card style={{ marginBottom: 20 }}>
						<Card.Title title="Park information" titleStyle={{ fontSize: 22, fontWeight: "700" }} />
						<Card.Content>
							{parkData && <>
								<Input
									disabled
									placeholder={parkData['name']}
									leftIcon={<Ionicons name="information-circle" size={20} style={{ marginRight: 10 }} color="#666" />} />
								<Input
									disabled
									placeholder={parkData['price'].toString()}
									leftIcon={<Ionicons name="pricetag" size={20} style={{ marginRight: 10 }} color="#666" />} />
								<Input
									disabled
									placeholder={parkData['location']}
									leftIcon={<Ionicons name="location" size={20} style={{ marginRight: 10 }} color="#666" />} />
							</>}
						</Card.Content>
					</Card>
					<Card style={{ marginBottom: 20 }}>
						<Card.Title title="Slot usage" titleStyle={{ fontSize: 22, fontWeight: "700" }} />
						<Card.Content>
							<Input
								disabled
								placeholder={info['name']}
								leftIcon={<Ionicons name="car" size={20} style={{ marginRight: 10 }} color="#666" />} />
							<Input
								disabled
								placeholder={info['registrationPlate']}
								leftIcon={<Ionicons name="file-tray-full" size={20} style={{ marginRight: 10 }} color="#666" />} />
							<Input
								disabled
								placeholder={`Start: ${info['bookStart']}`}
								leftIcon={<Ionicons name="time" size={20} style={{ marginRight: 10 }} color="#666" />} />
							{(vehicle && vehicle['bookEnd'] !== 'Waiting...' && vehicle['requireChecking'] === true) && <Input
								disabled
								placeholder={`End: ${vehicle['bookEnd']}`}
								leftIcon={<Ionicons name="time" size={20} style={{ marginRight: 10 }} color="#666" />} />}
							<Input
								disabled
								placeholder={info['slot']}
								leftIcon={<Ionicons name="download" size={20} style={{ marginRight: 10 }} color="#666" />} />
						</Card.Content>
					</Card>
				</View>}

				{vehicle && <Button
					disabled={vehicle['requireChecking'] === true ? false : true}
					icon={<Ionicons name="bag-check" size={20} style={{ marginRight: 10 }} color="#8291AD" />}
					onPress={() => handlePay()}
					style={{ margin: 10 }}
					buttonStyle={{ backgroundColor: 'white' }}
					titleStyle={{ color: '#8291AD' }}
					title='Pay' />}
				<Button
					icon={<Ionicons name="arrow-back-circle" size={20} style={{ marginRight: 10 }} color="#8291AD" />}
					onPress={() => navigation.goBack()}
					style={{ margin: 10 }}
					buttonStyle={{ backgroundColor: 'white' }}
					titleStyle={{ color: '#8291AD' }}
					title='Back' />
			</View>
			<Modal
				animationType="slide"
				transparent={true}
				visible={show}
				onRequestClose={() => {
					Alert.alert('Modal has been closed.')
					setModalVisible(!show)
				}}>
				<View style={styles.modalView}>
					<DataTable>
						<DataTable.Header>
							<DataTable.Title>Location</DataTable.Title>
							<DataTable.Title numeric>Price</DataTable.Title>
						</DataTable.Header>
						<DataTable.Row>
							<DataTable.Cell>Slot usage</DataTable.Cell>
							<DataTable.Cell>{howLong}h {howLongMinute}m</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Total price</DataTable.Cell>
							<DataTable.Cell>{priceDuration} VND</DataTable.Cell>
						</DataTable.Row>
					</DataTable>
					<Pressable
						style={[styles.button, styles.buttonClose]}
						onPress={() => handleConfirmation()}>
						<Text style={styles.textStyle}>Confirm payment</Text>
					</Pressable>
					<Pressable
						style={[styles.button, styles.buttonClose]}
						onPress={() => setShow(!show)}>
						<Text style={styles.textStyle}>Cancel</Text>
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
		margin: 10
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

export default PostPaymentScreen