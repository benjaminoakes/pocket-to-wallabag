class PocketConverter {
    static parsePocketCSV(csvContent) {
        const lines = csvContent.trim().split('\n');
        const headers = lines[0].split(',');
        
        // Validate Pocket CSV format
        const expectedHeaders = ['title', 'url', 'time_added', 'tags', 'status'];
        if (!this.validateHeaders(headers, expectedHeaders)) {
            throw new Error('Invalid Pocket CSV format');
        }
        
        const articles = [];
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length >= 5) {
                articles.push({
                    title: values[0],
                    url: values[1],
                    time_added: values[2],
                    tags: values[3],
                    status: values[4]
                });
            }
        }
        
        return articles;
    }
    
    static convertToInstapaper(articles) {
        const converted = articles.map(article => {
            return {
                URL: article.url,
                Title: article.title,
                Selection: '', // Pocket doesn't export selections
                Folder: this.mapStatusToFolder(article.status),
                Timestamp: this.convertTimestamp(article.time_added),
                Tags: this.formatTags(article.tags)
            };
        });
        
        return converted;
    }
    
    static generateCSV(articles) {
        const headers = ['URL', 'Title', 'Selection', 'Folder', 'Timestamp', 'Tags'];
        const csvLines = [headers.join(',')];
        
        articles.forEach(article => {
            const line = [
                this.escapeCSVField(article.URL),
                this.escapeCSVField(article.Title),
                this.escapeCSVField(article.Selection),
                this.escapeCSVField(article.Folder),
                article.Timestamp,
                this.escapeCSVField(article.Tags)
            ].join(',');
            csvLines.push(line);
        });
        
        return csvLines.join('\n');
    }
    
    // Helper methods
    static validateHeaders(actual, expected) {
        return expected.every(header => 
            actual.some(h => h.toLowerCase().includes(header))
        );
    }
    
    static parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }
    
    static mapStatusToFolder(status) {
        switch (status?.toLowerCase()) {
            case 'unread':
                return 'Unread';
            case 'archive':
                return 'Archive';
            default:
                return 'Unread';
        }
    }
    
    static convertTimestamp(unixTimestamp) {
        if (!unixTimestamp || unixTimestamp === '') return '';
        return parseInt(unixTimestamp);
    }
    
    static formatTags(tags) {
        if (!tags || tags === '') return '[]';
        
        // Pocket tags are comma-separated, convert to JSON array format
        const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        return JSON.stringify(tagArray);
    }
    
    static escapeCSVField(field) {
        if (!field) return '';
        
        const stringField = String(field);
        if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
            return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
    }
}