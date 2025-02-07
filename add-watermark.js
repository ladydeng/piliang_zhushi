// 运行命令npm run watermark 给指定文件批量添加头部注释

const fs = require('fs');
const path = require('path');

// 动态生成防伪内容（示例含时间）
function generateWatermark() {
  const timestamp = new Date().toLocaleString();
  return `
  * Project: piliang_zhushi
  * Author: dlf
  * Build Time: ${timestamp}
  `;
}

// 处理单个文件
function processFile(filePath) {
  const ext = path.extname(filePath);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 检查是否已存在防伪标记
  if (content.includes('* Build Time:')) return;

  // 根据文件类型调整注释格式
  let watermark = '';
  if (ext === '.vue') {
	watermark = '<!--' + generateWatermark() + '-->\n';
  } else if (ext === '.js' || ext === '.ts') {
	watermark = '/*' + generateWatermark() + '*/\n';
  } else if (ext === '.css' || ext === '.scss') {
    watermark = '/*' + generateWatermark() + '*/\n';
  } else {
    return; // 跳过其他文件
  }

  fs.writeFileSync(filePath, watermark + content);
  console.log(`✅ 已添加标记: ${filePath}`);
}

// 遍历目录（排除 node_modules/uni_modules）
function walkDir(dir) {
	console.log("=========:", dir)
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (['node_modules', 'uni_modules', 'static'].includes(file)) continue;
      walkDir(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}

// 从项目根目录运行
walkDir(path.join(__dirname, 'pages'));