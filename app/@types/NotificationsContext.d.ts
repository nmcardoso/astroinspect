interface NotificationsContextValue {
  show: ShowNotification;
  close: CloseNotification;
}

interface ShowNotificationOptions {
  /**
   * The key to use for deduping notifications. If not provided, a unique key will be generated.
   */
  key?: string;
  /**
   * The severity of the notification. When provided, the snackbar will show an alert with the
   * specified severity.
   */
  severity?: 'info' | 'warning' | 'error' | 'success';
  /**
   * The duration in milliseconds after which the notification will automatically close.
   */
  autoHideDuration?: number;
  /**
   * The text to display on the action button.
   */
  actionText?: React.ReactNode;
  /**
   * The callback to call when the action button is clicked.
   */
  onAction?: () => void;
}

interface ShowNotification {
  /**
   * Show a snackbar in the application.
   *
   * @param message The message to display in the snackbar.
   * @param options Options for the snackbar.
   * @returns The key that represents the notification. Useful for programmatically
   * closing it.
   */
  (message: React.ReactNode, options?: ShowNotificationOptions): string;
}

interface CloseNotification {
  /**
   * Close a snackbar in the application.
   *
   * @param key The key of the notification to close.
   */
  (key: string): void;
}


interface NotificationsProviderSlotProps {
  snackbar: SnackbarProps;
}

interface NotificationsProviderSlots {
  /**
   * The component that renders the snackbar.
   * @default Snackbar
   */
  snackbar: React.ElementType;
}

interface NotificationsProviderProps {
  children?: React.ReactNode;
  // eslint-disable-next-line react/no-unused-prop-types
  slots?: Partial<NotificationsProviderSlots>;
  // eslint-disable-next-line react/no-unused-prop-types
  slotProps?: Partial<NotificationsProviderSlotProps>;
}

interface UseNotifications {
  show: ShowNotification;
  close: CloseNotification;
}

interface NotificationQueueEntry {
  notificationKey: string;
  options: ShowNotificationOptions;
  open: boolean;
  message: React.ReactNode;
}

interface NotificationsState {
  queue: NotificationQueueEntry[];
}

interface NotificationsProps {
  state: NotificationsState;
}

interface NotificationProps {
  notificationKey: string;
  badge: string | null;
  open: boolean;
  message: React.ReactNode;
  options: ShowNotificationOptions;
}