"use client"

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
  Platform,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Alert
} from "react-native"
import { ArrowLeft, Eye, EyeOff, Mail, User, Lock, Home } from "lucide-react-native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { LinearGradient } from "expo-linear-gradient"
import { useTheme } from "~/context/ThemeContext"
import { useAuth } from "~/context/AuthContext"
import { useNavigation } from '@react-navigation/native'

type Props = {
  navigation: NativeStackNavigationProp<any>
}

export default function MobileLoginScreen({ navigation }: Props) {
  const { isDarkMode } = useTheme()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [navigation, fadeAnim])

  const handleLogin = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(formData.username, formData.email, formData.password);
      
      if (result.error) {
        Alert.alert("Login Failed", result.error);
      } else {
        // Navigate to UserHome on successful login
        navigation.reset({
          index: 0,
          routes: [{ name: 'UserHome' }],
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Top Half - Green Background */}
      <View style={styles.topHalf}>
        <LinearGradient colors={["#10B981", "#059669"]} style={StyleSheet.absoluteFill} />

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Add Home Button */}
        <TouchableOpacity 
          style={styles.homeButton} 
          onPress={() => navigation.navigate('Home')} 
          activeOpacity={0.7}
        >
          <Home size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Header Text */}
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Welcome Back</Text>
          <Text style={styles.headerSubtitle}>Sign in to continue</Text>
        </View>
      </View>

      {/* Bottom Half - Form Container */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.bottomHalf}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
            {/* Username Field */}
            <View style={styles.inputWrapper}>
              <View style={[styles.inputContainer, isDarkMode && styles.inputContainerDark]}>
                <User size={20} color={isDarkMode ? "#9CA3AF" : "#6B7280"} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  placeholder="Username"
                  placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  value={formData.username}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, username: text }))}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.inputWrapper}>
              <View style={[styles.inputContainer, isDarkMode && styles.inputContainerDark]}>
                <Mail size={20} color={isDarkMode ? "#9CA3AF" : "#6B7280"} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  placeholder="Email"
                  placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  value={formData.email}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputWrapper}>
              <View style={[styles.inputContainer, isDarkMode && styles.inputContainerDark]}>
                <Lock size={20} color={isDarkMode ? "#9CA3AF" : "#6B7280"} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  placeholder="Password"
                  placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  value={formData.password}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, password: text }))}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                  ) : (
                    <Eye size={20} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              activeOpacity={0.9}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={["#10B981", "#059669"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.divider, isDarkMode && styles.dividerDark]} />
              <Text style={[styles.dividerText, isDarkMode && styles.dividerTextDark]}>Or login with</Text>
              <View style={[styles.divider, isDarkMode && styles.dividerDark]} />
            </View>

            {/* Google Sign In */}
            <TouchableOpacity
              style={[styles.googleButton, isDarkMode && styles.googleButtonDark]}
              activeOpacity={0.9}
              onPress={() => Alert.alert("Google Sign In", "Google authentication will be implemented in a future update.")}
            >
              <Image
                source={require("../../../assets/google.png")}
                style={styles.googleIcon}
              />
              <Text style={[styles.googleButtonText, isDarkMode && styles.googleButtonTextDark]}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Terms Text */}
            <Text style={[styles.termsText, isDarkMode && styles.termsTextDark]}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>

            {/* Signup Link */}
            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, isDarkMode && styles.signupTextDark]}>
                New here?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupLink}>Create account</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const { width, height } = Dimensions.get("window")
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  containerDark: {
    backgroundColor: "#1F2937",
  },
  topHalf: {
    height: height * 0.35, // 35% of screen height
    position: "relative",
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  bottomHalfDark: {
    backgroundColor: "#1F2937",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 16 : (StatusBar.currentHeight ?? 16) + 16,
    left: 16,
    zIndex: 10,
  },
  homeButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 16 : (StatusBar.currentHeight ?? 16) + 16,
    right: 16,
    zIndex: 10,
  },
  headerTextContainer: {
    position: "absolute",
    bottom: 60,
    left: 24,
    right: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    color: "rgba(255, 255, 255, 0.9)",
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    height: 56,
  },
  inputContainerDark: {
    backgroundColor: "#374151",
    borderColor: "#4B5563",
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#1F2937",
  },
  inputDark: {
    color: "#F3F4F6",
  },
  eyeIcon: {
    padding: 16,
  },
  loginButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 24,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  gradientButton: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerDark: {
    backgroundColor: "#4B5563",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#6B7280",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  dividerTextDark: {
    color: "#9CA3AF",
  },
  googleButton: {
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 24,
  },
  googleButtonDark: {
    backgroundColor: "#374151",
    borderColor: "#4B5563",
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    color: "#1F2937",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  googleButtonTextDark: {
    color: "#F9FAFB",
  },
  termsText: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Poppins-Regular",
    color: "#6B7280",
    marginBottom: 24,
  },
  termsTextDark: {
    color: "#9CA3AF",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  signupText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#6B7280",
  },
  signupTextDark: {
    color: "#9CA3AF",
  },
  signupLink: {
    color: "#10B981",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
})