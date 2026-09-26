import { NotificationItem, NotificationChannel } from '../../models/Notification.js';
import { UserRepository } from '../../repositories/UserRepository.js';

export interface NotificationAdapter {
  readonly channel: NotificationChannel;
  send(notification: NotificationItem): Promise<{ delivered: boolean; error?: string }>;
}

export class BrowserNotifier implements NotificationAdapter {
  public readonly channel = 'browser';
  public async send(notification: NotificationItem): Promise<{ delivered: boolean }> {
    // In-browser items are persisted in SQLite and surfaced in UI popover / web notification API
    return { delivered: true };
  }
}

export class EmailNotifier implements NotificationAdapter {
  public readonly channel = 'email';

  public async send(notification: NotificationItem): Promise<{ delivered: boolean; error?: string }> {
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailWebhookUrl = process.env.EMAIL_WEBHOOK_URL;
    const fromAddress = process.env.EMAIL_FROM || 'WorkMatch AI <alerts@workmatch.local>';

    const user = UserRepository.findById(notification.user_id);
    const recipientEmail = process.env.EMAIL_TO || user?.email || 'user@workmatch.local';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #090b10; color: #f1f5f9; padding: 24px; margin: 0; }
    .card { background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; max-width: 580px; margin: 0 auto; padding: 28px; }
    .badge { display: inline-block; background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; }
    .title { font-size: 18px; font-weight: bold; color: #ffffff; margin-top: 14px; margin-bottom: 8px; line-height: 1.3; }
    .body { font-size: 13px; color: #94a3b8; line-height: 1.6; white-space: pre-line; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 16px; margin: 16px 0; }
    .footer { font-size: 11px; color: #64748b; text-align: center; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">MATCH ALERT ${notification.match_score ? `• ${notification.match_score}%` : ''}</span>
    <div class="title">${escapeHtml(notification.title)}</div>
    <div class="body">${escapeHtml(notification.body)}</div>
    <div class="footer">Dispatched by WorkMatch AI Opportunity Intelligence Pipeline</div>
  </div>
</body>
</html>
    `;

    // 1. Live Resend API Integration
    if (resendApiKey) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [recipientEmail],
            subject: notification.title,
            html: htmlContent
          })
        });

        if (!res.ok) {
          const errText = await res.text();
          console.warn(`[EmailNotifier] Resend API error (${res.status}): ${errText}`);
          return { delivered: false, error: errText };
        }

        console.log(`[EmailNotifier] Alert successfully delivered via Resend to ${recipientEmail}`);
        return { delivered: true };
      } catch (err: any) {
        console.warn('[EmailNotifier] Network failure delivering via Resend:', err.message);
        return { delivered: false, error: err.message };
      }
    }

    // 2. Generic Email Webhook Integration
    if (emailWebhookUrl) {
      try {
        const res = await fetch(emailWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: recipientEmail,
            subject: notification.title,
            body: notification.body,
            html: htmlContent,
            match_score: notification.match_score,
            sent_at: notification.sent_at
          })
        });
        return { delivered: res.ok };
      } catch (err: any) {
        return { delivered: false, error: err.message };
      }
    }

    // 3. Fallback / Dev logger
    console.log(`[EmailNotifier] [SIMULATION] Delivered email to ${recipientEmail}: ${notification.title}`);
    return { delivered: true };
  }
}

export class TelegramNotifier implements NotificationAdapter {
  public readonly channel = 'telegram';

  public async send(notification: NotificationItem): Promise<{ delivered: boolean; error?: string }> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      try {
        const text = `<b>${escapeHtml(notification.title)}</b>\n\n${escapeHtml(notification.body)}\n\n<i>Dispatched via WorkMatch AI</i>`;
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'HTML',
            disable_web_page_preview: true
          })
        });

        if (!res.ok) {
          const errText = await res.text();
          console.warn(`[TelegramNotifier] Telegram Bot API error (${res.status}): ${errText}`);
          return { delivered: false, error: errText };
        }

        console.log(`[TelegramNotifier] Alert delivered to Telegram chat ${chatId}`);
        return { delivered: true };
      } catch (err: any) {
        console.warn('[TelegramNotifier] Network failure connecting to Telegram:', err.message);
        return { delivered: false, error: err.message };
      }
    }

    // Fallback simulation for dev/test
    console.log(`[TelegramNotifier] [SIMULATION] Delivered Telegram message: ${notification.title}`);
    return { delivered: true };
  }
}

export class DiscordNotifier implements NotificationAdapter {
  public readonly channel = 'discord';

  public async send(notification: NotificationItem): Promise<{ delivered: boolean; error?: string }> {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        const isHighMatch = (notification.match_score || 0) >= 85;
        const color = isHighMatch ? 0x10b981 : 0x06b6d4; // Emerald or Cyan

        const payload = {
          username: 'WorkMatch AI',
          avatar_url: 'https://raw.githubusercontent.com/Ashaypatakare04/WorkMatch/main/frontend/public/favicon.svg',
          embeds: [
            {
              title: notification.title,
              description: notification.body,
              color,
              timestamp: new Date().toISOString(),
              footer: {
                text: 'WorkMatch AI • Opportunity Alert'
              }
            }
          ]
        };

        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errText = await res.text();
          console.warn(`[DiscordNotifier] Discord webhook error (${res.status}): ${errText}`);
          return { delivered: false, error: errText };
        }

        console.log('[DiscordNotifier] Alert delivered via Discord webhook');
        return { delivered: true };
      } catch (err: any) {
        console.warn('[DiscordNotifier] Network failure connecting to Discord webhook:', err.message);
        return { delivered: false, error: err.message };
      }
    }

    // Fallback simulation for dev/test
    console.log(`[DiscordNotifier] [SIMULATION] Delivered Discord webhook: ${notification.title}`);
    return { delivered: true };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
