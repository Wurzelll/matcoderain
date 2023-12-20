const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

const columns = 50; // Damla sayısını 50'ye düşürdük
const fontSize = 25;
const extraBits = 15; // Rakam miktarını artırmak için ekledik
const streams = [];
const subliminalText = "WURZEL";
const binaryText = "01010111 01010011 01010010 01011010 01000101 01001100";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Stream {
    constructor() {
        this.bits = [];
        this.totalBits = binaryText.length + subliminalText.length + extraBits; // Toplam bit miktarını artırdık
        this.speed = Math.floor(Math.random() * (5 - 1) + 1);
        this.x = Math.floor(Math.random() * canvas.width); // Başlangıç pozisyonunu rastgele belirledik
        this.delay = Math.random() * 1000; // Her damla için rastgele bir başlangıç süresi ekledik
        this.generateBits();
    }

    generateBits() {
        let y = -1 * this.totalBits * fontSize;
        const binaryArray = binaryText.split(" ").join(""); // Boşlukları kaldır

        for (let i = 0; i < this.totalBits; i++) {
            let bit;
            if (i < binaryArray.length) {
                bit = parseInt(binaryArray[i]);
            } else {
                bit = subliminalText[i - binaryArray.length] === ' ' ? 0 : 1; // Boşlukları 0 yap
            }
            this.bits.push({ bit, x: this.x, y });
            y += fontSize;
        }
    }

    render() {
        this.bits.forEach((bitObj, index) => {
            const { bit, x, y } = bitObj;
            const color = bit === 1 ? 'rgba(0, 255, 0, .9)' : 'rgba(0, 128, 0, .7)'; // Tüm renkleri yeşil yap

            ctx.font = `${fontSize}px monospace`;

            // Arkaplanı siyah ve %40 opaklıkta yap
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(x, y, fontSize, fontSize);


            // Rakamları renkli göster
            ctx.fillStyle = color;
            ctx.fillText(bit, x, y + fontSize);

            // Bit'i aşağıya hareket ettir
            bitObj.y += this.speed;

            // Değişiklik için bit'i rastgele değiştir
            if (Math.random() < 0.01) {
                bitObj.bit = 1 - bitObj.bit;
            }

            // Eğer bit pozisyonu canvas'ın dışına çıkarsa, pozisyonunu sıfırla
            if (bitObj.y > canvas.height) {
                bitObj.y = 0;
                bitObj.x = Math.floor(Math.random() * canvas.width);
            }
        });
    }
}

function createStreams() {
    for (let i = 0; i < columns; i++) {
        setTimeout(() => {
            streams.push(new Stream());
        }, i * 200); // Her damla arasında 200 ms'lik bir gecikme ekledik
    }
}

function drawMatrix() {
    // Arka planı temizle
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Her bir akışı çiz
    streams.forEach(stream => stream.render());
}

function matrixCodeRain() {
    drawMatrix();
    requestAnimationFrame(matrixCodeRain);
}

window.addEventListener('resize', () => {
    // Ekran boyutu değiştikçe canvas boyutunu güncelle
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Var olan akışları temizle ve tekrar oluştur
    streams.length = 0;
    createStreams();
});

// Başlangıçta akışları oluştur ve animasyonu başlat
createStreams();
matrixCodeRain();
