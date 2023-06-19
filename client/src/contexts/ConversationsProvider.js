import React, { useContext, useState, useEffect, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketProvider';
import CryptoJS from 'crypto-js'

const ConversationsContext = React.createContext()

export function useConversations() {
    return useContext(ConversationsContext)
}

export function ConversationsProvider({ id, children }) {
    const [conversations, setConversations] = useLocalStorage('conversations', [])
    const [selectedConversationIndex, setSelectedConversationIndex] = useState(0)
    const { contacts } = useContacts()
    const socket = useSocket()
    const secretKey = "a5f6c8b24e3d7a09123e456789abcdef1234567890abcdef0987654321fedc";

    function createConversation(recipients) {
        setConversations(prevConversations => {
            return [...prevConversations, { recipients, messages: [] }]
        })
    }

    
    let addMessageToConversation = useCallback(({ recipients, text, sender, enckey }) => {
        setConversations(prevConversations => {
            let madeChange = false
            const newEnc= CryptoJS.AES.decrypt(enckey, secretKey).toString(CryptoJS.enc.Utf8);
            const newMessage = { sender, text, newEnc }
            console.log(newMessage);
            const newConversations = prevConversations.map(conversation => {
                if (arrayEquality(conversation.recipients, recipients)) {
                    madeChange = true
                    return {                      
                        ...conversation,
                        messages: [...conversation.messages, newMessage]
                    }
                }

                return conversation

            })

            if (madeChange) {
                return newConversations
            } else {
                return [
                    ...prevConversations,
                    { recipients, messages: [newMessage] }
                ]
            }
        })
    }, [setConversations])

    useEffect(() => {
        if (socket == null) return

        socket.on('receive-message', addMessageToConversation)

        return () => socket.off('receive-message')
    }, [socket, addMessageToConversation])

    function sendMessage(recipients, text, enckey) {
        socket.emit('send-message', { recipients, text, enckey })

        addMessageToConversation({ recipients, text, sender: id, enckey })
    }
    const formattedConversations = conversations.map((conversation, index) => {
        const recipients = conversation.recipients.map(recipient => {
            const contact = contacts.find(contact => {
                return contact.id === recipient
            })
            const name = (contact && contact.name) || recipient
            return { id: recipient, name }
        })

        const messages = conversation.messages.map(message => {
            const contact = contacts.find(contact => {
                return contact.id === message.sender
            })
            const name = (contact && contact.name) || message.sender
            const fromMe = id === message.sender
            const enckey = message.newEnc           
            return { ...message, senderName: name, fromMe, enckey }
        })
        
        const selected = index === selectedConversationIndex
        return { ...conversation, messages, recipients, selected }
    })

    const value = {
        conversations: formattedConversations,
        selectedConversation: formattedConversations[selectedConversationIndex],
        sendMessage,
        selectConversationIndex: setSelectedConversationIndex,
        createConversation
    }

    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    )
}

function arrayEquality(a, b) {
    if (a.length !== b.length) return false

    a.sort()
    b.sort()

    return a.every((element, index) => {
        return element === b[index]
    })
}