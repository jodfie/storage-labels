import { exportData } from '../lib/api';

export default function Export() {
  return (
    <div className="container">
      <h1>📦 Export Data</h1>
      <p>I can download all my stuff!</p>

      <div className="export-sections">
        {/* Containers Export */}
        <section className="export-section">
          <h2>📦 Export Containers</h2>
          <p>Download all your container information</p>
          
          <div className="export-buttons">
            <button 
              className="btn btn-primary" 
              onClick={() => exportData.containersJSON()}
            >
              📄 Download JSON
            </button>
            <button 
              className="btn" 
              onClick={() => exportData.containersCSV()}
            >
              📊 Download CSV
            </button>
          </div>
        </section>

        {/* Items Export */}
        <section className="export-section">
          <h2>🎯 Export Items</h2>
          <p>Download all your items with container info</p>
          
          <div className="export-buttons">
            <button 
              className="btn btn-primary" 
              onClick={() => exportData.itemsJSON()}
            >
              📄 Download JSON
            </button>
            <button 
              className="btn" 
              onClick={() => exportData.itemsCSV()}
            >
              📊 Download CSV
            </button>
          </div>
        </section>

        {/* Complete Export */}
        <section className="export-section">
          <h2>💾 Export Everything</h2>
          <p>Download complete backup of all data</p>
          
          <div className="export-buttons">
            <button 
              className="btn btn-primary" 
              onClick={() => exportData.allJSON()}
            >
              📦 Download Complete Backup
            </button>
          </div>
        </section>
      </div>

      <div className="info-box" style={{ marginTop: '2rem' }}>
        <h3>📝 About Exports</h3>
        <p><strong>JSON Format:</strong> Good for backups and importing into other programs</p>
        <p><strong>CSV Format:</strong> Can be opened in Excel or Google Sheets</p>
        <p><strong>Complete Backup:</strong> Includes containers, items, and export metadata</p>
        <p><strong>Photos:</strong> Photo files are not included in exports, only file paths</p>
      </div>
    </div>
  );
}
