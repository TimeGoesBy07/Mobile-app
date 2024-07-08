import React, { useState, useEffect } from 'react'
import { ScrollView, Text, View, ActivityIndicator } from 'react-native'
import axios from 'axios'
import Dialog from "react-native-dialog"
import { Input } from '@rneui/themed'
import { Card } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Button } from 'react-native-elements'
import { getDatabase, ref, onChildChanged } from '@firebase/database'

const VehiclesScreen = ({ navigation }) => {
	const getUserAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/getUser'
	const removeVehicleAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/deleteVehicles'
	const vehicleStatus = 'https://us-central1-smart-parking-369015.cloudfunctions.net/updateVehicleStatus'
	const slotStatus = 'https://us-central1-smart-parking-369015.cloudfunctions.net/postParkingLotStatus'
	const [loading, setLoading] = useState(true)
	const [vehicle, setVehicle] = useState()
	const [reload, setReload] = useState(false)
	const [user, setUser] = useState(false)
	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }

	const db = getDatabase()
	const commentsRef = ref(db, `users/${user['id']}/${user['key']}/vehiclelist`)
	
	onChildChanged(commentsRef, () => setReload(!reload))

	useEffect(() => {
		getVehicles()
	}, [reload])

	const getUser = async () => {
		const value = await AsyncStorage.getItem('user')
		setUser(Object.values(JSON.parse(value))[0])
	}

	const getVehicles = async () => {
		if (user !== null) {
			setLoading(true)
			const value = await AsyncStorage.getItem('user')

			axios.get(getUserAPI, { params: { uid: Object.values(JSON.parse(value))[0]['id'] } }).then((response) => {
				setVehicle(Object.values(Object.values(response.data)[0]['vehiclelist']))
				setLoading(false)
			}).catch((error) => console.log(error))
		}
	}

	useEffect(() => {
		getUser()
	}, [])

	useEffect(() => {
		getVehicles()
	}, [user])

	const handleCancel = (element) => {
		setLoading(true)

		axios.post(slotStatus, {
			status: 'empty',
			key: element['parkKey'],
			id: element['parkId'],
			slot: element.slot
		}).then(() => {
			// Update vehicle
			axios.post(vehicleStatus, {
				requireChecking: false,
				qrCheck: true,
				key: user['key'],
				uid: user['id'],
				vehicle: element.key,
				slot: '',
				isBooking: false,
				bookStart: 'Waiting...',
				bookEnd: 'Waiting...',
				bookLocation: '',
				parkId: '',
				parkKey: ''
			}).then(() => {
				getVehicles()
			})
		})
	}

	const handleRemove = async (id) => {
		const value = await AsyncStorage.getItem('user')

		axios.delete(removeVehicleAPI, {
			data: {
				id: Object.values(JSON.parse(value))[0]['id'],
				key: Object.values(JSON.parse(value))[0]['key'],
				vehicleID: id,
			}
		}).then(() => { getVehicles() })
	}

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			getVehicles()
		})

		return unsubscribe
	}, [navigation])

	return (
		<ScrollView style={{ flex: 1, backgroundColor: '#8291AD' }}>
			<View style={{ paddingHorizontal: 25, paddingVertical: 35 }}>
				<Dialog.Container visible={loading}>
					<Dialog.Title><ActivityIndicator size='small' color='#8291AD' /> Loading...</Dialog.Title>
				</Dialog.Container>
				{vehicle && vehicle.map((element, i) => {

					return <View key={i}>
						<Card style={{ marginVertical: 10 }}>
							<Card.Content>
								<Input
									key={i + 1}
									disabled
									placeholder={element['name']}
									leftIcon={<Icon name="car-info" size={30} color="#666" />} />
								<Input
									key={i + 2}
									disabled
									placeholder={element['registrationPlate']}
									leftIcon={<Icon name="numeric" size={30} color="#666" />} />
								{element['isBooking'] === true && <View>
									<Input
										key={i + 5}
										disabled
										placeholder={element['bookStart']}
										leftIcon={<Icon name="clock-outline" size={30} color="#666" />} />
									<Input
										key={i + 6}
										disabled
										placeholder={element['bookLocation']}
										leftIcon={<Icon name="map-marker-check" size={30} color="#666" />} />
								</View>}
								<View style={{ display: 'flex' }}>
									{element['isBooking'] === false && <Button
										icon={<Ionicons name="trash" size={20} style={{ marginRight: 10 }} color="white" />}
										key={i + 6}
										onPress={() => handleRemove(element['key'])}
										style={{ margin: 10 }}
										buttonStyle={{ backgroundColor: '#8291AD' }}
										title='Remove this vehicle' />}
									{(element['isBooking'] === true && element['bookStart'] !== 'Waiting...') && <Button
										icon={<Ionicons name="information-circle" size={20} style={{ marginRight: 10 }} color="white" />}
										key={i + 4}
										disabled={element['isBooking'] === false ? true : false}
										onPress={() => navigation.navigate('PostPayment', { info: element })}
										style={{ margin: 10 }}
										buttonStyle={{ backgroundColor: '#8291AD' }}
										title='View details' />}
									{(element['isBooking'] === true && element['bookStart'] === 'Waiting...') && <Button
										icon={<Ionicons name="close-circle" size={20} style={{ marginRight: 10 }} color="white" />}
										key={i + 5}
										onPress={() => handleCancel(element)}
										style={{ margin: 10 }}
										buttonStyle={{ backgroundColor: '#8291AD' }}
										title='Cancel' />}
								</View>
							</Card.Content>
						</Card>
					</View>
				})}
				<Button
					icon={<Ionicons name="add-circle" size={20} style={{ marginRight: 10 }} color="#8291AD" />}
					onPress={() => navigation.navigate('Addvehicle')}
					style={{ margin: 10 }}
					buttonStyle={{ backgroundColor: 'white' }}
					titleStyle={{ color: '#8291AD' }}
					title='Add vehicle' />
				<Button
					icon={<Ionicons name="arrow-back-circle" size={20} style={{ marginRight: 10 }} color="#8291AD" />}
					onPress={() => navigation.navigate('Menu')}
					style={{ margin: 10 }}
					buttonStyle={{ backgroundColor: 'white' }}
					titleStyle={{ color: '#8291AD' }}
					title='Back' />
			</View>
		</ScrollView>
	)
}

export default VehiclesScreen