import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/app/HomeScreen';
import Big5Stack from './Big5Stack';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home Screen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home Screen" component={HomeScreen} />
      <Stack.Screen name="Big 5 Stack" component={Big5Stack} />
    </Stack.Navigator>
  );
};

export default AppStack;
