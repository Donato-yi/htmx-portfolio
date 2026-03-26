// ========================================
// Sakura Particle System - Three.js
// Cinematic falling cherry blossoms
// ========================================

class SakuraSystem {
    constructor() {
        this.canvas = document.getElementById('sakura-canvas');
        if (!this.canvas) return;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            alpha: true,
            antialias: true 
        });
        
        this.petals = [];
        this.petalCount = 150;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
    }
    
    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Setup camera
        this.camera.position.z = 50;
        
        // Create petals
        this.createPetals();
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffd1d1, 0.4);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);
        
        // Event listeners
        window.addEventListener('resize', () => this.onResize());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Start animation
        this.animate();
    }
    
    createPetals() {
        // Create petal geometry
        const petalShape = new THREE.Shape();
        petalShape.moveTo(0, 0);
        petalShape.bezierCurveTo(0.5, 0.5, 1, 0, 0.5, -0.5);
        petalShape.bezierCurveTo(0, -1, -0.5, -0.5, 0, 0);
        
        const geometry = new THREE.ShapeGeometry(petalShape);
        
        // Sakura colors
        const colors = [
            0xffd1dc, // Light pink
            0xffb7c5, // Cherry blossom
            0xffc0cb, // Pink
            0xffe4e1, // Misty rose
            0xffffff, // White
        ];
        
        for (let i = 0; i < this.petalCount; i++) {
            const material = new THREE.MeshBasicMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                transparent: true,
                opacity: Math.random() * 0.6 + 0.2,
                side: THREE.DoubleSide
            });
            
            const petal = new THREE.Mesh(geometry, material);
            
            // Random starting position
            petal.position.x = (Math.random() - 0.5) * 100;
            petal.position.y = Math.random() * 60 + 20;
            petal.position.z = (Math.random() - 0.5) * 50;
            
            // Random scale
            const scale = Math.random() * 0.5 + 0.3;
            petal.scale.set(scale, scale, scale);
            
            // Random rotation
            petal.rotation.x = Math.random() * Math.PI;
            petal.rotation.y = Math.random() * Math.PI;
            petal.rotation.z = Math.random() * Math.PI;
            
            // Store animation properties
            petal.userData = {
                speedY: Math.random() * 0.08 + 0.03,
                speedX: (Math.random() - 0.5) * 0.02,
                speedZ: (Math.random() - 0.5) * 0.02,
                rotationSpeedX: (Math.random() - 0.5) * 0.02,
                rotationSpeedY: (Math.random() - 0.5) * 0.02,
                rotationSpeedZ: (Math.random() - 0.5) * 0.02,
                swayAmplitude: Math.random() * 0.5 + 0.2,
                swayFrequency: Math.random() * 0.02 + 0.01,
                swayOffset: Math.random() * Math.PI * 2
            };
            
            this.scene.add(petal);
            this.petals.push(petal);
        }
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    onMouseMove(event) {
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        this.petals.forEach((petal) => {
            // Update position
            petal.position.y -= petal.userData.speedY;
            petal.position.x += petal.userData.speedX + 
                Math.sin(time * petal.userData.swayFrequency + petal.userData.swayOffset) * 
                petal.userData.swayAmplitude * 0.01;
            petal.position.z += petal.userData.speedZ;
            
            // Mouse influence
            petal.position.x += this.mouseX * 0.01;
            
            // Update rotation
            petal.rotation.x += petal.userData.rotationSpeedX;
            petal.rotation.y += petal.userData.rotationSpeedY;
            petal.rotation.z += petal.userData.rotationSpeedZ;
            
            // Reset if falls below screen
            if (petal.position.y < -40) {
                petal.position.y = 40;
                petal.position.x = (Math.random() - 0.5) * 100;
                petal.position.z = (Math.random() - 0.5) * 50;
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }
    
    updateTheme(theme) {
        // Update petal colors based on theme
        const darkColors = [
            0xffd1dc, // Light pink
            0xffb7c5, // Cherry blossom
            0xffc0cb, // Pink
            0xffe4e1, // Misty rose
            0xffffff, // White
        ];
        
        const lightColors = [
            0xffb7c5, // Cherry blossom
            0xff9eb5, // Deeper pink
            0xffa0b5, // Rose
            0xff8da1, // Darker pink
            0xf8c8dc, // Classic pink
        ];
        
        const colors = theme === 'light' ? lightColors : darkColors;
        
        this.petals.forEach((petal) => {
            const newColor = colors[Math.floor(Math.random() * colors.length)];
            petal.material.color.setHex(newColor);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sakuraSystem = new SakuraSystem();
});
