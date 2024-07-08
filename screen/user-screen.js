import React, { useState, useEffect } from 'react'
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Button } from '@rneui/base'
import { Input } from '@rneui/themed'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Dialog from "react-native-dialog"
import axios from 'axios'
import { Avatar } from 'react-native-elements'
import { Card } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { updatePassword, getAuth, reauthenticateWithCredential, EmailAuthProvider } from '@firebase/auth'

const UserScreen = ({ navigation }) => {
	const getUserAPI = 'https://us-central1-smart-parking-369015.cloudfunctions.net/getUser'
	const updateData = 'https://us-central1-smart-parking-369015.cloudfunctions.net/updateData'
	const [loading, setLoading] = useState(true)
	const [userData, setUserData] = useState()
	const [edit, setEdit] = useState(false)
	const [newPw, setNewPw] = useState('')
	const [newPhone, setNewPhone] = useState('')
	const [newUsername, setNewUsername] = useState('')

	const handleUpdateData = () => {
		setLoading(true)

		if (newPw !== '') {
			const credential = EmailAuthProvider.credential(userData['emailAddress'], userData['password'])

			reauthenticateWithCredential(getAuth().currentUser, credential).then(() => {
				updatePassword(getAuth().currentUser, newPw).then(() => {
					console.log('Password updated')
				}).catch(error => console.log(error))
			}).catch(error => console.log(error))
		}

		axios.post(updateData, {
			newPassword: newPw !== '' ? newPw : userData['password'],
			newPhone: newPhone !== '' ? newPhone : userData['phone'],
			newUsername: newUsername !== '' ? newUsername : userData['username'],
			uid: userData['id'],
			key: userData['key']
		}).then(() => {
			getUser()
			setLoading(false)
			setEdit(false)
		})
	}

	const getUser = async () => {
		setLoading(true)

		try {
			const user = await AsyncStorage.getItem('user')

			axios.get(getUserAPI, { params: { uid: Object.values(JSON.parse(user))[0]['id'] } }).then((response) => {
				setUserData(Object.values(response.data)[0])
				setLoading(false)
			}).catch((error) => console.error(error))
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => getUser())

		return unsubscribe
	}, [navigation])

	useEffect(() => {
		getUser()
	}, [])

	return (
		<ScrollView style={{ flex: 1, backgroundColor: '#8291AD' }}>
			<View style={{ paddingHorizontal: 25, paddingVertical: 55 }}>
				<Dialog.Container visible={loading}>
					<Dialog.Title><ActivityIndicator size='small' color='#8291AD' /> Loading...</Dialog.Title>
				</Dialog.Container>

				{userData && <View>
					<View style={{ alignItems: 'center' }}>
						<Avatar
							containerStyle={{ marginVertical: 10, marginBottom: 10 }}
							// overlayContainerStyle={{ backgroundColor: '#8291AD' }}
							rounded
							size={140}
							activeOpacity={0.7}
							icon={{ name: 'user', type: 'font-awesome' }} />
					</View>
					<Card style={{ marginVertical: 10 }}>
						<Card.Content>
							<Input
								disabled
								placeholder={userData['emailAddress']}
								leftIcon={<Ionicons name="mail" size={20} color="#666" />} />
							<Input
								disabled={edit ? false : true}
								placeholder={userData['username']}
								onChangeText={newText => setNewUsername(newText)}
								leftIcon={<Ionicons name="person-circle" size={20} color="#666" />} />
							<Input
								disabled
								placeholder={userData['money']}
								leftIcon={<Ionicons name="card" size={20} color="#666" />} />
							<Input
								disabled={edit ? false : true}
								placeholder={userData['phone']}
								onChangeText={newText => setNewPhone(newText)}
								leftIcon={<Ionicons name="call" size={20} color="#666" />} />
							<Input
								disabled={edit ? false : true}
								placeholder={userData['password']}
								onChangeText={newText => setNewPw(newText)}
								leftIcon={<Ionicons name="lock-closed" size={20} color="#666" />} />
						</Card.Content>
						<Button
							icon={<Ionicons name="pencil" size={20} style={{ marginRight: 10 }} color="white" />}
							onPress={() => setEdit(!edit)}
							style={{ margin: 10 }}
							buttonStyle={{ backgroundColor: '#8291AD' }}
							title='Edit' />
						{edit && <Button
							icon={<Ionicons name="arrow-back-circle" size={20} style={{ marginRight: 10 }} color="white" />}
							onPress={() => handleUpdateData()}
							style={{ margin: 10 }}
							buttonStyle={{ backgroundColor: '#8291AD' }}
							title='Update' />}
						<Button
							icon={<Ionicons name="arrow-back-circle" size={20} style={{ marginRight: 10 }} color="white" />}
							onPress={() => navigation.goBack()}
							style={{ margin: 10 }}
							buttonStyle={{ backgroundColor: '#8291AD' }}
							title='Back' />
					</Card>
				</View>}
			</View>
		</ScrollView>
	)
}

export default UserScreen