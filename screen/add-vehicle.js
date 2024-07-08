import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, ActivityIndicator } from 'react-native'
import { Button } from 'react-native-elements'
import { Input } from '@rneui/themed'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useForm, Controller } from 'react-hook-form'
import Dialog from "react-native-dialog"
import { HelperText } from 'react-native-paper'
import axios from 'axios'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Card } from 'react-native-paper'

const AddVehicle = ({ navigation }) => {
	const postVehicleAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/postVehicles'
	const getUserAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/getUser'
	const { handleSubmit, control, formState: { errors } } = useForm()
	const [loading, setLoading] = useState(false)
	const [user, setUser] = useState()

	const getUser = async () => {
		setLoading(true)
		const user = await AsyncStorage.getItem('user')

		axios.get(getUserAPI, { params: { uid: Object.values(JSON.parse(user))[0]['id'] } }).then((response) => {
			setUser(Object.values(response.data)[0])
			setLoading(false)
		}).catch((error) => console.log(error))
	}

	const onSubmit = data => {
		setLoading(true)

		axios.post(postVehicleAPI, {
			id: user['id'],
			key: user['key'],
			name: data.name,
			registrationPlate: data.plate,
			isBooking: false,
			bookStart: 'Waiting...',
			bookEnd: 'Waiting...',
			bookLocation: '',
			qrCheck: true,
			slot: '',
			parkId: '',
			parkKey: ''
		}).then(() => {
			setLoading(false)
			navigation.goBack()
		})
	}

	useEffect(() => {
		getUser()
	}, [])

	return (
		<SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: '#8291AD' }}>
			<View style={{ paddingHorizontal: 25, paddingVertical: 45 }}>
				<Dialog.Container visible={loading}>
					<Dialog.Title><ActivityIndicator size='small' color='#8291AD' /> Loading...</Dialog.Title>
				</Dialog.Container>

				<Card style={{ marginBottom: 20 }}>
					<Card.Title title="Add a vehicle" titleStyle={{ fontSize: 22, fontWeight: "700" }} />
					<Card.Content>
						{errors.name && <HelperText style={{ color: 'red' }}>{errors.name.message}</HelperText>}
						<Controller
							control={control}
							name='name'
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									label={'Name'}
									onChangeText={value => onChange(value)}
									onBlur={onBlur}
									value={value}
									leftIcon={<Icon name="car-info" size={30} color="#666" />} />
							)}
							rules={{
								required: { value: true, message: 'This field is required!' },
								pattern: {
									value: /^[a-zA-Z]*$/,
									message: 'Text only please 😞'
								}
							}} />

						{errors.plate && <HelperText style={{ color: 'red' }}>{errors.plate.message}</HelperText>}
						<Controller
							control={control}
							name='plate'
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									label={'Registration plate'}
									onChangeText={value => onChange(value)}
									onBlur={onBlur}
									value={value}
									leftIcon={<Icon name="numeric" size={30} color="#666" />} />
							)}
							rules={{
								required: { value: true, message: 'This field is required!' },
								minLength: { value: 6, message: 'This field must be at least 6 characters' }
							}} />
						<Button
							icon={<Ionicons name="add-circle" size={20} style={{ marginRight: 10 }} color="white" />}
							onPress={handleSubmit(onSubmit)}
							style={{ margin: 10 }}
							buttonStyle={{ backgroundColor: '#8291AD' }}
							title='Add' />
						<Button
							icon={<Ionicons name="arrow-back-circle" size={20} style={{ marginRight: 10 }} color="white" />}
							onPress={() => navigation.goBack()}
							style={{ margin: 10 }}
							buttonStyle={{ backgroundColor: '#8291AD' }}
							title='Back' />
					</Card.Content>
				</Card>
			</View>
		</SafeAreaView>
	)
}

export default AddVehicle