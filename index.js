import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './screen/log-in'
import RegisterScreen from './screen/register'
import UserScreen from './screen/user-screen'
import PaymentScreen from './screen/pre-payment'
import PostPaymentScreen from './screen/post-payment'
import VehiclesScreen from './screen/vehicles'
import MenuScreen from './screen/menu'
import AddVehicle from './screen/add-vehicle'
import GoogleMap from './screen/map'
import HVTMap from './screen/floor-plan'
import BachKhoaMap from './screen/floor-plan-2'

// const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// function BottomBar() {

// 	return (
// 		<Tab.Navigator initialRouteName='Homepage' screenOptions={{ headerShown: false }}>
// 			<Tab.Screen name='Homepage' component={MapScreen} />
// 			<Tab.Screen name='Settings' component={UserScreen} />
// 			<Tab.Screen name='Vehicles' component={VehiclesScreen} />
// 		</Tab.Navigator>
// 	)
// }

function App() {

	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name='Login' component={LoginScreen} />
				<Stack.Screen name='Homepage' component={GoogleMap} />
				<Stack.Screen name='User' component={UserScreen} />
				<Stack.Screen name='Vehicles' component={VehiclesScreen} />
				<Stack.Screen name='Addvehicle' component={AddVehicle} />
				<Stack.Screen name='Menu' component={MenuScreen} />
				<Stack.Screen name="Register" component={RegisterScreen} />
				<Stack.Screen name="Payment" component={PaymentScreen} />
				<Stack.Screen name="PostPayment" component={PostPaymentScreen} />
				<Stack.Screen name="-NlPFapga5nR38-bU4N7" component={HVTMap} />
				<Stack.Screen name="-NlSHotmSczuAy6vWbYX" component={BachKhoaMap} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default App
