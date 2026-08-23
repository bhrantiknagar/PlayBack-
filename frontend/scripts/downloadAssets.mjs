import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const musicDir = path.resolve('public/music');
const imagesDir = path.resolve('public/images/albums');

if (!fs.existsSync(musicDir)) fs.mkdirSync(musicDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

const audioTracks = [
  { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', file: 'track-01.mp3' },
  { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', file: 'track-02.mp3' },
  { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', file: 'track-03.mp3' },
  { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', file: 'track-04.mp3' },
  { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', file: 'track-05.mp3' },
  { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', file: 'track-06.mp3' }
];

const albumImages = [
  { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80', file: 'album-01.jpg' },
  { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80', file: 'album-02.jpg' },
  { url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80', file: 'album-03.jpg' },
  { url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop&q=80', file: 'album-04.jpg' },
  { url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80', file: 'album-05.jpg' },
  { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80', file: 'album-06.jpg' }
];

async function run() {
  console.log('Downloading audio files...');
  for (const track of audioTracks) {
    const dest = path.join(musicDir, track.file);
    try {
      console.log(`Downloading ${track.file}...`);
      await downloadFile(track.url, dest);
      console.log(`✓ Saved ${track.file} (${fs.statSync(dest).size} bytes)`);
    } catch (e) {
      console.error(`Failed ${track.file}:`, e.message);
    }
  }

  console.log('\nDownloading album artwork images...');
  for (const img of albumImages) {
    const dest = path.join(imagesDir, img.file);
    try {
      console.log(`Downloading ${img.file}...`);
      await downloadFile(img.url, dest);
      console.log(`✓ Saved ${img.file} (${fs.statSync(dest).size} bytes)`);
    } catch (e) {
      console.error(`Failed ${img.file}:`, e.message);
    }
  }
}

run();
