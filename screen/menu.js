import React from 'react'
import { ScrollView, View } from 'react-native'
import { Button } from 'react-native-elements'
import { Card } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FIREBASE_AUTH } from '../firebase/config.js'
import { signOut } from '@firebase/auth'
import Ionicons from 'react-native-vector-icons/Ionicons'

const MenuScreen = ({ navigation }) => {
	const handleLogOut = () => {
		signOut(FIREBASE_AUTH).then(async () => {
			try {
				await AsyncStorage.removeItem('user')
				navigation.navigate('Login')
			} catch (error) {
				console.log(error)
			}
		}).catch((error) => {
			console.log(error)
		})
	}

	return (
		<ScrollView style={{ flex: 1, backgroundColor: '#8291AD' }}>
			<View style={{ paddingHorizontal: 25, paddingVertical: 55 }}>
				<Card>
					<Card.Content>
						<Button
							icon={<Ionicons name="person" size={20} style={{ marginRight: 10 }} color="white" />}
							onPress={() => navigation.navigate('User')}
							style={{ margin: 10 }}
							buttonStyle={{ backgroundColor: '#8291AD' }}
							title='User information' />
						<Button
							icon={<Ionicons name="car-sport" size={20} style={{ marginRight: 10 }} color="white" />}
							onPress={() => navigation.navigate('Vehicles')}
							style={{ margin: 10 }}
							buttonStyle={{ backgroundColor: '#8291AD' }}
							title='Your Vehicles' />
						<Button
							icon={<Ionicons name="log-out" size={20} style={{ marginRight: 10 }} color="white" />}
							onPress={() => handleLogOut()}
							style={{ margin: 10 }}
							buttonStyle={{ backgroundColor: '#8291AD' }}
							title='Sign out' />
						<Button
							icon={<Ionicons name="arrow-back-circle" size={20} style={{ marginRight: 10 }} color="white" />}
							onPress={() => navigation.navigate('Homepage')}
							style={{ margin: 10 }}
							buttonStyle={{ backgroundColor: '#8291AD' }}
							title='Back' />
					</Card.Content>
				</Card>
			</View>
		</ScrollView>
	)
}

export default MenuScreen