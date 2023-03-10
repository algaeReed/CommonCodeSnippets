const fs = require('fs');
const path = require('path');
const OSS = require('ali-oss');

// 阿里云 OSS 的 AccessKey ID 和 AccessKey Secret
const accessKeyId = 'aaaaaaaaaaaaaaaaaaaaaaaa';
const accessKeySecret = 'bbbbbbbbbbbbbbbbbb';

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

// 定义递归函数，用于遍历目录并上传文件和子目录
async function uploadDir(localDirPath, ossDirPath) {
  const files = await fs.promises.readdir(localDirPath);
  for (const file of files) {
    const localFilePath = path.join(localDirPath, file);
    const ossFilePath = path.join(ossDirPath, file);
    const stats = await fs.promises.stat(localFilePath);
    if (stats.isDirectory()) {
      await uploadDir(localFilePath, ossFilePath);
    } else {
      const result = await client.put(ossFilePath, localFilePath);
      console.log(`Uploaded ${ossFilePath}, ETag: ${JSON.stringify(result.url)}`);
    }
  }
}

// 调用函数上传 dist 目录下的所有文件和子目录
const localDirPath = '\\';

const ossDirPath = '';
uploadDir(localDirPath, ossDirPath)
  .then(() => console.log(`Upload completed: ${localDirPath} => oss://${bucket}/${ossDirPath}`))
  .catch((err) => console.error(`Upload failed: ${err}`));
