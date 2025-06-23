import { ConfigKeyOpenAIApiBase, ConfigKeyOpenAIKey, ConfigKeyOpenAIModel } from '@/configs/appConfigKey';
import { AppConfig } from '@/store/appconfig';
import { ToastError } from '@/utils/Toast';
import OpenAI from 'openai';

class AiService {
  private openai!: OpenAI;
  private apiKey: string;
  private apiBase: string;
  private model: string;

  constructor(apiKey: string, apiBase: string = 'https://api.openai.com/v1', model: string = 'gpt-3.5-turbo') {
    this.apiKey = apiKey;
    this.apiBase = apiBase;
    this.model = model;
    this.initializeOpenAI();
  }

  private initializeOpenAI() {
    const configuration = new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.apiBase,
      dangerouslyAllowBrowser: true // 允许在浏览器环境中使用
    });
    this.openai = configuration;
  }

  async chat(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
      });

      return response.choices[0]?.message?.content || '';
    } catch (error: any) {
      ToastError('AI service call failed:'+error.message);
      return "";
    }
  }

  updateConfig(apiKey?: string, apiBase?: string, model?: string) {
    if (apiKey) this.apiKey = apiKey;
    if (apiBase) this.apiBase = apiBase;
    if (model) this.model = model;
    
    this.initializeOpenAI();
  }
}

export const aiService = () => {
  const key = AppConfig.getString(ConfigKeyOpenAIKey);
  if (key === "") {
    ToastError("Please configure AI first key");
    return null;
  }

  return new AiService(
    AppConfig.getString(ConfigKeyOpenAIKey),
    AppConfig.getString(ConfigKeyOpenAIApiBase),
    AppConfig.getString(ConfigKeyOpenAIModel)
  );
};