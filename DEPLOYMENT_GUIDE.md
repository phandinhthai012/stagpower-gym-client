# 🚀 Hướng dẫn Deploy Miễn phí - StagPower Gym

Hướng dẫn deploy frontend và backend lên các nền tảng miễn phí cho dự án tốt nghiệp.

## 📋 Tổng quan

Dự án bao gồm:
- **Frontend**: React (Create React App)
- **Backend**: Node.js/Express + Socket.IO
- **Database**: MongoDB

## 🎯 Khuyến nghị Deploy (HOÀN TOÀN MIỄN PHÍ)

### ⭐ Phương án 1: Vercel + Render (Khuyến nghị nhất)

#### Frontend trên Vercel (Miễn phí)
- ✅ Free tier rất hào phóng (100GB bandwidth/tháng)
- ✅ Deploy tự động từ GitHub
- ✅ SSL miễn phí
- ✅ CDN toàn cầu
- ✅ Hỗ trợ React rất tốt

#### Backend trên Render (Miễn phí)
- ✅ Free tier với Web Service (sẽ sleep sau 15 phút không hoạt động)
- ✅ Hỗ trợ MongoDB (có thể dùng MongoDB Atlas free)
- ✅ Environment variables dễ cấu hình
- ✅ Tự động rebuild khi push code

---

## 🔵 PHƯƠNG ÁN 1: VERCEL (Frontend) + RENDER (Backend)

### Bước 1: Deploy Frontend lên Vercel

1. **Chuẩn bị code**:
   ```bash
   # Build project
   cd stagpower-gym-client
   npm run build
   ```

2. **Push code lên GitHub** (nếu chưa có):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

3. **Deploy trên Vercel**:
   - Truy cập: https://vercel.com
   - Đăng nhập bằng GitHub
   - Click "New Project"
   - Import repository của bạn
   - Cấu hình:
     - **Framework Preset**: Create React App
     - **Root Directory**: `stagpower-gym-client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
     - **Install Command**: `npm install`

4. **Cấu hình Environment Variables trên Vercel**:
   - Vào Settings → Environment Variables
   - Thêm các biến:
     ```
     REACT_APP_API_URL=https://your-backend-url.onrender.com
     REACT_APP_API_PREFIX=/api
     REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com
     REACT_APP_ENV=production
     ```
   - Sau khi deploy xong backend, cập nhật lại `REACT_APP_API_URL`

5. **Deploy**: Click "Deploy"
   - URL sẽ là: `https://your-project-name.vercel.app`

---

### Bước 2: Deploy Backend lên Render

1. **Chuẩn bị MongoDB Atlas (Miễn phí)**:
   - Truy cập: https://www.mongodb.com/cloud/atlas
   - Đăng ký tài khoản miễn phí
   - Tạo cluster miễn phí (M0 Free tier)
   - Lấy connection string

2. **Push backend code lên GitHub**:
   ```bash
   cd stagpower-gym-server
   git add .
   git commit -m "Prepare backend for deployment"
   git push origin main
   ```

3. **Deploy trên Render**:
   - Truy cập: https://render.com
   - Đăng nhập bằng GitHub
   - Click "New +" → "Web Service"
   - Connect repository của bạn
   - Cấu hình:
     - **Name**: `stagpower-gym-api`
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

4. **Cấu hình Environment Variables trên Render**:
   - Trong tab "Environment"
   - Thêm các biến:
     ```env
     NODE_ENV=production
     PORT=10000
     HOSTNAME=0.0.0.0
     MONGODB_URI=your-mongodb-atlas-connection-string
     JWT_SECRET=your-secret-key-change-this
     JWT_ACCESS_EXPIRES_IN=15m
     JWT_REFRESH_EXPIRES_IN=7d
     CORS_ORIGIN=https://your-frontend-url.vercel.app
     ```
   - Lưu ý: Render tự động set PORT, nhưng có thể override

5. **Cập nhật CORS trong backend**:
   - Thêm domain Vercel của bạn vào CORS whitelist

6. **Deploy**: Click "Create Web Service"
   - URL sẽ là: `https://stagpower-gym-api.onrender.com`
   - ⚠️ **Lưu ý**: Free tier sẽ sleep sau 15 phút không hoạt động
   - Request đầu tiên sau khi sleep có thể mất 30-60 giây để wake up

---

### Bước 3: Cập nhật Frontend

1. **Cập nhật Environment Variables trên Vercel**:
   ```
   REACT_APP_API_URL=https://stagpower-gym-api.onrender.com
   REACT_APP_SOCKET_URL=https://stagpower-gym-api.onrender.com
   ```

2. **Redeploy frontend** để áp dụng thay đổi

---

## 🔵 PHƯƠNG ÁN 2: NETLIFY (Frontend) + RAILWAY (Backend)

### Frontend trên Netlify
- ✅ Free tier tốt (100GB bandwidth)
- ✅ Deploy tự động
- ✅ Form handling miễn phí

### Backend trên Railway
- ✅ Free tier $5 credit/tháng (đủ cho dự án nhỏ)
- ✅ Không bị sleep như Render
- ✅ Dễ deploy

---

## 🔵 PHƯƠNG ÁN 3: TẤT CẢ TRÊN RENDER (Đơn giản nhất)

Deploy cả frontend và backend trên Render:

1. **Frontend**: 
   - Tạo Static Site trên Render
   - Build command: `npm run build`
   - Publish directory: `build`

2. **Backend**: 
   - Tạo Web Service như hướng dẫn trên

---

## 📝 Checklist Deploy

### Frontend (.env cho production)
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_API_PREFIX=/api
REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com
REACT_APP_ENV=production
```

### Backend (.env cho production)
```env
NODE_ENV=production
PORT=10000
HOSTNAME=0.0.0.0
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-url.vercel.app
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password
```

---

## 🎯 So sánh các nền tảng

| Nền tảng | Type | Free Tier | Ưu điểm | Nhược điểm |
|----------|------|-----------|---------|------------|
| **Vercel** | Frontend | 100GB/tháng | Nhanh, CDN tốt | Chỉ frontend |
| **Netlify** | Frontend | 100GB/tháng | Dễ dùng | Chỉ frontend |
| **Render** | Fullstack | Free Web Service | Dễ deploy | Sleep sau 15 phút |
| **Railway** | Fullstack | $5 credit/tháng | Không sleep | Credit có hạn |
| **Fly.io** | Fullstack | Free tier | Tốt cho Docker | Phức tạp hơn |

---

## 🚨 Lưu ý quan trọng

1. **Render Free Tier**:
   - Web service sẽ sleep sau 15 phút không hoạt động
   - Request đầu tiên sau khi sleep mất ~30-60s để wake up
   - ⚠️ **Giải pháp**: Dùng uptime monitor (như UptimeRobot miễn phí) để ping mỗi 10 phút

2. **MongoDB Atlas**:
   - Free tier: 512MB storage
   - Đủ cho dự án tốt nghiệp nhỏ
   - Cần whitelist IP của Render (hoặc 0.0.0.0/0 cho development)

3. **CORS**:
   - Nhớ cập nhật CORS trong backend để chấp nhận domain frontend
   - Vercel: `https://your-project.vercel.app`
   - Netlify: `https://your-project.netlify.app`

4. **Environment Variables**:
   - ⚠️ KHÔNG commit file `.env` lên git
   - Set trên hosting platform thay vì hardcode

---

## 🔗 Links hữu ích

- **Vercel**: https://vercel.com
- **Render**: https://render.com
- **Netlify**: https://netlify.com
- **Railway**: https://railway.app
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **UptimeRobot** (monitor miễn phí): https://uptimerobot.com

---

## 📞 Hỗ trợ

Nếu gặp vấn đề khi deploy, kiểm tra:
1. Build logs trên hosting platform
2. Environment variables đã set đúng chưa
3. CORS configuration
4. MongoDB connection string
5. Port và hostname configuration

**Chúc bạn deploy thành công! 🎉**

