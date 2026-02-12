import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useScanner } from '@/context/ScannerContext';
import { ScannerColors } from '@/constants/ScannerColors';

export default function ReviewScreen() {
  const router = useRouter();
  const { pages, removePage } = useScanner();

  const handleRetake = (index: number) => {
    removePage(index);
    router.back();
  };

  const handleFinish = () => {
    router.push('/scanner/upload');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Your Work</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>
          Check if your page is clear and legible. If not, you can retake it.
        </Text>

        {pages.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.pageCard}>
            <Image source={{ uri }} style={styles.pageThumbnail} />
            <View style={styles.pageInfo}>
              <Text style={styles.pageTitle}>Page {index + 1}</Text>
              <TouchableOpacity
                onPress={() => handleRetake(index)}
                style={styles.retakeButton}
              >
                <Ionicons name="refresh" size={16} color={ScannerColors.primary} />
                <Text style={styles.retakeButtonText}>Retake</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {pages.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No pages captured yet.</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.captureMoreButton}
            >
              <Text style={styles.captureMoreButtonText}>Capture Pages</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleFinish}
          style={[styles.finishButton, pages.length === 0 && styles.disabledButton]}
          disabled={pages.length === 0}
        >
          <Text style={styles.finishButtonText}>Finish & Upload</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ScannerColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  subtitle: {
    color: ScannerColors.textSecondary,
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
  },
  pageCard: {
    flexDirection: 'row',
    backgroundColor: ScannerColors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  pageThumbnail: {
    width: 80,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  pageInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  pageTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  retakeButtonText: {
    color: ScannerColors.primary,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  finishButton: {
    backgroundColor: ScannerColors.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: ScannerColors.textSecondary,
    fontSize: 16,
    marginBottom: 20,
  },
  captureMoreButton: {
    borderWidth: 1,
    borderColor: ScannerColors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  captureMoreButtonText: {
    color: ScannerColors.primary,
    fontWeight: 'bold',
  },
});
