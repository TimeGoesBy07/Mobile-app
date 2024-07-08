import { useEffect, useState } from "react"
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import { Button } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'
import axios from 'axios'
import { Input } from '@rneui/themed'
import { SelectList } from 'react-native-dropdown-select-list'
import Modal from "react-native-modal"
import Dialog from "react-native-dialog"
import { useNavigation } from "@react-navigation/native"

function HandleBook(props) {
	const validateStatus = 'https://us-central1-smart-parking-369015.cloudfunctions.net/validateStatus'
	const setBalanceAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/setBalance'
	const vehicleStatus = 'https://us-central1-smart-parking-369015.cloudfunctions.net/updateVehicleStatus'
	const slotStatus = 'https://us-central1-smart-parking-369015.cloudfunctions.net/postParkingLotStatus'
	const [list, setList] = useState()
	const [selected, setSelected] = useState()
	const [showBalance, setShowBalance] = useState(false)
	const [late, setLate] = useState(false)
	const [loading, setLoading] = useState(false)
	const navigation = useNavigation()

	useEffect(() => {
		let vehicle = Object.values(props.user['vehiclelist'])

		let array = vehicle.map(element => ({
			key: element['registrationPlate'],
			id: element['key'],
			booking: element['isBooking'],
			value: element['registrationPlate']
		}))

		setList(array.filter(element => element['booking'] === false))
	}, [])

	const handlePaying = async () => {
		setLoading(true)

		if (Number(props.park['price']) > Number(props.user['money'])) {
			setLoading(false)
			setShowBalance(true)
		}
		else {
			// Check slot status
			axios.get(validateStatus, {
				params: {
					uid: props.park['id'],
					key: props.park['key'],
					slot: props.slot
				}
			}).then((response) => {
				if (response.data === 'empty') {
					console.log('this is res', response.data)
					let now = new Date()
					// Update slot
					axios.post(slotStatus, {
						status: `occupied: ${props.user['emailAddress']} - ${selected} - ${now.toLocaleString('en-us', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}`,
						key: props.park['key'],
						id: props.park['id'],
						slot: props.slot
					}).then(() => {
						let foundVehicle = null

						for (const key in props.user['vehiclelist']) {
							if (props.user['vehiclelist'][key].registrationPlate === selected) {
								foundVehicle = props.user['vehiclelist'][key]
								break; // Stop searching once found
							}
						}

						if (foundVehicle) {
							console.log("Found vehicle:", foundVehicle.key);
						} else {
							console.log("Vehicle not found.");
						}
						// Update vehicle
						axios.post(vehicleStatus, {
							requireChecking: false,
							key: props.user['key'],
							uid: props.user['id'],
							vehicle: foundVehicle.key,
							slot: props.slot,
							isBooking: true,
							bookStart: 'Waiting...',
							bookEnd: 'Waiting...',
							bookLocation: props.park['location'],
							parkId: props.park['id'],
							parkKey: props.park['key']
						}).then(() => {
							// Update balance
							axios.post(setBalanceAPI, {
								newMoney: (props.user['money'] - props.park['price']).toString(),
								id: props.user['id'],
								key: props.user['key']
							}).then(() => {
								setLoading(false)
								navigation.navigate({ name: 'Vehicles' })
							})
						})
					})
				}
				else {
					setLate(true)
				}
			})
		}

		console.log('slot is ', props.slot)
		console.log('car is ', selected)
		console.log('location is ', props.park['location'])
		console.log('price is ', props.user)
	}

	return (
		<View>
			<Dialog.Container visible={loading}>
				<Dialog.Title><ActivityIndicator size='small' color='#8291AD' /> Loading...</Dialog.Title>
			</Dialog.Container>
			{props.slot && <Input
				disabled
				placeholder={props.slot}
				leftIcon={<Ionicons name="download" size={20} color="#666" />} />}
			<Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 20 }}>User information</Text>
			<Input
				disabled
				placeholder={props.user['emailAddress']}
				leftIcon={<Ionicons name="mail" size={20} color="#666" />} />
			<Input
				disabled
				placeholder={props.user['money']}
				leftIcon={<Ionicons name="card" size={20} color="#666" />} />
			<Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 20 }}>Pick your vehicle</Text>
			<SelectList
				boxStyles={{ marginBottom: 20, marginTop: 20 }}
				search={false}
				placeholder='Your available vehicles'
				setSelected={(val) => setSelected(val)}
				data={list}
				save="value" />

			<Button
				icon={<Ionicons name="bag-check" size={20} style={{ marginRight: 10 }} color="white" />}
				disabled={(selected && props.slot) ? false : true}
				onPress={() => handlePaying()}
				style={{ margin: 10 }}
				buttonStyle={{ backgroundColor: '#8291AD' }}
				title='Book' />
			<Button
				icon={<Ionicons name="arrow-back-circle" size={20} style={{ marginRight: 10 }} color="white" />}
				onPress={() => navigation.navigate({ name: 'Homepage' })}
				style={{ margin: 10 }}
				buttonStyle={{ backgroundColor: '#8291AD' }}
				title='Go back' />
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
			<Modal
				animationType="slide"
				transparent={true}
				visible={late}
				onRequestClose={() => {
					Alert.alert('Modal has been closed.')
					setModalVisible(!setLate)
				}}>
				<View style={styles.modalView}>
					<Text>Oops! You are late! Someone already took it.</Text>
					<Pressable
						style={[styles.button, styles.buttonClose]}
						onPress={() => setLate(!late)}>
						<Text style={styles.textStyle}>OK</Text>
					</Pressable>
				</View>
			</Modal>
		</View>
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

export default HandleBook