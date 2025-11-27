import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  useTheme,
  Checkbox,
  Surface,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
  onCancel?: () => void;
}

export function LoginScreen({ onLoginSuccess, onCancel }: LoginScreenProps) {
  const theme = useTheme();
  const { login, getStoredCredentials, isLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load stored credentials if available
  useEffect(() => {
    loadStoredCredentials();
  }, []);

  const loadStoredCredentials = async () => {
    const stored = await getStoredCredentials();
    if (stored) {
      setUsername(stored.username);
      setPassword(stored.password);
      setRememberMe(true);
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login(username.trim(), password, rememberMe);
      
      if (result.success) {
        onLoginSuccess?.();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Surface style={[styles.formContainer, { backgroundColor: theme.colors.surface }]} elevation={2}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              SWUDB Login
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
              Sign in with your SWUDB account
            </Text>
          </View>

          {/* Error message */}
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: theme.colors.errorContainer }]}>
              <Text style={{ color: theme.colors.error }}>{error}</Text>
            </View>
          )}

          {/* Username input */}
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
            disabled={isSubmitting}
          />

          {/* Password input */}
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            disabled={isSubmitting}
          />

          {/* Remember me checkbox */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={rememberMe ? 'checked' : 'unchecked'}
              onPress={() => setRememberMe(!rememberMe)}
              disabled={isSubmitting}
            />
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurface, flex: 1 }}
              onPress={() => setRememberMe(!rememberMe)}
            >
              Remember my login for next time
            </Text>
          </View>

          {/* Login button */}
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.loginButton}
            contentStyle={styles.loginButtonContent}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>

          {/* Cancel button */}
          {onCancel && (
            <Button
              mode="text"
              onPress={onCancel}
              disabled={isSubmitting}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          )}

          {/* Info text */}
          <Text
            variant="bodySmall"
            style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}
          >
            Don't have an account? Visit swudb.com to register.
          </Text>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    borderRadius: 16,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginLeft: -8,
  },
  loginButton: {
    marginBottom: 12,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  cancelButton: {
    marginBottom: 16,
  },
  infoText: {
    textAlign: 'center',
  },
});

