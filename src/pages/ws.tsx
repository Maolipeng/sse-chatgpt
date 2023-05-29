import ConvertToMarkdown from '@/components/markdown';
import useThrottleFn from '@/hooks/useThrottleFn';
import * as React from 'react'
import io, { Socket } from 'socket.io-client'

const { useState, useRef, useEffect } = React

const WsPage: React.FC = () => {
  const wsRef = useRef<Socket<any>>(null!)
  const [message, setMessage] = useState<string>('');
  const smoothToBottom = useThrottleFn(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }, 300)

  useEffect(() => {
    wsRef.current = io('http://localhost:3004')
    wsRef.current.on('document', (data: string) => {
      setMessage((text) => `${text}${data}`);
      smoothToBottom()
    });
    return () => {
      wsRef.current.disconnect();
    }
  }, [])
const handleStart = () => {
  wsRef.current.emit('message', '/send-document')
}
const handleDisconnect = () => {
  wsRef.current.disconnect();
}
  return (
    <div>
      <h1>Websocket接口Demo</h1>
      <button onClick={handleStart}>开始ws请求</button>
      <br />
      <br />
      <button onClick={handleDisconnect}>Websocket服务关闭</button>
      <div>
              <ConvertToMarkdown content={message} />
            </div>
            <div style={{width: '100%', height: '100px', marginTop: '50px'}}>footer</div>
    </div>
  );
};

export default WsPage;
