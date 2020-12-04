import { Binary } from '@angular/compiler';

export interface Fileclass {
    file_name: string,
    language: string,
    content: string | ArrayBuffer,
    description?: string,
}