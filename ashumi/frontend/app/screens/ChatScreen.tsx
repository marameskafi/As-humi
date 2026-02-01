import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextField, Card } from '../../components';
import { chatService } from '../../services';
import { ChatMessage } from '../../models';
import { theme } from '../../theme';

export const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m here to help you with family financial planning questions. Remember, this is educational information only and not financial advice.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage({ message: inputText.trim() });
      if (response.success) {
        setMessages(prev => [...prev, response.data]);
      } else {
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          text: 'Sorry, I encountered an error. Please try again.',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: 'Sorry, I encountered a network error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Financial Assistant</Text>
        <Text style={styles.subtitle}>Ask questions about family financial planning</Text>
      </View>

      <ScrollView 
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.isUser ? styles.userMessageWrapper : styles.botMessageWrapper,
            ]}
          >
            <Card style={[
              styles.messageCard,
              message.isUser ? styles.userMessage : styles.botMessage,
            ]}>
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.botMessageText,
              ]}>
                {message.text}
              </Text>
              <Text style={[
                styles.messageTime,
                message.isUser ? styles.userMessageTime : styles.botMessageTime,
              ]}>
                {formatTime(message.timestamp)}
              </Text>
            </Card>
          </View>
        ))}
        
        {isLoading && (
          <View style={styles.botMessageWrapper}>
            <Card style={styles.botMessage}>
              <Text style={styles.loadingText}>Thinking...</Text>
            </Card>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextField
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about family financial planning..."
          />
        </View>
        <Button
          title="Send"
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
          size="medium"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  messageWrapper: {
    marginVertical: theme.spacing.xs,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  botMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageCard: {
    maxWidth: '80%',
    marginVertical: 0,
  },
  userMessage: {
    backgroundColor: theme.colors.primary,
  },
  botMessage: {
    backgroundColor: theme.colors.background,
  },
  messageText: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xs,
  },
  userMessageText: {
    color: 'white',
  },
  botMessageText: {
    color: theme.colors.text,
  },
  messageTime: {
    ...theme.typography.small,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  botMessageTime: {
    color: theme.colors.textSecondary,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    alignItems: 'flex-end',
    gap: theme.spacing.md,
  },
  inputWrapper: {
    flex: 1,
  },
});