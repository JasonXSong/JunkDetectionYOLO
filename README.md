# 垃圾检测系统

基于YOLO模型的垃圾分类检测系统，包含React前端和FastAPI后端。

## 功能特性

- 🖼️ 图片上传和预览
- 🔍 实时垃圾检测
- 📊 检测结果可视化
- 📈 垃圾分类统计
- 🎯 高精度边界框显示

## 垃圾分类类别

- 可回收垃圾 (Recyclable waste)
- 有害垃圾 (Hazardous waste)  
- 厨余垃圾 (Kitchen waste)
- 其他垃圾 (Other waste)

## 系统架构

```
├── backend/          # FastAPI后端服务
│   ├── main.py      # 主要API服务
│   └── requirements.txt
├── frontend/         # React前端应用
│   ├── src/
│   │   ├── GarbageDetector.js  # 主检测组件
│   │   └── GarbageDetector.css # 样式文件
│   └── package.json
├── models/           # YOLO模型文件
├── uploads/          # 上传图片存储
└── start_system.bat  # 一键启动脚本
```

## 快速开始

#### 启动后端

```bash
cd backend
pip install -r requirements.txt
python main.py
```

后端服务将在 http://localhost:8000 启动

#### 启动前端

```bash
cd frontend
npm install
npm start
```

前端应用将在 http://localhost:3000 启动

## 使用说明

1. 打开浏览器访问 http://localhost:3000
2. 点击"选择文件"上传一张包含垃圾的图片
3. 点击"开始检测"按钮
4. 系统会显示检测结果，包括：
   - 在图片上绘制检测框和标签
   - 垃圾分类统计信息
   - 详细的检测信息（类别和置信度）

## API接口

### POST /detect

上传图片进行垃圾检测

**请求参数：**
- `file`: 图片文件 (multipart/form-data)

**响应格式：**
```json
{
  "success": true,
  "image_url": "/uploads/xxx.jpg",
  "detections": [
    {
      "bbox": [x1, y1, x2, y2],
      "confidence": 0.95,
      "class_id": 0,
      "class_name": "可回收垃圾"
    }
  ],
  "total_objects": 1
}
```

## 技术栈

**后端：**
- FastAPI - Web框架
- Ultralytics YOLO - 目标检测模型
- OpenCV - 图像处理
- Pillow - 图像操作

**前端：**
- React - 用户界面框架
- HTML5 Canvas - 检测框绘制
- CSS3 - 样式设计

## 注意事项

1. 确保已安装Python 3.8+和Node.js 14+
2. 模型文件路径：`models/yolov8n.pt`
3. 上传的图片会保存在 `uploads/` 目录
4. 支持的图片格式：JPG, PNG, BMP等常见格式

## 故障排除

**后端启动失败：**
- 检查Python环境和依赖包安装
- 确认模型文件存在且路径正确

**前端启动失败：**
- 运行 `npm install` 安装依赖
- 检查Node.js版本是否符合要求

**检测失败：**
- 确认上传的是有效图片文件
- 检查后端服务是否正常运行
- 查看浏览器控制台错误信息