/**
 * Real-Time Collaboration & Synchronized Presence Engine
 * Role: agency-realtime-collaboration-engineer
 * 
 * Features:
 * - Native BroadcastChannel for zero-latency multi-tab sync
 * - Simulated WebSocket heartbeat stream for global Coke Studio room
 * - Real-time collective cheer reaction propagation
 */

export interface RealtimeMessage {
  type: 'CHEER' | 'VOTE' | 'LISTENER_JOIN' | 'LISTENER_LEAVE' | 'CART_SYNC';
  payload: Record<string, unknown>;
  senderId: string;
  timestamp: number;
}

type MessageHandler = (msg: RealtimeMessage) => void;

class RealtimeEngine {
  private channel: BroadcastChannel | null = null;
  private handlers: Set<MessageHandler> = new Set();
  private clientId: string;
  private onlineUsersCount = 418;
  private presenceInterval: number | null = null;

  constructor() {
    this.clientId = 'fan_' + Math.random().toString(36).substring(2, 9);
    this.initChannel();
    this.startSimulatedPresence();
  }

  private initChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('coke_studio_realtime');
        this.channel.onmessage = (event: MessageEvent<RealtimeMessage>) => {
          this.notifyHandlers(event.data);
        };
      } catch (err) {
        console.warn('[RealtimeEngine] BroadcastChannel error:', err);
      }
    }
  }

  private startSimulatedPresence() {
    if (typeof window === 'undefined') return;

    // Simulate natural room ebb-and-flow
    this.presenceInterval = window.setInterval(() => {
      const delta = (Math.random() > 0.45 ? 1 : -1) * Math.floor(Math.random() * 4);
      this.onlineUsersCount = Math.max(312, Math.min(850, this.onlineUsersCount + delta));
      
      // Occasionally simulate a spontaneous global cheer
      if (Math.random() > 0.7) {
        const reactions = ['❤️', '🔥', '🎵', '⚡', '✨', '🥤'];
        const randomEmoji = reactions[Math.floor(Math.random() * reactions.length)];
        this.notifyHandlers({
          type: 'CHEER',
          payload: { emoji: randomEmoji, sender: 'Global Fan ' + Math.floor(Math.random() * 900 + 100) },
          senderId: 'simulated_peer',
          timestamp: Date.now()
        });
      }
    }, 4000);
  }

  public getOnlineCount(): number {
    return this.onlineUsersCount;
  }

  public getClientId(): string {
    return this.clientId;
  }

  public send(type: RealtimeMessage['type'], payload: Record<string, unknown>) {
    const msg: RealtimeMessage = {
      type,
      payload,
      senderId: this.clientId,
      timestamp: Date.now()
    };

    // 1. Notify self
    this.notifyHandlers(msg);

    // 2. Broadcast across tabs
    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch (err) {
        console.warn('[RealtimeEngine] PostMessage failed:', err);
      }
    }
  }

  public subscribe(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  private notifyHandlers(msg: RealtimeMessage) {
    this.handlers.forEach((handler) => {
      try {
        handler(msg);
      } catch (err) {
        console.error('[RealtimeEngine] Handler error:', err);
      }
    });
  }

  public cleanup() {
    if (this.presenceInterval) {
      clearInterval(this.presenceInterval);
    }
    if (this.channel) {
      this.channel.close();
    }
  }
}

export const realtime = new RealtimeEngine();
