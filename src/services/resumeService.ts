import mammoth from 'mammoth';

export class ResumeService {
  static async extractTextFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          
          if (file.type === 'application/pdf') {
            // For now, we'll provide a simple message for PDF files
            // In a production app, you'd want to use a server-side PDF parser
            resolve('PDF file detected. Please provide your information manually below.');
          } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ arrayBuffer });
            console.log('Extracted DOCX text:', result.value);
            resolve(result.value);
          } else {
            reject(new Error('Unsupported file type'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  static validateFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Please upload a PDF or DOCX file'
      };
    }
    
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size must be less than 5MB'
      };
    }
    
    return { valid: true };
  }
}
