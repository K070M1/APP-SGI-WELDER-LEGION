import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';
import { View, ScrollView } from 'react-native';
import { AlertCircleIcon, CheckCircle2, Loader } from 'lucide-react-native';
import { Icon } from '@/shared/components/ui/icon';
import QRCode from 'react-native-qrcode-svg';

export interface AlertAction {
  name: string;
  color?: 'white' | 'blue' | 'orange' | 'green' | 'red';
  onClick?: () => boolean | void | Promise<boolean | void>;
}

export interface AlertConfig {
  icon?: 'warning' | 'success' | 'error' | 'loading' | 'info';
  title: string;
  text?: string;
  description?: string;
  actions?: AlertAction[];
  isQR?: boolean;     // Si es true, muestra modal de QR
  qrCode?: string;    // Código QR a mostrar
  qrValue?: string;
  qrDetails?: Array<{
    label: string;
    value: string;
  }>;
}

export interface LoadingConfig {
  title?: string;
  text?: string;
}

interface UiOverlayContextType {
  showAlert: (config: AlertConfig) => void;
  hideAlert: () => void;
  startLoading: (config: LoadingConfig) => void;
  stopLoading: () => void;
}

const UiOverlayContext = createContext<UiOverlayContextType | undefined>(undefined);

export function useUiOverlay(): UiOverlayContextType {
  const context = useContext(UiOverlayContext);
  if (!context) {
    throw new Error('useUiOverlay must be used within UiOverlayProvider');
  }
  return context;
}

export function UiOverlayProvider({ children }: { children: ReactNode }) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({ title: '' });
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState<LoadingConfig>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Paleta de colores
  const COLORS = {
    primary: {
      main: '#748FFC',
      text: '#FFFFFF',
    },
    success: {
      main: '#69DB7C',
      text: '#FFFFFF',
    },
    error: {
      main: '#FF8787',
      text: '#FFFFFF',
    },
    warning: {
      main: '#FFB84D',
      text: '#FFFFFF',
    },
    info: {
      main: '#5DADE2',
      text: '#FFFFFF',
    },
    neutral: {
      main: '#CBD5E1',
      border: '#D1D5DB',
    },
  };

  const getActionButtonColor = (color?: string) => {
    switch (color) {
      case 'white':
        return { bg: '#FFFFFF', border: '#D1D5DB', text: '#1F2937', hasBorder: true };
      case 'blue':
        return { bg: COLORS.primary.main, text: COLORS.primary.text, hasBorder: false };
      case 'orange':
        return { bg: COLORS.warning.main, text: COLORS.warning.text, hasBorder: false };
      case 'green':
        return { bg: COLORS.success.main, text: COLORS.success.text, hasBorder: false };
      case 'red':
        return { bg: COLORS.error.main, text: COLORS.error.text, hasBorder: false };
      default:
        return { bg: COLORS.primary.main, text: COLORS.primary.text, hasBorder: false };
    }
  };

  const showAlert = (config: AlertConfig) => {
    setAlertConfig(config);
    setAlertOpen(true);
  };

  const hideAlert = () => {
    setAlertOpen(false);
  };

  const startLoading = (config: LoadingConfig) => {
    setLoadingConfig(config);
    setLoadingOpen(true);
  };

  const stopLoading = () => {
    setLoadingOpen(false);
  };

  const handleAlertAction = async (action?: AlertAction) => {
    if (!action) {
      hideAlert();
      return;
    }

    if (action.onClick) {
      setIsProcessing(true);
      try {
        const result = await action.onClick();
        if (result !== false) {
          hideAlert();
        }
      } finally {
        setIsProcessing(false);
      }
    } else {
      hideAlert();
    }
  };

  const getIconComponent = (icon?: string) => {
    switch (icon) {
      case 'success':
        return <Icon as={CheckCircle2} size={96} className="text-[#69DB7C]" />;
      case 'error':
        return <Icon as={AlertCircleIcon} size={96} className="text-[#FF8787]" />;
      case 'warning':
        return <Icon as={AlertCircleIcon} size={96} className="text-[#FFB84D]" />;
      case 'info':
        return <Icon as={AlertCircleIcon} size={96} className="text-[#5DADE2]" />;
      case 'loading':
        return <Icon as={Loader} size={96} className="text-[#748FFC]" />;
      default:
        return null;
    }
  };

  return (
    <UiOverlayContext.Provider value={{ showAlert, hideAlert, startLoading, stopLoading }}>
      {children}

      {/* Loading Overlay */}
      <Dialog open={loadingOpen} onOpenChange={setLoadingOpen}>
        <DialogContent className="w-[90%] bg-white rounded-[32px] p-6" showClose={true}>
          <DialogHeader>
            <View className="items-center justify-center mb-4">
              <Icon as={Loader} size={64} className="text-slate-400" />
            </View>
            {loadingConfig.title && (
              <DialogTitle className="text-center text-2xl font-extrabold text-slate-900 mt-2">
                {loadingConfig.title}
              </DialogTitle>
            )}
            {loadingConfig.text && (
              <DialogDescription className="text-center text-slate-500 text-sm mt-1 px-4">
                {loadingConfig.text}
              </DialogDescription>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Alert Modal - AlertDialog para confirmaciones */}
      <AlertDialog open={alertOpen && !alertConfig.isQR} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="bg-white rounded-[32px] p-6">
          <AlertDialogHeader className="items-center">
            {alertConfig.icon && (
              <View className="mb-3">
                {getIconComponent(alertConfig.icon)}
              </View>
            )}
            <AlertDialogTitle className="text-slate-900 font-extrabold text-2xl text-center">
              {alertConfig.title}
            </AlertDialogTitle>
            {alertConfig.description && (
              <AlertDialogDescription className="text-slate-500 mt-2 text-base text-center leading-5 px-2">
                {alertConfig.description}
              </AlertDialogDescription>
            )}
            {alertConfig.text && (
              <AlertDialogDescription className="text-slate-500 mt-2 text-base text-center leading-5 px-2">
                {alertConfig.text}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>

          {alertConfig.actions && alertConfig.actions.length > 0 && (
            <AlertDialogFooter className="mt-4 flex-row justify-center gap-4">
              {alertConfig.actions.map((action, idx) => {
                const colorConfig = getActionButtonColor(action.color);
                return (
                  <Button
                    key={idx}
                    className="flex rounded-xl flex-row items-center justify-center px-4 py-2"
                    style={{
                      backgroundColor: colorConfig.bg,
                      borderWidth: colorConfig.hasBorder ? 1 : 0,
                      borderColor: colorConfig.border,
                    }}
                    onPress={() => handleAlertAction(action)}
                    disabled={isProcessing}
                  >
                    <Text style={{ color: colorConfig.text }} className="font-bold">
                      {action.name}
                    </Text>
                  </Button>
                );
              })}
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>

      {/* QR Modal - información completa y QR al final */}
      <Dialog
        open={alertOpen && alertConfig.isQR}
        onOpenChange={setAlertOpen}
      >
        <DialogContent
          className="w-[90%] bg-white rounded-[32px] p-6"
          style={{ maxHeight: 620 }}
          showClose={true}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-extrabold text-slate-900 mt-2">
              {alertConfig.title}
            </DialogTitle>

            {alertConfig.text && (
              <DialogDescription className="text-center text-slate-500 text-sm mt-1 px-4">
                {alertConfig.text}
              </DialogDescription>
            )}
          </DialogHeader>

          <View className="items-center justify-center">
            <View className=" bg-white rounded-3xl border border-slate-200 items-center justify-center shadow-sm min-h-[220px] min-w-[220px]">
              <View className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <QRCode
                  value={
                    alertConfig?.qrValue ||
                    alertConfig?.qrCode ||
                    'SIN-CODIGO'
                  }
                  size={190}
                  color="#0F172A"
                  backgroundColor="#FFFFFF"
                />
              </View>

              <Text className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Código: {alertConfig?.qrCode || 'No registrado'}
              </Text>
            </View>
          </View>

          {alertConfig?.actions &&
            alertConfig.actions.length > 0 && (
              <View className="mt-4 flex-row justify-center gap-4">
                {alertConfig.actions.map((action, idx) => {
                  const colorConfig =
                    getActionButtonColor(action.color);

                  return (
                    <Button
                      key={idx}
                      className="flex rounded-xl flex-row items-center justify-center px-4 py-2"
                      style={{
                        backgroundColor: colorConfig.bg,
                        borderWidth: colorConfig.hasBorder
                          ? 1
                          : 0,
                        borderColor: colorConfig.border,
                      }}
                      onPress={() =>
                        handleAlertAction(action)
                      }
                      disabled={isProcessing}
                    >
                      <Text
                        style={{ color: colorConfig.text }}
                        className="font-bold"
                      >
                        {action.name}
                      </Text>
                    </Button>
                  );
                })}
              </View>
            )}
        </DialogContent>
      </Dialog>
    </UiOverlayContext.Provider>
  );
}
