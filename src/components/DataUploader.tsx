import React, { useRef, useState } from 'react';

// Mock UploadProvider
class UploadProvider {
  async uploadFile({ file }: { file: File }) {
    console.warn('UploadProvider is mocked. File upload is disabled.');
    return { data: { url: null } };
  }
}

interface DataUploaderProps {
  onUploadSuccess: (cdnUrl: string) => void;
}

export default function DataUploader({ onUploadSuccess }: DataUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.json')) {
      setErrorMessage('请选择 .json 格式的文件');
      return;
    }

    setUploading(true);
    setErrorMessage(null);
    setUploadedUrl(null);

    try {
      const uploader = new UploadProvider();
      const result = await uploader.uploadFile({ file: selectedFile });

      if (result.data?.url) {
        const cdnUrl = result.data.url;
        setUploadedUrl(cdnUrl);
        onUploadSuccess(cdnUrl);
      } else {
        setErrorMessage('上传失败，未获取到 CDN 地址');
      }
    } catch (err) {
      setErrorMessage(`上传出错：${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        className="filter-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
        style={{
          color: uploading ? '#4A5A6A' : '#0BC4E3',
          background: uploading ? 'rgba(74,90,106,0.1)' : 'rgba(11,196,227,0.1)',
          border: `1px solid ${uploading ? 'rgba(74,90,106,0.3)' : 'rgba(11,196,227,0.3)'}`,
          cursor: uploading ? 'not-allowed' : 'pointer',
        }}
        onClick={() => !uploading && fileInputRef.current?.click()}
        title="上传本地 augments.json 作为数据源"
        disabled={uploading}
      >
        {uploading ? (
          <>
            <i className="fas fa-spinner fa-spin text-xs" />
            上传中...
          </>
        ) : (
          <>
            <i className="fas fa-upload text-xs" />
            上传数据
          </>
        )}
      </button>

      {uploadedUrl && (
        <span className="text-xs" style={{ color: '#56C96D' }}>
          <i className="fas fa-check-circle mr-1" />
          已切换至 CDN 数据源
        </span>
      )}

      {errorMessage && (
        <span className="text-xs" style={{ color: '#E84057' }}>
          <i className="fas fa-exclamation-circle mr-1" />
          {errorMessage}
        </span>
      )}
    </div>
  );
}
