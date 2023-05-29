import * as React from 'react'
import ConvertToMarkdown from '@/components/markdown';
import useThrottleFn from '@/hooks/useThrottleFn';

const { useState } = React

export default function HomePage() {
    const [text, setText] = useState('')
    const smoothToBottom = useThrottleFn(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 300)
    const handleBegin = async () => {
        const response = await fetch('http://127.0.0.1:3003/sse', {
            method: 'GET',
        })
        if (response.ok) {
            const reader = response.body.getReader()
            const decoder = new TextDecoder('utf-8')
            let done = false
            while (!done) {
                const { value, done: readerDone } = await reader.read()
                if (value) {
                    let message = decoder.decode(value)
                    console.log('message', message);
                    // setMessages((messages) => [...messages, message]);
                   setText((text) => `${text}${message}`)
                   smoothToBottom()
                }
                done = readerDone
            }
        }
    }
    return (
        <div>
            <h1>SSE接口Demo：</h1>
            <button onClick={handleBegin}>开始</button>
            <div>
              <ConvertToMarkdown content={text} />
            </div>
            <div style={{width: '100%', height: '100px', marginTop: '50px'}}>footer</div>
        </div>
    );
}
