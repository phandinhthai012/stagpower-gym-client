# 📝 File .env để Copy

## File `.env` cho Development

Tạo file `.env` trong thư mục `stagpower-gym-client` với nội dung sau:

```env
# ============================================
# StagPower Gym Client - Development Environment
# ============================================

# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_PREFIX=/api

# Socket.IO Configuration
REACT_APP_SOCKET_URL=

# Application Configuration
REACT_APP_API_TIMEOUT=600000
REACT_APP_ENV=development
```

## File `.env` cho Production (khi deploy)

Khi deploy lên Vercel/Netlify, cần set các biến môi trường trên hosting platform:

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_API_PREFIX=/api
REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com
REACT_APP_API_TIMEOUT=600000
REACT_APP_ENV=production
```

### Cách set trên Vercel:
1. Vào project → Settings → Environment Variables
2. Add từng biến một
3. Chọn environment: Production (hoặc All)
4. Save và Redeploy

---

## 📋 Tóm tắt nhanh

**Development (local):**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_PREFIX=/api
REACT_APP_SOCKET_URL=
REACT_APP_API_TIMEOUT=600000
REACT_APP_ENV=development
```

**Production (deploy):**
```env
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_API_PREFIX=/api
REACT_APP_SOCKET_URL=https://your-backend.onrender.com
REACT_APP_API_TIMEOUT=600000
REACT_APP_ENV=production
```

⚠️ **Lưu ý**: Thay `your-backend.onrender.com` bằng URL backend thực tế của bạn sau khi deploy!

