const fs = require('fs');
const files = [
  'web-app/mock/discover_profiles.json',
  'web-app/mock/profiles.json',
  'web-app/mock/likes.json'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let data = fs.readFileSync(file, 'utf8');
    for (let i = 1; i <= 20; i++) {
        const strId = `"${i}"`;
        const uuidId = `"00000000-0000-0000-0000-${i.toString().padStart(12, '0')}"`;
        data = data.replaceAll(`"user_id": ${strId}`, `"user_id": ${uuidId}`);
    }
    fs.writeFileSync(file, data);
  }
}
