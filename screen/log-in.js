import React, { useState } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Button } from 'react-native-elements'
import { Input } from '@rneui/themed'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { SocialIcon } from 'react-native-elements'
import { FIREBASE_AUTH } from '../firebase/config.js'
import { useForm, Controller } from 'react-hook-form'
import { signInWithEmailAndPassword } from '@firebase/auth'
import FlashMessage, { showMessage } from 'react-native-flash-message'
import Dialog from "react-native-dialog"
import { HelperText } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const LoginScreen = ({ navigation }) => {
	const getUserAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/findUserByEmail'
	const { handleSubmit, control, formState: { errors } } = useForm()
	const [loading, setLoading] = useState(false)

	const onSubmit = data => {
		setLoading(true)

		signInWithEmailAndPassword(FIREBASE_AUTH, data.email, data.password).then(() => {
			axios.get(getUserAPI, { params: { email: data.email } }).then(async (response) => {
				try {
					await AsyncStorage.setItem('user', JSON.stringify(response.data))
				} catch (error) {
					console.log(error)
				}

				setLoading(false)
				navigation.navigate('Homepage')
			}).catch((error) => console.log(error))
		}).catch(() => {
			setLoading(false)
			showMessage({
				type: 'error',
				message: 'Invalid email or password!',
				color: 'white',
				backgroundColor: '#8291AD'
			})
		})
	}

	return (
		<SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
			<FlashMessage position="top" />

			<Dialog.Container visible={loading}>
				<Dialog.Title><ActivityIndicator size='small' color='#8291AD' /> Loading...</Dialog.Title>
			</Dialog.Container>

			<View style={{ paddingHorizontal: 25 }}>
				<Text
					style={{
						fontSize: 28,
						fontWeight: '500',
						color: '#333',
						marginBottom: 30,
					}}>
					Login
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
				<Button
					onPress={handleSubmit(onSubmit)}
					icon={<Ionicons name="log-in" size={20} style={{ marginRight: 10 }} color="white" />}
					style={{ margin: 10 }}
					buttonStyle={{ backgroundColor: '#8291AD' }}
					title='Log in' />
				<Text style={{ textAlign: 'center', color: '#666', marginBottom: 30, marginTop: 30 }}>
					Or, login with ...
				</Text>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginBottom: 30
					}}>
					<TouchableOpacity
						onPress={() => { }}
						style={{
							borderColor: '#ddd',
							borderWidth: 2,
							borderRadius: 10,
							paddingHorizontal: 15,
							paddingVertical: 15
						}}>
						<SocialIcon type='github' />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => { }}
						style={{
							borderColor: '#ddd',
							borderWidth: 2,
							borderRadius: 10,
							paddingHorizontal: 15,
							paddingVertical: 15
						}}>
						<SocialIcon type='facebook' />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => { }}
						style={{
							borderColor: '#ddd',
							borderWidth: 2,
							borderRadius: 10,
							paddingHorizontal: 15,
							paddingVertical: 15
						}}>
						<SocialIcon type='twitter' />
					</TouchableOpacity>
				</View>

				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'center',
						marginBottom: 30
					}}>
					<Text>New to the app?</Text>
					<TouchableOpacity onPress={() => navigation.navigate('Register')}>
						<Text style={{ color: '#8291AD', fontWeight: '700' }}> Register</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	)
}

export default LoginScreen