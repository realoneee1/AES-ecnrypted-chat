import React, { useState, useCallback } from 'react'
import { Form, InputGroup, Button } from 'react-bootstrap'
import CryptoJS from 'crypto-js'

import { useConversations } from '../contexts/ConversationsProvider';
import { useTheme } from '../contexts/ThemeProvider';


export default function OpenConversation() {
    const { isLightTheme } = useTheme()
    // const key = "obvwoqcbv21801f19z0zibcoavwpnqdf";
    // const keyHex = CryptoJS.enc.Utf8.parse(key); // перетворення ключа в байтовий масив
    // const keyHexEncoded = CryptoJS.enc.Hex.stringify(keyHex); // кодування ключа
    const secretKey = "a5f6c8b24e3d7a09123e456789abcdef1234567890abcdef0987654321fedc";

    const [text, setText] = useState('')
    const setRef = useCallback(node => {
        if (node) {
            node.scrollIntoView({ smooth: true })
        }
    }, [])
    const { sendMessage, selectedConversation } = useConversations()

    

    function handleSubmit(e) {
        e.preventDefault()

        const key = CryptoJS.lib.WordArray.random(32).toString();
        const keyHex = CryptoJS.enc.Utf8.parse(key);
        const keyHexEncoded = CryptoJS.enc.Hex.stringify(keyHex);
        const encryptedKey = CryptoJS.AES.encrypt(keyHexEncoded, secretKey).toString()
        //AES-128   
        console.log("key: " + keyHexEncoded)
        let cipher = CryptoJS.AES.encrypt(text, keyHexEncoded).toString()
        console.log("Encrypted message: " + cipher)
        sendMessage(
            selectedConversation.recipients.map(r => r.id),
            cipher,
            encryptedKey
        )
        setText('')
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          handleSubmit(e)
        }
      };

    return (
        <div className={isLightTheme ? "bag-light d-flex flex-column flex-grow-1" : "bag-dark d-flex flex-column flex-grow-1"}>
            <div className="flex-grow-1 overflow-auto">
                <div className="d-flex flex-column align-items-start justify-content-end px-3">
                    {selectedConversation.messages.map((message, index) => {
                        const lastMessage = selectedConversation.messages.length - 1 === index
                        return (
                            <div
                                ref={lastMessage ? setRef : null}
                                key={index}
                                className={`my-1 d-flex flex-column ${message.fromMe ? 'align-self-end align-items-end' : 'align-items-start'}`}
                            >
                                <div
                                    className={isLightTheme ? `rounded px-2 py-1 ${message.fromMe ? 'bg-color text-white' : 'bg-light-colorless'}` : `rounded px-2 py-1 ${message.fromMe ? 'bg-color text-white' : 'bg-dark-colorless'}`}>
                                    {message.enckey ? CryptoJS.AES.decrypt(message.text, message.enckey).toString(CryptoJS.enc.Utf8) : ''}
                                    {/* keyHexEncoded */}
                                    {/* {console.log("decrypted: " + CryptoJS.AES.decrypt(message.text, keyHexEncoded).toString(CryptoJS.enc.Utf8))  } */}
                                    
                                </div>
                                <div className={`text-muted small ${message.fromMe ? 'text-right' : ''}`}>
                                    {message.fromMe ? 'You' : message.senderName}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="m-2">
                    <InputGroup>
                        <Form.Control
                            as="textarea"
                            required
                            value={text}
                            onChange={e => setText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type Your Message"
                            style={{ height: '75px', resize: 'none' }}                           
                        />
                        <InputGroup.Append>
                            <Button type="submit">Send</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
            </Form>
        </div>
    )
}
