// screens/TestScreen.tsx
import { View, Text, StyleSheet } from 'react-native';
import { testMessage } from '../utils/testHelper';

const TestScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{testMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24 }
});

export default TestScreen;