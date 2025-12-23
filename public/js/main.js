// Sound System using Web Audio API
const SoundSystem = {
    audioContext: null,
    isReady: false,
    
    async init() {
        // Initialize audio context (requires user interaction first)
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // Immediately try to resume if suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            this.isReady = (this.audioContext.state === 'running');
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.isReady = false;
        }
    },
    
    // Ensure audio context is ready (required for some browsers)
    async ensureContext() {
        // If already ready, return immediately
        if (this.isReady && this.audioContext && this.audioContext.state === 'running') {
            return true;
        }
        
        if (!this.audioContext) {
            await this.init();
        }
        
        if (this.audioContext) {
            // Wait for context to be ready
            if (this.audioContext.state === 'suspended') {
                try {
                    await this.audioContext.resume();
                } catch (e) {
                    // Ignore resume errors
                    return false;
                }
            }
            // Check if it's actually running now
            if (this.audioContext.state === 'running') {
                this.isReady = true;
                return true;
            }
        }
        return false;
    },
    
    // Play a beep sound
    async playBeep(frequency = 440, duration = 100, type = 'sine', volume = 0.3) {
        const ready = await this.ensureContext();
        if (!ready || !this.audioContext) {
            return; // Don't play if context isn't ready
        }
        
        // Final check - make sure context is running
        if (this.audioContext.state !== 'running') {
            return; // Still not ready
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    },
    
    // Play a hit sound (fun winner sound - upward chime)
    playHit() {
        // Upward success sound - like a little victory chime
        this.playBeep(400, 60, 'sine', 0.3).catch(() => {});
        setTimeout(() => {
            this.playBeep(500, 60, 'sine', 0.3).catch(() => {});
        }, 40);
        setTimeout(() => {
            this.playBeep(600, 80, 'sine', 0.25).catch(() => {});
        }, 80);
    },
    
    // Play an eat/collect sound (upward chirp)
    playEat() {
        this.playBeep(400, 50, 'sine', 0.3).catch(() => {});
        setTimeout(() => {
            this.playBeep(600, 50, 'sine', 0.3).catch(() => {});
        }, 30);
    },
    
    // Play game over sound (downward sad tone)
    playGameOver() {
        this.playBeep(300, 200, 'sine', 0.4).catch(() => {});
        setTimeout(() => {
            this.playBeep(200, 300, 'sine', 0.4).catch(() => {});
        }, 100);
    },
    
    // Play a whoosh/swing sound
    playSwing() {
        this.playBeep(80, 100, 'sawtooth', 0.2).catch(() => {});
    }
};

// Initialize sound system on first user interaction
let soundInitialized = false;
async function initSoundOnInteraction() {
    if (!soundInitialized) {
        soundInitialized = true;
        await SoundSystem.init(); // Wait for initialization to complete
    }
}

// Initialize on any user interaction (multiple events to catch early)
// Click is the most reliable for audio context initialization
// Use capture phase to catch clicks early, and don't use 'once' so we can retry if needed
document.addEventListener('click', function(e) {
    initSoundOnInteraction();
}, { capture: true, passive: true });

document.addEventListener('keydown', initSoundOnInteraction, { once: true });
document.addEventListener('touchstart', initSoundOnInteraction, { once: true });

// Shooter Game for Home Section
function initShooterGame() {
    const shooterGame = document.getElementById('shooterGame');
    const shooterHammer = document.getElementById('shooterHammer');
    const startMessage = document.getElementById('shooterStartMessage');
    if (!shooterGame || !shooterHammer || !startMessage) return;
    
    let score = 0;
    let targets = [];
    let hammerX = 0;
    let hammerY = 0;
    let isSwinging = false;
    let gameActive = false; // Game is disabled until first click
    const targetEmojis = ['🐛', '🪲', '🐜', '🦗', '🪳', '🦟', '🐞'];
    
    // Create score display
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'shooter-score';
    scoreDisplay.textContent = 'Score: 0';
    shooterGame.appendChild(scoreDisplay);
    
    // Update score
    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = `Score: ${score}`;
        scoreDisplay.style.transform = 'scale(1.1)';
        setTimeout(() => {
            scoreDisplay.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Fun messages for hitting bugs
    const bugHitMessages = [
        'Bug fixed!',
        'Code saved!',
        'Nice catch!',
        'Bug squashed!',
        'Well done!',
        'Perfect!',
        'Excellent!',
        'You saved the code!',
        'Bug eliminated!',
        'Great hit!',
        'Code protected!',
        'Bug destroyed!',
        'Awesome!',
        'Fantastic!',
        'Bug crushed!',
        'Code secured!',
        'Brilliant!',
        'Bug terminated!',
        'Outstanding!',
        'Code rescued!'
    ];
    
    // Track recently used messages to avoid repetition
    let recentMessages = [];
    const maxRecentCount = 3;
    
    // Get a random message that hasn't been used recently
    function getRandomMessage() {
        let availableMessages = bugHitMessages;
        
        // If we have recent messages, filter them out
        if (recentMessages.length >= maxRecentCount) {
            availableMessages = bugHitMessages.filter(msg => !recentMessages.includes(msg));
        }
        
        // If all messages were recent, reset and use all
        if (availableMessages.length === 0) {
            availableMessages = bugHitMessages;
            recentMessages = [];
        }
        
        // Pick random from available
        const randomIndex = Math.floor(Math.random() * availableMessages.length);
        const selectedMessage = availableMessages[randomIndex];
        
        // Add to recent messages
        recentMessages.push(selectedMessage);
        if (recentMessages.length > maxRecentCount) {
            recentMessages.shift(); // Remove oldest
        }
        
        return selectedMessage;
    }
    
    // Show score popup with fun message
    function showScorePopup(x, y) {
        const popup = document.createElement('div');
        popup.className = 'shooter-score-popup';
        // Pick a random message (avoiding recent ones)
        const message = getRandomMessage();
        popup.textContent = message;
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        shooterGame.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 1500); // Slightly longer to read the message
    }
    
    // Get home section element
    const homeSection = document.querySelector('.home-section');
    let spawnInterval = null;
    
    // Function to show/hide game based on visibility
    function toggleGameVisibility(isVisible) {
        if (isVisible) {
            // Home section is visible - show hammer if game is active
            if (gameActive) {
                shooterHammer.style.display = 'block';
            }
        } else {
            // Home section is not visible - hide hammer and pause game
            shooterHammer.style.display = 'none';
            // Remove all targets
            targets.forEach(target => target.remove());
            targets = [];
            // Clear spawn interval
            if (spawnInterval) {
                clearInterval(spawnInterval);
                spawnInterval = null;
            }
        }
    }
    
    // Use Intersection Observer to detect when home section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            toggleGameVisibility(entry.isIntersecting);
        });
    }, {
        threshold: 0.3 // Trigger when 30% of section is visible
    });
    
    observer.observe(homeSection);
    
    // Hammer follows mouse (only when game is active and section is visible)
    homeSection.addEventListener('mousemove', function(e) {
        if (!gameActive) return; // Don't move hammer if game isn't active
        
        const rect = homeSection.getBoundingClientRect();
        hammerX = e.clientX - rect.left;
        hammerY = e.clientY - rect.top;
        
        shooterHammer.style.left = hammerX + 'px';
        shooterHammer.style.top = hammerY + 'px';
    });
    
    // Start the game on first click
    function startGame() {
        if (gameActive) return; // Already started
        
        gameActive = true;
        startMessage.classList.add('hidden');
        shooterHammer.style.display = 'block';
        initSoundOnInteraction(); // Initialize sound
        
        // Start spawning targets - spawn multiple bugs immediately
        setTimeout(() => {
            // Spawn 3 bugs right away
            createTarget();
            createTarget();
            createTarget();
            
            spawnInterval = setInterval(() => {
                if (gameActive && targets.length < 10) { // Increased max bugs from 5 to 10
                    // Check if home section is still visible
                    const rect = homeSection.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    if (isVisible) {
                        createTarget();
                    }
                }
            }, 1000 + Math.random() * 1000); // Faster spawn: 1-2 seconds instead of 2-4
        }, 500); // Start faster: 500ms instead of 1000ms
    }
    
    // Listen for clicks to start the game
    homeSection.addEventListener('click', startGame, { once: true });
    
    // Check collision between hammer and targets
    function checkHammerCollisions() {
        if (!gameActive) return; // Don't check collisions if game isn't active
        
        // Check if home section is visible
        const rect = homeSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (!isVisible) return; // Don't check collisions if section is not visible
        
        targets.forEach(target => {
            if (target.classList.contains('hit')) return;
            
            const targetRect = target.getBoundingClientRect();
            const gameRect = shooterGame.getBoundingClientRect();
            const targetX = targetRect.left - gameRect.left + targetRect.width / 2;
            const targetY = targetRect.top - gameRect.top + targetRect.height / 2;
            
            // Larger hit detection area (easier to hit)
            const distance = Math.sqrt(
                Math.pow(hammerX - targetX, 2) + 
                Math.pow(hammerY - targetY, 2)
            );
            
            // Hit if within 40px (much easier than before)
            if (distance < 40) {
                target.classList.add('hit');
                updateScore(10);
                showScorePopup(targetX, targetY);
                
                // Play hit sound
                SoundSystem.playHit();
                
                // Swing animation
                if (!isSwinging) {
                    isSwinging = true;
                    shooterHammer.classList.add('swinging');
                    SoundSystem.playSwing();
                    setTimeout(() => {
                        shooterHammer.classList.remove('swinging');
                        isSwinging = false;
                    }, 200);
                }
                
                setTimeout(() => {
                    target.remove();
                    targets = targets.filter(t => t !== target);
                }, 400);
            }
        });
    }
    
    // Check collisions continuously
    setInterval(checkHammerCollisions, 50);
    
    // Create target
    function createTarget() {
        const target = document.createElement('div');
        target.className = 'shooter-target';
        target.textContent = targetEmojis[Math.floor(Math.random() * targetEmojis.length)];
        
        // Random position (avoid center area)
        const homeSection = document.querySelector('.home-section');
        const rect = homeSection.getBoundingClientRect();
        let x, y;
        do {
            x = Math.random() * rect.width;
            y = Math.random() * rect.height;
        } while (x > rect.width * 0.3 && x < rect.width * 0.7 && 
                 y > rect.height * 0.3 && y < rect.height * 0.7);
        
        target.style.left = x + 'px';
        target.style.top = y + 'px';
        
        // Random movement
        const speed = 0.3 + Math.random() * 0.5;
        const angle = Math.random() * Math.PI * 2;
        let vx = Math.cos(angle) * speed;
        let vy = Math.sin(angle) * speed;
        
        shooterGame.appendChild(target);
        targets.push(target);
        
        // Animate target movement
        function moveTarget() {
            if (!target.parentNode || target.classList.contains('hit')) return;
            
            let currentX = parseFloat(target.style.left);
            let currentY = parseFloat(target.style.top);
            
            currentX += vx;
            currentY += vy;
            
            // Bounce off edges
            if (currentX <= 0 || currentX >= rect.width - 30) {
                vx = -vx;
            }
            if (currentY <= 0 || currentY >= rect.height - 30) {
                vy = -vy;
            }
            
            currentX = Math.max(0, Math.min(currentX, rect.width - 30));
            currentY = Math.max(0, Math.min(currentY, rect.height - 30));
            
            target.style.left = currentX + 'px';
            target.style.top = currentY + 'px';
            
            // Occasionally change direction
            if (Math.random() < 0.01) {
                const newAngle = Math.atan2(vy, vx) + (Math.random() - 0.5) * 0.3;
                vx = Math.cos(newAngle) * speed;
                vy = Math.sin(newAngle) * speed;
            }
            
            requestAnimationFrame(moveTarget);
        }
        moveTarget();
        
        // Remove after some time
        setTimeout(() => {
            if (target.parentNode && !target.classList.contains('hit')) {
                target.remove();
                targets = targets.filter(t => t !== target);
            }
        }, 12000);
    }
    
    // Click to swing hammer (only when game is active)
    homeSection.addEventListener('click', function() {
        if (!gameActive) return; // Don't swing if game isn't active
        
        if (!isSwinging) {
            isSwinging = true;
            shooterHammer.classList.add('swinging');
            setTimeout(() => {
                shooterHammer.classList.remove('swinging');
                isSwinging = false;
            }, 200);
        }
    });
}

// Animated background for home section
function createAnimatedBackground() {
    const bgContainer = document.getElementById('animatedBg');
    if (!bgContainer) return;

    // C++ Unreal Engine code snippets
    const codeSnippets = [
        'void APlayerCharacter::Tick(float DeltaTime)',
        'UCLASS(BlueprintType)',
        'UPROPERTY(VisibleAnywhere)',
        'FVector PlayerLocation',
        'GetWorld()->SpawnActor',
        'AActor* HitActor',
        'FHitResult HitResult;',
        'GetActorLocation()',
        'AddMovementInput(Direction)',
        'GetController()->SetControlRotation',
        'UAnimMontage* Montage',
        'PlayMontage(AttackMontage)',
        'GetCharacterMovement()',
        'SetMaxWalkSpeed(600.0f)',
        'OnComponentBeginOverlap',
        'Cast<APlayerCharacter>(OtherActor)',
        'GetGameInstance()',
        'UGameplayStatics::PlaySound2D',
        'GetWorld()->GetTimerManager()',
        'SetTimer(Handle, this, &AClass::Function, 2.0f)',
        'FVector ForwardVector = GetActorForwardVector()',
        'FRotator NewRotation',
        'SetActorRotation(NewRotation)',
        'GetActorBounds(false, Origin, BoxExtent)',
        'GetOverlappingActors(TArray<AActor*>&)',
        'OnBeginPlay()',
        'OnEndPlay(EEndPlayReason::Type)',
        'GetWorld()->LineTraceSingleByChannel',
        'DrawDebugLine(GetWorld(), Start, End)',
        'GetCharacterMovement()->Jump()'
    ];

    // Game icons/emojis
    const gameIcons = ['🎮', '⚡', '🎯', '💻', '🔧', '⚙️', '🎲', '🧩', '🕹️', '👾', '🎰', '🎳', '🖱️', '🎲', '💣',];

    // Create code particles - spawn randomly from all sides
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'code-particle';
        const fullText = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        
        // Store full text for typing effect
        particle.dataset.fullText = fullText;
        particle.textContent = ''; // Start empty for typing effect
        
        // Random spawn position from edges (avoid center)
        const spawnSide = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
        let leftPos, topPos, startX, startY;
        
        // Keep away from center (30-70% area)
        do {
            leftPos = Math.random() * 100;
            topPos = Math.random() * 100;
        } while (leftPos > 30 && leftPos < 70 && topPos > 30 && topPos < 70);
        
        // Set starting position based on spawn side
        switch(spawnSide) {
            case 0: // Top
                startX = leftPos;
                startY = -10;
                particle.style.left = leftPos + '%';
                particle.style.top = '0%';
                particle.dataset.direction = 'down';
                break;
            case 1: // Right
                startX = 110;
                startY = topPos;
                particle.style.left = '100%';
                particle.style.top = topPos + '%';
                particle.dataset.direction = 'left';
                break;
            case 2: // Bottom
                startX = leftPos;
                startY = 110;
                particle.style.left = leftPos + '%';
                particle.style.top = '100%';
                particle.dataset.direction = 'up';
                break;
            case 3: // Left
                startX = -10;
                startY = topPos;
                particle.style.left = '0%';
                particle.style.top = topPos + '%';
                particle.dataset.direction = 'right';
                break;
        }
        
        const delay = Math.random() * 15;
        particle.style.animationDelay = delay + 's';
        particle.style.fontSize = (8 + Math.random() * 4) + 'px';
        particle.dataset.spawnSide = spawnSide;
        bgContainer.appendChild(particle);
        
        // Start typing effect immediately when particle appears
        setTimeout(() => {
            particle.style.opacity = '0.7'; // Make visible for typing
            typeText(particle, fullText, 0);
        }, delay * 1000);
    }
    
    // Typing effect function - faster typing
    function typeText(element, text, index) {
        if (index < text.length && element.parentNode) {
            element.textContent = text.substring(0, index + 1);
            // Faster typing - 15-25ms per character
            setTimeout(() => typeText(element, text, index + 1), 15 + Math.random() * 10);
        }
    }

    // Create floating game icons - keep away from center
    for (let i = 0; i < 10; i++) {
        const icon = document.createElement('div');
        icon.className = 'game-icon';
        icon.textContent = gameIcons[Math.floor(Math.random() * gameIcons.length)];
        
        // Keep icons on edges, avoid center area
        let leftPos, topPos;
        do {
            leftPos = Math.random() * 100;
            topPos = Math.random() * 100;
        } while (leftPos > 30 && leftPos < 70 && topPos > 30 && topPos < 70);
        
        icon.style.left = leftPos + '%';
        icon.style.top = topPos + '%';
        icon.style.animationDelay = Math.random() * 30 + 's';
        icon.style.animationDuration = (20 + Math.random() * 20) + 's';
        bgContainer.appendChild(icon);
    }

    // Create geometric shapes (no triangles)
    const shapes = ['circle', 'square'];
    for (let i = 0; i < 6; i++) {
        const shape = document.createElement('div');
        shape.className = 'geometric-shape shape-' + shapes[Math.floor(Math.random() * shapes.length)];
        // Keep shapes away from center (edges only)
        const edgePosition = Math.random() < 0.5 
            ? (Math.random() < 0.5 ? Math.random() * 20 : 80 + Math.random() * 20)
            : (Math.random() < 0.5 ? Math.random() * 100 : Math.random() * 100);
        shape.style.left = edgePosition + '%';
        shape.style.top = edgePosition + '%';
        shape.style.animationDelay = Math.random() * 8 + 's';
        shape.style.animationDuration = (6 + Math.random() * 4) + 's';
        bgContainer.appendChild(shape);
    }

    // Create particle dots - keep away from center
    for (let i = 0; i < 15; i++) {
        const dot = document.createElement('div');
        dot.className = 'particle-dot';
        
        // Keep dots on edges
        let leftPos, topPos;
        do {
            leftPos = Math.random() * 100;
            topPos = Math.random() * 100;
        } while (leftPos > 30 && leftPos < 70 && topPos > 30 && topPos < 70);
        
        dot.style.left = leftPos + '%';
        dot.style.top = topPos + '%';
        dot.style.animationDelay = Math.random() * 12 + 's';
        dot.style.animationDuration = (10 + Math.random() * 6) + 's';
        bgContainer.appendChild(dot);
    }

    // Create connection lines (fewer, more subtle)
    for (let i = 0; i < 5; i++) {
        const line = document.createElement('div');
        line.className = 'connection-line';
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const length = 50 + Math.random() * 100;
        const angle = Math.random() * 360;
        
        line.style.left = startX + '%';
        line.style.top = startY + '%';
        line.style.width = length + 'px';
        line.style.transform = `rotate(${angle}deg)`;
        line.style.animationDelay = Math.random() * 3 + 's';
        bgContainer.appendChild(line);
    }

    // Add typing effect to some code particles
    setTimeout(() => {
        const particles = bgContainer.querySelectorAll('.code-particle');
        particles.forEach((particle, index) => {
            if (index % 3 === 0) {
                const originalText = particle.textContent;
                particle.textContent = '';
                particle.style.opacity = '1';
                
                let charIndex = 0;
                const typeInterval = setInterval(() => {
                    if (charIndex < originalText.length) {
                        particle.textContent += originalText[charIndex];
                        charIndex++;
                    } else {
                        clearInterval(typeInterval);
                    }
                }, 50);
            }
        });
    }, 1000);
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animated background
    createAnimatedBackground();
    
    // Initialize shooter game
    initShooterGame();
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Use projects data from projects-data.js
    // Make sure projects-data.js is loaded before main.js in the HTML
    if (typeof projectsData === 'undefined') {
        console.error('projectsData is not defined. Make sure projects-data.js is loaded before main.js');
    }
    const projects = projectsData || [];

    // Function to create project cards
    function createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        let imageHtml = '';
        if (project.image) {
            imageHtml = `<div class="project-image">
                <img src="${project.image}" alt="${project.title}" onerror="this.style.display='none'">
            </div>`;
        }
        
        // Build links HTML from links array or github property
        let linksHtml = '';
        if (project.links && project.links.length > 0) {
            linksHtml = project.links.map(link => 
                `<a href="${link.url}" target="_blank" class="btn btn-small">${link.label}</a>`
            ).join('');
        } else if (project.github) {
            linksHtml = `<a href="${project.github}" target="_blank" class="btn btn-small">GitHub</a>`;
        }
        
        // Debug: Log if links are found
        if (project.links && project.links.length > 0) {
            console.log(`Found ${project.links.length} links for project: ${project.title}`);
        }
        
        card.innerHTML = `
            ${imageHtml}
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-links">
                    <button class="btn btn-small" onclick="showProjectDetails(${index})">View Details</button>
                    ${linksHtml}
                </div>
            </div>
        `;
        
        return card;
    }

    // Load projects into the grid
    const projectsGrid = document.getElementById('projectsGrid');
    if (projectsGrid) {
        projects.forEach((project, index) => {
            const card = createProjectCard(project, index);
            projectsGrid.appendChild(card);
        });
    }

    // Modal functionality
    const modal = document.getElementById('projectModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Make showProjectDetails available globally
    window.showProjectDetails = function(index) {
        const project = projects[index];
        const modalBody = document.getElementById('modalBody');
        
        let videoHtml = '';
        if (project.video) {
            videoHtml = `
                <div style="margin-bottom: 1rem;">
                    <video width="100%" controls>
                        <source src="${project.video}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            `;
        }
        
        // Build links HTML for modal
        let modalLinksHtml = '';
        if (project.links && project.links.length > 0) {
            modalLinksHtml = '<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">' +
                project.links.map(link => 
                    `<a href="${link.url}" target="_blank" class="btn btn-primary">${link.label}</a>`
                ).join('') +
                '</div>';
        } else if (project.github) {
            modalLinksHtml = `<div style="margin-top: 1rem;"><a href="${project.github}" target="_blank" class="btn btn-primary">View on GitHub</a></div>`;
        }
        
        // Check if details contains HTML (starts with <)
        const detailsContent = project.details || project.description;
        const detailsHtml = detailsContent && detailsContent.trim().startsWith('<') 
            ? detailsContent 
            : `<p style="margin-bottom: 1rem; line-height: 1.8;">${detailsContent}</p>`;
        
        modalBody.innerHTML = `
            <h2>${project.title}</h2>
            ${videoHtml}
            ${project.image ? `<img src="${project.image}" alt="${project.title}" class="modal-project-image" style="margin-top: 1.5rem;">` : ''}
            <div style="line-height: 1.8;">${detailsHtml}</div>
            ${modalLinksHtml}
        `;
        
        modal.style.display = 'block';
    };
});

// Snake Game in Contact Section
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('snakeCanvas');
    const scoreDisplay = document.getElementById('snakeScore');
    const lengthDisplay = document.getElementById('snakeLength');
    const bestScoreDisplay = document.getElementById('snakeBestScore');
    const gameOverlay = document.getElementById('snakeGameOverlay');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const gameArea = document.getElementById('snakeGameArea');
    
    if (!canvas || !scoreDisplay || !lengthDisplay || !bestScoreDisplay) return;
    
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    
    // Responsive canvas sizing
    function setCanvasSize() {
        const maxWidth = 600;
        const maxHeight = 400;
        const containerWidth = gameArea ? gameArea.clientWidth - 20 : maxWidth;
        
        // On mobile, use smaller canvas
        if (window.innerWidth <= 768) {
            const mobileWidth = Math.min(containerWidth, 300);
            canvas.width = Math.floor(mobileWidth / gridSize) * gridSize; // Keep divisible by gridSize
            canvas.height = Math.floor((mobileWidth * 0.67) / gridSize) * gridSize;
        } else {
            canvas.width = maxWidth;
            canvas.height = maxHeight;
        }
        
        // Set CSS dimensions to match canvas dimensions (prevents stretching)
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';
    }
    
    // Set canvas size FIRST
    setCanvasSize();
    
    // Calculate tile count AFTER setting canvas size (separate for width and height)
    let tileCountX = canvas.width / gridSize;
    let tileCountY = canvas.height / gridSize;
    
    // Start snake in the middle of the canvas (works for any size)
    let snake = [{ x: Math.floor(tileCountX / 3), y: Math.floor(tileCountY / 2) }];
    let dx = 0;
    let dy = 0;
    // Food position will be set by generateFood() - use safe default within any canvas size
    let food = { x: Math.floor(tileCountX * 0.6), y: Math.floor(tileCountY / 2) };
    let score = 0;
    let bestScore = 0;
    let gameRunning = true;
    const bugEmojis = ['🐛', '🪲', '🐜', '🦗', '🪳', '🦟', '🐞'];
    let currentBug = bugEmojis[Math.floor(Math.random() * bugEmojis.length)];
    
    // Load best score from localStorage
    function loadBestScore() {
        const saved = localStorage.getItem('snakeBestScore');
        if (saved !== null) {
            bestScore = parseInt(saved, 10);
            bestScoreDisplay.textContent = bestScore;
        }
    }
    
    // Save best score to localStorage
    function saveBestScore() {
        localStorage.setItem('snakeBestScore', bestScore.toString());
    }
    
    // Update best score if current score is higher
    function updateBestScore() {
        if (score > bestScore) {
            bestScore = score;
            bestScoreDisplay.textContent = bestScore;
            saveBestScore();
        }
    }
    
    // Update displays
    function updateDisplays() {
        scoreDisplay.textContent = score;
        lengthDisplay.textContent = snake.length;
        updateBestScore(); // Check and update best score
    }
    
    // Load best score on page load
    loadBestScore();
    
    // Draw game
    function drawGame() {
        clearCanvas();
        drawSnake();
        drawFood();
    }
    
    function clearCanvas() {
        ctx.fillStyle = '#0d1117';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    function drawSnake() {
        ctx.fillStyle = '#3a7bd5';
        snake.forEach((segment, index) => {
            if (index === 0) {
                // Head - brighter
                ctx.fillStyle = '#3a7bd5';
                ctx.shadowBlur = 15;
                ctx.shadowColor = 'rgba(58, 123, 213, 0.8)';
            } else {
                // Body - darker
                ctx.fillStyle = '#2d5fa3';
                ctx.shadowBlur = 5;
                ctx.shadowColor = 'rgba(58, 123, 213, 0.4)';
            }
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });
        ctx.shadowBlur = 0;
    }
    
    function drawFood() {
        // Draw bug emoji as food
        ctx.font = `${gridSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            currentBug,
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2
        );
    }
    
    // Move snake
    function moveSnake() {
        // Don't move if no direction is set (waiting for first key press)
        if (dx === 0 && dy === 0) {
            return;
        }
        
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        
        // Check wall collision (using separate X and Y tile counts)
        if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
            gameOver();
            return;
        }
        
        // Check self collision - check new head against all body segments
        // Skip the tail (last segment) if snake length > 1, as it will be removed
        const segmentsToCheck = snake.length > 1 ? snake.length - 1 : snake.length;
        for (let i = 0; i < segmentsToCheck; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }
        
        snake.unshift(head);
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            currentBug = bugEmojis[Math.floor(Math.random() * bugEmojis.length)];
            generateFood();
            updateDisplays();
            // Play eat sound
            SoundSystem.playEat();
            // Redraw immediately to show new food
            drawGame();
        } else {
            snake.pop();
        }
    }
    
    // Generate food
    function generateFood() {
        let attempts = 0;
        const maxAttempts = 100;
        
        do {
            food = {
                x: Math.floor(Math.random() * tileCountX),
                y: Math.floor(Math.random() * tileCountY)
            };
            attempts++;
            
            // Safety check: if we can't find a spot after many attempts, 
            // the snake might be too long (game should end soon anyway)
            if (attempts >= maxAttempts) {
                // Try to find any available spot more systematically
                let found = false;
                for (let x = 0; x < tileCountX && !found; x++) {
                    for (let y = 0; y < tileCountY && !found; y++) {
                        if (!snake.some(segment => segment.x === x && segment.y === y)) {
                            food = { x, y };
                            found = true;
                        }
                    }
                }
                // If still no spot found, game is essentially won (snake fills board)
                if (!found) {
                    // Place food at a random position anyway (will be eaten immediately)
                    food = {
                        x: Math.floor(Math.random() * tileCountX),
                        y: Math.floor(Math.random() * tileCountY)
                    };
                }
                break;
            }
        } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    }
    
    // Game over
    function gameOver() {
        gameRunning = false;
        // Update best score before showing game over
        updateBestScore();
        gameOverlay.classList.add('show');
        // Play game over sound
        SoundSystem.playGameOver();
    }
    
    // Restart game
    function restartGame() {
        // Reset snake to center of canvas (works for any size)
        snake = [{ x: Math.floor(tileCountX / 3), y: Math.floor(tileCountY / 2) }];
        dx = 0;
        dy = 0;
        score = 0;
        gameRunning = true;
        gameOverlay.classList.remove('show');
        currentBug = bugEmojis[Math.floor(Math.random() * bugEmojis.length)];
        generateFood();
        updateDisplays();
    }
    
    // Game loop
    function gameLoop() {
        if (gameRunning) {
            moveSnake();
            drawGame();
        }
    }
    
    // Controls - Only WASD (no arrow keys to prevent page scrolling)
    document.addEventListener('keydown', function(e) {
        if (!gameRunning && e.code === 'Space') {
            restartGame();
            return;
        }
        
        if (!gameRunning) return;
        
        // Prevent default behavior for WASD keys to avoid any conflicts
        if (e.key === 'w' || e.key === 'a' || e.key === 's' || e.key === 'd') {
            e.preventDefault();
        }
        
        // Prevent reverse direction - Only WASD controls
        if (e.key === 'w' && dy !== 1) {
            dx = 0;
            dy = -1;
        } else if (e.key === 's' && dy !== -1) {
            dx = 0;
            dy = 1;
        } else if (e.key === 'a' && dx !== 1) {
            dx = -1;
            dy = 0;
        } else if (e.key === 'd' && dx !== -1) {
            dx = 1;
            dy = 0;
        }
    });
    
    // Mobile Touch Controls
    const touchControls = document.getElementById('touchControls');
    const restartBtn = document.getElementById('restartBtn');
    
    if (touchControls) {
        const touchBtns = touchControls.querySelectorAll('.touch-btn');
        touchBtns.forEach(btn => {
            btn.addEventListener('touchstart', function(e) {
                e.preventDefault();
                if (!gameRunning) return;
                
                const direction = this.getAttribute('data-direction');
                
                if (direction === 'up' && dy !== 1) {
                    dx = 0;
                    dy = -1;
                } else if (direction === 'down' && dy !== -1) {
                    dx = 0;
                    dy = 1;
                } else if (direction === 'left' && dx !== 1) {
                    dx = -1;
                    dy = 0;
                } else if (direction === 'right' && dx !== -1) {
                    dx = 1;
                    dy = 0;
                }
            });
            
            // Also handle click for tablets with mouse
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (!gameRunning) return;
                
                const direction = this.getAttribute('data-direction');
                
                if (direction === 'up' && dy !== 1) {
                    dx = 0;
                    dy = -1;
                } else if (direction === 'down' && dy !== -1) {
                    dx = 0;
                    dy = 1;
                } else if (direction === 'left' && dx !== 1) {
                    dx = -1;
                    dy = 0;
                } else if (direction === 'right' && dx !== -1) {
                    dx = 1;
                    dy = 0;
                }
            });
        });
    }
    
    // Mobile restart button
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            restartGame();
        });
        restartBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            restartGame();
        });
    }
    
    // Initialize
    generateFood();
    updateDisplays();
    drawGame();
    setInterval(gameLoop, 150);
});
