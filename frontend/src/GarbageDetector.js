import React, { useState, useRef } from 'react';
import './GarbageDetector.css';

const GarbageDetector = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // 处理文件选择
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
      setDetections([]);
      setError('');
      
      // 清除画布上的检测框
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // 上传并检测
  const handleDetect = async () => {
    if (!selectedFile) {
      setError('请先选择一张图片');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('检测失败');
      }

      const result = await response.json();
      
      // 过滤掉置信度低于30%的检测结果
      const filteredDetections = result.detections.filter(detection => detection.confidence >= 0.3);
      setDetections(filteredDetections);
      
      // 使用后端返回的图片URL
      setImageUrl(`http://localhost:8000${result.image_url}`);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 在图片上绘制检测框
  const drawDetections = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image || detections.length === 0) return;

    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制检测框
    detections.forEach((detection, index) => {
      const [x1, y1, x2, y2] = detection.bbox;
      const width = x2 - x1;
      const height = y2 - y1;
      
      // 设置颜色
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
      const color = colors[detection.class_id % colors.length];
      
      // 绘制边界框
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, width, height);
      
      // 绘制标签背景
      const label = `${detection.class_name} (${(detection.confidence * 100).toFixed(1)}%)`;
      ctx.font = '16px Arial';
      const textWidth = ctx.measureText(label).width;
      
      ctx.fillStyle = color;
      ctx.fillRect(x1, y1 - 25, textWidth + 10, 25);
      
      // 绘制标签文字
      ctx.fillStyle = 'white';
      ctx.fillText(label, x1 + 5, y1 - 8);
    });
  };

  // 图片加载完成后绘制检测框
  const handleImageLoad = () => {
    drawDetections();
  };

  // 获取垃圾分类统计
  const getClassStats = () => {
    const stats = {};
    detections.forEach(detection => {
      stats[detection.class_name] = (stats[detection.class_name] || 0) + 1;
    });
    return stats;
  };

  return (
    <div className="garbage-detector">
      <h1>垃圾检测系统</h1>
      
      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="file-input"
        />
        <button 
          onClick={handleDetect} 
          disabled={loading || !selectedFile}
          className="detect-button"
        >
          {loading ? '检测中...' : '开始检测'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {imageUrl && (
        <div className="image-container">
          <div className="image-wrapper">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="检测图片"
              onLoad={handleImageLoad}
              className="detection-image"
            />
            <canvas
              ref={canvasRef}
              className="detection-canvas"
            />
          </div>
        </div>
      )}

      {detections.length > 0 && (
        <div className="results-section">
          <h2>检测结果</h2>
          <div className="stats">
            <h3>垃圾分类统计：</h3>
            {Object.entries(getClassStats()).map(([className, count]) => (
              <div key={className} className="stat-item">
                <span className="class-name">{className}</span>
                <span className="count">{count} 个</span>
              </div>
            ))}
          </div>
          
          <div className="detections-list">
            <h3>详细检测信息：</h3>
            {detections.map((detection, index) => (
              <div key={index} className="detection-item">
                <span className="detection-class">{detection.class_name}</span>
                <span className="detection-confidence">
                  置信度: {(detection.confidence * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GarbageDetector;