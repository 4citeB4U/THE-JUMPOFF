// Main JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initNavbar();
    initTestimonials();
    initAgentLee();
    initEventCountdowns();
    
    // Check for offline status
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker not registered', err));
    }
});

// Navigation functionality
function initNavbar() {
    const toggle = document.querySelector('.navbar-toggle');
    const menu = document.querySelector('.navbar-menu');
    const navbar = document.querySelector('.navbar');
    
    if (toggle) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }
    
    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.backgroundColor = 'rgba(18, 18, 18, 0.95)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.backgroundColor = 'rgba(18, 18, 18, 0.9)';
        }
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.navbar-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (menu.classList.contains('active')) {
                    menu.classList.remove('active');
                }
            }
        });
    });
}

// Testimonial slider
function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(item => item.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }
    
    // Initialize dots functionality
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
    
    // Auto rotate testimonials
    setInterval(() => {
        let nextIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(nextIndex);
    }, 5000);
    
    // Show first testimonial
    showTestimonial(0);
}

// Agent Lee chat functionality
function initAgentLee() {
    const agentButton = document.querySelector('.agent-lee');
    const agentChat = document.querySelector('.agent-chat');
    const closeButton = document.querySelector('.agent-close');
    const messageInput = document.querySelector('.agent-input input');
    const sendButton = document.querySelector('.agent-input button');
    const messagesContainer = document.querySelector('.agent-messages');
    
    // Toggle chat
    if (agentButton) {
        agentButton.addEventListener('click', () => {
            agentChat.classList.add('active');
            agentButton.style.display = 'none';
            
            // Add welcome message
            if (messagesContainer && messagesContainer.children.length === 0) {
                addAgentMessage("Hi, I'm Agent Lee! How can I help you today? Ask me about the artist, music, merch, or upcoming events!");
            }
        });
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            agentChat.classList.remove('active');
            agentButton.style.display = 'flex';
        });
    }
    
    // Send message
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    if (messageInput) {
        messageInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            // Add user message
            const userMessage = document.createElement('div');
            userMessage.className = 'agent-message user-message';
            userMessage.textContent = message;
            messagesContainer.appendChild(userMessage);
            
            // Clear input
            messageInput.value = '';
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Generate reply (simulated AI response)
            setTimeout(() => {
                const response = generateAgentResponse(message);
                addAgentMessage(response);
            }, 1000);
        }
    }
    
    function addAgentMessage(message) {
        const agentMessage = document.createElement('div');
        agentMessage.className = 'agent-message';
        agentMessage.textContent = message;
        messagesContainer.appendChild(agentMessage);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Simple AI response generator
    function generateAgentResponse(message) {
        message = message.toLowerCase();
        
        if (message.includes('merch') || message.includes('t-shirt') || message.includes('shop')) {
            return "Our merch store has t-shirts, hoodies, and vinyl! Check out the Merch section for the latest items.";
        } else if (message.includes('tour') || message.includes('concert') || message.includes('show') || message.includes('event')) {
            return "We have upcoming events! Check the Tour section for dates and locations. Can I help you RSVP or get tickets?";
        } else if (message.includes('music') || message.includes('album') || message.includes('song') || message.includes('listen')) {
            return "You can stream our music on all platforms! Check out our latest releases in the Video section.";
        } else if (message.includes('price') || message.includes('cost') || message.includes('much') || message.includes('booking')) {
            return "For booking or pricing information, please see our Pricing section or I can help you fill out the booking form!";
        } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hey there! How can I help you today?";
        } else if (message.includes('thank')) {
            return "You're welcome! Let me know if you need anything else.";
        } else {
            return "I'm not sure I understand. Can you ask about our music, merch, tour dates, or booking information?";
        }
    }
}

// Update online status
function updateOnlineStatus() {
    const offlineMessage = document.querySelector('.offline-message');
    
    if (navigator.onLine) {
        if (offlineMessage) {
            offlineMessage.style.display = 'none';
        }
    } else {
        if (offlineMessage) {
            offlineMessage.style.display = 'block';
        } else {
            window.location.href = 'offline.html';
        }
    }
}

// Event countdowns
function initEventCountdowns() {
    const countdowns = document.querySelectorAll('.countdown');
    
    countdowns.forEach(countdown => {
        const eventDate = new Date(countdown.getAttribute('data-date'));
        
        // Update every second
        const timer = setInterval(() => {
            const now = new Date();
            const diff = eventDate - now;
            
            // If event passed
            if (diff < 0) {
                countdown.textContent = 'Event passed';
                clearInterval(timer);
                return;
            }
            
            // Calculate days, hours, minutes
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            // Display countdown
            if (days > 0) {
                countdown.textContent = `${days}d ${hours}h`;
            } else {
                countdown.textContent = `${hours}h ${minutes}m`;
            }
        }, 1000);
    });
}