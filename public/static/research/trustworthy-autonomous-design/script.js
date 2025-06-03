// Interactive functionality for the Trustworthy Autonomous Design research page

document.addEventListener('DOMContentLoaded', function() {
    initializeInteractivity();
    initializeAnimations();
    initializeDemo();
});

// Initialize all interactive elements
function initializeInteractivity() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.objective-card, .approach-item, .publication-item, .resource-item');
    animateElements.forEach(el => observer.observe(el));

    // Interactive diagram hover effects
    const systemLayers = document.querySelectorAll('.system-layer');
    systemLayers.forEach(layer => {
        layer.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });

        layer.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Objective cards interaction
    const objectiveCards = document.querySelectorAll('.objective-card');
    objectiveCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            objectiveCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            this.classList.add('active');
            
            // Show objective details (could expand to show more info)
            showObjectiveDetails(index + 1);
        });
    });
}

// Initialize progress bar animations
function initializeAnimations() {
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target.querySelector('.progress-fill');
                if (progressFill) {
                    // Animate progress bar
                    const width = progressFill.style.width;
                    progressFill.style.width = '0%';
                    setTimeout(() => {
                        progressFill.style.width = width;
                    }, 200);
                }
            }
        });
    }, { threshold: 0.5 });

    const approachItems = document.querySelectorAll('.approach-item');
    approachItems.forEach(item => progressObserver.observe(item));
}

// Initialize interactive demo
function initializeDemo() {
    const scenarioButtons = document.querySelectorAll('.scenario-btn');
    const runDemoButton = document.getElementById('runDemo');
    const decisionFlow = document.getElementById('decisionFlow');
    
    // Scenario data
    const scenarios = {
        'autonomous-vehicle': {
            sensors: 'Camera, LiDAR, GPS, Radar',
            analysis: 'Object Detection & Path Planning',
            confidence: 85,
            rules: 'Traffic Safety Rules',
            decision: 'Navigate Around Obstacle'
        },
        'industrial-robot': {
            sensors: 'Vision, Force, Position',
            analysis: 'Task Recognition & Planning',
            confidence: 92,
            rules: 'Safety Protocols',
            decision: 'Execute Assembly Task'
        },
        'drone-navigation': {
            sensors: 'IMU, GPS, Camera, Ultrasonic',
            analysis: 'SLAM & Obstacle Avoidance',
            confidence: 78,
            rules: 'Flight Safety Rules',
            decision: 'Adjust Flight Path'
        }
    };

    let currentScenario = 'autonomous-vehicle';

    // Scenario selection
    scenarioButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            scenarioButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update current scenario
            currentScenario = this.dataset.scenario;
            updateScenarioDisplay(scenarios[currentScenario]);
        });
    });

    // Demo runner
    runDemoButton.addEventListener('click', function() {
        runDecisionDemo(scenarios[currentScenario]);
    });

    // Initialize with default scenario
    updateScenarioDisplay(scenarios[currentScenario]);
}

// Update scenario display
function updateScenarioDisplay(scenario) {
    const stages = document.querySelectorAll('.flow-stage');
    
    // Update content
    stages[0].querySelector('.sensor-data').textContent = scenario.sensors;
    stages[1].querySelector('.ai-analysis').textContent = scenario.analysis;
    stages[1].querySelector('.meter-fill').style.width = scenario.confidence + '%';
    stages[1].querySelector('.confidence-meter span:last-child').textContent = scenario.confidence + '%';
    stages[2].querySelector('.logic-rules').textContent = scenario.rules;
    stages[3].querySelector('.final-decision').textContent = scenario.decision;
}

// Run decision process demo
function runDecisionDemo(scenario) {
    const stages = document.querySelectorAll('.flow-stage');
    const runButton = document.getElementById('runDemo');
    
    // Disable button during animation
    runButton.disabled = true;
    runButton.textContent = 'Running...';
    
    // Reset all stages
    stages.forEach(stage => stage.classList.remove('active'));
    
    // Animate through stages
    let currentStage = 0;
    const stageInterval = setInterval(() => {
        if (currentStage > 0) {
            stages[currentStage - 1].classList.remove('active');
        }
        
        if (currentStage < stages.length) {
            stages[currentStage].classList.add('active');
            
            // Add some special effects for AI processing stage
            if (currentStage === 1) {
                animateConfidenceMeter(scenario.confidence);
            }
            
            currentStage++;
        } else {
            clearInterval(stageInterval);
            
            // Reset after a delay
            setTimeout(() => {
                stages.forEach(stage => stage.classList.remove('active'));
                runButton.disabled = false;
                runButton.textContent = 'Run Decision Process';
            }, 2000);
        }
    }, 1500);
}

// Animate confidence meter
function animateConfidenceMeter(targetConfidence) {
    const meterFill = document.querySelector('.meter-fill');
    const confidenceText = document.querySelector('.confidence-meter span:last-child');
    
    let currentConfidence = 0;
    const increment = targetConfidence / 30; // 30 frames for smooth animation
    
    const confidenceInterval = setInterval(() => {
        currentConfidence += increment;
        if (currentConfidence >= targetConfidence) {
            currentConfidence = targetConfidence;
            clearInterval(confidenceInterval);
        }
        
        meterFill.style.width = currentConfidence + '%';
        confidenceText.textContent = Math.round(currentConfidence) + '%';
    }, 50);
}

// Show objective details (placeholder for potential expansion)
function showObjectiveDetails(objectiveNumber) {
    // Could expand to show more detailed information
    console.log(`Showing details for objective ${objectiveNumber}`);
    
    // Add visual feedback
    const card = document.querySelector(`[data-objective="${objectiveNumber}"]`);
    if (card) {
        card.style.transform = 'scale(1.02)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 200);
    }
}

// Smooth scrolling for navigation links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const diagram = document.querySelector('.interactive-diagram');
    
    if (hero && diagram) {
        // Subtle parallax effect
        hero.style.transform = `translateY(${scrolled * 0.2}px)`;
        diagram.style.transform = `translateY(${scrolled * -0.1}px)`;
    }
});

// Add hover effects to publication items
document.addEventListener('DOMContentLoaded', function() {
    const publicationItems = document.querySelectorAll('.publication-item, .resource-item');
    
    publicationItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});

// Add dynamic typing effect to hero subtitle (optional enhancement)
function addTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 50);
}

// Performance optimization: Use requestAnimationFrame for smooth animations
function optimizeAnimations() {
    let ticking = false;
    
    function updateAnimations() {
        // Any continuous animations would go here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    }
    
    // Could be used for scroll-based animations
    window.addEventListener('scroll', requestTick);
}

// Initialize optimization
optimizeAnimations(); 