import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StatusBar
} from 'react-native';
import { useAuth } from "~/context/AuthContext"
import { useTheme } from "~/context/ThemeContext"
import { LogOut, User as UserIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';

// Add this type definition
type RootStackParamList = {
  Login: undefined;
  // Add other screens as needed
};

type UserHomePageProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

export default function UserHomePage({ navigation }: UserHomePageProps) {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={["#10B981", "#059669"]}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.headerTitle}>Africa Updates</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {/* User Profile Card */}
        <View style={[styles.profileCard, isDarkMode && styles.profileCardDark]}>
          <View style={styles.profileHeader}>
            {user?.avatarUrl ? (
              <Image 
                source={{ uri: user.avatarUrl }} 
                style={styles.avatar} 
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <UserIcon size={40} color="#10B981" />
              </View>
            )}
            <View style={styles.userInfo}>
              <Text style={[styles.displayName, isDarkMode && styles.displayNameDark]}>
                {user?.displayName || user?.username || "User"}
              </Text>
              <Text style={[styles.username, isDarkMode && styles.usernameDark]}>
                @{user?.username || "username"}
              </Text>
            </View>
          </View>
          
          {user?.bio && (
            <Text style={[styles.bio, isDarkMode && styles.bioDark]}>
              {user.bio}
            </Text>
          )}
          
          <View style={styles.userDetails}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, isDarkMode && styles.detailLabelDark]}>
                Email
              </Text>
              <Text style={[styles.detailValue, isDarkMode && styles.detailValueDark]}>
                {user?.email || "No email provided"}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, isDarkMode && styles.detailLabelDark]}>
                Role
              </Text>
              <Text style={[styles.detailValue, isDarkMode && styles.detailValueDark]}>
                {user?.role || "User"}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, isDarkMode && styles.detailLabelDark]}>
                Member Since
              </Text>
              <Text style={[styles.detailValue, isDarkMode && styles.detailValueDark]}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#FFFFFF" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  header: {
    height: 100,
    justifyContent: 'flex-end',
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileCardDark: {
    backgroundColor: '#1F2937',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  displayName: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
  },
  displayNameDark: {
    color: '#F9FAFB',
  },
  username: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  usernameDark: {
    color: '#9CA3AF',
  },
  bio: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#4B5563',
    marginBottom: 16,
    lineHeight: 24,
  },
  bioDark: {
    color: '#D1D5DB',
  },
  userDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  detailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  detailLabelDark: {
    color: '#9CA3AF',
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1F2937',
  },
  detailValueDark: {
    color: '#F3F4F6',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 20,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  errorTextDark: {
    color: '#D1D5DB',
  },
  loginButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 40,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
}); 