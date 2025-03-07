"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native"
import { X, LogIn, UserPlus, Settings, Sun, Moon, Laptop, Check, ChevronDown } from "lucide-react-native"
import { useTheme } from "~/context/ThemeContext"
import { BlurView } from "expo-blur"
import { useAuth } from "~/context/AuthContext"

type UserMenuProps = {
  visible: boolean
  onClose: () => void
  navigation: any
}

type Theme = "system" | "light" | "dark"

const themeOptions = [
  { label: "System Default", value: "system" as Theme, icon: Laptop },
  { label: "Light", value: "light" as Theme, icon: Sun },
  { label: "Dark", value: "dark" as Theme, icon: Moon },
]

const { height } = Dimensions.get("window")

export default function UserMenu({ visible, onClose, navigation }: UserMenuProps) {
  const [showThemeOptions, setShowThemeOptions] = useState(false)
  const { theme, setTheme, isDarkMode } = useTheme()
  const slideAnim = useRef(new Animated.Value(height)).current
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 10,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, slideAnim])

  useEffect(() => {
    if (!visible) {
      setShowThemeOptions(false)
    }
  }, [visible])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    handleCloseModal()
  }

  const navigateToAuth = (screen: string) => {
    if (isAuthenticated() && screen === 'Login') {
      navigation.navigate('Auth', { screen: 'UserHome' })
    } else {
      navigation.navigate('Auth', { screen })
    }
    onClose()
  }

  const handleCloseModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose()
    })
  }

  return (
    <Modal animationType="none" transparent={true} visible={visible} onRequestClose={handleCloseModal}>
      <Pressable style={styles.backdrop} onPress={handleCloseModal}>
        {Platform.OS === "ios" ? (
          <BlurView intensity={20} tint={isDarkMode ? "dark" : "light"} style={StyleSheet.absoluteFill} />
        ) : (
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: isDarkMode ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.3)" }]}
          />
        )}

        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Modal Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: isDarkMode ? "#F3F4F6" : "#1F2937" }]}>Account</Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: isDarkMode ? "#374151" : "#F3F4F6" }]}
              onPress={handleCloseModal}
            >
              <X size={20} color={isDarkMode ? "#F3F4F6" : "#4B5563"} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Auth Options */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? "#D1D5DB" : "#4B5563" }]}>Authentication</Text>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[styles.optionButton, { backgroundColor: isDarkMode ? "#374151" : "#F9FAFB" }]}
                onPress={() => navigateToAuth('Login')}
              >
                <LogIn size={20} stroke="#16A34A" />
                <Text style={[styles.optionText, { color: isDarkMode ? "#F3F4F6" : "#1F2937" }]}>Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionButton, { backgroundColor: isDarkMode ? "#374151" : "#F9FAFB" }]}
                onPress={() => navigateToAuth('Signup')}
              >
                <UserPlus size={20} color="#16A34A" />
                <Text style={[styles.optionText, { color: isDarkMode ? "#F3F4F6" : "#1F2937" }]}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Theme Selector */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? "#D1D5DB" : "#4B5563" }]}>Appearance</Text>

            <TouchableOpacity
              style={[styles.themeToggle, { backgroundColor: isDarkMode ? "#374151" : "#F9FAFB" }]}
              onPress={() => setShowThemeOptions(!showThemeOptions)}
              activeOpacity={0.7}
            >
              <View style={styles.themeToggleHeader}>
                <View style={styles.themeIconContainer}>
                  <Settings size={20} color="#16A34A" />
                </View>
                <Text style={[styles.themeToggleText, { color: isDarkMode ? "#F3F4F6" : "#1F2937" }]}>Theme</Text>
                <ChevronDown
                  size={18}
                  color={isDarkMode ? "#D1D5DB" : "#6B7280"}
                  style={{
                    transform: [{ rotate: showThemeOptions ? "180deg" : "0deg" }],
                  }}
                />
              </View>
            </TouchableOpacity>

            {showThemeOptions && (
              <View style={[styles.themeOptionsContainer, { backgroundColor: isDarkMode ? "#2D3748" : "#F3F4F6" }]}>
                {themeOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = theme === option.value

                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.themeOption,
                        {
                          backgroundColor: isSelected
                            ? isDarkMode
                              ? "rgba(22, 163, 74, 0.2)"
                              : "rgba(22, 163, 74, 0.1)"
                            : "transparent",
                        },
                      ]}
                      onPress={() => handleThemeChange(option.value)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.themeOptionContent}>
                        <View
                          style={[
                            styles.themeIconCircle,
                            {
                              backgroundColor: isDarkMode
                                ? isSelected
                                  ? "rgba(22, 163, 74, 0.3)"
                                  : "#374151"
                                : isSelected
                                  ? "rgba(22, 163, 74, 0.2)"
                                  : "#FFFFFF",
                            },
                          ]}
                        >
                          <Icon size={18} color={isSelected ? "#16A34A" : isDarkMode ? "#D1D5DB" : "#6B7280"} />
                        </View>
                        <Text
                          style={[
                            styles.themeOptionText,
                            {
                              color: isSelected ? "#16A34A" : isDarkMode ? "#F3F4F6" : "#1F2937",
                              fontWeight: isSelected ? "600" : "400",
                            },
                          ]}
                        >
                          {option.label}
                        </Text>
                      </View>
                      {isSelected && <Check size={18} color="#16A34A" />}
                    </TouchableOpacity>
                  )
                })}
              </View>
            )}
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(150, 150, 150, 0.2)",
    marginHorizontal: 20,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  optionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  optionText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
  themeToggle: {
    borderRadius: 12,
    overflow: "hidden",
  },
  themeToggleHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  themeIconContainer: {
    marginRight: 12,
  },
  themeToggleText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    flex: 1,
  },
  themeOptionsContainer: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  themeOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  themeOptionText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
})

