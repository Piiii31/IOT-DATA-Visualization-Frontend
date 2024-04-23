import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Form from './components/Form';
import HomePage from './components/HomePage';
import Listitem from './components/Listitem';
import EditForm from './components/EditForm';
import Charts from './components/Charts';
import { QueryClient, QueryClientProvider } from 'react-query';









// Create a stack navigator
const Stack = createStackNavigator();
const queryClient = new QueryClient();


function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{
            headerShown: false, // Add this line to hide the header
          }}
        />
        <Stack.Screen name="Form" component={Form} />
        <Stack.Screen name="EditForm" component={EditForm} />
        <Stack.Screen name="Charts" component={Charts} />
        
      </Stack.Navigator>
    </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;
