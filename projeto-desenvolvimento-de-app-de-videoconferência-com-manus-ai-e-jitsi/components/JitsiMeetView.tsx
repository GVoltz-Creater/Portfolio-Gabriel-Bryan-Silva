import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Platform, ActivityIndicator,
  TouchableOpacity, Dimensions
} from 'react-native';
import { WebView } from 'react-native-webview';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface JitsiMeetViewProps {
  roomName: string;
  displayName: string;
  onConferenceTerminated?: () => void;
  onConferenceJoined?: () => void;
  onConferenceWillJoin?: () => void;
}

/**
 * JitsiMeetView — Integração otimizada com Jitsi Meet
 * 
 * Usa WebView com configuração otimizada para melhor performance
 * Suporta Android, iOS e Web
 */
export default function JitsiMeetView({
  roomName,
  displayName,
  onConferenceTerminated,
  onConferenceJoined,
  onConferenceWillJoin,
}: JitsiMeetViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);
  const { width, height } = Dimensions.get('window');

  // Construir URL do Jitsi Meet com configurações otimizadas
  const buildJitsiUrl = () => {
    const baseUrl = 'https://meet.jit.si';
    const params = new URLSearchParams({
      'config.prejoinPageEnabled': 'false',
      'config.startWithAudioMuted': 'false',
      'config.startWithVideoMuted': 'false',
      'config.disableDeepLinking': 'true',
      'config.toolbarButtons': JSON.stringify(['microphone', 'camera', 'hangup', 'chat', 'raisehand']),
      'config.enableWelcomePage': 'false',
      'config.enableClosePage': 'false',
      'config.disableAudioLevels': 'false',
      'config.resolution': '720',
      'config.constraints': JSON.stringify({
        video: {
          height: { ideal: 720 },
          width: { ideal: 1280 }
        }
      }),
      'userInfo.displayName': displayName,
      'userInfo.email': `${displayName.toLowerCase().replace(/\s+/g, '')}@callinbuy.local`,
    });

    return `${baseUrl}/${roomName}#${params.toString()}`;
  };

  const jitsiUrl = buildJitsiUrl();

  // Injetar JavaScript para detectar eventos
  const injectedJavaScript = `
    (function() {
      // Detectar quando a conferência foi iniciada
      if (window.JitsiMeetExternalAPI) {
        console.log('Jitsi Meet API disponível');
        window.ReactNativeWebView?.postMessage(JSON.stringify({
          type: 'conferenceJoined',
          data: { roomName: '${roomName}' }
        }));
      }
      
      // Detectar mudanças de estado
      window.addEventListener('beforeunload', () => {
        window.ReactNativeWebView?.postMessage(JSON.stringify({
          type: 'conferenceTerminated',
          data: { roomName: '${roomName}' }
        }));
      });
      
      true;
    })();
  `;

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message:', data);
      
      if (data.type === 'conferenceJoined') {
        setLoading(false);
        onConferenceJoined?.();
      } else if (data.type === 'conferenceTerminated') {
        onConferenceTerminated?.();
      }
    } catch (err) {
      console.error('Erro ao processar mensagem WebView:', err);
    }
  };

  // Web fallback
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <IconSymbol name="video.fill" size={48} color="#E63946" />
          <Text style={styles.placeholderTitle}>Jitsi Meet</Text>
          <Text style={styles.placeholderSub}>Sala: {roomName}</Text>
          <Text style={styles.placeholderNote}>
            Videoconferência disponível no app Android/iOS
          </Text>
        </View>
      </View>
    );
  }

  // Loading state
  if (loading && !error) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E63946" />
          <Text style={styles.loadingText}>Conectando à sala...</Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.circle.fill" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Erro de Conexão</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setLoading(true);
            }}
          >
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // WebView com Jitsi Meet
  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: jitsiUrl }}
        style={styles.webview}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onLoadEnd={() => {
          setLoading(false);
          onConferenceJoined?.();
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
          setError('Erro ao carregar Jitsi Meet');
          setLoading(false);
        }}
        onMessage={handleWebViewMessage}
        injectedJavaScript={injectedJavaScript}
        renderLoading={() => (
          <View style={styles.webviewLoading}>
            <ActivityIndicator size="large" color="#E63946" />
            <Text style={styles.webviewLoadingText}>Conectando à sala...</Text>
          </View>
        )}
        // Configurações de segurança e performance
        mixedContentMode="always"
        allowFileAccess
        allowUniversalAccessFromFileURLs
        scalesPageToFit
        scrollEnabled={false}
        // User agent para melhor compatibilidade
        userAgent="Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  placeholderTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  placeholderSub: {
    fontSize: 14,
    color: '#E63946',
    fontWeight: '600',
  },
  placeholderNote: {
    fontSize: 13,
    color: '#9BA1A6',
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#9BA1A6',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  errorMessage: {
    fontSize: 14,
    color: '#9BA1A6',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#E63946',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  webviewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0D0D0D',
  },
  webviewLoadingText: {
    color: '#9BA1A6',
    fontSize: 16,
  },
});
