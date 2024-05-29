let kuvat = [];
let kuvatData = [];
let alphaValues = [100, 130, 120, 150, 40, 120, 120, 90, 100, 50, 15, 19];
let video;
let speedFactor = 2;
let noiseOffsetX = 10;
let noiseOffsetY = 150; // Eri offset arvo llille
let orangeBall;

function preload() {
  for (let i = 1; i <= 8; i++) {
    kuvat.push(loadImage(`pallo${i}.jpg`));
  }
  video = createVideo(['untitled.mov']); // Vaihda 'untitled.mov' videon polkuun omalla koneellasi
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video.hide(); // Piilota alkuperäinen videoelementti
  video.loop(); // Toista video automaattisesti
  video.speed(1 / speedFactor); // Hidasta videon toistoa

  // Alustetaan kuvatiedot
  for (let i = 0; i < kuvat.length; i++) {
    let img = kuvat[i];
    img.resize(550, 0); // Skaalaa kuvat samanlevyisiksi, mutta säilytä suhde
    
    // Luo maski, jotta kuva on ympyrän muotoinen
    let mask = createGraphics(img.width, img.height);
    mask.ellipse(img.width / 2, img.height / 2, img.width, img.height);
    let maskedImage = img.get();
    maskedImage.mask(mask);

    kuvatData.push({
      x: random(width),
      y: random(height),
      img: maskedImage,
      noiseOffsetX: random(200), // Eri noise offset jokaiselle kuvalle
      noiseOffsetY: random(9000) + 1000, // Eri noise offset jokaiselle kuvalle
      alpha: alphaValues[i % alphaValues.length]
    });
  }

  // Alusta oranssi pallo
  orangeBall = {
    x: random(width),
    y: random(height),
    vx: random(-2, 2),
    vy: random(-2, 2),
    radius: 20
  };
}

function draw() {
  background(139, 182, 170, 3); // Vaaleansininen tausta

  // Näytetään video taustalla blendattuna
  push(); // Tallenna nykyinen piirtoasetusten tila
  blendMode(NORMAL); // Valitse sopiva blend mode
  tint(100, 128, 100, 100); // Puoliläpinäkyvyys videolle
  image(video, 0, 0, width, height);
  pop(); // Palauta aiempi piirtoasetusten tila

  // Piirretään ja liikutetaan kuvia sumuisella aaltoliikkeellä
  for (let i = 0; i < kuvat.length; i++) {
    let imgData = kuvatData[i];
    let img = imgData.img;
    
    let offsetX = map(noise(imgData.noiseOffsetX), 0, 1, -500, 30);
    let offsetY = map(noise(imgData.noiseOffsetY), 0, 1, -500, 30);
    
    let alpha = imgData.alpha; // Käytetään ennalta määriteltyä alfa-arvoa
    
    tint(255, alpha); // Sumuisuus ja läpinäkyvyys
    image(img, imgData.x + offsetX, imgData.y + offsetY);
    
    imgData.noiseOffsetX += 0.001;
    imgData.noiseOffsetY += 0.001;
  }

  // Piirrä ja liikuta oranssi pallo blendattuna kuvien päälle
  push(); // Tallenna nykyinen piirtoasetusten tila
  blendMode(ADD); // Valitse sopiva blend mode
  fill(245, 165, 0, 128); // Asetetaan väriksi puoliläpinäkyvä oranssi
  noStroke();
  ellipse(orangeBall.x, orangeBall.y, orangeBall.radius * 3);
  pop(); // Palauta aiempi piirtoasetusten tila

  orangeBall.x += orangeBall.vx;
  orangeBall.y += orangeBall.vy;

  if (orangeBall.x < orangeBall.radius || orangeBall.x > width - orangeBall.radius) {
    orangeBall.vx *= -1;
  }
  if (orangeBall.y < orangeBall.radius || orangeBall.y > height - orangeBall.radius) {
    orangeBall.vy *= -1;
  }

  // Näytetään video sumuisena ja blendataan kuviin
  blendMode(ADD); // Valitse sopiva blend mode
  tint(255, 128, 100, 25); // Puoliläpinäkyvyys videolle
  image(video, 0, 0, width, height);
  blendMode(BLEND); // Palauta normaali blend mode
}

