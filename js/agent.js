// Agent Lee AI Assistant

class AgentLee {
    constructor() {
        this.initialized = false;
        this.voiceEnabled = false;
        this.messages = [];
        this.synth = window.speechSynthesis;
    }
    
    init() {
        if (this.initialized) return;
        
        this.agentButton = document.querySelector('.agent-lee');
        this.agentChat = document.querySelector('.agent-chat');
        this.closeButton = document.querySelector('.agent-close');
        this.messageInput = document.querySelector('.agent-input input');
        this.sendButton = document.querySelector('.agent-input button');
        this.messagesContainer = document.querySelector('.agent-messages');
        this.voiceButton = document.querySelector('.agent-voice');
        
        this.bindEvents();
        this.initialized = true;
        
        // Check if browser supports speech recognition
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            this.setupVoiceRecognition();
        } else {
            if (this.voiceButton) {
                this.voiceButton.style.display = 'none';
            }
        }
    }
    
    bindEvents() {
        if (this.agentButton) {
            this.agentButton.addEventListener('click', () => this.openChat());
        }
        
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.closeChat());
        }
        
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
        }
        
        if (this.messageInput) {
            this.messageInput.addEventListener('keypress', e => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
        
        if (this.voiceButton) {
            this.voiceButton.addEventListener('click', () => this.toggleVoiceInput());
        }
    }
    
    openChat() {
        this.agentChat.classList.add('active');
        this.agentButton.style.display = 'none';
        
        // Add welcome message if first time
        if (this.messages.length === 0) {
            this.addAgentMessage("Hi, I'm Agent Lee! How can I help you today? Ask me about the artist, music, merch, or upcoming events!");
        }
    }
    
    closeChat() {
        this.agentChat.classList.remove('active');
        this.agentButton.style.display = 'flex';
        
        // Stop voice if active
        if (this.voiceEnabled) {
            this.toggleVoiceInput();
        }
    }
    
    sendMessage() {
        const message = this.messageInput.value.trim();
        if (message) {
            // Add user message
            this.addUserMessage(message);
            
            // Clear input
            this.messageInput.value = '';
            
            // Generate reply
            setTimeout(() => {
                const response = this.generateResponse(message);
                this.addAgentMessage(response);
                
                // If voice is enabled, speak the response
                if (this.voiceEnabled) {
                    this.speakMessage(response);
                }
            }, 1000);
        }
    }
    
    addUserMessage(message) {
        // Store message
        this.messages.push({ role: 'user', content: message });
        
        // Add to UI
        const userMessage = document.createElement('div');
        userMessage.className = 'agent-message user-message';
        userMessage.textContent = message;
        this.messagesContainer.appendChild(userMessage);
        this.scrollToBottom();
    }
    
    addAgentMessage(message) {
        // Store message
        this.messages.push({ role: 'agent', content: message });
        
        // Add to UI
        const agentMessage = document.createElement('div');
        agentMessage.className = 'agent-message';
        agentMessage.textContent = message;
        this.messagesContainer.appendChild(agentMessage);
        this.scrollToBottom();
        
        // Save conversation to localStorage
        this.saveConversation();
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    generateResponse(message) {
        // Simple rule-based responses
        message = message.toLowerCase();
        
        if (message.includes('merch') || message.includes('t-shirt') || message.includes('shop')) {
            return "Our merch store has t-shirts, hoodies, and vinyl! Check out the Merch section for the latest items.";
        } else if (message.includes('tour') || message.includes('concert') || message.includes('show') || message.includes('event')) {
            return "We have upcoming events! Check the Tour section for dates and locations. Can I help you RSVP or get tickets?";
        } else if (message.includes('music') || message.includes('album') || message.includes('song') || message.includes('listen')) {
            return "You can stream our music on all platforms! Check out our latest releases in the Video section.";
        } else if (message.includes('price') || message.includes('cost') || message.includes('much') || message.includes('booking')) {
            return "For booking or pricing information, please see our Pricing section or I can help you fill out the booking form!";
        } else if (message.includes('artist') || message.includes('about') || message.includes('who')) {
            return "The artist is an independent musician known for their unique sound and engaging performances. Check out the About section to learn more!";
        } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hey there! How can I help you today?";
        } else if (message.includes('thank')) {
            return "You're welcome! Let me know if you need anything else.";
        } else {
            return "I'm not sure I understand. Can you ask about our music, merch, tour dates, or booking information?";
        }
    }
    
    setupVoiceRecognition() {
        // Setup speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.lang = 'en-US';
        
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.messageInput.value = transcript;
            this.sendMessage();
        };
        
        this.recognition.onend = () => {
            if (this.voiceEnabled) {
                // Keep listening if voice mode is enabled
                try {
                    this.recognition.start();
                } catch (e) {
                    console.log('Recognition already started');
                }
            } else {
                this.voiceButton.classList.remove('active');
            }
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            this.voiceEnabled = false;
            this.voiceButton.classList.remove('active');
        };
    }
    
    toggleVoiceInput() {
        if (!this.voiceEnabled) {
            // Start voice recognition
            this.voiceEnabled = true;
            this.voiceButton.classList.add('active');
            try {
                this.recognition.start();
                this.addAgentMessage("Voice mode activated. What would you like to know?");
            } catch (e) {
                console.error('Could not start speech recognition', e);
            }
        } else {
            // Stop voice recognition
            this.voiceEnabled = false;
            this.voiceButton.classList.remove('active');
            this.recognition.stop();
            this.addAgentMessage("Voice mode deactivated.");
        }
    }
    
    speakMessage(message) {
        if (this.synth && this.voiceEnabled) {
            // Stop any current speech
            this.synth.cancel();
            
            // Create new utterance
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.rate = 1;
            utterance.pitch = 1;
            
            // Get available voices and select a good one
            let voices = this.synth.getVoices();
            if (voices.length > 0) {
                // Try to find a good female voice
                const femaleVoice = voices.find(voice => 
                    voice.name.includes('Female') || 
                    voice.name.includes('Google') || 
                    voice.name.includes('Samantha')
                );
                
                if (femaleVoice) {
                    utterance.voice = femaleVoice;
                }
            }
            
            this.synth.speak(utterance);
        }
    }
    
    saveConversation() {
        // Save conversation to localStorage
        if (this.messages.length > 0) {
            try {
                localStorage.setItem('agent-conversation', JSON.stringify(this.messages));
            } catch (e) {
                console.error('Could not save conversation', e);
            }
        }
    }
    
    loadConversation() {
        // Load conversation from localStorage
        try {
            const savedMessages = localStorage.getItem('agent-conversation');
            if (savedMessages) {
                this.messages = JSON.parse(savedMessages);
                
                // Display messages in UI
                this.messagesContainer.innerHTML = '';
                this.messages.forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = msg.role === 'user' ? 'agent-message user-message' : 'agent-message';
                    messageDiv.textContent = msg.content;
                    this.messagesContainer.appendChild(messageDiv);
                });
                
                this.scrollToBottom();
            }
        } catch (e) {
            console.error('Could not load conversation', e);
        }
    }
}

// Initialize Agent Lee when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.agentLee = new AgentLee();
    window.agentLee.init();
    
    // Load previous conversation
    window.agentLee.loadConversation();
});