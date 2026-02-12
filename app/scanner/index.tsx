import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions, FlashMode } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useScanner } from '@/context/ScannerContext';
import { ScannerColors } from '@/constants/ScannerColors';

export default function CaptureScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode>('off');
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { addPage, pages } = useScanner();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          addPage(photo.uri);
        }
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  };

  const lastPhoto = pages.length > 0 ? pages[pages.length - 1] : null;

  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} flash={flash} ref={cameraRef}>
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={toggleFlash} style={styles.iconButton}>
              <Ionicons
                name={flash === 'on' ? 'flash' : 'flash-off'}
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="help-circle-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomBar}>
            <View style={styles.thumbnailContainer}>
              {lastPhoto && (
                <Image source={{ uri: lastPhoto }} style={styles.thumbnail} />
              )}
            </View>

            <TouchableOpacity onPress={takePicture} style={styles.captureButtonContainer}>
              <View style={styles.captureButtonOuter}>
                <View style={styles.captureButtonInner} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/scanner/review')}
              style={styles.finishButton}
            >
              <Text style={styles.finishButtonText}>Review ({pages.length})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  captureButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  finishButton: {
    backgroundColor: ScannerColors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  finishButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: ScannerColors.primary,
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
