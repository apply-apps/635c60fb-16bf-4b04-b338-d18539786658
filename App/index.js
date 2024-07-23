// Filename: index.js
// Combined code from all files
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function App() {
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const response = await axios.get('http://apihub.p.appply.xyz:3300/motd');
                setMessage(response.data.message);
            } catch (error) {
                console.error("Error fetching the message of the day: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessage();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>React Native Expo App</Text>
            <View style={styles.contentContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Text style={styles.message}>{message}</Text>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
    },
});