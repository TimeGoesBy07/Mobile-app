import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import HandleBook from "./handle-book"
import { SelectList } from "react-native-dropdown-select-list"

function BachKhoaMap(props) {
	const [status, setStatus] = useState()
	const [selected, setSelected] = useState()
	const [floor, setFloor] = useState()
	const [highlight, setHighlight] = useState(true)
	const correctSlot = 'slot-10:'
	const wrongSlot = 'slot-14:'

	useEffect(() => {
		setStatus(props['status']['status'])
	}, [props])

	const renderConditionally = () => {
		switch (floor) {
			case 'Ground':
				return (<View class="mapContainer" style={styles.container}>
					<View style={styles.row}>
						<Text style={styles.wall}>Wall</Text>
						<Text style={styles.wall}>Wall</Text>
						<Text style={styles.wall}>Wall</Text>
						<Text style={styles.wall}>Wall</Text>
						<Text style={styles.wall}>Wall</Text>
						<Text style={styles.wall}>Wall</Text>
					</View>
					<View style={styles.row}>
						{(status.slice(0, 4)).map((element, i) => {
							return (<>
								<TouchableOpacity style={{
									flex: 1,
									padding: 10,
									backgroundColor: '#bbb',
									margin: 1,
									backgroundColor: `${highlight === true ? (Object.keys(element)[0] === correctSlot ? 'green' : (Object.keys(element)[0] === wrongSlot ? 'yellow' : (Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C'))) : (Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C')}`
								}}
									onPress={() => Object.values(element)[0] === 'empty' && setSelected(Object.keys(element)[0])}>
									<Text>{Object.keys(element)[0]}</Text>
								</TouchableOpacity>
								{(i === 0 || i === 2) && <Text style={styles.road}></Text>}
							</>
							)
						})}
					</View>
					<View style={styles.row}>
						{(status.slice(4, 8)).map((element, i) => {
							return (<>
								<TouchableOpacity style={{
									flex: 1,
									padding: 10,
									backgroundColor: '#bbb',
									margin: 1,
									backgroundColor: `${highlight === true ? (Object.keys(element)[0] === correctSlot ? 'green' : (Object.keys(element)[0] === wrongSlot ? 'yellow' : (Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C'))) : (Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C')}`
								}}
									onPress={() => Object.values(element)[0] === 'empty' && setSelected(Object.keys(element)[0])}>
									<Text>{Object.keys(element)[0]}</Text>
								</TouchableOpacity>
								{(i === 0 || i === 2) && <Text style={styles.road}></Text>}
							</>
							)
						})}
					</View>
				</View>)

			case 'First':
				return (<View class="mapContainer" style={styles.container}>
					<View style={styles.row}>
						<Text style={styles.wall}>Wall</Text>
						<Text style={styles.wall}>Wall</Text>
						<Text style={styles.wall}>Wall</Text>
						<Text style={styles.wall}>Wall</Text>
						<Text style={styles.wall}>Wall</Text>
						<Text style={styles.wall}>Wall</Text>
					</View>
					<View style={styles.row}>
						{(status.slice(8, 12)).map((element, i) => {
							return (<>
								<TouchableOpacity 
								key={i}
								style={{
									flex: 1,
									padding: 10,
									backgroundColor: '#bbb',
									margin: 1,
									backgroundColor: `${highlight === true ? (Object.keys(element)[0] === correctSlot ? 'green' : (Object.keys(element)[0] === wrongSlot ? 'yellow' : (Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C'))) : (Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C')}`
								}}
									onPress={() => Object.values(element)[0] === 'empty' && setSelected(Object.keys(element)[0])}>
									<Text>{Object.keys(element)[0]}</Text>
								</TouchableOpacity>
								{(i === 0 || i === 2) && <Text style={styles.road}></Text>}
							</>
							)
						})}
					</View>
					<View style={styles.row}>
						{(status.slice(12, 16)).map((element, i) => {
							return (<>
								<TouchableOpacity style={{
									flex: 1,
									padding: 10,
									backgroundColor: '#bbb',
									margin: 1,
									backgroundColor: `${highlight === true ? (Object.keys(element)[0] === correctSlot ? 'green' : (Object.keys(element)[0] === wrongSlot ? 'yellow' : (Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C'))) : (Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C')}`
								}}
									onPress={() => Object.values(element)[0] === 'empty' && setSelected(Object.keys(element)[0])}>
									<Text>{Object.keys(element)[0]}</Text>
								</TouchableOpacity>
								{(i === 0 || i === 2) && <Text style={styles.road}></Text>}
							</>
							)
						})}
					</View>
				</View>)

			case 'Second':
				return (<View class="mapContainer" style={styles.container}>
					<View style={styles.row}>
						<Text style={styles.wall}>Wall</Text>
						<Text style={styles.wall}>Wall</Text>
						<Text style={styles.wall}>Wall</Text>
						<Text style={styles.wall}>Wall</Text>
						<Text style={styles.wall}>Wall</Text>
						<Text style={styles.wall}>Wall</Text>
					</View>
					<View style={styles.row}>
						{(status.slice(16, 20)).map((element, i) => {
							return (<>
								<TouchableOpacity
									key={Object.keys(element)[0]}
									style={{
										flex: 1,
										padding: 10,
										backgroundColor: '#bbb',
										margin: 1,
										backgroundColor: `${highlight === true ? (Object.keys(element)[0] === correctSlot ? 'green' : (Object.keys(element)[0] === wrongSlot ? 'yellow' : (Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C'))) : (Object.values(element)[0] === 'empty' ? '#33B5FF' : '#FF4C4C')}`
									}}
									onPress={() => Object.values(element)[0] === 'empty' && setSelected(Object.keys(element)[0])}>
									<Text>{Object.keys(element)[0]}</Text>
								</TouchableOpacity>
								{(i === 0 || i === 2) && <Text style={styles.road}></Text>}
							</>
							)
						})}
					</View>
				</View>)

			default:
				break
		}
	}

	return (
		<View>
			<Text>Select area</Text>
			<SelectList
				boxStyles={{ marginBottom: 20, marginTop: 20 }}
				search={false}
				placeholder='Area'
				setSelected={(val) => setFloor(val)}
				data={['Ground', 'First', 'Second']}
				save="value" />
			{status && renderConditionally()}
			{highlight === true && <HandleBook slot={selected} user={props.user} park={props['status']} />}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		border: "1px solid #000000",
		overflow: "auto",
		height: "800px",
		backgroundColor: "#f5f5f5",
		marginVertical: 40,
		marginHorizontal: 6,
		alignItems: "center"
	},
	row: {
		flexDirection: 'row',
	},
	road: {
		flex: 1,
		margin: 1,
		padding: 10,
		backgroundColor: 'gray'
	},
	wall: {
		flex: 1,
		padding: 10,
		backgroundColor: 'brown',
		margin: 1,
	},
	cube: {
		flex: 1,
		padding: 10,
		backgroundColor: '#bbb',
		margin: 1,
	},
})

export default BachKhoaMap