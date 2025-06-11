window.addEventListener('scroll',function(){
    const navbar = document.getElementById('navbar');
    if(this.window.screenY > 50){
        navbar.classList.add('scrolled');
    }else{
        navbar.classList.remove('scrolled');
    }
});



// Product card animations on scroll (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries){
    entries.forEach(entry =>{
        if(entry.isIntersecting){
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);


// Initialize product cards for scroll animation
document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('.product-card').forEach(
        (card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.6s ease-out ${index * 0.1}s`;            

            observer.observe(card);
        }
    );
});




// Add to cart functionality with visual feedback

document.querySelectorAll('.product-button').forEach(
    button=>{
        button.addEventListener('click', function(){
            const originalText = this.textContent;
            const originalBackground = this.style.background;

            // change appearnce
            this.textContent = 'Added! ✓';
            this.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            this.style.transform = 'scale(0.98)';
        })
    }
)


// Add CSS for ripple effect
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    .product-button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);


// Add parallax effect to hero section
window.addEventListener('scroll', function(){
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');

    if (hero && scrolled<hero.offsetHeight){
        // Parallax effect for hero elements
        if (heroContent){
            heroContent.style.transform = `translateY(${scrolled*0.5}px)`;
        }
        if(heroImage){
            heroImage.style.transform = `translateY(${scrolled*0.3}px)`;
        }
    }
});



// Lazy loading for product cards
const lazyLoadObserver = new IntersectionObserver(function
    (entries){
        entries.forEach(entry =>{
            if(entry.isIntersecting){
                const card = entry.target;
                card.classList.add('loaded');
                lazyLoadObserver.unobserve(card);
            }
        });
    }
);

document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.product-card').forEach(card =>{
        lazyLoadObserver.observe(card);
    });
});

// Add floating particles effect
function createFloatingParticle() {
    const particle = document.createElement('div');
    particle.innerHTML = ['🌿', '🍃', '🌱', '✨'][Math.floor(Math.random() * 4)];
    particle.style.position = 'fixed';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.bottom = '-50px';
    particle.style.fontSize = '1.5rem';
    particle.style.opacity = '0.7';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1';
    particle.style.animation = `float-up ${3 + Math.random() * 3}s linear forwards`;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 6000);
}

// Add CSS for floating particles
const style = document.createElement('style');
style.textContent = `
    @keyframes float-up {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.body.appendChild(style);

// Create particles periodically
setInterval(createFloatingParticle, 3000);
