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
- 湿垃圾 (Kitchen waste)
- 干垃圾 (Other waste)

## 系统架构

```
├── backend/                    # FastAPI后端服务
│   └── main.py                 # 主要API服务
├── frontend/                   # React前端应用
│   ├── src/
│   │   ├── GarbageDetector.js  # 主检测组件
│   │   └── GarbageDetector.css # 样式文件
│   └── package.json
├── models/                     # YOLO模型文件
├── uploads/                    # 上传图片存储
└── yolo-v8.ipynb               # 一键启动脚本
```

## 快速开始

#### 后端

##### 安装依赖
有GPU，安装GPU版本的pytorch及ultralytics
```bash
conda install -c pytorch -c nvidia -c conda-forge pytorch torchvision pytorch-cuda=11.8 ultralytics
```
无GPU，安装CPU版本的pytorch及ultralytics
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
pip install ultralytics
```

安装其他依赖包
```bash
pip install fastapi
pip install python-multipart
pip install uvicorn
```

##### 启动
```bash
cd backend
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

## 训练模型

### 训练数据
[生活垃圾数据集YOLO版](https://gitcode.com/open-source-toolkit/875cd)
解压后，将ImageSet中的文件（夹）放到本项目的data目录下
```
d-----         2025/7/17      0:42                data-txt
d-----         2025/7/17      0:43                images
d-----         2025/7/17     11:26                labels
-a----          2021/9/6     20:15             63 classes.txt
```

### 打开Jupter，训练模型
安装启动jupyter notebook
```bash
pip install notebook
jupyter notebook
```

## 注意事项

1. 确保已安装Python 3.8+和Node.js 14+
2. 训练后的模型文件路径：`runs/detect/waste_detection/weights/best.pt`
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