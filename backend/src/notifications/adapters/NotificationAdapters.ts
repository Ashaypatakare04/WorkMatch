import { NotificationItem, NotificationChannel } from '../../models/Notification.js';

export interface NotificationAdapter {
  readonly channel: NotificationChannel;
  send(notification: NotificationItem): Promise<{ delivered: boolean; error?: string }>;
}

export class BrowserNotifier implements NotificationAdapter {
  public readonly channel = 'browser';
  public async send(notification: NotificationItem): Promise<{ delivered: boolean }> {
    // In browser notification model, items are fetched via polling or SSE/WebSockets
    // and shown via web notification API
    return { delivered: true };
  }
}

export class EmailNotifier implements NotificationAdapter {
  public readonly channel = 'email';
  public async send(notification: NotificationItem): Promise<{ delivered: boolean }> {
    console.log(`[EmailNotifier] Sending email to user for alert: ${notification.title}`);
    return { delivered: true };
  }
}

export class TelegramNotifier implements NotificationAdapter {
  public readonly channel = 'telegram';
  public async send(notification: NotificationItem): Promise<{ delivered: boolean }> {
    console.log(`[TelegramNotifier] Sending Telegram message: ${notification.title}`);
    return { delivered: true };
  }
}

export class DiscordNotifier implements NotificationAdapter {
  public readonly channel = 'discord';
  public async send(notification: NotificationItem): Promise<{ delivered: boolean }> {
    console.log(`[DiscordNotifier] Sending Discord webhook: ${notification.title}`);
    return { delivered: true };
  }
}
