const fs = require('fs');
const path = require('path');
const OSS = require('ali-oss');

// 阿里云 OSS 的 AccessKey ID 和 AccessKey Secret
const accessKeyId = 'aaaaaaaaaaaaaaaaa';
const accessKeySecret = 'bbbbbbbbbbbbbbbb';

// 阿里云 OSS 的 Endpoint、Bucket 和 Region
const bucket = 'bucket';
const region = `oss-cn-beijing`;

const endpoint = `http://${region}.aliyuncs.com`;

// 创建 OSS 实例
const client = new OSS({
  accessKeyId,
  accessKeySecret,
  endpoint,
  bucket,
  region,
});

// 调用函数上传 dist 目录下的所有文件和子目录
const localDirPath = 'C:\\Users\\Easy\\Desktop\\middlwPlatform\\sp-platform\\dist\\';
// const localDirPath = path.join(__dirname, 'dist');

  async function uploadFiles(dirPath, prefix = '') {
    const files = await fs.promises.readdir(dirPath);
  
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const key = prefix ? `${prefix}/${file}` : file;
  
      const stats = await fs.promises.stat(filePath);
  
      if (stats.isFile()) {
        // 上传文件
        await client.put(key, filePath);
      } else if (stats.isDirectory()) {
        // 上传子目录
        await uploadFiles(filePath, key);
      }
    }
  }
  
  async function uploadDist(distPath) {
    try {
      await uploadFiles(distPath);
      console.log('上传成功！');
    } catch (err) {
      console.error('上传失败：', err);
    }
  }
  
  uploadDist(localDirPath);
