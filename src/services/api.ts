import type { Note } from "../context/NoteContext";
import type { Folder } from "../context/FolderContext";
import config from "../config";

export const SERVER_UNAVAILABLE_ERROR_MESSAGE = "note-term server error!";

export type StandardResponse = {
  data?: any;
  success: boolean;
  message?: string;
};

export class API {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async _fetch(url: string, options?: RequestInit): Promise<StandardResponse> {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message ?? SERVER_UNAVAILABLE_ERROR_MESSAGE);
    }

    return {
      data: result.data,
      success: !!result.success,
      message: result.message ?? "No message",
    } as StandardResponse;
  }

  async get(url: string) {
    return this._fetch(url);
  }

  async post(url: string, data?: any) {
    return this._fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async createNote(note: Note): Promise<StandardResponse> {
    return await this.post(`${this.baseUrl}/api/notes`, note);
  }

  async fetchNotes(folderId?: number): Promise<Note[]> {
    const notes = await this.get(
      `${this.baseUrl}/api/notes${folderId ? `?folderId=${folderId}` : ""}`
    );
    return notes.data;
  }

  async fetchFolders(): Promise<Folder[]> {
    const folders = await this.get(`${this.baseUrl}/api/folders`);
    return folders.data;
  }
}

export const api = new API(config.apiBaseUrl);
