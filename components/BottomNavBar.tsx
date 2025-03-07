"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions, Platform } from "react-native"
import { HomeIcon, MessageSquareIcon, PlusIcon, LayoutGridIcon, UserIcon } from "lucide-react-native"
import { useTheme } from "~/context/ThemeContext"

const { width } = Dimensions.get("window")
const TAB_WIDTH = width / 5

type TabItem = {
  key: string
  icon: (props: { color: string; size: number }) => React.ReactNode
  label: string
  onPress: () => void
}

export default function BottomNavBar() {
  const { isDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState("home")
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current
  const postButtonScale = useRef(new Animated.Value(1)).current
  const fabRotation = useRef(new Animated.Value(0)).current

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey)
  }

  const handlePostPress = () => {
    // Animate the post button
    Animated.sequence([
      Animated.timing(postButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(postButtonScale, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fabRotation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset rotation after animation completes
      setTimeout(() => {
        Animated.timing(fabRotation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }).start()
      }, 500)
    })

    console.log("Post pressed")
  }

  const tabItems: TabItem[] = [
    {
      key: "home",
      icon: ({ color, size }) => <HomeIcon color={color} size={size} />,
      label: "Home",
      onPress: () => handleTabPress("home"),
    },
    {
      key: "pushwall",
      icon: ({ color, size }) => <MessageSquareIcon color={color} size={size} />,
      label: "Push Wall",
      onPress: () => handleTabPress("pushwall"),
    },
    {
      key: "post",
      icon: ({ color, size }) => <PlusIcon color={color} size={size} />,
      label: "Post",
      onPress: handlePostPress,
    },
    {
      key: "categories",
      icon: ({ color, size }) => <LayoutGridIcon color={color} size={size} />,
      label: "Categories",
      onPress: () => handleTabPress("categories"),
    },
    {
      key: "profile",
      icon: ({ color, size }) => <UserIcon color={color} size={size} />,
      label: "Profile",
      onPress: () => handleTabPress("profile"),
    },
  ]

  // Calculate indicator position based on active tab
  useEffect(() => {
    const index = tabItems.findIndex((item) => item.key === activeTab)
    if (index !== -1 && index !== 2) {
      // Skip the post button
      const position = index > 2 ? (index - 1) * TAB_WIDTH : index * TAB_WIDTH
      Animated.spring(tabIndicatorPosition, {
        toValue: position,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }).start()
    }
  }, [activeTab, tabIndicatorPosition])

  const rotation = fabRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  })

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
          borderTopColor: isDarkMode ? "#374151" : "#E5E7EB",
        },
      ]}
    >
      {/* Tab Items */}
      <View style={styles.tabsContainer}>
        {tabItems.map((item, index) => {
          const isActive = activeTab === item.key
          const isPostTab = item.key === "post"

          if (isPostTab) {
            return (
              <View key={item.key} style={styles.postButtonContainer}>
                <Animated.View
                  style={[
                    styles.fabShadow,
                    {
                      transform: [{ scale: postButtonScale }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={item.onPress}
                    style={[styles.postButton, { backgroundColor: "#16A34A" }]}
                    activeOpacity={0.85}
                  >
                    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                      {item.icon({ color: "#FFFFFF", size: 22 })}
                    </Animated.View>
                  </TouchableOpacity>
                </Animated.View>
                <Text style={[styles.tabLabel, { color: isDarkMode ? "#D1D5DB" : "#6B7280" }]}>{item.label}</Text>
              </View>
            )
          }

          return (
            <TouchableOpacity key={item.key} onPress={item.onPress} style={styles.tabButton} activeOpacity={0.7}>
              <Animated.View style={[styles.tabIconContainer, isActive && styles.activeTabIconContainer]}>
                {item.icon({
                  color: isActive ? "#16A34A" : isDarkMode ? "#9CA3AF" : "#6B7280",
                  size: 20,
                })}
              </Animated.View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? "#16A34A" : isDarkMode ? "#D1D5DB" : "#6B7280",
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingBottom: Platform.OS === "ios" ? 12 : 4,
    paddingTop: 4,
    position: "relative",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    zIndex: 1,
  },
  tabIconContainer: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  activeTabIconContainer: {
    backgroundColor: "rgba(22, 163, 74, 0.1)",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
    fontFamily: 'Poppins-Regular'
  },
  postButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 2,
  },
  fabShadow: {
    shadowColor: "#16A34A",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  postButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -24,
  },
})

