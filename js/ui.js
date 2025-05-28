class UIController {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.convertedData = null;
    }
    
    initializeElements() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.browseBtn = document.getElementById('browseBtn');
        this.progressSection = document.getElementById('progressSection');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.resultsSection = document.getElementById('resultsSection');
        this.statsDisplay = document.getElementById('statsDisplay');
        this.downloadBtn = document.getElementById('downloadBtn');
    }
    
    attachEventListeners() {
        // File input events
        this.browseBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files[0]));
        
        // Drag and drop events
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        
        // Download button
        this.downloadBtn.addEventListener('click', () => this.downloadConvertedFile());
    }
    
    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('drag-over');
    }
    
    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
    }
    
    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.handleFileSelect(files[0]);
        }
    }
    
    async handleFileSelect(file) {
        try {
            // Validate file
            ZipHandler.validateZipFile(file);
            
            // Show progress
            this.showProgress('Extracting CSV from ZIP...');
            
            // Extract CSV
            const csvContent = await ZipHandler.extractPocketCSV(file);
            
            this.updateProgress(33, 'Parsing Pocket data...');
            
            // Parse Pocket CSV
            const articles = PocketConverter.parsePocketCSV(csvContent);
            
            this.updateProgress(66, 'Converting to Instapaper format...');
            
            // Convert to Instapaper format
            const converted = PocketConverter.convertToInstapaper(articles);
            
            this.updateProgress(100, 'Conversion complete!');
            
            // Generate CSV
            this.convertedData = PocketConverter.generateCSV(converted);
            
            // Show results
            setTimeout(() => this.showResults(articles.length), 500);
            
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    showProgress(message) {
        this.uploadArea.style.display = 'none';
        this.progressSection.style.display = 'block';
        this.resultsSection.style.display = 'none';
        this.progressText.textContent = message;
        this.progressFill.style.width = '0%';
    }
    
    updateProgress(percent, message) {
        this.progressFill.style.width = `${percent}%`;
        this.progressText.textContent = message;
    }
    
    showResults(articleCount) {
        this.progressSection.style.display = 'none';
        this.resultsSection.style.display = 'block';
        
        this.statsDisplay.innerHTML = `
            <p>✅ Successfully converted <strong>${articleCount}</strong> articles</p>
            <p>📄 Exported in Instapaper CSV format for Wallabag import</p>
        `;
    }
    
    showError(message) {
        this.progressSection.style.display = 'none';
        this.uploadArea.style.display = 'block';
        
        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = `Error: ${message}`;
        
        this.uploadArea.appendChild(errorDiv);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    downloadConvertedFile() {
        if (!this.convertedData) return;
        
        const blob = new Blob([this.convertedData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'instapaper-format-for-wallabag.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new UIController();
});