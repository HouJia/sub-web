// 项目常量定义
const backendOrigin = (import.meta.env.VITE_SUBCONVERTER_DEFAULT_BACKEND || '').replace(/\/$/, '');
const defaultBackend = backendOrigin ? `${backendOrigin}/sub?` : '/sub?';
const localBackend =
  import.meta.env.VITE_BACKEND_OPTION_LOCAL || 'http://127.0.0.1:25500/sub?';

export const CONSTANTS = {
  PROJECT: import.meta.env.VITE_PROJECT,
  REMOTE_CONFIG_SAMPLE: import.meta.env.VITE_SUBCONVERTER_REMOTE_CONFIG,
  DOC_ADVANCED: import.meta.env.VITE_SUBCONVERTER_DOC_ADVANCED,
  BACKEND_RELEASE: import.meta.env.VITE_BACKEND_RELEASE,
  DEFAULT_BACKEND: defaultBackend,
  /** 后端地址下拉：生产默认 + 本地自建参考 */
  BACKEND_SUGGESTIONS: [
    { value: defaultBackend },
    ...(localBackend && localBackend !== defaultBackend ? [{ value: localBackend }] : []),
  ],
  SHORT_URL_API: import.meta.env.VITE_MYURLS_API,
  CONFIG_UPLOAD_API: import.meta.env.VITE_CONFIG_UPLOAD_API,
  BOT_LINK: import.meta.env.VITE_BOT_LINK,
  DEFAULT_CLIENT_TYPE: 'clash',
  BUTTON_WIDTH: '140px',
  LARGE_BUTTON_WIDTH: '290px'
};
