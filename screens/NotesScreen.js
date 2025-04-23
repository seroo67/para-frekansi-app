import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@user_notes';

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        setNotes(stored ? JSON.parse(stored) : []);
      } catch(e) { console.error(e); }
    })();
  }, []);

  const saveNotes = async newNotes => {
    try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes)); }
    catch(e) { console.error(e); }
  };

  const addNote = () => {
    if (!input.trim()) return;
    const updated = [{ id: Date.now().toString(), text: input }, ...notes];
    setNotes(updated);
    saveNotes(updated);
    setInput('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS==='ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Kişisel Notlar</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Notunu yaz..."
          value={input}
          onChangeText={setInput}
        />
        <Button title="Ekle" onPress={addNote} />
      </View>
      <FlatList
        data={notes}
        keyExtractor={item=>item.id}
        renderItem={({item})=>(
          <View style={styles.noteItem}><Text>{item.text}</Text></View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16 },
  title: { fontSize:20, fontWeight:'bold', marginBottom:12 },
  inputContainer: { flexDirection:'row', marginBottom:16 },
  input: { flex:1, borderWidth:1, borderRadius:8, padding:8, marginRight:8 },
  noteItem: { padding:12, borderBottomWidth:1, borderColor:'#ddd' }
});
