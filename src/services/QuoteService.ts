import axios from 'axios';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Fallback quotes in case AI generation fails
const fallbackQuotes: { [key: string]: string[] } = {
  clear: [
    "Sunshine is nature's way of reminding us that every day holds endless possibilities!",
    "Let the golden rays of today illuminate your path to greatness!",
    "Clear skies ahead mean clear opportunities await you!"
  ],
  clouds: [
    "Even on cloudy days, remember that the sun is always shining above the clouds!",
    "Gray skies are just clouds waiting to reveal the blue. Your breakthrough is coming!",
    "Cloudy weather reminds us that beauty comes in many forms - embrace today's unique charm!"
  ],
  rain: [
    "Rain washes the world clean and gives us a fresh start - what will you create today?",
    "Like raindrops nourishing the earth, let today's challenges help you grow stronger!",
    "Every raindrop is a reminder that growth comes from life's gentle storms!"
  ],
  snow: [
    "Like snowflakes, you are unique and beautiful - let your individuality shine today!",
    "Snow blankets the world in peace and possibility - what dreams will you pursue?",
    "Winter's beauty reminds us that even in quiet seasons, magic is happening!"
  ],
  thunderstorm: [
    "Even the strongest storms pass, leaving behind clearer skies and renewed strength!",
    "Thunder reminds us that powerful things are happening - you're capable of greatness too!",
    "After every storm comes growth - embrace the power within you today!"
  ],
  mist: [
    "Misty mornings hold mystery and magic - what wonderful surprises await you today?",
    "Like morning mist, uncertainty can be beautiful when you trust the journey ahead!",
    "Foggy weather reminds us that clarity comes to those who keep moving forward!"
  ],
  default: [
    "Every day is a gift - unwrap it with enthusiasm and joy!",
    "Weather changes, but your potential remains constant - shine bright today!",
    "No matter the weather outside, you have the power to create sunshine within!"
  ]
};

export class QuoteService {
  private static isConfigured(): boolean {
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      console.warn('OpenRouter API key not configured. Using fallback quotes.');
      return false;
    }
    return true;
  }

  private static async makeOpenRouterRequest(prompt: string): Promise<string> {
    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content: "You are a motivational weather assistant that creates uplifting, concise quotes about weather conditions. Keep responses under 25 words and always positive."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 50,
        temperature: 0.8
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Weather Insights App'
        }
      }
    );

    return response.data.choices[0]?.message?.content?.trim() || '';
  }

  static async generateQuote(
    location: string,
    weatherCondition: string,
    temperature: number,
    description: string
  ): Promise<string> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const prompt = `Generate a short, uplifting, and inspirational quote (maximum 25 words) about the weather in ${location}. 
      Current conditions: ${description} with ${temperature}°F temperature. 
      The quote should be motivational, positive, and relate to the weather condition "${weatherCondition}".
      Make it personal and encouraging, as if speaking directly to someone checking the weather.
      Do not use quotation marks in the response.`;

      const generatedQuote = await this.makeOpenRouterRequest(prompt);
      
      if (generatedQuote && generatedQuote.length > 0) {
        return generatedQuote;
      } else {
        throw new Error('Empty response from AI');
      }
    } catch (error) {
      console.warn('Failed to generate AI quote:', error);
      return this.getFallbackQuote(weatherCondition);
    }
  }

  private static getFallbackQuote(weatherCondition: string): string {
    const quotes = fallbackQuotes[weatherCondition.toLowerCase()] || fallbackQuotes.default;
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
}