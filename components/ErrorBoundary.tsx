// components/ErrorBoundary.tsx

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { designTokens } from '../theme/designTokens';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// A simple fallback component to display when an error occurs
const ErrorFallback = ({ onReset }: { onReset: () => void }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Oops! Something went wrong.</Text>
    <Text style={styles.subtitle}>We've logged the error and will fix it.</Text>
    <Button title="Try Again" onPress={onReset} color={designTokens.colors.primary} />
  </View>
);

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: designTokens.colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: designTokens.colors.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: designTokens.colors.textSecondary,
  },
});

export default ErrorBoundary;