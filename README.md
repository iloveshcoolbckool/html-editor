html,
body {
  margin: 0;
  min-height: 100%;
  background: #0f172a;
  color: #e2e8f0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

* {
  box-sizing: border-box;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.ide-shell {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background: #0b1020;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 58px;
  padding: 0 18px;
  background: #0f172a;
  border-bottom: 1px solid #1f2937;
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: #e2e8f0;
}

.brand-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, #60a5fa, #22c55e);
  box-shadow: 0 0 12px rgba(96, 165, 250, 0.9);
}

.toolbar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.toolbar button,
.file-item,
.tab,
.tab-close,
.delete-file {
  transition: background 0.18s ease, border-color 0.18s ease, opacity 0.18s ease;
}

.toolbar button {
  background: #111827;
  color: #e2e8f0;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 8px 12px;
}

.toolbar button:hover {
  background: #1e293b;
}

.workspace {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  background: #0f172a;
  border-right: 1px solid #1f2937;
  transition: width 0.2s ease;
}

.sidebar.collapsed {
  width: 58px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
  padding: 8px 10px;
  border-bottom: 1px solid #1f2937;
  color: #94a3b8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.sidebar-header button {
  border: none;
  background: transparent;
  color: #e2e8f0;
  font-size: 20px;
}

.search-box {
  padding: 10px;
}

.search-box input {
  width: 100%;
  border: 1px solid #334155;
  background: #111827;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  background: transparent;
  border: none;
  border-left: 3px solid transparent;
  color: #dbeafe;
  text-align: left;
  padding: 9px 10px;
  border-radius: 8px;
}

.file-item:hover,
.tab:hover {
  background: rgba(148, 163, 184, 0.08);
}

.file-item.active {
  background: rgba(59, 130, 246, 0.14);
  border-left-color: #60a5fa;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-file,
.tab-close {
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 18px;
  line-height: 1;
}

.delete-file:hover,
.tab-close:hover {
  color: #fca5a5;
}

.main-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 6px 10px 0;
  background: #0f172a;
  border-bottom: 1px solid #1f2937;
  overflow-x: auto;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #111827;
  color: #cbd5e1;
  border: 1px solid #334155;
  border-bottom: 0;
  border-radius: 8px 8px 0 0;
  padding: 8px 12px;
  white-space: nowrap;
}

.active-tab {
  background: #0b1020;
  color: #f8fafc;
  border-color: #334155;
}

.editor-layout {
  display: flex;
  flex: 1;
  min-height: 0;
}

.editor-pane {
  flex: 1.3;
  min-width: 0;
  background: #0b1020;
}

.preview-pane {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 320px;
  border-left: 1px solid #1f2937;
  background: #f8fafc;
}

.preview-header {
  display: flex;
  align-items: center;
  height: 42px;
  padding: 0 16px;
  background: #e2e8f0;
  border-bottom: 1px solid #cbd5e1;
  color: #0f172a;
  font-weight: 700;
}

.preview-frame {
  flex: 1;
  width: 100%;
  border: none;
  background: white;
}

@media (max-width: 900px) {
  .preview-pane {
    display: none;
  }
}
