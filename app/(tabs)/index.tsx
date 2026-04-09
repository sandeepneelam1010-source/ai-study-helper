import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomeScreen() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askAI = async () => {
    if (!question.trim()) {
      setAnswer("Please enter a question.");
      return;
    }

    try {
      const response = await fetch(
        "https://keli-nondurable-kristie.ngrok-free.dev/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question }),
        }
      );

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("Error connecting to server.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Study Helper 🤖</Text>

      <TextInput
        style={styles.input}
        placeholder="Ask your study question..."
        placeholderTextColor="#888"
        value={question}
        onChangeText={setQuestion}
      />

      <TouchableOpacity style={styles.button} onPress={askAI}>
        <Text style={styles.buttonText}>Ask AI</Text>
      </TouchableOpacity>

      {answer ? (
        <View style={styles.answerBox}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    color: "#38bdf8",
    fontWeight: "bold",
    marginBottom: 30,
  },

  input: {
    width: "100%",
    backgroundColor: "#1e293b",
    color: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#38bdf8",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 20,
  },

  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },

  answerBox: {
    width: "100%",
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 10,
  },

  answerText: {
    color: "white",
    fontSize: 16,
  },
});