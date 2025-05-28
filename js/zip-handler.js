class ZipHandler {
    static async extractPocketCSV(zipFile) {
        try {
            const zip = new JSZip();
            const zipContent = await zip.loadAsync(zipFile);
            
            // Pocket exports typically contain part_000000.csv
            const csvFile = zipContent.file(/\.csv$/)[0];
            
            if (!csvFile) {
                throw new Error('No CSV file found in ZIP archive');
            }
            
            const csvContent = await csvFile.async('text');
            return csvContent;
        } catch (error) {
            throw new Error(`Failed to extract CSV: ${error.message}`);
        }
    }
    
    static validateZipFile(file) {
        if (!file) {
            throw new Error('No file provided');
        }
        
        if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
            throw new Error('Please select a ZIP file');
        }
        
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            throw new Error('File too large. Maximum size is 50MB');
        }
        
        return true;
    }
}