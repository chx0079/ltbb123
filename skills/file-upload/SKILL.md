---
  name: file-upload
  description: 使用 OneDay 提供的文件上传能力，支持上传视频，图片和文件，生成和返回对应的 CDN 地址
---
### 文件上传

**依赖**: @ali/oneday-ability@0.0.9
**描述**: 支持上传视频，图片和文件
**使用方法**:

```typescript
import { UploadProvider } from '@ali/oneday-ability';

const upload = new UploadProvider();

// 上传文件
const file = document.getElementById('fileInput').files[0];
const result = await upload.uploadFile({
  file: file
});

if (result.data?.url) {
  console.log('文件上传成功:', result.data.url);
}
```
