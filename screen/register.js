import React, { useState } from 'react'
import { ScrollView, View, ActivityIndicator } from 'react-native'
import { Text } from '@rneui/base'
import { Input } from '@rneui/themed'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { createUserWithEmailAndPassword } from '@firebase/auth'
import { useForm, Controller } from 'react-hook-form'
import { FIREBASE_AUTH } from '../firebase/config.js'
import FlashMessage, { showMessage } from 'react-native-flash-message'
import axios from 'axios'
import Dialog from "react-native-dialog"
import { HelperText } from 'react-native-paper'
import { Button } from 'react-native-elements'

const RegisterScreen = ({ navigation }) => {
	const createUserAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/createUser'
	const postVehicleAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/postVehicles'
	const { handleSubmit, control, formState: { errors } } = useForm()
	const [loading, setLoading] = useState(false)

	const onSubmit = data => {
		setLoading(true)

		createUserWithEmailAndPassword(FIREBASE_AUTH, data.email, data.password)
			.then(userCredential => {
				axios.post(createUserAPI, {
					"id": userCredential.user.uid,
					"username": data.username,
					"emailAddress": data.email,
					"phone": data.phone,
					"password": data.password,
					"money": '0',
				}).then((response) => {
					axios.post(postVehicleAPI, {
						id: userCredential.user.uid,
						key: response.data['key'],
						name: data.name,
						registrationPlate: data.plate,
						isBooking: false,
						bookStart: '',
						bookLocation: '',
						slot: '',
						qrCheck: true,
						parkId: '',
						parkKey: ''
					})
					setLoading(false)
					navigation.navigate('Login')
				})
			})
			.catch(() => {
				setLoading(false)
				showMessage({
					type: 'error',
					message: 'Invalid login credential!',
					color: 'white',
					backgroundColor: '#8291AD'
				})
			})
	}

	return (
		<ScrollView contentContainerStyle={{ justifyContent: 'center' }} style={{ flex: 1 }}>
			<View style={{ paddingHorizontal: 25, paddingVertical: 45 }}>
				<FlashMessage position="top" />
				<Dialog.Container visible={loading}>
					<Dialog.Title><ActivityIndicator size='small' color='#8291AD' /> Loading...</Dialog.Title>
				</Dialog.Container>
				<Text
					style={{
						fontSize: 28,
						fontWeight: '500',
						color: '#333',
						marginBottom: 30,
					}}>
					Register account
				</Text>

				{errors.email && <HelperText style={{ color: 'red' }}>{errors.email.message}</HelperText>}
				<Controller
					control={control}
					name='email'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							label={'Email ID'}
							onChangeText={value => onChange(value)}
							onBlur={onBlur}
							value={value}
							leftIcon={<Ionicons name="mail" size={20} color="#666" />} />
					)}
					rules={{
						required: { value: true, message: 'This field is required!' },
						pattern: {
							value: /.+@.+\.[A-Za-z]+$/,
							message: 'This is not a valid email! 😞'
						}
					}}
				/>

				{errors.username && <HelperText style={{ color: 'red' }}>{errors.username.message}</HelperText>}
				<Controller
					control={control}
					name='username'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							label={'Username'}
							onChangeText={value => onChange(value)}
							onBlur={onBlur}
							value={value}
							leftIcon={<Ionicons name="person" size={20} color="#666" />} />
					)}
					rules={{
						required: { value: true, message: 'This field is required!' },
						minLength: { value: 5, message: 'This field must be at least 5 characters' }
					}} />

				{errors.phone && <HelperText style={{ color: 'red' }}>{errors.phone.message}</HelperText>}
				<Controller
					control={control}
					name='phone'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							label={'Phone number'}
							onChangeText={value => onChange(value)}
							onBlur={onBlur}
							value={value}
							leftIcon={<Ionicons name="call" size={20} color="#666" />} />
					)}
					rules={{
						required: { value: true, message: 'This field is required!' },
						validate: value => {
							return /^[0-9]*$/.test(value) || `Only numbers are allowed 😞`
						},
						minLength: { value: 6, message: 'This field must be at least 6 characters' }
					}} />

				{errors.password && <HelperText style={{ color: 'red' }}>{errors.password.message}</HelperText>}
				<Controller
					control={control}
					name='password'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							label={'Password'}
							onChangeText={value => onChange(value)}
							onBlur={onBlur}
							value={value}
							leftIcon={<Ionicons name="key" size={20} color="#666" />} />
					)}
					rules={{
						required: { value: true, message: 'This field is required!' },
						minLength: { value: 6, message: 'This field must be at least 6 characters' }
					}} />

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
							leftIcon={<Ionicons name="car" size={20} style={{ marginRight: 10 }} color="#666" />} />
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
							leftIcon={<Ionicons name="file-tray-full" size={20} style={{ marginRight: 10 }} color="#666" />} />
					)}
					rules={{
						required: { value: true, message: 'This field is required!' },
						minLength: { value: 6, message: 'This field must be at least 6 characters' }
					}} />

				<Button
					icon={<Ionicons name="person-add" size={20} style={{ marginRight: 10 }} color="white" />}
					onPress={handleSubmit(onSubmit)}
					style={{ margin: 10 }}
					buttonStyle={{ backgroundColor: '#8291AD' }}
					title='Register' />
				<Button
					icon={<Ionicons name="arrow-back-circle" size={20} style={{ marginRight: 10 }} color="white" />}
					onPress={() => navigation.navigate('Login')}
					style={{ margin: 10 }}
					buttonStyle={{ backgroundColor: '#8291AD' }}
					title='Back' />
			</View>
		</ScrollView>
	)
}

export default RegisterScreen