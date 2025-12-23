import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Button,
  useTheme,
  Surface,
  Avatar,
  List,
  Divider,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from './LoginScreen';

interface AccountScreenProps {
  onNavigateBack?: () => void;
}

export function AccountScreen({ onNavigateBack }: AccountScreenProps) {
  const theme = useTheme();
  const { user, isLoggedIn, logout, clearStoredCredentials, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleClearCredentials = async () => {
    await clearStoredCredentials();
  };

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLoginSuccess={onNavigateBack}
        onCancel={onNavigateBack}
      />
    );
  }

  // Show account info when logged in
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* User Profile Card */}
      <Surface style={[styles.profileCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
        <View style={styles.avatarContainer}>
          <Avatar.Text
            size={80}
            label={user?.userName?.substring(0, 2).toUpperCase() || '??'}
            style={{ backgroundColor: theme.colors.primary }}
          />
        </View>
        
        <Text variant="headlineSmall" style={[styles.userName, { color: theme.colors.onSurface }]}>
          {user?.userName}
        </Text>
        
        {user?.email && (
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {user.email}
          </Text>
        )}

        {user?.roles && user.roles.length > 0 && (
          <View style={styles.rolesContainer}>
            {user.roles.map((role, index) => (
              <View
                key={index}
                style={[styles.roleBadge, { backgroundColor: theme.colors.primaryContainer }]}
              >
                <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer }}>
                  {role}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Surface>

      {/* Account Details */}
      <Surface style={[styles.detailsCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <List.Section>
          <List.Subheader style={{ color: theme.colors.primary }}>Account Details</List.Subheader>
          
          <List.Item
            title="User ID"
            description={user?.userId?.substring(0, 8) + '...'}
            left={props => <List.Icon {...props} icon="identifier" />}
          />
          
          <Divider />
          
          {user?.givenName && (
            <>
              <List.Item
                title="Name"
                description={`${user.givenName} ${user.familyName || ''}`.trim()}
                left={props => <List.Icon {...props} icon="account" />}
              />
              <Divider />
            </>
          )}
          
          {user?.pronouns && (
            <>
              <List.Item
                title="Pronouns"
                description={user.pronouns}
                left={props => <List.Icon {...props} icon="account-voice" />}
              />
              <Divider />
            </>
          )}
          
          {user?.patreonTier && (
            <>
              <List.Item
                title="Patreon Tier"
                description={user.patreonTier}
                left={props => <List.Icon {...props} icon="star" />}
              />
              <Divider />
            </>
          )}
        </List.Section>
      </Surface>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Button
          mode="outlined"
          onPress={handleClearCredentials}
          style={styles.actionButton}
          icon="key-remove"
        >
          Clear Saved Login
        </Button>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.actionButton}
          buttonColor={theme.colors.error}
          icon="logout"
          loading={isLoading}
        >
          Sign Out
        </Button>
      </View>

      {/* Info Text */}
      <Text
        variant="bodySmall"
        style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}
      >
        Visit swudb.com to manage your account settings.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  profileCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontWeight: '700',
    marginBottom: 4,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailsCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    borderRadius: 8,
  },
  infoText: {
    textAlign: 'center',
  },
});







