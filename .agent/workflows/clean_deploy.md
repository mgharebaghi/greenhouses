---
description: how to perform a clean deploy on the server
---

Follow these steps on your production server to resolve `400 Bad Request` and `ChunkLoadError` persistent issues:

1. **Stop Application**:
   ```bash
   pm2 stop greenhouse || pm2 stop all
   ```

2. **Nuclear Clean**:
   // turbo
   ```bash
   rm -rf .next node_modules package-lock.json
   ```

3. **Reinstall & Rebuild**:
   ```bash
   npm install
   npx prisma generate
   npm run build
   ```

4. **Restart & Save**:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   ```

5. **Client Cache**:
   - Open the site and press `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac).
