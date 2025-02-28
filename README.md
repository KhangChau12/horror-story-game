# Bóng Tối Chọn Lựa - Web Game Tương Tác Kể Truyện Kinh Dị

"Bóng Tối Chọn Lựa" là một web game tương tác kể truyện kinh dị, sử dụng OpenAI API để tạo nội dung kể chuyện động. Người chơi có thể chọn bối cảnh, tạo nhân vật và đưa ra các lựa chọn để ảnh hưởng đến diễn biến câu chuyện.

## Tính năng

- **Nhiều bối cảnh kinh dị**: Rừng sâu, tòa nhà bỏ hoang, bệnh viện tâm thần, ngôi nhà lạ, xe buýt đêm
- **Tạo nhân vật**: Người chơi có thể đặt tên và giới tính cho nhân vật chính
- **Hệ thống lựa chọn**: Mỗi đoạn truyện kết thúc với 3 lựa chọn ảnh hưởng đến tiến triển câu chuyện
- **Thanh nỗi sợ**: Mức độ kinh dị tăng dần theo nội dung câu chuyện, ảnh hưởng đến giao diện
- **Hiệu ứng kinh dị**: Màu sắc, animation, và hiệu ứng text thay đổi theo mức độ kinh dị
- **Âm thanh nền**: Nhạc nền kinh dị tạo không khí rùng rợn
- **Lưu tiến trình**: Tự động lưu tiến trình để người chơi có thể quay lại sau

## Công nghệ sử dụng

### Frontend
- React.js
- Styled Components cho CSS
- Typewriter Effect cho hiệu ứng gõ chữ
- Axios để gọi API

### Backend
- Node.js & Express
- MongoDB để lưu trữ tiến trình trò chơi
- OpenAI API (GPT-4o) để tạo nội dung câu chuyện

## Cài đặt và chạy

### Yêu cầu
- Node.js (v14+)
- npm hoặc yarn
- Tài khoản MongoDB Atlas
- OpenAI API key

### Cài đặt
1. Clone repository
   ```bash
   git clone https://github.com/your-username/horror-story-game.git
   cd horror-story-game
   ```

2. Cài đặt dependencies cho server
   ```bash
   npm install
   ```

3. Cài đặt dependencies cho client
   ```bash
   cd client
   npm install
   cd ..
   ```

4. Tạo file `.env` trong thư mục gốc
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   ```

5. Tạo file `.env` trong thư mục client
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Chạy ứng dụng
```bash
npm run dev
```
Ứng dụng sẽ chạy tại http://localhost:3000

## Triển khai

Xem chi tiết trong file [DEPLOYMENT.md](DEPLOYMENT.md) để biết cách triển khai ứng dụng lên Render.

## Cấu trúc dự án
```
horror-story-game/
├── .env                      # Biến môi trường cho server
├── .gitignore                # Danh sách các file/thư mục để loại trừ khỏi git
├── package.json              # Package.json cho toàn bộ dự án
├── README.md                 # Hướng dẫn dự án
├── client/                   # Frontend React app
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── horror-ambience.mp3  # File nhạc nền
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoadingScreen.js
│   │   │   ├── StartScreen.js
│   │   │   └── StoryScreen.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── GlobalStyles.js
│   │   ├── App.js
│   │   └── index.js
│   ├── .env                  # Biến môi trường cho client
│   └── package.json          # Package.json cho client
└── server/                   # Backend server
    └── index.js              # Mã nguồn server
```

## Hướng dẫn sử dụng

1. **Màn hình bắt đầu**:
   - Chọn một trong các bối cảnh kinh dị
   - Nhập thông tin nhân vật (tên và giới tính)
   - Nhấn "Bắt đầu hành trình"

2. **Màn hình trò chơi**:
   - Đọc đoạn truyện (có hiệu ứng gõ chữ)
   - Sau khi hiệu ứng gõ chữ kết thúc, 3 lựa chọn sẽ xuất hiện
   - Chọn một trong 3 lựa chọn để tiếp tục câu chuyện
   - Quan sát thanh nỗi sợ tăng dần theo nội dung
   - Giao diện sẽ thay đổi khi mức độ sợ hãi tăng cao

3. **Lưu và tiếp tục**:
   - Tiến trình tự động lưu sau mỗi lựa chọn
   - Khi quay lại trang, tiến trình sẽ tự động tải

## Đóng góp

Nếu bạn muốn đóng góp cho dự án, hãy tạo pull request hoặc gửi issue trên GitHub.

## Giấy phép

Dự án được phát hành dưới giấy phép MIT.
