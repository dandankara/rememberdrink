
import { StatusBar } from 'expo-status-bar';
import { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import AsyncStorageStatic  from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon' 


const amount = [250, 500, 1000, 1500];

const storeDataProgress = async ( value, key = "@amount") => {
  try {
    await AsyncStorageStatic.setItem(key, value)
  } catch(err) {
    console.log(err)
  }
}

const getDataProgress = async (key, setValue) => {
  try {
    const value = await AsyncStorageStatic.getItem(key)
    if(value !== null) {
      setValue(Number(value))
    }
  } catch (err) {
    console.log(err)
  }
}

const renderConfetti = () => {
  return (<ConfettiCannon count={200} origin={{ x: 50, y: 50}} fadeOut={true} />)
} 

export default function App() {
  const [fillPercent, setFillPercent] = useState(0)
  const [goal, setGoal] = useState(3000);
  const [actualGoal, setActualGoal] = useState(0)
  const [isGoalGot, setIsGoaGot] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)


  //Bar animation
  const heightBar = useRef(new Animated.Value(0)).current
  const percentBarProgress = heightBar.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", '100%']
  });

  useEffect(() => {
    Animated.timing(heightBar,{
      duration: 1500,
      toValue: fillPercent / 3,
      useNativeDriver: false
    }).start()
  },[fillPercent])

  useEffect(() => {
    storeDataProgress(goal.toString(), "@goal");
  },[goal])

  useEffect(() => {
    storeDataProgress(actualGoal.toString(), "@amount");
  },[goal])

  useEffect(() => {
    let percent = (actualGoal * 100) / goal
    let fill = (percent * 300) / 100
    setFillPercent(fill > 300 ? 300 : fill)
  }, [goal, setFillPercent, actualGoal])

  useEffect(() => {
    if(actualGoal >= goal && isGoalGot === false) {
      setIsGoaGot(true)
    }

    if(actualGoal < goal && isGoalGot === true) {
      setIsGoaGot(false)
    }

    if(showConfetti === false && isGoalGot === true){
      setShowConfetti(true)
    } else {
      setShowConfetti(false)
    }
  } ,[actualGoal, isGoalGot, goal])

  return (
      <SafeAreaView style={styles.container}>
        {showConfetti && renderConfetti()}
        <View style={styles.headerAddGoal}>
          <Text style={styles.textGoal}>Sua meta</Text>
          <View style={styles.viewGoalAndButtons}>
            <Text style={styles.numberGoal}>
              {goal} mL
            </Text>
            <TouchableOpacity onPress={() => setGoal(goal + 250)}>
            <Ionicons name="add-circle" size={26} color="#2389da" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGoal(goal - 250)}>
            <Ionicons name="remove-circle" size={26} color="#2389da" />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text>Você já bebeu</Text>
          <Text>{actualGoal} mL</Text>
          <Text>de água</Text>

          <View style={styles.barProgressContainer}>
            <Animated.View
              style={{
                height: percentBarProgress,
                backgroundColor: '#5abcd8',
                borderRadius:20
              }}
             />
          </View>
        </View>
      <StatusBar style='auto' />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFF'
  },
  headerAddGoal:{
    display: 'flex',
    padding:50,
    alignItems:'center'
  },
  viewGoalAndButtons:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop: 10
  },
  barProgressContainer:{
    borderRadius:20,
    borderWidth: 1,
    width:40,
    height:300,
    justifyContent: 'flex-end'
  },
  textGoal:{
    color:'#2389da',
    fontWeight:'600',
    fontSize: 24
  },
  numberGoal:{
    fontSize:26,
    
  }
})