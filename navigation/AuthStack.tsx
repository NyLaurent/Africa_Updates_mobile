import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../src/screens/auth/LoginScreen';
import SignupScreen from '../src/screens/auth/SignupScreen';
import type { AuthStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerBackTitle: '',
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTransparent: true,
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          headerTitle: '',
        }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{
          headerTitle: '',
        }}
      />
    </Stack.Navigator>
  );
} 