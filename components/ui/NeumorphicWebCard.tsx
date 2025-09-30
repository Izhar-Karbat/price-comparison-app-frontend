import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

interface NeumorphicWebCardProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  width?: number;
  height?: number;
  borderRadius?: number;
  variant?: 'raised' | 'pressed';
}

const NeumorphicWebCard: React.FC<NeumorphicWebCardProps> = ({
  width = 300,
  height = 150,
  borderRadius = 20,
  variant = 'raised',
  style,
}) => {

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 20px;
          background: #F7F5F3;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .neumorphic-card {
          width: ${width - 40}px;
          height: ${height - 40}px;
          border-radius: ${borderRadius}px;
          background: #F7F5F3;
          ${variant === 'raised' ? `
            box-shadow:
              20px 20px 60px #d2d0ce,
              -20px -20px 60px #ffffff;
          ` : `
            box-shadow:
              inset 20px 20px 60px #d2d0ce,
              inset -20px -20px 60px #ffffff;
          `}
        }
      </style>
    </head>
    <body>
      <div class="neumorphic-card"></div>
    </body>
    </html>
  `;

  return (
    <View style={[styles.container, { width, height }, style]}>
      <WebView
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  webview: {
    backgroundColor: 'transparent',
  },
});

export default NeumorphicWebCard;