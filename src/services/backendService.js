import { CONSTANTS } from '@/config/constants';
import { formatVersion } from '@/utils/formatters';

/**
 * 后端版本检查服务
 */
export class BackendService {
  /**
   * 获取后端版本信息
   * @param {Object} $axios - Axios实例
   * @returns {Promise<string>} 版本信息
   */
  static async getBackendVersion($axios) {
    const backendRoot = CONSTANTS.DEFAULT_BACKEND.replace(/\/sub\?$/, "");
    const versionApiUrl = backendRoot + "/version.txt";

    try {
      const response = await $axios.get(versionApiUrl, {
        responseType: "text",
        transformResponse: [(data) => data],
      });
      return formatVersion(response.data);
    } catch (error) {
      return "";
    }
  }
}
