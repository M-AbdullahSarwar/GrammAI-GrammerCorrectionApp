// app/home.jsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { API_BASE_URL } from '../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text as RNText } from 'react-native';

const Home = () => {
  const [inputText, setInputText] = useState('');
  const [checkedText, setCheckedText] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            router.replace('/');
          },
        },
      ]
    );
  };

  const checkGrammar = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some text to check');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/grammar/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      if (response.ok) {
        setCheckedText(data.correctedText || inputText);
        setErrors(data.errors || []);
      } else {
        Alert.alert('Error', data.message || 'Failed to check grammar');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
      console.error('Grammar check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTextWithHighlights = () => {
    if (!checkedText || errors.length === 0) {
      return <Text style={styles.previewText}>{inputText || 'Your text will appear here...'}</Text>;
    }

    // Split the checkedText into words for highlighting
    const words = checkedText.split(/(\s+)/);

    // Highlight grammar suggestions in the corrected text
    const grammarSuggestions = new Set(
      errors
        .filter(e => (e.type || '').toLowerCase() === 'grammar' && e.suggestion)
        .map(e => e.suggestion.toLowerCase())
    );
    // Highlight spelling suggestions in the corrected text
    const spellingSuggestions = new Set(
      errors
        .filter(e => (e.type || '').toLowerCase() === 'spelling' && e.suggestion)
        .map(e => e.suggestion.toLowerCase())
    );

    return (
      <Text style={styles.previewText}>
        {words.map((word, idx) => {
          const cleanWord = word.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
          if (grammarSuggestions.has(cleanWord)) {
            return (
              <Text key={idx} style={styles.highlightedWord}>{word}</Text>
            );
          }
          if (spellingSuggestions.has(cleanWord)) {
            return (
              <Text key={idx} style={styles.spellingWord}>{word}</Text>
            );
          }
          return <Text key={idx}>{word}</Text>;
        })}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GrammAI</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Text Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewContainer}>
            {renderTextWithHighlights()}
          </View>
        </View>

        {/* Text Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enter your text</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Type your text here..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            textAlignVertical="top"
            autoCorrect={false}
          />
        </View>

        {/* Check Button */}
        <TouchableOpacity
          style={[styles.checkButton, loading && styles.checkButtonDisabled]}
          onPress={checkGrammar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.checkButtonText}>Check Grammar</Text>
          )}
        </TouchableOpacity>

        {/* Errors Display */}
        {errors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested Corrections</Text>
            {errors.map((error, index) => (
              <View key={index} style={styles.errorItem}>
                <Text style={styles.errorWord}>"{error.word}"</Text>
                <Text style={styles.errorSuggestion}>
                  Suggestion: {error.suggestion || 'No suggestion available'}
                </Text>
                <Text style={styles.errorType}>
                  Type: {error.type || 'Grammar/Spelling'}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50, // Account for status bar
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fd79a8',
    borderRadius: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 12,
  },
  previewContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  previewText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2d3436',
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#2d3436',
  },
  checkButton: {
    backgroundColor: '#00b894',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
  checkButtonDisabled: {
    backgroundColor: '#b2bec3',
  },
  checkButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e17055',
  },
  errorWord: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e17055',
    marginBottom: 4,
  },
  errorSuggestion: {
    fontSize: 14,
    color: '#2d3436',
    marginBottom: 2,
  },
  errorType: {
    fontSize: 12,
    color: '#636e72',
    fontStyle: 'italic',
  },
  highlightedWord: {
    backgroundColor: '#ffcccc', // light red background
    borderRadius: 4,
    color: '#c0392b', // dark red text
    fontWeight: 'bold',
  },
  spellingWord: {
    backgroundColor: '#cce4ff', // light blue background
    borderRadius: 4,
    color: '#1565c0', // blue text
    fontWeight: 'bold',
  },
});

export default Home;