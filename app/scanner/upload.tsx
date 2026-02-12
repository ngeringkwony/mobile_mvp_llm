import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Network from 'expo-network';
import { useScanner } from '@/context/ScannerContext';
import { ScannerColors } from '@/constants/ScannerColors';

export default function UploadScreen() {
  const router = useRouter();
  const { clearPages } = useScanner();
  const [status, setStatus] = useState<'uploading' | 'success' | 'offline'>('uploading');
  const [progress] = useState(new Animated.Value(0));

  const startUpload = useCallback(() => {
    setStatus('uploading');
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        setStatus('success');
      }
    });
  }, [progress]);

  const checkConnectivity = useCallback(async () => {
    const networkState = await Network.getNetworkStateAsync();
    if (!networkState.isConnected) {
      setStatus('offline');
    } else {
      startUpload();
    }
  }, [startUpload]);

  useEffect(() => {
    checkConnectivity();
  }, [checkConnectivity]);

  const handleDone = () => {
    clearPages();
    router.dismissAll();
    router.replace('/(tabs)');
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {status === 'uploading' && (
          <>
            <View style={styles.iconContainer}>
              <View style={styles.outerCircle}>
                <View style={styles.innerCircle}>
                  <Ionicons name="book-outline" size={60} color="white" />
                </View>
              </View>
            </View>

            <Text style={styles.title}>We&apos;re reading your work</Text>
            <Text style={styles.subtitle}>
              Our AI is currently analyzing your handwriting and diagrams. This usually takes a few seconds.
            </Text>

            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground}>
                <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
              </View>
            </View>

            <View style={styles.secureBadge}>
              <Ionicons name="shield-checkmark" size={16} color={ScannerColors.primary} />
              <Text style={styles.secureBadgeText}>SECURE PROCESSING</Text>
            </View>
          </>
        )}

        {status === 'success' && (
          <>
            <View style={styles.successIconContainer}>
              <View style={styles.successCircle}>
                <Ionicons name="checkmark" size={80} color="white" />
              </View>
            </View>

            <Text style={styles.title}>Upload Successful!</Text>
            <Text style={styles.subtitle}>
              Your documents have been uploaded and are being processed. You&apos;ll receive a notification once they&apos;re ready.
            </Text>

            <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
              <Text style={styles.doneButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </>
        )}

        {status === 'offline' && (
          <>
            <View style={styles.offlineHeader}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.offlineHeaderText}>Save for Later</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.offlineIconContainer}>
               <View style={styles.offlineBadge}>
                 <Ionicons name="wifi-outline" size={14} color="#f97316" />
                 <Text style={styles.offlineBadgeText}>OFFLINE MODE</Text>
               </View>
               <View style={styles.offlineIllustration}>
                  <Ionicons name="camera-outline" size={100} color="white" />
               </View>
            </View>

            <Text style={styles.title}>No Signal? No Problem.</Text>
            <Text style={styles.subtitle}>
              You can take a photo now and upload it later. Your effort counts even when you&apos;re offline!
            </Text>

            <View style={styles.syncCard}>
              <View style={styles.syncHeader}>
                <Ionicons name="cloud-offline-outline" size={20} color="#f97316" />
                <Text style={styles.syncHeaderText}>Auto-sync status</Text>
              </View>
              <Text style={styles.syncBodyText}>Will upload when you&apos;re back online</Text>
            </View>

            <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
              <Text style={styles.doneButtonText}>Finish & Save</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={checkConnectivity} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ScannerColors.background,
  },
  offlineHeader: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offlineHeaderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  offlineIconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
    marginBottom: 20,
  },
  offlineBadgeText: {
    color: '#f97316',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  offlineIllustration: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  syncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  syncHeaderText: {
    color: ScannerColors.textSecondary,
    fontSize: 14,
    marginLeft: 10,
  },
  syncBodyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
  },
  retryButtonText: {
    color: ScannerColors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  iconContainer: {
    marginBottom: 40,
  },
  outerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: ScannerColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: ScannerColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    color: ScannerColors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  progressContainer: {
    width: '100%',
    height: 8,
    marginBottom: 40,
  },
  progressBarBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: ScannerColors.primary,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  secureBadgeText: {
    color: ScannerColors.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 1,
  },
  successIconContainer: {
    marginBottom: 40,
  },
  successCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: ScannerColors.success,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: ScannerColors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  doneButton: {
    backgroundColor: ScannerColors.primary,
    height: 56,
    width: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
