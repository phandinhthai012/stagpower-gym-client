import { io, Socket } from 'socket.io-client';

const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(token?: string) {
    if (this.socket) {
      if (token) {
        this.socket.auth = { ...(this.socket.auth as Record<string, unknown>), token };
      }
      if (!this.socket.connected) {
        this.socket.connect();
      }
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: true,
      auth: token ? { token } : undefined
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connect error:', error.message);
    });

    return this.socket;
  }

  getSocket() {
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();

