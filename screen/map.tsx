import React from 'react'
import "react-native-gesture-handler"
import { ActivityIndicator, Dimensions, StyleSheet, Text, View, Pressable } from "react-native"
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { Image } from 'react-native'
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import * as Location from "expo-location"
import Constants from "expo-constants"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import MapViewDirections, { MapDirectionsResponse } from "react-native-maps-directions"
import RenderHtml from "react-native-render-html"
import axios from "axios"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Modal from "react-native-modal"
import { ScrollView } from 'react-native-gesture-handler'
import Dialog from "react-native-dialog"
import { DataTable } from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons'

const { width: SCREEN_WIDTH } = Dimensions.get("window")

type LocationType = {
	latitude: number;
	longitude: number;
	latitudeDelta: number;
	longitudeDelta: number;
}

type LatLongType = {
	latitude: number;
	longitude: number;
}

const listUrl = "https://us-central1-smart-parking-369015.cloudfunctions.net/displayParkingList"
const API_KEY = "AIzaSyA49f4RJecmxCQmfoXwNZ1Xn_R8paeCy9U"
const VND = new Intl.NumberFormat("vi-VN", { currency: "VND", })

export default function GoogleMap({ navigation }) {
	const bottomSheetRef = useRef<BottomSheet>(null)
	const snapPoints = useMemo(() => ["25%", "50%"], [])
	const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null)
	const [origin, setOrigin] = useState<LatLongType | null>(null)
	const [mapDirectionResponse, setMapdirectionResponse] = useState<MapDirectionsResponse | null>(null)
	const [destination, setDestination] = useState<LatLongType | null>(null)
	const [listData, setListData] = useState<unknown[]>([])
	const [errorMsg, setErrorMsg] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [popUpInfo, setPopUpInfo] = useState({ "description": "adfafafadfafd", "geo": [10.7694, 106.6938], "id": "afe5357f-ec26-42bf-ad88-d488a8a2df1d", "key": "-NndA-yFQn72_7Ne8P1w", "location": "Moon123", "name": "DogTester", "price": "30000", "status": [] })
	const [modalVisible, setModalVisible] = useState(false)
	const [temp, setTemp] = useState<LatLongType | null>(null)

	const findNearestMarker = (userLocation: any) => {
		let minDistance = Infinity
		let nearestMarker = null

		listData.forEach((marker: any) => {
			let temp = Object.keys(marker)[0]
			const distance = getDistance(userLocation, marker[temp].geo)

			if (distance < minDistance) {
				minDistance = distance
				nearestMarker = marker[temp]
			}

			console.log('min is: ', minDistance)
		})

		return nearestMarker
	}

	const goToTheNearest = () => {
		setDestination({ latitude: findNearestMarker(currentLocation).geo[0], longitude: findNearestMarker(currentLocation).geo[1] })
		setPopUpInfo(findNearestMarker(currentLocation))
	}

	const getDistance = (location1: any, location2: any) => {
		const toRad = (x: any) => (x * Math.PI) / 180
		const R = 6371 // radius of Earth in km

		const dLat = toRad(location2[0] - location1.latitude)
		const dLon = toRad(location2[1] - location1.longitude)

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(toRad(location1.latitude)) *
			Math.cos(toRad(location2[0])) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2)
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
		const d = R * c

		return d
	}

	const goToMarker = (element: any) => {
		setPopUpInfo(element)
		setDestination({ latitude: element.geo[0], longitude: element.geo[1] })
		setModalVisible(!modalVisible)
	}

	const fetchList = () => {
		axios.get(listUrl).then((response) => {
			setListData(Object.values(response.data))
		}).catch((error) => console.log("error - ", error))
	}

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			fetchList()
			bottomSheetRef.current && bottomSheetRef.current.close()
		})

		return unsubscribe
	}, [navigation])

	useEffect(() => {
		(async () => {
			fetchList()

			let { status } = await Location.requestForegroundPermissionsAsync()

			if (status !== "granted") {
				setErrorMsg("Permission to access location was denied")
				return
			}

			const locationListener = await Location.watchPositionAsync(
				{
					accuracy: 6, // Độ chính xác cao nhất
					timeInterval: 5000, // Cập nhật vị trí mỗi 5 giây
					distanceInterval: 100, // Cập nhật vị trí mỗi khi di chuyển 10 mét
				},
				(location) => {
					const { latitude, longitude } = location.coords
					console.log("update location")

					if (!origin) setOrigin({ latitude, longitude })
					setCurrentLocation({
						latitude,
						longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					})
				}
			)

			return () => {
				if (locationListener) {
					locationListener.remove()
				}
			}
		})()
	}, [])

	let text = "Waiting..."

	if (errorMsg) {
		text = errorMsg
	} else if (currentLocation) {
		text = JSON.stringify(currentLocation)
	}

	const handleSheetChanges = useCallback((index: number) => {
		console.log("handleSheetChanges", index)
	}, [])

	useEffect(() => {
		if (bottomSheetRef.current) {
			if (origin && destination) {
				bottomSheetRef.current?.snapToIndex(0)
			} else {
				bottomSheetRef.current?.snapToIndex(-1)
			}
		}
	}, [origin, destination])

	const [page, setPage] = useState<number>(0)
	const numberOfItemsPerPageList = [5, 3, 4]
	const [numberOfItemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0])

	const from = page * numberOfItemsPerPage
	const to = Math.min((page + 1) * numberOfItemsPerPage, listData.length)

	useEffect(() => {
		setPage(0)
	}, [numberOfItemsPerPage])

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View style={styles.container}>
				{currentLocation ? (
					<>
						<View
							style={{
								backgroundColor: 'white',
								flexDirection: "row",
								alignItems: "center",
								position: "absolute",
								top: Constants.statusBarHeight + 10,
								zIndex: 20,
								marginHorizontal: 20,
							}}>
							<Dialog.Container visible={loading}>
								<Dialog.Title><ActivityIndicator size='small' color='#8291AD' /> Loading...</Dialog.Title>
							</Dialog.Container>
							<GooglePlacesAutocomplete
								placeholder="Search ..."
								fetchDetails
								onPress={(data, details = null) => {
									// 'details' is provided when fetchDetails = true
									// console.log("details - ,", data)
									setDestination({
										latitude: details?.geometry.location.lat || 0,
										longitude: details?.geometry.location.lng || 0,
									});
								}}
								query={{
									key: API_KEY,
									language: "vi",
								}}
								onFail={(error) => console.log("error - ", error)}
								styles={{
									textInput: {
										fontSize: 16,
										borderRadius: 30,
										paddingHorizontal: 20,
										height: 50,
									},
								}} />
							{currentLocation && listData.length !== 0 && <Ionicons color={'#8291AD'} style={{ margin: 5 }} name='flash' onPress={() => goToTheNearest()} size={30} />}
							{listData.length !== 0 && <Ionicons style={{ margin: 5 }} color={'#8291AD'} name='list' onPress={() => setModalVisible(!modalVisible)} size={30} />}
							<Ionicons style={{ margin: 5 }} color={'#8291AD'} name='grid' onPress={() => navigation.navigate('Menu')} size={30} />
						</View>
						<MapView
							// provider={PROVIDER_GOOGLE}
							style={styles.map}
							initialRegion={currentLocation}
							showsUserLocation>
							{/* {origin && (
								<Marker
									coordinate={origin}
									title="Your Location"
									description="This is your start address"
								/>
							)} */}
							{/* {destination ? (
								<Marker
									coordinate={destination}
									title="Your Location"
									description="This is your end address"
									pinColor="#000"
								/>
							) : null} */}
							{origin && destination ? (
								<MapViewDirections
									origin={origin}
									destination={destination}
									apikey={API_KEY}
									strokeWidth={5}
									strokeColor="crimson"
									onError={(errorMessage) => {
										// console.log('GOT AN ERROR');
										console.log("MapViewDirections error - ", errorMessage)
									}}
									onStart={() => setLoading(true)}
									onReady={(response: MapDirectionsResponse) => {
										console.log("map direction response - ", response)
										setMapdirectionResponse(response)
										setLoading(false)
									}}
									language="vi" />
							) : null}
							{currentLocation &&
								listData &&
								listData.map((element: any) => {
									let temp = Object.keys(element)[0]

									return (
										<Marker
											title="Marker"
											key={element[temp].key}
											coordinate={{
												latitude: element[temp].geo[0],
												longitude: element[temp].geo[1],
											}}
											onPress={(e) => {
												setLoading(true)
												setPopUpInfo(element[temp])
												setDestination(e.nativeEvent.coordinate)
												setLoading(false)
											}}>
											<Image
												style={{ width: 30, height: 30 }}
												source={require('./car-marker.png')} />
											<Callout>
												<View
													style={{
														flex: 1,
														justifyContent: "center",
														alignItems: "center",
														width: 120
													}}>
													<Text>
														{VND.format(element[temp].price)} VND/hour
													</Text>
												</View>
											</Callout>
										</Marker>
									)
								})}
						</MapView>
						<BottomSheet
							ref={bottomSheetRef}
							index={-1}
							snapPoints={snapPoints}
							onChange={handleSheetChanges} >
							<BottomSheetScrollView style={styles.contentContainer} >
								{loading ? (
									<View style={{ paddingVertical: 30 }}>
										<ActivityIndicator size={"large"} />
									</View>
								) : null}
								{mapDirectionResponse && !loading ? (
									<View style={{ gap: 5 }}>
										<Text style={{ fontSize: 22, fontWeight: "700" }}>
											Parking details: {<Ionicons name="arrow-redo-outline" size={20} color="#666" onPress={() => navigation.navigate('Payment', { info: popUpInfo })} />}
										</Text>
										<Text>
											<Text style={{ fontWeight: "700" }}>Name: </Text>
											{popUpInfo.name}
										</Text>
										<Text>
											<Text style={{ fontWeight: "700" }}>Address: </Text>
											{popUpInfo.location}
										</Text>
										<Text>
											<Text style={{ fontWeight: "700" }}>Price per hour: </Text>
											{popUpInfo.price}
										</Text>
										<Text>
											<Text style={{ fontWeight: "700" }}>Available slots: </Text>
											{popUpInfo.status.filter(e => Object.values(e)[0] === 'empty').length}/{popUpInfo.status.length}
										</Text>
										<Text style={{ fontSize: 22 }}>
											<Text style={{ fontWeight: "700" }}>Distance:</Text> {mapDirectionResponse.legs[0].distance.text} (<Text>{mapDirectionResponse.legs[0].duration.text}</Text>)
										</Text>
										<Text>
											<Text style={{ fontWeight: "700" }}>Start: </Text>
											{mapDirectionResponse.legs[0].start_address}
										</Text>
										<Text>
											<Text style={{ fontWeight: "700" }}>End: </Text>
											{mapDirectionResponse.legs[0].end_address}
										</Text>
										<View>
											<Text style={{ fontSize: 22, fontWeight: "700" }}>
												Instructions
											</Text>
											<View>
												{mapDirectionResponse.legs[0].steps.map(
													(item, index) => (
														<View
															style={{
																paddingVertical: 10,
																borderBottomWidth: 1,
																borderBlockColor: "#ccc",
															}}
															key={index}>
															<Text style={{ fontWeight: "700" }}>
																{item.distance.text} (<Text>{item.duration.text}</Text>)
															</Text>
															<RenderHtml
																source={{ html: item.html_instructions }}
																contentWidth={SCREEN_WIDTH - 30} />
														</View>
													)
												)}
											</View>
										</View>
									</View>
								) : null}
							</BottomSheetScrollView>
						</BottomSheet>
					</>
				) : (
					<Text>Loading...</Text>
				)}
				<Modal isVisible={modalVisible}>
					<View >
						<ScrollView contentContainerStyle={styles.modalView}>
							<Text>List of parking lots</Text>
							{listData && <DataTable>
								<DataTable.Header>
									<DataTable.Title>Location</DataTable.Title>
									<DataTable.Title numeric>Price</DataTable.Title>
								</DataTable.Header>

								{listData.slice(from, to).map((element) => {
									let temp = Object.keys(element)[0]

									return (
										<DataTable.Row key={element[temp].name}>
											<DataTable.Cell><MaterialIcons
												name="location-pin"
												size={20}
												color="#666"
												onPress={() => goToMarker(element[temp])} />{element[temp].location}</DataTable.Cell>
											<DataTable.Cell numeric>{element[temp].price}</DataTable.Cell>
										</DataTable.Row>
									)
								})}

								<DataTable.Pagination
									page={page}
									numberOfPages={Math.ceil(listData.length / numberOfItemsPerPage)}
									onPageChange={(page) => setPage(page)}
									label={`${from + 1}-${to} of ${listData.length}`}
									numberOfItemsPerPage={numberOfItemsPerPage}
									showFastPaginationControls
								// numberOfItemsPerPageList={numberOfItemsPerPageList}
								// onItemsPerPageChange={onItemsPerPageChange}
								// selectPageDropdownLabel={'Rows per page'}
								/>
							</DataTable>}
							<Icon style={{ margin: 5 }} name='window-close' onPress={() => setModalVisible(!modalVisible)} size={30} />
						</ScrollView>
					</View>
				</Modal>
			</View>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	modalView: {
		margin: 10,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 15,
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
	map: {
		width: "100%",
		height: "100%",
	},
	contentContainer: {
		padding: 15,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
		margin: 5
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	}
});
