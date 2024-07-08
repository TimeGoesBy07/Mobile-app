import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Pressable } from 'react-native'
import HVTMap from './floor-plan'

function TempComponent({ props }) {
    console.log(props)
    const [floorplan, setFloorPlan] = useState({ ...props.carList })

    useEffect(() => {
        setFloorPlan(props.carList);
    }, [props.carList])

    if (floorplan) {
        switch (floorplan['key']) {
            case '-NlPFapga5nR38-bU4N7':
                return <HVTMap status={floorplan['status']} />

            case '-NlSHotmSczuAy6vWbYX':
                return <div>nothing here</div>

            default:
                break
        }
    }
    else {
        <Text>Loading...</Text>
    }
}

export default TempComponent