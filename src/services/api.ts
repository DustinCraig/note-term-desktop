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

  private async get(url: string) {
    return this._fetch(url);
  }

  private async post(url: string, data?: any) {
    return this._fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private async put(url: string, data?: any) {
    return this._fetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private async delete(url: string, data?: any) {
    return this._fetch(url, {
      method: "DELETE",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async createNote(note: Omit<Note, "id">): Promise<StandardResponse> {
    return await this.post(`${this.baseUrl}/api/notes`, note);
  }

  async updateNote(note: Note): Promise<StandardResponse> {
    return await this.put(`${this.baseUrl}/api/notes/${note.id}`, note);
  }

  async deleteNote(note: Note): Promise<StandardResponse> {
    return await this.delete(`${this.baseUrl}/api/notes/${note.id}`);
  }

  async fetchNotes(folderid?: number): Promise<Note[]> {
    const notes = await this.get(
      `${this.baseUrl}/api/notes${folderid ? `?folderid=${folderid}` : ""}`
    );
    return notes.data;
  }

  async fetchFolders(): Promise<Folder[]> {
    const folders = await this.get(`${this.baseUrl}/api/folders`);
    return folders.data;
  }

  async createFolder(folder: Folder): Promise<StandardResponse> {
    return await this.post(`${this.baseUrl}/api/folders`, folder);
  }
}

export const api = new API(config.apiBaseUrl);
