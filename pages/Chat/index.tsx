import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  StatusBar,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import trainingData from "../../data/trainingData.json";
// Define message type
interface Message {
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  timestamp?: number;
}

// Sample training data (should be moved to a separate file)

function ChatAppPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();
  // ...existing code
  // Add welcome message when component mounts
  useEffect(() => {
    const welcomeMessage: Message = {
      role: "assistant",
      content:
        "Xin chào! Tôi là trợ lý tâm lý AI. Bạn có thể chia sẻ với tôi bất cứ điều gì đang khiến bạn trăn trở. Tôi luôn ở đây để lắng nghe và hỗ trợ bạn 😊",
      timestamp: Date.now(),
    };
    setMessages([welcomeMessage]);

    // Load previous messages from storage if any
    loadMessages();
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isThinking]);

  // Load messages from storage
  const loadMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem("chatMessages");
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  // Save messages to storage
  const saveMessages = async (newMessages: Message[]) => {
    try {
      await AsyncStorage.setItem("chatMessages", JSON.stringify(newMessages));
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  };

  // Find response in training data
  const findTrainingResponse = (input: string): string | null => {
    const normalizedInput = input.toLowerCase().trim();
    const inputWords = normalizedInput.split(" ");

    // Array to store matching results and their match count
    let matches: { answer: string; matchCount: number }[] = [];

    trainingData.conversations.forEach((conv) => {
      let matchCount = 0;

      // Check words in main question
      const questionWords = conv.question.toLowerCase().split(" ");
      questionWords.forEach((word) => {
        if (inputWords.includes(word)) matchCount++;
      });

      // Check words in similar questions
      conv.similarQuestions?.forEach((similar) => {
        const similarWords = similar.toLowerCase().split(" ");
        let similarMatchCount = 0;
        similarWords.forEach((word) => {
          if (inputWords.includes(word)) similarMatchCount++;
        });
        // Use the highest match count
        matchCount = Math.max(matchCount, similarMatchCount);
      });

      // If at least one keyword matches, add to results
      if (matchCount > 0) {
        matches.push({
          answer: conv.answer,
          matchCount: matchCount,
        });
      }
    });

    // Sort by match count in descending order and take the answer with the highest match
    matches.sort((a, b) => b.matchCount - a.matchCount);
    return matches.length > 0 ? matches[0].answer : null;
  };

  // Scroll to bottom of conversation
  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  // Send message handler using deepseek model
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setInput("");
    setIsTyping(true);
    setIsThinking(false);

    // Check training data first
    const trainedResponse = findTrainingResponse(input);
    if (trainedResponse) {
      setTimeout(() => {
        const botMessage: Message = {
          role: "assistant",
          content: trainedResponse,
        };
        const newMessages = [...updatedMessages, botMessage];
        setMessages(newMessages);
        saveMessages(newMessages);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      console.log("Sending request to deepseek API...");

      // Connect to the deepseek API using axios
      const response = await axios.post(
        "http://192.168.46.150:11434/api/chat",
        {
          model: "llama3.1:8b",
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          stream: false,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // Handle non-streaming response
      if (response.data && response.data.message) {
        const assistantMessage: Message = {
          role: "assistant",
          content: response.data.message.content || "Không có phản hồi từ AI.",
        };

        // Add reasoning if available
        if (response.data.message.reasoning) {
          assistantMessage.reasoning = response.data.message.reasoning;
        }

        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
        saveMessages(finalMessages);
      } else {
        console.error("Invalid response format:", response.data);
        handleApiError(updatedMessages);
      }
      setIsTyping(false);
      setIsThinking(false);
    } catch (error) {
      console.error("Error making API request:", error);
      handleApiError(updatedMessages);
    }
  };

  // Handle API errors
  const handleApiError = (updatedMessages: Message[]) => {
    const fallbackResponse: Message = {
      role: "assistant",
      content:
        "Xin lỗi, tôi đang gặp vấn đề kết nối. Vui lòng thử lại sau hoặc kiểm tra kết nối mạng của bạn.",
    };
    const newMessages = [...updatedMessages, fallbackResponse];
    setMessages(newMessages);
    saveMessages(newMessages);
    setIsTyping(false);
    setIsThinking(false);
  };

  // Add new function to start a new chat
  const startNewChat = () => {
    Alert.alert(
      "Tạo cuộc trò chuyện mới",
      "Bạn có chắc muốn bắt đầu cuộc trò chuyện mới? Lịch sử trò chuyện hiện tại sẽ bị xóa.",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: () => {
            const welcomeMessage: Message = {
              role: "assistant",
              content:
                "Xin chào! Tôi là trợ lý tâm lý AI. Bạn có thể chia sẻ với tôi bất cứ điều gì đang khiến bạn trăn trở. Tôi luôn ở đây để lắng nghe và hỗ trợ bạn 😊",
            };
            setMessages([welcomeMessage]);
            saveMessages([welcomeMessage]);
            setInput("");
            setIsTyping(false);
            setIsThinking(false);
          },
        },
      ]
    );
  };

  // Format timestamp into readable time
  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Enhanced message rendering
  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === "user";
    return (
      <View
        key={index}
        style={[
          styles.messageWrapper,
          isUser ? styles.userMessageWrapper : styles.assistantMessageWrapper,
        ]}
      >
        {!isUser && (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AI</Text>
            </View>
          </View>
        )}
        <View style={styles.messageContentWrapper}>
          <View
            style={[
              styles.messageBubble,
              isUser ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            <Text style={styles.messageText}>{message.content}</Text>
            {message.reasoning && (
              <View style={styles.reasoningContainer}>
                <Text style={styles.reasoningLabel}>Phân tích:</Text>
                <Text style={styles.reasoningText}>{message.reasoning}</Text>
              </View>
            )}
            <Text style={styles.timestampText}>
              {formatTime(message.timestamp)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2A5D8F" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Trợ lý tâm lý AI</Text>
        <TouchableOpacity style={styles.newChatButton} onPress={startNewChat}>
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.chatContainer}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessage)}
          {isTyping && (
            <View
              style={[styles.messageWrapper, styles.assistantMessageWrapper]}
            >
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>AI</Text>
                </View>
              </View>
              <View style={styles.messageContentWrapper}>
                <View style={[styles.messageBubble, styles.assistantBubble]}>
                  <View style={styles.typingIndicator}>
                    <ActivityIndicator size="small" color="#3674B5" />
                    <Text style={styles.typingText}>Đang suy nghĩ...</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          {isThinking && (
            <View
              style={[styles.messageWrapper, styles.assistantMessageWrapper]}
            >
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>AI</Text>
                </View>
              </View>
              <View style={styles.messageContentWrapper}>
                <View style={[styles.messageBubble, styles.thinkingBubble]}>
                  <View style={styles.typingIndicator}>
                    <ActivityIndicator size="small" color="#FF9800" />
                    <Text style={styles.thinkingText}>
                      Đang phân tích sâu...
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={100}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Gõ tin nhắn..."
            placeholderTextColor="#999"
            multiline
            autoFocus={false}
            keyboardType="default"
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={sendMessage}
            autoCapitalize="none"
            autoCorrect={false}
            enablesReturnKeyAutomatically={true}
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.disabledButton]}
            onPress={sendMessage}
            disabled={!input.trim()}
          >
            <MaterialIcons
              name="send"
              size={24}
              color={input.trim() ? "#fff" : "#ccc"}
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#3674B5",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  newChatButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: "#FF9800",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#E8EEF2",
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messagesContent: {
    paddingBottom: 10,
  },
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  userMessageWrapper: {
    justifyContent: "flex-end",
  },
  assistantMessageWrapper: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#3674B5",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  messageContentWrapper: {
    maxWidth: "75%",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    marginBottom: 4,
  },
  userBubble: {
    backgroundColor: "#D0E8FD",
    borderBottomRightRadius: 6,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  assistantBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 6,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  thinkingBubble: {
    backgroundColor: "#FFF8E1",
    borderBottomLeftRadius: 6,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  timestampText: {
    fontSize: 11,
    color: "#999",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  reasoningContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  reasoningLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 4,
  },
  reasoningText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 20,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
  typingText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
  thinkingText: {
    marginLeft: 8,
    color: "#FF9800",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    maxHeight: 120,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  sendButton: {
    width: 48,
    height: 48,
    backgroundColor: "#3674B5",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: "#e0e0e0",
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default ChatAppPage;
