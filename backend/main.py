from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import uuid
from ultralytics import YOLO
import cv2
import numpy as np
from PIL import Image
import io
import base64

app = FastAPI(title="垃圾检测API")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React开发服务器
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 创建上传目录
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 挂载静态文件
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# 加载YOLO模型 - 使用训练好的最佳模型
MODEL_PATH = "../runs/detect/waste_detection/weights/best.pt"
try:
    model = YOLO(MODEL_PATH)
    print("垃圾检测模型加载成功")
    print(f"模型路径: {MODEL_PATH}")
except Exception as e:
    print(f"模型加载失败: {e}")

# 垃圾分类标签
CLASS_NAMES = {
    0: "可回收垃圾",
    1: "有害垃圾", 
    2: "湿垃圾",
    3: "干垃圾"
}

@app.get("/")
async def root():
    return {"message": "垃圾检测API服务运行中"}

@app.post("/detect")
async def detect_garbage(file: UploadFile = File(...)):
    if not model:
        raise HTTPException(status_code=500, detail="模型未加载")
    
    # 验证文件类型
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="请上传图片文件")
    
    try:
        # 保存上传的图片
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # 使用YOLO模型进行预测
        results = model(file_path)
        
        # 处理预测结果
        detections = []
        if len(results) > 0 and results[0].boxes is not None:
            boxes = results[0].boxes
            for i in range(len(boxes)):
                box = boxes[i]
                # 获取边界框坐标
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                # 获取置信度
                confidence = float(box.conf[0].cpu().numpy())
                # 获取类别
                class_id = int(box.cls[0].cpu().numpy())
                class_name = CLASS_NAMES.get(class_id, "未知")
                
                detections.append({
                    "bbox": [float(x1), float(y1), float(x2), float(y2)],
                    "confidence": confidence,
                    "class_id": class_id,
                    "class_name": class_name
                })
        
        return {
            "success": True,
            "image_url": f"/uploads/{unique_filename}",
            "detections": detections,
            "total_objects": len(detections)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"检测失败: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)