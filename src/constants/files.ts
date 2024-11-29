export const MULTER_DESTINATION: string = './public/uploads';

export const MULTER_MAX_FILES: number = 1;

export const MULTER_MAX_FILE_SIZE: number = 5 * 1024 * 1024;

export const MAX_FILES_PER_TASK: number = 3;

export const ALLOWED_FILE_EXTENSIONS: string[] = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.pdf',
  '.docx',
  '.pptx',
  '.ppt',
];

export const ALLOWED_FILE_MIME_TYPES: string[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];
