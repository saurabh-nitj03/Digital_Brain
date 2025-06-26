import axios from 'axios';
import * as cheerio from 'cheerio';
import pdf from 'pdf-parse';
import Tesseract from 'tesseract.js';
import { YoutubeTranscript } from 'youtube-transcript';
import puppeteer from 'puppeteer';

export interface ProcessedContent {
  text: string;
  source: string;
  type: 'pdf' | 'image' | 'web' | 'youtube' | 'twitter' | 'text';
}

export class ContentProcessor {
  
  static async processPDF(buffer: Buffer): Promise<ProcessedContent> {
    try {
      const data = await pdf(buffer);
      return {
        text: data.text,
        source: 'PDF Document',
        type: 'pdf'
      };
    } catch (error) {
      throw new Error(`Failed to process PDF: ${error}`);
    }
  }

  static async processImage(buffer: Buffer): Promise<ProcessedContent> {
    try {
      const result = await Tesseract.recognize(buffer, 'eng', {
        logger: m => console.log(m)
      });
      
      return {
        text: result.data.text,
        source: 'Image OCR',
        type: 'image'
      };
    } catch (error) {
      throw new Error(`Failed to process image: ${error}`);
    }
  }

  static async processWebLink(url: string): Promise<ProcessedContent> {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      $('script').remove();
      $('style').remove();
      
      const text = $('body').text().replace(/\s+/g, ' ').trim();
      
      return {
        text: text,
        source: url,
        type: 'web'
      };
    } catch (error) {
      throw new Error(`Failed to process web link: ${error}`);
    }
  }

  static async processYouTubeLink(url: string): Promise<ProcessedContent> {
    try {
      // Extract video ID from URL
      const videoId = this.extractYouTubeVideoId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      const transcripts = await YoutubeTranscript.fetchTranscript(videoId);
      const text = transcripts.map(item => item.text).join(' ');
      
      return {
        text: text,
        source: url,
        type: 'youtube'
      };
    } catch (error) {
      throw new Error(`Failed to process YouTube link: ${error}`);
    }
  }

  static async processTwitterLink(url: string): Promise<ProcessedContent> {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      await page.goto(url, { waitUntil: 'networkidle0' });
      
      // Wait for tweet content to load
      await page.waitForSelector('[data-testid="tweetText"]', { timeout: 10000 });
      
      const tweetText = await page.$eval('[data-testid="tweetText"]', el => el.textContent);
      
      await browser.close();
      
      return {
        text: tweetText || 'No text found',
        source: url,
        type: 'twitter'
      };
    } catch (error) {
      throw new Error(`Failed to process Twitter link: ${error}`);
    }
  }

  static async processText(text: string): Promise<ProcessedContent> {
    return {
      text: text,
      source: 'User Input',
      type: 'text'
    };
  }

  static async processContent(content: string | Buffer, contentType?: string): Promise<ProcessedContent> {
    try {
      // If content is a buffer, it's likely a file
      if (Buffer.isBuffer(content)) {
        if (contentType?.includes('pdf')) {
          return await this.processPDF(content);
        } else if (contentType?.includes('image')) {
          return await this.processImage(content);
        } else {
          throw new Error('Unsupported file type');
        }
      }

      if (typeof content === 'string') {
        const url = content.trim();
        
        if (this.isYouTubeUrl(url)) {
          return await this.processYouTubeLink(url);
        } else if (this.isTwitterUrl(url)) {
          return await this.processTwitterLink(url);
        } else if (this.isWebUrl(url)) {
          return await this.processWebLink(url);
        } else {
          return await this.processText(content);
        }
      }

      throw new Error('Unsupported content type');
    } catch (error) {
      throw new Error(`Content processing failed: ${error}`);
    }
  }

  private static isYouTubeUrl(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  private static isTwitterUrl(url: string): boolean {
    return url.includes('twitter.com') || url.includes('x.com');
  }

  private static isWebUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  private static extractYouTubeVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
} 