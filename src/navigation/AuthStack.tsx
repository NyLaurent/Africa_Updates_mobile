import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import UserHomePage from '../screens/UserHomePage';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export function AuthStack() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated() ? "UserHome" : "Login"}
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
      {isAuthenticated() ? (
        <Stack.Screen 
          name="UserHome" 
          component={UserHomePage}
          options={{
            headerShown: false,
          }}
        />
      ) : (
        <>
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
        </>
      )}
    </Stack.Navigator>
  );
} 