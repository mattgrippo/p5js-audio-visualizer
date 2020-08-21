let song;
let fft;
let peak;
let threshold = 0.02;
var angle = 0;
var button;

var loading = true;

var w;
var bgColor = {
  r: 0,
  g: 0,
  b: 0
};

var strokeColor = {
  r: 0,
  g: 0,
  b: 0
};

function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function loaded(song) {
  song.play();
  loading = false;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  song = loadSound("bigboss.wav", loaded);
  fft = new p5.FFT();
  peak = new p5.PeakDetect(2000, 20000, threshold, 10);

  w = width / 512;

  background(bgColor.r, bgColor.g, bgColor.b);

  button = createButton("toggle");
  button.mousePressed(toggleSong);

}

function mouseMoved() {
  if (!loading) {
    if (mouseIsPressed) {
      height = height + movedY;
      if (height < 0) {
        height = windowHeight;
      }
      if (height > windowHeight + height / 2) {
        height = windowHeight;
      }

    }


  }
}

function draw() {
  console.log(movedY);
  if (loading) {
    background(0);
    translate(width / 2, height / 2);

    for (var c = 0; c < 10; c++) {
      var loadFill = map(c, 0, 10, 0, 255);
      rotate(angle);
      strokeWeight(2);
      line(25, 0, 25, 0);
      stroke(loadFill);
      angle += 0.1;
    }

  } else {

    fft.analyze();
    peak.update(fft);

    if (peak.isDetected) {
      bgColor.r = random(0, 100);
      bgColor.g = random(0, 100);
      bgColor.b = random(0, 100);

      strokeColor.r = random(150, 255);
      strokeColor.g = random(150, 255);
      strokeColor.b = random(150, 255);
    }



    background(bgColor.r, bgColor.g, bgColor.b);

    var spectrum = fft.analyze();

    stroke(strokeColor.r, strokeColor.g, strokeColor.b);

    var waveform = fft.waveform();
    noFill();

    for (var j = 0; j <= height; j += height / 3) {
      let strokeWidth = map(j, 0, height, 0.1, 1);
      strokeWeight(strokeWidth);

      beginShape();
      for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, 0, width);
        let y = map(waveform[i], -1, 1, 0, (j / 10 + height) - (height / 10));
        vertex(x, y);
      }
      endShape();
    }

    for (var j = 0; j <= height; j += height / 3) {
      let strokeWidth = map(j, 0, height, 1, .1);
      strokeWeight(strokeWidth);

      beginShape();
      for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, 0, width);
        let y = map(waveform[i], -1, 1, 0, j / 10 + height);
        vertex(x, y);
      }
      endShape();
    }
  }
}