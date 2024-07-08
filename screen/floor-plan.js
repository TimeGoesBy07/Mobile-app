import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Button } from '@rneui/base'
import axios from 'axios'
import { Input } from '@rneui/themed'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import HandleBook from "./handle-book"

function HVTMap(props) {
	const [selected, setSelected] = useState()
	const [status, setStatus] = useState()
	const [highlight, setHighlight] = useState(true)
	const correctSlot = 'slot-10:'
	const wrongSlot = 'slot-14:'

	useEffect(() => {
		setStatus(props['status']['status'])
	}, [props])

	useEffect(() => {
		console.log(selected)
	}, [selected])

	return (
		<View>
			<Text style={{ fontSize: 22, fontWeight: "700" }}>Pick a slot</Text>
			{status && <View class="mapContainer" style={styles.container}>
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
							{/* <td className="cube" style={{ backgroundColor: `${Object.values(element)[0] === 'empty' ? 'blue' : 'red'}` }}>{Object.keys(element)[0]}</td>
                            {(i === 0 || i === 2) && <Text></Text>} */}
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
							{/* <td className="cube" style={{ backgroundColor: `${Object.values(element)[0] === 'empty' ? 'blue' : 'red'}` }}>{Object.keys(element)[0]}</td>
                            {(i === 0 || i === 2) && <Text></Text>} */}
						</>
						)
					})}
				</View>
				<View style={styles.row}>
					{(status.slice(8, 12)).map((element, i) => {
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
							{/* <td className="cube" style={{ backgroundColor: `${Object.values(element)[0] === 'empty' ? 'blue' : 'red'}` }}>{Object.keys(element)[0]}</td>
                            {(i === 0 || i === 2) && <Text></Text>} */}
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
							{/* <td className="cube" style={{ backgroundColor: `${Object.values(element)[0] === 'empty' ? 'blue' : 'red'}` }}>{Object.keys(element)[0]}</td>
                            {(i === 0 || i === 2) && <Text></Text>} */}
						</>
						)
					})}
				</View>
				<View style={styles.row}>
					{(status.slice(16, 20)).map((element, i) => {
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
							{/* <td className="cube" style={{ backgroundColor: `${Object.values(element)[0] === 'empty' ? 'blue' : 'red'}` }}>{Object.keys(element)[0]}</td>
                            {(i === 0 || i === 2) && <Text></Text>} */}
						</>
						)
					})}
				</View>
			</View>}
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

export default HVTMap