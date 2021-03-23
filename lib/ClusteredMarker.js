import React, { memo } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Marker } from "react-native-maps";
import { returnMarkerStyle } from "./helpers";
import Pie from 'react-native-pie';

class ClusteredMarker extends React.PureComponent<Props, State> { 
  getSections = ()  => {
    const { properties } = this.props
    const series = []
    const points = properties.point_count
    const storeFormatId = properties.fak.map((elem) => {
       return elem.properties.idColor
    })
    storeFormatId.forEach((elem) => {
      const id = properties.fak.filter(item => {
        return item.properties.idColor === elem
      })
      if (id.length && id.length === storeFormatId.length) {
        return series.push({percentage: 100, color:id[0].properties.color})
      }
      if (id.length) {
        series.push({percentage: id.length * 100/points   , color:id[0].properties.color})
      }
    })
   return series
  }

  render() {
    const {  
      geometry,
      properties,
      onPress,
      tracksViewChanges,} = this.props
      const points = properties.point_count;
      const { width, height } = returnMarkerStyle(points);
      const sections = this.getSections()

    return(
      <Marker
        key={`${geometry.coordinates[0]}_${geometry.coordinates[1]}`}
        coordinate={{
          longitude: geometry.coordinates[0],
          latitude: geometry.coordinates[1],
        }}
        onPress={onPress}
        tracksViewChanges={tracksViewChanges}
      >
      <TouchableOpacity
        activeOpacity={0.5}
        style={[styles.container, { width, height, zIndex:9 }]}
      >
        <Pie
          radius={25}
          innerRadius={20}
          sections={sections}
         >
        </Pie>
        <View style={[styles.gauge]}>
          <Text style={styles.gaugeText}>
            {points}
          </Text>
         </View>
      </TouchableOpacity>
    </Marker>
    )
  }
    
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    position: "absolute",
    // opacity: 0.5,
    zIndex: 0,
  },
  cluster: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  text: {
    fontWeight: "bold",
  },
  gauge: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 50 / 2,
  },
  gaugeText: {
    backgroundColor: 'transparent',
    color: '#000',
    fontSize: 24,
  },
});

export default memo(ClusteredMarker);
