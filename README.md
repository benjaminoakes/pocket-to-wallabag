# Pocket to Wallabag Converter

A browser-based tool that converts Pocket CSV exports to Instapaper-compatible CSV format for easy import into Wallabag.

## 🔒 Privacy & Security

This tool processes all data **locally in your browser** - no data is ever sent to any servers.

### How to Verify Client-Side Processing

You can easily verify that this tool operates entirely client-side:

1. **Network Tab Verification**:
   - Open your browser's Developer Tools (F12)
   - Go to the "Network" tab
   - Upload and convert a file
   - You'll see NO network requests to external servers during conversion
   - Only requests will be for loading the initial page and JavaScript libraries

2. **Offline Test**:
   - Load the page while online
   - Disconnect from the internet (disable WiFi/ethernet)
   - Upload and convert a Pocket export file
   - The conversion will work perfectly without any internet connection

3. **Source Code Inspection**:
   - All source code is available on [GitHub](https://github.com/benjaminoakes/pocket-to-wallabag/)
   - No server-side code exists - only HTML, CSS, and JavaScript
   - You can review the code to confirm no data transmission occurs

4. **Local File Protocol**:
   - Download the files and open `index.html` directly in your browser
   - The tool will work identically using the `file://` protocol
   - This proves no server communication is required

## Features

- 📁 Drag & drop ZIP file upload
- 🔄 Converts Pocket CSV to Instapaper format (compatible with Wallabag)
- 📱 Mobile-responsive design
- 🚫 No server required - works completely offline
- 📖 Open source (GPL v3 license)

## Usage

1. Export your data from Pocket (Settings → Export)
2. Upload the ZIP file to this tool
3. Download the converted CSV file
4. Import into Wallabag using the "Import from Instapaper" feature

## Technical Details

- **Input Format**: Pocket CSV (`title,url,time_added,tags,status`)
- **Output Format**: Instapaper CSV (`URL,Title,Selection,Folder,Timestamp,Tags`)
- **Processing**: 100% client-side JavaScript using JSZip library
- **Privacy**: No data leaves your device

## License

GPL v3 - See [LICENSE.txt](LICENSE.txt) for details.
